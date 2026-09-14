export const KNOWLEDGE_PAGE_SIZE = 12;
export const KNOWLEDGE_MAX_PAGE_SIZE = 24;

const KNOWLEDGE_SOURCES = new Set([
  "kci",
  "pubmed",
  "pmc",
  "europepmc",
  "kmbase_publicdata",
  "kamje",
  "doaj",
  "medrxiv",
  "manual",
]);

export type KnowledgePaperScope = "domestic" | "overseas";
export type KnowledgeFilter = "all" | KnowledgePaperScope;

export type KnowledgePaperItem = {
  paper_id: string;
  published_date: string;
  title: string;
  title_ko: string | null;
  brief: string;
  brief_en: string | null;
  authors: string[];
  author_count: number;
  journal: string | null;
  published_year: number;
  source: string;
  scope: KnowledgePaperScope;
  href: string;
};

export type KnowledgePaperPage = {
  schema_version: "knowledge.literature.page.v1";
  items: KnowledgePaperItem[];
  next_cursor: string | null;
  data_as_of: string | null;
  refreshed_at: string | null;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isBoundedString(value: unknown, min: number, max: number): value is string {
  return typeof value === "string" && value.trim().length >= min && value.length <= max;
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

const KOREAN_SENTENCE_END = /[다요음임함됨죠네까][.!?]/g;

/**
 * Generated card summaries can arrive with decimals split by a space ("96. 7일",
 * "AUC=0. 97") and occasionally cut off right after a bare number ("aRR 1.").
 * Re-join the decimals and never show a dangling numeric fragment: fall back to
 * the last complete sentence, or mark the cut with an ellipsis.
 */
export function repairKnowledgeBrief(brief: string): string {
  const joined = brief.replace(/(\d)\. (?=\d)/g, "$1.").trim();
  if (!/\d\.\s*$/.test(joined)) return joined;

  let lastSentenceEnd = -1;
  for (const match of joined.matchAll(KOREAN_SENTENCE_END)) {
    lastSentenceEnd = match.index + match[0].length;
  }
  if (lastSentenceEnd >= 60) return joined.slice(0, lastSentenceEnd).trim();

  return `${joined.replace(/\s*\S+\s*$/, "").trimEnd()}…`;
}

export function isKnowledgeCursor(value: unknown): value is string {
  return typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}_[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function parseKnowledgePaperItem(value: unknown): KnowledgePaperItem | null {
  if (!isRecord(value)) return null;

  const authors = value.authors;
  const authorCount = value.author_count;
  const publishedYear = value.published_year;
  const publishedDate = value.published_date;

  if (
    !isBoundedString(value.paper_id, 36, 36) ||
    typeof publishedDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(publishedDate) ||
    !Number.isFinite(Date.parse(`${publishedDate}T00:00:00.000Z`)) ||
    !isBoundedString(value.title, 8, 500) ||
    !(value.title_ko === null || isBoundedString(value.title_ko, 1, 500)) ||
    !isBoundedString(value.brief, 20, 500) ||
    !/[가-힣]/u.test(value.brief) ||
    !(value.brief_en === null || value.brief_en === undefined || isBoundedString(value.brief_en, 20, 500)) ||
    !Array.isArray(authors) ||
    authors.length > 3 ||
    !authors.every((author) => isBoundedString(author, 1, 200)) ||
    !Number.isSafeInteger(authorCount) ||
    Number(authorCount) < authors.length ||
    !(value.journal === null || isBoundedString(value.journal, 1, 300)) ||
    !Number.isSafeInteger(publishedYear) ||
    Number(publishedYear) < 1800 ||
    Number(publishedYear) > 2100 ||
    typeof value.source !== "string" ||
    !KNOWLEDGE_SOURCES.has(value.source) ||
    (value.scope !== "domestic" && value.scope !== "overseas") ||
    !isBoundedString(value.href, 8, 2_048)
  ) {
    return null;
  }

  try {
    const href = new URL(value.href);
    if (href.protocol !== "https:") return null;
  } catch {
    return null;
  }

  return {
    paper_id: value.paper_id,
    published_date: publishedDate,
    title: value.title.trim(),
    title_ko: value.title_ko === null ? null : value.title_ko.trim(),
    brief: value.brief.trim(),
    brief_en: typeof value.brief_en === "string" ? value.brief_en.trim() : null,
    authors: authors.map((author) => author.trim()),
    author_count: Number(authorCount),
    journal: value.journal === null ? null : value.journal.trim(),
    published_year: Number(publishedYear),
    source: value.source,
    scope: value.scope,
    href: value.href,
  };
}

export function parseKnowledgePaperPage(value: unknown): KnowledgePaperPage | null {
  if (!isRecord(value) || value.schema_version !== "knowledge.literature.page.v1") return null;
  if (!Array.isArray(value.items) || value.items.length > KNOWLEDGE_MAX_PAGE_SIZE) return null;
  if (!(value.next_cursor === null || isKnowledgeCursor(value.next_cursor))) return null;
  if (!(value.data_as_of === null || isIsoTimestamp(value.data_as_of))) return null;
  if (!(value.refreshed_at === null || isIsoTimestamp(value.refreshed_at))) return null;

  const items = value.items.map(parseKnowledgePaperItem);
  if (items.some((item) => item === null)) return null;

  const parsedItems = items as KnowledgePaperItem[];
  if (new Set(parsedItems.map((item) => item.paper_id)).size !== parsedItems.length) return null;
  if (value.next_cursor !== null && parsedItems.length === 0) return null;

  return {
    schema_version: "knowledge.literature.page.v1",
    items: parsedItems,
    next_cursor: value.next_cursor,
    data_as_of: value.data_as_of,
    refreshed_at: value.refreshed_at,
  };
}
