const ALPHAEVIDENCE_SNAPSHOT_ENDPOINT =
  process.env.VIORE_ALPHAEVIDENCE_SNAPSHOT_ENDPOINT ??
  "https://texauplfngpawivaeukr.supabase.co/rest/v1/viore_alphaevidence_public_snapshot?select=schema_version,generated_at,data_as_of,counts";
const ALPHAEVIDENCE_SNAPSHOT_PUBLISHABLE_KEY =
  process.env.VIORE_METRICS_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_luvxrrYk1-G4PvatU1tILg__1r4aRc6";

export const ALPHAEVIDENCE_SNAPSHOT_REVALIDATE_SECONDS = 10 * 60;
export const ALPHAEVIDENCE_SNAPSHOT_STALE_AFTER_MS = 3 * 60 * 60 * 1_000;
export const ALPHAEVIDENCE_SNAPSHOT_FETCH_TIMEOUT_MS = 5_000;

type CountMap = {
  canonical_papers: number;
  papers_with_abstract: number;
  visible_guidelines: number;
};

export type AlphaEvidencePublicSnapshotV1 = {
  schema_version: "technology.alphaevidence.snapshot.v1";
  generated_at: string;
  data_as_of: string;
  counts: CountMap;
};

export type AlphaEvidenceSnapshotResult =
  | {
      state: "live" | "stale";
      snapshot: AlphaEvidencePublicSnapshotV1;
      lastSuccessAt: string;
    }
  | {
      state: "unavailable";
      snapshot: null;
      lastSuccessAt: string | null;
    };

type UnknownRecord = Record<string, unknown>;

let lastSuccessfulSnapshotAt: string | null = null;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) >= 0;
}

function hasExactIntegerKeys(value: unknown, keys: readonly string[]): value is UnknownRecord {
  return isRecord(value) && keys.every((key) => isNonNegativeInteger(value[key]));
}

export function parseAlphaEvidenceSnapshot(value: unknown): AlphaEvidencePublicSnapshotV1 | null {
  if (!isRecord(value)) return null;

  const counts = value.counts;
  if (
    value.schema_version !== "technology.alphaevidence.snapshot.v1" ||
    typeof value.generated_at !== "string" ||
    !Number.isFinite(Date.parse(value.generated_at)) ||
    typeof value.data_as_of !== "string" ||
    !Number.isFinite(Date.parse(value.data_as_of)) ||
    !hasExactIntegerKeys(counts, [
      "canonical_papers",
      "papers_with_abstract",
      "visible_guidelines",
    ])
  ) {
    return null;
  }

  return {
    schema_version: "technology.alphaevidence.snapshot.v1",
    generated_at: value.generated_at,
    data_as_of: value.data_as_of,
    counts: {
      canonical_papers: counts.canonical_papers as number,
      papers_with_abstract: counts.papers_with_abstract as number,
      visible_guidelines: counts.visible_guidelines as number,
    },
  };
}

export function snapshotStateAt(
  snapshot: AlphaEvidencePublicSnapshotV1,
  nowMs = Date.now(),
): "live" | "stale" {
  return nowMs - Date.parse(snapshot.generated_at) > ALPHAEVIDENCE_SNAPSHOT_STALE_AFTER_MS
    ? "stale"
    : "live";
}

export async function getAlphaEvidencePublicSnapshot(): Promise<AlphaEvidenceSnapshotResult> {
  try {
    const response = await fetch(ALPHAEVIDENCE_SNAPSHOT_ENDPOINT, {
      headers: { apikey: ALPHAEVIDENCE_SNAPSHOT_PUBLISHABLE_KEY },
      next: { revalidate: ALPHAEVIDENCE_SNAPSHOT_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(ALPHAEVIDENCE_SNAPSHOT_FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`AlphaEvidence snapshot request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    const snapshot = Array.isArray(payload) ? parseAlphaEvidenceSnapshot(payload[0]) : null;
    if (!snapshot) throw new Error("AlphaEvidence snapshot did not match the public contract");

    lastSuccessfulSnapshotAt = snapshot.generated_at;
    return {
      state: snapshotStateAt(snapshot),
      snapshot,
      lastSuccessAt: snapshot.generated_at,
    };
  } catch (error) {
    console.error("[alphaevidence-snapshot] aggregate unavailable", error);
    return {
      state: "unavailable",
      snapshot: null,
      lastSuccessAt: lastSuccessfulSnapshotAt,
    };
  }
}
