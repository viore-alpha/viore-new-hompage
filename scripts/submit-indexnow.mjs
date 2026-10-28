const SITE_ORIGIN = "https://vioreai.com";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY = "68610822735d7ad887a086e8769cb4ceda64055fb76cb4be7006b182238065ff";
const KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;
const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
const dryRun = process.argv.includes("--dry-run");

async function fetchWithTimeout(url, init = {}) {
  return fetch(url, {
    ...init,
    signal: AbortSignal.timeout(20_000),
  });
}

const [sitemapResponse, keyResponse] = await Promise.all([
  fetchWithTimeout(SITEMAP_URL),
  fetchWithTimeout(KEY_LOCATION),
]);

if (!sitemapResponse.ok) {
  throw new Error(`Sitemap request failed: ${sitemapResponse.status} ${SITEMAP_URL}`);
}
if (!keyResponse.ok) {
  throw new Error(`IndexNow key request failed: ${keyResponse.status} ${KEY_LOCATION}`);
}

const [sitemapXml, publicKey] = await Promise.all([
  sitemapResponse.text(),
  keyResponse.text(),
]);

if (publicKey.trim() !== INDEXNOW_KEY) {
  throw new Error("The public IndexNow key file does not match the configured key.");
}

const urlList = [
  ...new Set(
    [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((match) => match[1].trim())
      .filter((value) => {
        const url = new URL(value);
        return url.origin === SITE_ORIGIN;
      }),
  ),
];

if (urlList.length !== 8) {
  throw new Error(`Expected 8 canonical URLs in the live sitemap, found ${urlList.length}.`);
}

const payload = {
  host: new URL(SITE_ORIGIN).host,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList,
};

if (dryRun) {
  console.log(JSON.stringify({ dryRun: true, sitemap: SITEMAP_URL, ...payload }, null, 2));
  process.exit(0);
}

const response = await fetchWithTimeout(INDEXNOW_ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

if (response.status !== 200 && response.status !== 202) {
  const detail = await response.text();
  throw new Error(`IndexNow submission failed: ${response.status} ${detail}`);
}

console.log(`IndexNow accepted ${urlList.length} URLs with HTTP ${response.status}.`);
