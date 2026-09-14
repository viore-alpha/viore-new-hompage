import {
  KNOWLEDGE_MAX_PAGE_SIZE,
  KNOWLEDGE_PAGE_SIZE,
  isKnowledgeCursor,
  parseKnowledgePaperItem,
  repairKnowledgeBrief,
  type KnowledgeFilter,
  type KnowledgePaperItem,
  type KnowledgePaperPage,
} from "@/app/knowledge-contract";

const KNOWLEDGE_FEED_ENDPOINT =
  process.env.VIORE_KNOWLEDGE_FEED_ENDPOINT ??
  "https://texauplfngpawivaeukr.supabase.co/rest/v1/viore_knowledge_public_papers";
const KNOWLEDGE_FEED_PUBLISHABLE_KEY =
  process.env.VIORE_METRICS_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_luvxrrYk1-G4PvatU1tILg__1r4aRc6";

export const KNOWLEDGE_FEED_REVALIDATE_SECONDS = 10 * 60;
export const KNOWLEDGE_FEED_STALE_AFTER_MS = 3 * 60 * 60 * 1_000;
export const KNOWLEDGE_FEED_FETCH_TIMEOUT_MS = 5_000;

// The public table is read-only and bounded; selecting every column keeps the
// feed working before and after the optional `brief_en` column is deployed.
const KNOWLEDGE_SELECT = "*";

type KnowledgePaperRow = KnowledgePaperItem & {
  data_as_of: string;
  refreshed_at: string;
};

export type KnowledgeInitialFeedResult = {
  state: "live" | "stale" | "unavailable";
  page: KnowledgePaperPage;
  lastSuccessAt: string | null;
};

let lastSuccessfulFeedAt: string | null = null;

function parseCursor(value: string | null) {
  if (value === null) return null;
  if (!isKnowledgeCursor(value)) throw new Error("Invalid Knowledge cursor");
  return {
    publishedDate: value.slice(0, 10),
    paperId: value.slice(11),
  };
}

function encodeCursor(item: KnowledgePaperItem) {
  return `${item.published_date}_${item.paper_id}`;
}

function latestTimestamp(values: string[]) {
  return values.reduce<string | null>((latest, value) => {
    if (!Number.isFinite(Date.parse(value))) return latest;
    if (latest === null || Date.parse(value) > Date.parse(latest)) return value;
    return latest;
  }, null);
}

function parseKnowledgePaperRow(value: unknown): KnowledgePaperRow | null {
  const item = parseKnowledgePaperItem(value);
  if (!item || !value || typeof value !== "object" || Array.isArray(value)) return null;

  const row = value as Record<string, unknown>;
  if (
    typeof row.data_as_of !== "string" ||
    !Number.isFinite(Date.parse(row.data_as_of)) ||
    typeof row.refreshed_at !== "string" ||
    !Number.isFinite(Date.parse(row.refreshed_at))
  ) {
    return null;
  }

  return {
    ...item,
    data_as_of: row.data_as_of,
    refreshed_at: row.refreshed_at,
  };
}

export function knowledgeFeedStateAt(
  refreshedAt: string | null,
  nowMs = Date.now(),
): "live" | "stale" | "unavailable" {
  if (!refreshedAt || !Number.isFinite(Date.parse(refreshedAt))) return "unavailable";
  return nowMs - Date.parse(refreshedAt) > KNOWLEDGE_FEED_STALE_AFTER_MS ? "stale" : "live";
}

export async function getKnowledgePaperPage({
  scope = "all",
  cursor = null,
  limit = KNOWLEDGE_PAGE_SIZE,
  revalidate = false,
}: {
  scope?: KnowledgeFilter;
  cursor?: string | null;
  limit?: number;
  revalidate?: boolean;
} = {}): Promise<KnowledgePaperPage> {
  if (scope !== "all" && scope !== "domestic" && scope !== "overseas") {
    throw new Error("Invalid Knowledge scope");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > KNOWLEDGE_MAX_PAGE_SIZE) {
    throw new Error("Invalid Knowledge page size");
  }

  const parsedCursor = parseCursor(cursor);
  const endpoint = new URL(KNOWLEDGE_FEED_ENDPOINT);
  endpoint.searchParams.set("select", KNOWLEDGE_SELECT);
  endpoint.searchParams.set("order", "published_date.desc,paper_id.desc");
  endpoint.searchParams.set("limit", String(limit + 1));
  if (scope !== "all") endpoint.searchParams.set("scope", `eq.${scope}`);
  if (parsedCursor) {
    endpoint.searchParams.set(
      "or",
      `(published_date.lt.${parsedCursor.publishedDate},and(published_date.eq.${parsedCursor.publishedDate},paper_id.lt.${parsedCursor.paperId}))`,
    );
  }

  const response = await fetch(endpoint, {
    headers: { apikey: KNOWLEDGE_FEED_PUBLISHABLE_KEY },
    ...(revalidate
      ? { next: { revalidate: KNOWLEDGE_FEED_REVALIDATE_SECONDS } }
      : { cache: "no-store" as const }),
    signal: AbortSignal.timeout(KNOWLEDGE_FEED_FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Knowledge feed request failed with status ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error("Knowledge feed did not return a row array");

  const rows = payload.map(parseKnowledgePaperRow);
  if (rows.some((row) => row === null)) {
    throw new Error("Knowledge feed did not match the public contract");
  }

  const parsedRows = rows as KnowledgePaperRow[];
  if (scope !== "all" && parsedRows.some((row) => row.scope !== scope)) {
    throw new Error("Knowledge feed returned a row outside the requested scope");
  }

  const pageRows = parsedRows.slice(0, limit);
  const items = pageRows.map<KnowledgePaperItem>((row) => ({
    paper_id: row.paper_id,
    published_date: row.published_date,
    title: row.title,
    title_ko: row.title_ko,
    brief: repairKnowledgeBrief(row.brief),
    brief_en: row.brief_en,
    authors: row.authors,
    author_count: row.author_count,
    journal: row.journal,
    published_year: row.published_year,
    source: row.source,
    scope: row.scope,
    href: row.href,
  }));
  const refreshedAt = latestTimestamp(pageRows.map((row) => row.refreshed_at));
  if (refreshedAt) lastSuccessfulFeedAt = refreshedAt;

  return {
    schema_version: "knowledge.literature.page.v1",
    items,
    next_cursor: parsedRows.length > limit && items.length > 0
      ? encodeCursor(items[items.length - 1])
      : null,
    data_as_of: latestTimestamp(pageRows.map((row) => row.data_as_of)),
    refreshed_at: refreshedAt,
  };
}

export async function getKnowledgeInitialFeed(): Promise<KnowledgeInitialFeedResult> {
  try {
    const page = await getKnowledgePaperPage({ revalidate: true });
    return {
      state: knowledgeFeedStateAt(page.refreshed_at),
      page,
      lastSuccessAt: page.refreshed_at,
    };
  } catch (error) {
    console.error("[knowledge-feed] public paper feed unavailable", error);
    return {
      state: "unavailable",
      page: {
        schema_version: "knowledge.literature.page.v1",
        items: [],
        next_cursor: null,
        data_as_of: null,
        refreshed_at: null,
      },
      lastSuccessAt: lastSuccessfulFeedAt,
    };
  }
}
