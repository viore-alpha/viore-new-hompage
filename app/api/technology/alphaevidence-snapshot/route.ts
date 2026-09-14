import {
  ALPHAEVIDENCE_SNAPSHOT_REVALIDATE_SECONDS,
  getAlphaEvidencePublicSnapshot,
} from "@/app/alphaevidence-snapshot";

export async function GET() {
  const result = await getAlphaEvidencePublicSnapshot();
  const status = result.state === "unavailable" ? 503 : 200;

  return Response.json(result, {
    status,
    headers: {
      "Cache-Control": `public, max-age=0, s-maxage=${ALPHAEVIDENCE_SNAPSHOT_REVALIDATE_SECONDS}, stale-while-revalidate=3600`,
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
