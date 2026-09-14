import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname) {
  const baseUrl = process.env.VIORE_TEST_BASE_URL;
  if (!baseUrl) throw new Error("VIORE_TEST_BASE_URL is required");

  return fetch(new URL(pathname, baseUrl), {
    headers: { accept: "text/html" },
    redirect: "manual",
  });
}

test("server-renders independent Korean and English homepage metadata", async () => {
  const [response, englishResponse] = await Promise.all([
    render("/ko"),
    render("/en"),
  ]);
  assert.equal(response.status, 200);
  assert.equal(englishResponse.status, 200);

  const [html, englishHtml] = await Promise.all([
    response.text(),
    englishResponse.text(),
  ]);
  assert.match(html, /<html lang="ko-KR"/);
  assert.match(html, /<title>바이오레, 새로운 선형을 그리다\.<\/title>/);
  assert.match(html, /<meta name="description" content="의료의 전문성과 시스템을 연결해/);
  assert.match(html, /<meta name="robots" content="index, follow"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/vioreai\.com\/ko"/);
  assert.match(html, /<link rel="alternate" hrefLang="en-US" href="https:\/\/vioreai\.com\/en"/);
  assert.match(html, /<meta property="og:title" content="바이오레, 새로운 선형을 그리다\."/);
  assert.match(html, /<meta property="og:image" content="https:\/\/vioreai\.com\/brand\/viore-social-card-white-v3\.png"/);
  assert.match(html, /<meta property="og:image:width" content="1200"/);
  assert.match(html, /<meta property="og:image:height" content="630"/);
  assert.match(html, /<meta name="twitter:title" content="바이오레, 새로운 선형을 그리다\."/);
  assert.match(html, /<link rel="icon" href="\/brand\/viore-v-square-white-v2\.png"/);
  assert.match(html, /<meta name="google-site-verification"/);
  assert.match(html, /<meta name="naver-site-verification"/);
  assert.match(html, /id="viore-home-structured-data"/);
  assert.match(html, /"legalName":"주식회사 바이오레"/);
  assert.match(html, /class="footer-company-primary"><strong>주식회사 바이오레<\/strong><span>대표 고석진<\/span><span>사업자등록번호 709-88-03418<\/span>/);
  assert.match(html, /class="footer-company-address"><span>경기도 성남시 분당구 대왕판교로 660,/);
  assert.match(html, /href="mailto:biz@vioreai\.com">biz@vioreai\.com<\/a>/);
  assert.doesNotMatch(html, /131111-0078435/);
  assert.doesNotMatch(html, /\[object Object\]/);

  assert.match(englishHtml, /<html lang="en-US"/);
  assert.match(englishHtml, /<title>Viore, Drawing a New Linearity in Medicine\.<\/title>/);
  assert.match(englishHtml, /<meta property="og:title" content="Viore, Drawing a New Linearity in Medicine\."/);
  assert.match(englishHtml, /<meta property="og:image" content="https:\/\/vioreai\.com\/brand\/viore-social-card-white-v3\.png"/);
  assert.match(englishHtml, /class="footer-company-primary"><strong>Viore Inc\.<\/strong><span>Representative Seokjin Ko<\/span><span>Business Registration No\. 709-88-03418<\/span>/);
  assert.match(englishHtml, /B101-102 and 104, Building A, 660 Daewangpangyo-ro/);
  assert.doesNotMatch(englishHtml, /<title>바이오레,/);
});

test("server-renders the correct document language for every canonical page", async () => {
  const paths = [
    "/ko",
    "/en",
    "/ko/technology",
    "/en/technology",
    "/ko/product/alphadoc",
    "/en/product/alphadoc",
    "/ko/knowledge",
    "/en/knowledge",
    "/ko/legal",
    "/en/legal",
  ];
  const responses = await Promise.all(paths.map((pathname) => render(pathname)));

  for (const [index, response] of responses.entries()) {
    assert.equal(response.status, 200, paths[index]);
    const html = await response.text();
    const expectedLanguage = paths[index].startsWith("/ko") ? "ko-KR" : "en-US";
    assert.match(html, new RegExp(`<html lang="${expectedLanguage}"`), paths[index]);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://vioreai\\.com${paths[index]}"`), paths[index]);
  }
});

test("permanently redirects the root index to the Korean canonical page", async () => {
  const response = await render("/");
  assert.equal(response.status, 308);
  assert.equal(new URL(response.headers.get("location"), "http://localhost").pathname, "/ko");
});

test("permanently maps retired locale entry points to current canonical pages", async () => {
  for (const [legacyPath, currentPath] of [
    ["/global", "/en"],
    ["/global/", "/en"],
    ["/legal", "/ko/legal"],
    ["/legal/", "/ko/legal"],
  ]) {
    const response = await render(legacyPath);
    assert.equal(response.status, 308);
    assert.equal(new URL(response.headers.get("location"), "http://localhost").pathname, currentPath);
  }
});

test("serves a clean noindex document for retired and unknown pages", async () => {
  const response = await render("/medical-ai-startup");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /<title>페이지를 찾을 수 없습니다 \| Viore<\/title>/);
  assert.equal((html.match(/<meta name="robots" content="noindex"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /<meta name="robots" content="index, follow"/);
});

test("permanently redirects the former Company routes to each locale homepage", async () => {
  for (const [legacyPath, currentPath] of [
    ["/ko/company", "/ko"],
    ["/en/company", "/en"],
  ]) {
    const response = await render(legacyPath);
    assert.equal(response.status, 308);
    assert.equal(new URL(response.headers.get("location"), "http://localhost").pathname, currentPath);
  }
});

test("permanently redirects the former Contact routes to the partnership inquiry", async () => {
  for (const [legacyPath, currentPath] of [
    ["/ko/contact", "/ko#partnership-inquiry"],
    ["/en/contact", "/en#partnership-inquiry"],
  ]) {
    const response = await render(legacyPath);
    const location = new URL(response.headers.get("location"), "http://localhost");
    assert.equal(response.status, 308);
    assert.equal(`${location.pathname}${location.hash}`, currentPath);
  }
});

test("keeps the inactive language option legible over the translucent header", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /\.language-switch a \{[^}]*color: #3f4044;[^}]*font-weight: 650;/);
  assert.match(css, /\.language-switch a:hover,\.language-switch a:focus-visible \{[^}]*color: var\(--ink\);/);
  assert.match(css, /\.language-switch a\.is-active \{[^}]*color: var\(--ink\);/);
});

test("ships aligned crawler files and brand thumbnail dimensions", async () => {
  const [robots, sitemapResponse, llms, manifestText, socialLogoImage, squareImage] = await Promise.all([
    readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
    render("/sitemap.xml"),
    readFile(new URL("../public/llms.txt", import.meta.url), "utf8"),
    readFile(new URL("../public/site.webmanifest", import.meta.url), "utf8"),
    readFile(new URL("../public/brand/viore-social-card-white-v3.png", import.meta.url)),
    readFile(new URL("../public/brand/viore-v-square-white-v2.png", import.meta.url)),
  ]);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();

  assert.match(robots, /Sitemap: https:\/\/vioreai\.com\/sitemap\.xml/);
  assert.match(robots, /Disallow: \/api\//);
  assert.match(sitemap, /<loc>https:\/\/vioreai\.com\/ko<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/vioreai\.com\/en<\/loc>/);
  assert.doesNotMatch(sitemap, /\/company/);
  assert.doesNotMatch(sitemap, /\/contact/);
  assert.match(sitemap, /<loc>https:\/\/vioreai\.com\/ko\/knowledge<\/loc>/);
  assert.doesNotMatch(sitemap, /\/council/);
  assert.doesNotMatch(sitemap, /\/insight\//);
  assert.match(sitemap, /hreflang="x-default" href="https:\/\/vioreai\.com\/ko"/);
  assert.equal((sitemap.match(/hreflang="x-default"/g) ?? []).length, 10);
  assert.equal((sitemap.match(/<loc>/g) ?? []).length, 10);
  assert.match(llms, /Korean homepage: https:\/\/vioreai\.com\/ko/);
  assert.doesNotMatch(llms, /vioreai\.com\/ko\/company/);
  assert.match(llms, /Korean knowledge: https:\/\/vioreai\.com\/ko\/knowledge/);
  assert.match(llms, /English knowledge: https:\/\/vioreai\.com\/en\/knowledge/);
  assert.match(llms, /Viore designs medical AI as a connected technology system rather than one model/);
  assert.match(llms, /AlphaDocument's core engine and product connection paths are implemented/);
  assert.match(llms, /AlphaImage's bounded static-image artifact technology is implemented and synthetic-input runtime-verified/);
  assert.match(llms, /AlphaLayer is runtime-verified for selected protected text capabilities/);
  assert.match(llms, /AlphaSeal encrypts message bodies on supported one-to-one paths/);
  assert.doesNotMatch(llms, /Council:|\/council/);

  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.name, "바이오레 | Viore");
  assert.match(manifest.description, /주식회사 바이오레/);
  assert.equal(manifest.icons[0].src, "/brand/viore-v-square-white-v2.png");

  const pngSize = (buffer) => ({
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  });
  assert.deepEqual(pngSize(socialLogoImage), { width: 1200, height: 630 });
  assert.deepEqual(pngSize(squareImage), { width: 1024, height: 1024 });

  const optimizedTexture = await render("/media/viore-paper-texture-dark-v2.webp");
  assert.equal(optimizedTexture.status, 200);
  assert.equal(
    optimizedTexture.headers.get("cache-control"),
    "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800",
  );
});

test("submits exactly the production sitemap through IndexNow after a successful deployment", async () => {
  const [packageJson, script, workflow] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../scripts/submit-indexnow.mjs", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/indexnow.yml", import.meta.url), "utf8"),
  ]);

  assert.match(packageJson, /"seo:indexnow": "node scripts\/submit-indexnow\.mjs"/);
  assert.match(script, /const SITEMAP_URL = `\$\{SITE_ORIGIN\}\/sitemap\.xml`/);
  assert.match(script, /urlList\.length !== 10/);
  assert.match(script, /response\.status !== 200 && response\.status !== 202/);
  assert.match(workflow, /deployment_status:/);
  assert.match(workflow, /github\.event\.deployment\.environment == 'Production'/);
  assert.match(workflow, /ref: \$\{\{ github\.event\.deployment\.sha \}\}/);
  assert.doesNotMatch(workflow, /pull_request:/);
});

test("server-renders the Korean Company story as the homepage", async () => {
  const response = await render("/ko");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<link rel="canonical" href="https:\/\/vioreai\.com\/ko"/);
  assert.match(html, /<meta property="og:url" content="https:\/\/vioreai\.com\/ko"/);
  assert.match(html, /<link rel="alternate" hrefLang="en-US" href="https:\/\/vioreai\.com\/en"/);
  assert.match(html, /class="company-hero"/);
  assert.match(html, /의료계의/);
  assert.match(html, /새로운 선형을 그리다\./);
  assert.match(html, /의료계가 오랜 시간 축적해 온 전문성과 시스템을 연결하기 위한 선/);
  assert.match(html, /그것이 바이오레 입니다/);
  assert.match(html, /의료인의 모든 업무를/);
  assert.match(html, /하나의 흐름으로/);
  assert.match(html, /혁신은, 더 많이 더하는 일이 아닙니다\./);
  assert.match(html, /이미 존재하는 의료의 전문성과 시스템이 더 자연스럽게 이어지도록 만드는 일입니다\./);
  assert.match(html, /바이오레는 의료인의 질문과 문서, 지식과 도구가 끊김 없이 이어지는 환경을 Medical OS\(Operating System\)라고 부릅니다\./);
  assert.match(html, /class="detail-statement-lead"/);
  assert.match(html, /data-metrics-source="(?:live|snapshot)"/);
  assert.match(html, /class="company-metrics-asof"/);
  assert.match(html, /(?:데이터 기준|검증 스냅샷 게시)/);
  assert.match(html, /Medical Documents Added Monthly/);
  assert.match(html, /Standardized Medical Documents/);
  assert.match(html, /Korean &amp; Global Clinical Guidelines/);
  assert.match(html, /최근 30일 신규 정규화 문헌/);
  assert.match(html, /누적 정규화 의료 문헌/);
  assert.match(html, /누적 공개 국내외 가이드라인·지침 문헌/);
  assert.ok(html.indexOf("Standardized Medical Documents") < html.indexOf("Medical Documents Added Monthly"));
  assert.match(html, /class="company-efficiency"/);
  assert.match(html, /class="company-efficiency-title-brand">Alphadoc<\/span><span class="company-efficiency-title-workspace">AI Medical Workspace<\/span>/);
  assert.doesNotMatch(html, /company-efficiency-title-brand">Alphadoc,/);
  assert.doesNotMatch(html, /company-efficiency-workspace|company-section-subtitle/);
  assert.match(html, /class="company-knowledge"/);
  assert.match(html, /id="company-knowledge-title">Ever-growing Knowledge<\/h2>/);
  assert.match(html, /class="company-question-loop"/);
  assert.match(html, /패혈증 초기 처치는\?/);
  assert.match(html, /의료 현장은 수많은 정보와 시스템 사이를 끊임없이 오갑니다\./);
  assert.match(html, /기록하고, 계산하고, 검색하고, 확인하는 반복적인 과정은 의료인의 시간을 빼앗습니다\./);
  assert.match(html, /class="company-efficiency-product">알파닥<\/strong>은 이러한 업무를 하나의 자연스러운 흐름으로 연결하여,/);
  assert.match(html, /의료인이 가장 중요한 일에 집중할 수 있도록 돕습니다\./);
  assert.match(html, /class="company-connections"/);
  assert.ok(html.indexOf('class="company-efficiency"') < html.indexOf('class="company-knowledge"'));
  assert.ok(html.indexOf('class="company-knowledge"') < html.indexOf('class="company-metrics"'));
  assert.doesNotMatch(html, /CONNECTED BY DESIGN/);
  assert.doesNotMatch(html, /기존의 가치를 대체하지 않으며/);
  assert.match(html, /One connected Flow/);
  assert.match(html, /for Medicine/);
  assert.match(html, /보안을 고려한 설계/);
  assert.match(html, /더 직관적인 경험/);
  assert.match(html, /다양한 의료 도구/);
  assert.match(html, /빠른 의료 노트 작성/);
  assert.match(html, /쉽게 보는 최신 의료 근거/);
  assert.match(html, /함께 성장하는 지식 커뮤니티/);
  assert.ok(html.indexOf("더 직관적인 경험") < html.indexOf("보안을 고려한 설계"));
  assert.ok(html.indexOf("보안을 고려한 설계") < html.indexOf("다양한 의료 도구"));
  assert.ok(html.indexOf("다양한 의료 도구") < html.indexOf("빠른 의료 노트 작성"));
  assert.doesNotMatch(html, /처음부터 설계 기준에 포함된 보안/);
  assert.match(html, /class="company-convergence-canvas"/);
  assert.doesNotMatch(html, /viore-company-convergence-threads|viore-company-network-dark-portrait-transparent/);
  assert.doesNotMatch(html, /viore-connected-principles/);
  assert.match(html, /그 첫 번째 선형, <span class="company-join-product-name">알파닥 Alphadoc<\/span>/);
  assert.match(html, /id="partnership-inquiry"/);
  assert.match(html, /href="\/ko#partnership-inquiry"[^>]*>Contact<\/a>/);
  assert.doesNotMatch(html, /NEW LINE/);
  assert.doesNotMatch(html, />첫 번째 선형, 알파닥</);
  assert.doesNotMatch(html, /Medical intelligence|Connected workflow|Responsible direction/);
  assert.doesNotMatch(html, /바이오레는 의료계의 새로운 선형을 그립니다\./);
  assert.match(html, /class="company-energy-canvas"/);
  assert.match(html, /class="company-scroll-cue"/);
  assert.doesNotMatch(html, />스크롤</);
  assert.doesNotMatch(html, /company-energy-line|company-energy-core/);
  assert.doesNotMatch(html, /detail-network-backdrop|company-linearity-visual/);
});

test("keeps Knowledge public while Council is unavailable and marked coming soon", async () => {
  const [companyResponse, knowledgeResponse, englishKnowledgeResponse, councilResponse] = await Promise.all([
    render("/ko"),
    render("/ko/knowledge"),
    render("/en/knowledge"),
    render("/ko/council"),
  ]);

  assert.equal(companyResponse.status, 200);
  assert.equal(knowledgeResponse.status, 200);
  assert.equal(englishKnowledgeResponse.status, 200);
  assert.equal(councilResponse.status, 404);

  const [companyHtml, knowledgeHtml, englishKnowledgeHtml] = await Promise.all([
    companyResponse.text(),
    knowledgeResponse.text(),
    englishKnowledgeResponse.text(),
  ]);

  assert.match(companyHtml, /href="\/ko\/knowledge"[^>]*>Knowledge<\/a>/);
  assert.doesNotMatch(companyHtml, /href="\/ko\/council"/);
  assert.match(companyHtml, /class="nav-link nav-link-disabled"[^>]*disabled=""[^>]*>[\s\S]*?<span>Council<\/span>[\s\S]*?<small>Coming soon<\/small>/);
  assert.match(companyHtml, /class="mobile-top-link mobile-top-link-disabled"[^>]*disabled=""/);
  assert.doesNotMatch(companyHtml, />Insight<\/button>/);
  assert.doesNotMatch(knowledgeHtml, /INSIGHT ·/);
  assert.match(knowledgeHtml, /<link rel="canonical" href="https:\/\/vioreai\.com\/ko\/knowledge"/);
  assert.match(knowledgeHtml, /<title>바이오레 Knowledge \| 최신 의학 논문과 근거<\/title>/);
  assert.match(knowledgeHtml, /<h1 id="knowledge-title">Knowledge<\/h1>/);
  assert.match(englishKnowledgeHtml, /<h1 id="knowledge-title">Knowledge<\/h1>/);
  assert.match(knowledgeHtml, /class="knowledge-page" data-knowledge-state="live"/);
  assert.doesNotMatch(knowledgeHtml, /VIORE · ALPHADOC LITERATURE/);
  assert.doesNotMatch(knowledgeHtml, /실시간으로 채워지는 논문 라이브러리\./);
  assert.doesNotMatch(englishKnowledgeHtml, /A living library of newly published medical literature\./);
  assert.match(knowledgeHtml, /신규 논문과 브리프/);
  assert.match(knowledgeHtml, /AlphaEvidence DB에서 선별한 국내외 최신 논문/);
  assert.match(knowledgeHtml, /aria-label="전체"[^>]*aria-pressed="true"/);
  assert.match(knowledgeHtml, /aria-label="해외"[^>]*aria-pressed="false"/);
  assert.match(knowledgeHtml, /aria-label="국내"[^>]*aria-pressed="false"/);
  const paperCardCount = (knowledgeHtml.match(/class="knowledge-paper-card"/g) ?? []).length;
  assert.equal(paperCardCount, 12);
  assert.match(knowledgeHtml, /data-paper-scope="overseas"/);
  assert.match(knowledgeHtml, /class="knowledge-paper-brief" lang="ko"/);
  assert.match(knowledgeHtml, /rel="noopener noreferrer"/);
  assert.match(knowledgeHtml, /class="knowledge-feed-sentinel"/);
  assert.doesNotMatch(knowledgeHtml, /knowledge-filter-result/);
  assert.doesNotMatch(knowledgeHtml, /class="knowledge-scope-filter"[^>]*><span>[^<]+<\/span><small>/);
  assert.doesNotMatch(knowledgeHtml, /detail-page-knowledge|knowledge-motion|knowledge-stack/);
});

test("implements Knowledge as a paginated live literature contract on paper", async () => {
  const [contract, dataSource, component, paperLibrary, apiRoute, css, migration] = await Promise.all([
    readFile(new URL("../app/knowledge-contract.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/knowledge-feed.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/KnowledgePage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/KnowledgePaperLibrary.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/knowledge/papers/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/knowledge.css", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/20260721103250_knowledge_infinite_public_feed.sql", import.meta.url), "utf8"),
  ]);

  assert.match(contract, /KNOWLEDGE_PAGE_SIZE = 12/);
  assert.match(contract, /knowledge\.literature\.page\.v1/);
  assert.match(contract, /href\.protocol !== "https:"/);
  assert.match(contract, /items\.length > KNOWLEDGE_MAX_PAGE_SIZE/);
  assert.match(dataSource, /viore_knowledge_public_papers/);
  assert.match(dataSource, /published_date\.lt\./);
  assert.match(dataSource, /paper_id\.lt\./);
  assert.match(dataSource, /limit \+ 1/);
  assert.match(dataSource, /AbortSignal\.timeout\(KNOWLEDGE_FEED_FETCH_TIMEOUT_MS\)/);
  assert.match(dataSource, /next: \{ revalidate: KNOWLEDGE_FEED_REVALIDATE_SECONDS \}/);
  assert.doesNotMatch(dataSource, /service_role|service-role|secret key/i);
  assert.match(component, /<h1 id="knowledge-title">Knowledge<\/h1>/);
  assert.doesNotMatch(component, /실시간으로 채워지는 논문 라이브러리\.|A living library of newly published medical literature\./);
  assert.match(paperLibrary, /useState<KnowledgeFilter>\("all"\)/);
  assert.match(paperLibrary, /aria-pressed=\{activeFilter === filter\.value\}/);
  assert.match(paperLibrary, /new IntersectionObserver/);
  assert.match(paperLibrary, /rootMargin: "900px 0px"/);
  assert.match(paperLibrary, /\/api\/knowledge\/papers/);
  assert.match(paperLibrary, /parseKnowledgePaperPage/);
  assert.match(paperLibrary, /target="_blank"/);
  assert.match(paperLibrary, /rel="noopener noreferrer"/);
  assert.match(paperLibrary, /item\.brief/);
  assert.doesNotMatch(paperLibrary, /counts|knowledge-filter-result|<small>/);
  assert.match(apiRoute, /invalid_scope/);
  assert.match(apiRoute, /invalid_cursor/);
  assert.match(apiRoute, /Cache-Control/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /grant select on table public\.viore_knowledge_public_papers to anon, authenticated/);
  assert.match(migration, /refresh_viore_knowledge_public_papers/);
  assert.match(migration, /viore-knowledge-public-papers-hourly/);
  assert.match(migration, /viore_knowledge_abstract_allowed/);
  assert.match(css, /\.knowledge-paper-columns \{[\s\S]*?column-count: 4;/);
  assert.match(css, /\.knowledge-paper-card \{[\s\S]*?border-radius: 0;[\s\S]*?background: transparent;[\s\S]*?box-shadow: none;/);
  assert.match(css, /\.knowledge-scope-filter \{[\s\S]*?background: transparent;/);
  assert.match(css, /\.knowledge-feed-sentinel/);
  assert.match(css, /background-image: var\(--paper-texture\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("rejects malformed or unsafe paginated Knowledge payloads", async () => {
  const {
    isKnowledgeCursor,
    parseKnowledgePaperPage,
  } = await import(new URL("../app/knowledge-contract.ts", import.meta.url));
  const refreshedAt = "2026-07-21T09:50:33.000Z";
  const validPage = {
    schema_version: "knowledge.literature.page.v1",
    items: [{
      paper_id: "33e7523d-1405-4566-b91d-547ea2807610",
      published_date: "2026-07-21",
      title: "A clinically relevant paper title",
      title_ko: null,
      brief: "알파닥 카드 요약 정책을 통과한 완결된 한국어 브리프입니다.",
      authors: ["Kim A"],
      author_count: 1,
      journal: "Clinical Journal",
      published_year: 2026,
      source: "pubmed",
      scope: "overseas",
      href: "https://pubmed.ncbi.nlm.nih.gov/12345678/",
    }],
    next_cursor: "2026-07-21_33e7523d-1405-4566-b91d-547ea2807610",
    data_as_of: refreshedAt,
    refreshed_at: refreshedAt,
  };

  assert.ok(parseKnowledgePaperPage(validPage));
  assert.ok(isKnowledgeCursor(validPage.next_cursor));
  assert.equal(isKnowledgeCursor("not-a-cursor"), false);
  assert.equal(parseKnowledgePaperPage({ ...validPage, next_cursor: "not-a-cursor" }), null);
  assert.equal(parseKnowledgePaperPage({
    ...validPage,
    items: [{ ...validPage.items[0], href: "javascript:alert(1)" }],
  }), null);
  assert.equal(parseKnowledgePaperPage({
    ...validPage,
    items: [{ ...validPage.items[0], brief: "English-only abstract is rejected." }],
  }), null);
  assert.equal(parseKnowledgePaperPage({
    ...validPage,
    items: [validPage.items[0], validPage.items[0]],
  }), null);
});

test("serves domestic Knowledge pages and advances the cursor without duplicates", async () => {
  const firstResponse = await render("/api/knowledge/papers?scope=domestic");
  assert.equal(firstResponse.status, 200);
  const firstPage = await firstResponse.json();
  assert.equal(firstPage.schema_version, "knowledge.literature.page.v1");
  assert.ok(firstPage.items.length > 0 && firstPage.items.length <= 12);
  assert.ok(firstPage.items.every((item) => item.scope === "domestic"));
  assert.ok(firstPage.items.every((item) => /[가-힣]/u.test(item.brief)));
  if (firstPage.next_cursor) {
    assert.match(firstPage.next_cursor, /^\d{4}-\d{2}-\d{2}_[0-9a-f-]{36}$/i);
    const secondResponse = await render(`/api/knowledge/papers?scope=domestic&cursor=${encodeURIComponent(firstPage.next_cursor)}`);
    assert.equal(secondResponse.status, 200);
    const secondPage = await secondResponse.json();
    assert.ok(secondPage.items.length <= 12);
    const firstIds = new Set(firstPage.items.map((item) => item.paper_id));
    assert.ok(secondPage.items.every((item) => !firstIds.has(item.paper_id)));
  } else {
    assert.equal(firstPage.next_cursor, null);
  }

  const invalidResponse = await render("/api/knowledge/papers?scope=domestic&cursor=unsafe");
  assert.equal(invalidResponse.status, 400);
});

test("redirects legacy Knowledge while keeping the former Council route unavailable", async () => {
  const knowledgeResponse = await render("/ko/insight/knowledge");
  assert.equal(knowledgeResponse.status, 308);
  assert.equal(new URL(knowledgeResponse.headers.get("location"), "http://localhost").pathname, "/ko/knowledge");

  const councilResponse = await render("/ko/insight/clinical-council");
  assert.equal(councilResponse.status, 404);
});

test("server-renders the Alphadoc product story from real product UI", async () => {
  const [response, css, productCss, productSource, heroMotionSource, workspaceSource, featureRailSource, featureCardSource, featureMotionSource, phoneDemoSource, viewportMotionSource, deferredViewportMotionSource, energyCanvasSource, threadRenderQualitySource, nextConfigSource] = await Promise.all([
    render("/ko/product/alphadoc"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/product.css", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ProductPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AlphadocHeroMotion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AlphadocWorkspaceMotion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AlphadocFeatureRail.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AlphadocFeatureCard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AlphadocFeatureMotionSvg.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AlphadocsPhoneDemo.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/useViewportMotion.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ViewportMotion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CompanyEnergyCanvas.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/threadRenderQuality.ts", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
  ]);
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>알파닥 \| 의료 업무를 잇는 AI Medical Workspace<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/vioreai\.com\/ko\/product\/alphadoc"/);
  assert.match(html, /class="alphadoc-product lang-ko"/);
  assert.match(html, /class="site-header site-header-dark"/);
  assert.match(html, /class="site-footer "/);
  assert.doesNotMatch(html, /class="site-footer site-footer-dark"/);
  assert.match(html, /class="ap-hero-brand">알파닥,<\/span><span class="ap-hero-tagline">의료 업무를 하나의 AI Workspace로<\/span>/);
  assert.match(html, /임상 질문부터 근거 확인, 문서 작성과 번역까지\.\s*의료인의 업무를 앱의 형태로 이어주는 공간\./);
  assert.match(html, /의료인들의 하루를 바꾸는 워크스페이스/);
  assert.match(html, /class="ap-hero-motion-scene"/);
  assert.match(html, /class="ap-motion-chat"/);
  assert.match(html, /class="ap-motion-answer"/);
  assert.match(html, /38세 여성, Hb 8\.1, 혈소판 18,000/);
  assert.match(html, /TTP와 DIC를 감별하고 즉시 처치를 정리해줘/);
  assert.match(html, /혈전성 혈소판감소성 자반증/);
  assert.match(html, /ADAMTS13·PLASMIC/);
  assert.match(html, /예시 흉부 X-ray와 논문 PDF를 첨부해 답변받는 3단계 데모/);
  assert.match(html, /class="ap-motion-composer"/);
  assert.match(html, /class="ap-motion-action-bar"/);
  assert.match(html, /class="ap-motion-interface ap-motion-apps"/);
  assert.match(html, /https:\/\/alphadoc\.ai\/brand\/feature-icons\/functions\/soap\/logo\.svg/);
  assert.match(html, /https:\/\/alphadoc\.ai\/brand\/feature-icons\/panel\/guideline\/logo\.svg/);
  assert.match(nextConfigSource, /img-src 'self' data: https:\/\/alphadoc\.ai/);
  assert.doesNotMatch(html, /ap-hero-motion-svg/);
  assert.match(html, /\/brand\/alphadoc-alpha\.png/);
  assert.match(html, /모든 것이 하나의 화면 안에/);
  assert.match(html, /필요한 모든 기능이 단 하나의 공간에 펼쳐집니다\.\s*복잡함은 비우고 시야는 넓혀, 당신이 필요한 순간에 완벽하게 집중할 수 있도록\./);
  assert.match(html, /class="ap-workspace-motion/);
  assert.match(html, /brand\/alphawing\/original\.png/);
  assert.match(html, /brand\/alphachick-motion\/egg\.png/);
  assert.match(html, /brand\/alphachick-motion\/chick\.png/);
  assert.match(html, /brand\/alphachick-motion\/chirp\.png/);
  assert.match(html, /brand\/feature-icons\/functions\/soap\/logo\.svg/);
  assert.match(html, /brand\/feature-icons\/panel\/community\/logo\.svg/);
  assert.match(html, /응급실 흉통 평가,[\s\S]*연속 검사 중심으로 개편/);
  assert.match(html, /Accelerated Chest Pain Assessment/);
  assert.match(html, /generated\/news-chest-pain-night-optimized\.webp/);
  assert.match(html, /generated\/community-chest-pain-handoff-optimized\.webp/);
  assert.match(html, /혼합 산-염기 장애 계산/);
  assert.match(html, /138−\(102\+13\)/);
  assert.match(html, /23\+2\.5×\(4\.4−2\.4\)/);
  assert.match(html, /25\.5–29\.5/);
  assert.match(html, /고음이온차 대사성 산증/);
  assert.match(workspaceSource, /className="ap-real-answer-interpretation"/);
  assert.match(workspaceSource, /className="ap-real-answer-source-row"/);
  assert.match(workspaceSource, /className="ap-real-answer-source-chip"/);
  assert.match(workspaceSource, /className="ap-real-answer-suggestion-row"/);
  assert.match(workspaceSource, /className="ap-real-chat-question-bubble"/);
  assert.match(workspaceSource, /className="ap-real-answer-suggestion-chip"/);
  assert.match(workspaceSource, /className="ap-real-answer-message-actions"/);
  assert.doesNotMatch(workspaceSource, /className="ap-real-answer-evidence"|copy\.followupLabel/);
  assert.match(html, /날씨 데이터: 기상청 단기예보/);
  assert.match(html, /16:00 업데이트/);
  assert.match(html, /21시에 고른 기사에요/);
  assert.match(html, /전체 뉴스/);
  assert.match(workspaceSource, /className="ap-real-news-pick-card"/);
  assert.match(workspaceSource, /className="ap-real-news-list-surface"/);
  assert.match(workspaceSource, /className="ap-real-news-list-row"/);
  assert.match(workspaceSource, /className="ap-real-community-post ap-real-community-post--text"/);
  assert.match(workspaceSource, /className="ap-real-community-post ap-real-community-post--photo"/);
  assert.match(workspaceSource, /className="ap-real-community-post-actions"/);
  assert.doesNotMatch(workspaceSource, /savedBriefing|새로운 알파닥스 활동|진료 현황 투표/);
  assert.match(html, /모든 가능성은 앱 하나로/);
  assert.match(html, /필요한 순간 앱을 바로 실행하세요\.\s*더 높은 자율성, 손쉬운 연동, 그리고 계속해서 추가되는 앱까지\.\s*하나의 공간에서 이 모든 것이 가능해집니다\./);
  assert.match(html, /href="#overview"[^>]*>인터페이스/);
  assert.match(html, /href="#clinical"[^>]*>앱/);
  assert.match(html, /href="#alphadocs"[^>]*>알파닥스/);
  assert.match(html, /논문 검색/);
  assert.match(html, /의료 공지/);
  assert.match(html, /진료서류/);
  assert.match(html, /문서 번역/);
  assert.match(html, /수많은 논문 사이에서, 지금 필요한 근거를 찾습니다/);
  assert.match(productSource, /의료 현장의 변화를 놓치지 않도록, 흩어진 공지를 한곳에 모읍니다/);
  assert.match(productSource, /반복되는 서류 업무를, 하나의 완성된 흐름으로 바꿉니다/);
  assert.match(productSource, /언어가 달라도, 의료 문서의 흐름은 끊기지 않습니다/);
  assert.match(productSource, /전체 번역과 요약 번역 중 목적에 맞는 방식을 고를 수 있습니다/);
  assert.match(productSource, /판단이 필요한 순간, 필요한 의료 도구를 바로 엽니다/);
  assert.match(html, /의료 도구/);
  assert.match(html, /외 다수의 앱들/);
  assert.match(html, /https:\/\/alphadoc\.ai\/brand\/feature-icons\/panel\/paper\/logo\.svg/);
  assert.match(html, /https:\/\/alphadoc\.ai\/brand\/feature-icons\/functions\/medical-notices\/logo\.png/);
  assert.match(html, /https:\/\/alphadoc\.ai\/brand\/feature-icons\/functions\/guide\/logo\.svg/);
  assert.match(html, /https:\/\/alphadoc\.ai\/brand\/feature-icons\/functions\/document-translation\/logo\.svg/);
  assert.match(html, /https:\/\/alphadoc\.ai\/brand\/feature-icons\/functions\/medical-tools\/logo\.svg/);
  assert.match(html, /소통의 모든 순간을,\s*더 직관적이고 책임 있게/);
  assert.match(html, /알파닥스는 알파닥 계정으로 참여하는 커뮤니티입니다/);
  assert.match(html, /class="ap-alphadocs-demo/);
  assert.match(html, /class="ap-alphadocs-phone"/);
  assert.match(html, /class="ap-community-panel-switcher"/);
  assert.match(html, /핫 포스트/);
  assert.match(html, />알파닥스</);
  assert.match(html, /새벽두시라떼/);
  assert.match(html, /개원한지2년/);
  assert.match(html, /로딩중인전공의/);
  assert.match(html, /문서정리중/);
  assert.match(html, /내 선택을 가장 많이 바꾼 조건은\?/);
  assert.match(html, /교육 분위기/);
  assert.match(html, /당직 강도/);
  assert.match(html, /급여·복지/);
  assert.match(html, /community-chest-pain-handoff-optimized\.webp/);
  assert.doesNotMatch(html, /ap-community-global-head|새로운 소식이 있나요\?/);
  assert.doesNotMatch(html, /내과의 · 18분|중증 패혈증 초기 수액 후 승압제/);
  assert.match(html, /Intuitive UI/);
  assert.match(html, /Account-based access/);
  assert.match(html, /Protection-aware design/);
  assert.doesNotMatch(html, /Verified Access|AlphaEncryption|proprietary encryption|독자 개발한 암호화/);
  assert.match(html, /https:\/\/alphadoc\.ai\/brand\/feature-icons\/panel\/community\/logo\.svg/);
  assert.match(html, /바이오레의 첫번째 선형,/);
  assert.match(html, /이제 시작해보세요\./);
  assert.match(html, /class="ap-final-logo-stage"/);
  assert.match(html, /class="company-energy-canvas"/);
  assert.match(html, /class="ap-final-logo" src="\/brand\/alphadoc-alpha\.png"/);
  assert.match(productSource, /<CompanyEnergyCanvas quality="balanced" \/>/);
  assert.match(productSource, /<AlphadocLocalNav items=\{content\.nav\} language=\{language\} \/>/);
  assert.match(productSource, /<ViewportMotion as="section" className="ap-final-cta" threshold=\{0\.12\}>/);
  assert.doesNotMatch(productSource, /^"use client"/m);
  assert.doesNotMatch(productSource, /function useInView/);
  assert.match(heroMotionSource, /type MotionPhase = "intro" \| "attaching" \| "typing" \| "submitting" \| "thinking" \| "answer"/);
  assert.match(heroMotionSource, /setTypedLength\(cursor\)/);
  assert.match(heroMotionSource, /setPhase\("attaching"\)/);
  assert.match(heroMotionSource, /setPhase\("thinking"\)/);
  assert.match(heroMotionSource, /setPhase\("answer"\)/);
  assert.match(heroMotionSource, /startInteraction\(index \+ 1\)/);
  assert.match(heroMotionSource, /typingInterval: 16/);
  assert.match(heroMotionSource, /typingStep: 5/);
  assert.match(heroMotionSource, /restartDelay: 2600/);
  assert.match(heroMotionSource, /function restartSequence\(\)/);
  assert.match(heroMotionSource, /schedule\(restartSequence, MOTION_TIMING\.restartDelay\)/);
  assert.match(heroMotionSource, /const heroAppIcons = \[/);
  assert.match(heroMotionSource, /className="ap-motion-interface ap-motion-apps"/);
  assert.match(heroMotionSource, /synthetic-chest-xray-rll-optimized\.webp/);
  assert.match(heroMotionSource, /이 흉부 X-ray에서 우하폐야 음영을 판독하고/);
  assert.match(heroMotionSource, /이 논문의 PICO, 주요 결과와 한계를 정리하고/);
  assert.match(heroMotionSource, /function AttachmentCard/);
  assert.match(heroMotionSource, /className="ap-motion-composer-file"/);
  assert.doesNotMatch(heroMotionSource, /ap-motion-start|PadakiMark|start:/);
  assert.doesNotMatch(heroMotionSource, /ap-motion-assistant-bubble|ap-motion-answer-metrics|ap-motion-sources/);
  assert.match(heroMotionSource, /useViewportMotion<HTMLDivElement>\(0\.18\)/);
  assert.match(workspaceSource, /<ViewportMotion/);
  assert.match(workspaceSource, /deferChildren/);
  assert.match(workspaceSource, /mountMargin="520px 0px"/);
  assert.match(workspaceSource, /threshold=\{0\.08\}/);
  assert.doesNotMatch(workspaceSource, /^"use client"/m);
  assert.match(workspaceSource, /viewBox="0 0 1280 840"/);
  assert.match(workspaceSource, /width="648" height="768"/);
  assert.doesNotMatch(workspaceSource, /ap-real-workflow-shelf|workflowLabel|workflowItems|최근 이어서 하기/);
  assert.match(workspaceSource, /className="ap-real-answer-actions"/);
  assert.match(workspaceSource, /M914 779V764/);
  assert.doesNotMatch(workspaceSource, /feature-icons\/chat\/send\/logo\.svg/);
  assert.match(phoneDemoSource, /useViewportMotion<HTMLDivElement>\(0\.24\)/);
  assert.match(viewportMotionSource, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
  assert.match(viewportMotionSource, /document\.addEventListener\("visibilitychange"/);
  assert.match(viewportMotionSource, /new Observer/);
  assert.match(viewportMotionSource, /shouldAnimate: inView && pageVisible && !reducedMotion/);
  assert.match(deferredViewportMotionSource, /new IntersectionObserver/);
  assert.match(deferredViewportMotionSource, /data-motion-mounted=\{mounted \? "true" : "false"\}/);
  assert.match(deferredViewportMotionSource, /media\.addEventListener\("change", syncMotionPreference\)/);
  assert.match(energyCanvasSource, /const GLOW_BLUR_PX = 6/);
  assert.match(energyCanvasSource, /const GLOW_REFRESH_SECONDS = 1 \/ 20/);
  assert.match(energyCanvasSource, /const DRAW_BUDGET_MS = 20/);
  assert.match(energyCanvasSource, /renderTier < 2/);
  assert.match(energyCanvasSource, /getThreadRenderTier/);
  assert.match(threadRenderQualitySource, /sharedThreadRenderTier/);
  assert.match(energyCanvasSource, /glowContext\.filter = `blur/);
  assert.match(energyCanvasSource, /className="company-energy-glow-canvas"/);
  assert.match(energyCanvasSource, /const pixelRatio = Math\.min\(window\.devicePixelRatio \|\| 1, 2\)/);
  assert.match(energyCanvasSource, /glowScale = Math\.min\(pixelRatio, 1\)/);
  assert.match(energyCanvasSource, /for \(let widthGroup = 0; widthGroup < 4; widthGroup \+= 1\)/);
  assert.doesNotMatch(energyCanvasSource, /const FRAME_INTERVAL|const frameInterval|pixelRatioCap|shadowBlur/);
  assert.match(energyCanvasSource, /frame = window\.requestAnimationFrame\(animate\)/);
  assert.match(html, /"@type":"SoftwareApplication"/);
  assert.match(html, /"@id":"https:\/\/alphadoc\.ai\/#software"/);
  assert.match(html, /"inLanguage":"ko-KR"/);
  assert.match(html, /class="ap-feature-gallery/);
  assert.match(html, /class="ap-feature-rail"[^>]*role="list"/);
  assert.match(html, /data-feature-card="papers"/);
  assert.match(html, /data-feature-card="notices"/);
  assert.match(html, /data-feature-card="forms"/);
  assert.match(html, /data-feature-card="translation"/);
  assert.match(html, /data-feature-card="tools"/);
  assert.match(html, /class="ap-feature-motion-placeholder"/);
  assert.doesNotMatch(html, /class="ap-feature-svg ap-feature-svg--(?:papers|notices|forms|translation|tools)"/);
  assert.doesNotMatch(html, /role="tablist"|class="ap-gallery-tabs"/);
  assert.match(featureRailSource, /const AUTO_SCROLL_PX_PER_SECOND = 18/);
  assert.match(featureRailSource, /const RAIL_COPIES = \[0, 1\] as const/);
  assert.match(featureRailSource, /autoFrameRef\.current = window\.requestAnimationFrame\(tick\)/);
  assert.match(featureRailSource, /rail\.scrollLeft = nextLoopWidth/);
  assert.match(featureRailSource, /let next = rail\.scrollLeft - \(elapsed \* AUTO_SCROLL_PX_PER_SECOND\) \/ 1000/);
  assert.match(featureRailSource, /if \(next <= 0\) next \+= loopWidth/);
  assert.match(featureRailSource, /new Observer\(\(entries\) =>/);
  assert.match(featureRailSource, /\{ root: rail, rootMargin: "0px 48px", threshold: \[0, 0\.06\] \}/);
  assert.match(featureRailSource, /motionVisible=\{visibleInstances\.has\(instanceId\)\}/);
  assert.match(featureRailSource, /const pendingInstances = new Set<string>\(\)/);
  assert.match(featureRailSource, /requestIdleCallback\(mountNext, \{ timeout: 700 \}\)/);
  assert.match(featureRailSource, /window\.addEventListener\("scroll", deferDuringPageScroll/);
  assert.match(featureRailSource, /const cards = cardMetricsRef\.current/);
  assert.doesNotMatch(featureRailSource, /AUTO_ADVANCE_MS|directionRef|rail\.scrollTo/);
  assert.match(featureRailSource, /useViewportMotion<HTMLDivElement>\(0\.04\)/);
  assert.match(featureRailSource, /onPointerEnter=\{handleCardPointerEnter\}/);
  assert.match(featureRailSource, /onTouchStart=\{\(\) => setTouchPaused\(true\)\}/);
  assert.match(featureRailSource, /onTouchEnd=\{handleTouchRelease\}/);
  assert.match(featureRailSource, /onTouchCancel=\{handleTouchRelease\}/);
  assert.match(featureRailSource, /data-auto-scroll=\{autoScrollRunning \? "running" : "paused"\}/);
  assert.doesNotMatch(featureRailSource, /INTERACTION_RESUME_MS|interactionResumeRef|onWheel=|onFocusCapture|onBlurCapture|handleRailPointer/);
  assert.match(featureRailSource, /event\.key !== "ArrowLeft" && event\.key !== "ArrowRight"/);
  assert.match(featureCardSource, /<AlphadocFeatureMotionSvg/);
  assert.match(featureCardSource, /lazy\(async \(\) =>/);
  assert.match(featureCardSource, /loading="lazy"/);
  assert.match(featureCardSource, /is-motion-visible/);
  assert.match(featureCardSource, /data-feature-instance=\{instanceId\}/);
  assert.match(featureCardSource, /aria-hidden=\{duplicate \? "true" : undefined\}/);
  assert.match(featureCardSource, /onPointerEnter=\{onPointerEnter\}/);
  assert.match(featureCardSource, /onPointerLeave=\{onPointerLeave\}/);
  assert.doesNotMatch(featureCardSource, /key=\{`\$\{item\.id\}-\$\{active/);
  assert.doesNotMatch(featureCardSource, /ap-feature-motion-(?:query|scan|focus|result)|ap-feature-screen-crop/);
  assert.match(featureMotionSource, /SGLT2 심부전/);
  assert.match(featureMotionSource, /discharge-summary\.pdf/);
  assert.match(featureMotionSource, /Score 3/);
  assert.match(featureMotionSource, /feature-icons\/header\/notification\/logo\.svg/);
  assert.match(featureMotionSource, /ap-svg-scene--papers/);
  assert.match(featureMotionSource, /ap-svg-scene--notices/);
  assert.match(featureMotionSource, /ap-svg-scene--forms/);
  assert.match(featureMotionSource, /ap-svg-scene--translation/);
  assert.match(featureMotionSource, /ap-svg-scene--tools/);
  assert.match(featureMotionSource, /function MotionCursor/);
  assert.match(featureMotionSource, /ap-svg-translation-percent--zero/);
  assert.match(featureMotionSource, /ap-svg-translation-percent--done/);
  assert.match(featureMotionSource, /<g transform="translate\(16 110\)">\s*<g className="ap-svg-paper-card is-match">/);
  assert.match(featureMotionSource, /<g transform="translate\(18 120\)"><g className="ap-svg-form-card is-selected">/);
  assert.match(featureMotionSource, /<g transform="translate\(288 154\)"><g className="ap-svg-tool-card is-selected">/);
  assert.doesNotMatch(featureMotionSource, /className="ap-svg-(?:paper-card|form-card is-selected|tool-card is-selected)" transform=/);
  assert.doesNotMatch(featureMotionSource, /#ff6f67|#ff8177|ap-feature-motion-(?:scan|focus)/);
  assert.match(html, /class="ap-button ap-button-primary"/);
  assert.doesNotMatch(html, /제품 화면 보기/);
  assert.doesNotMatch(html, /ALPHADOC · MEDICAL WORKSPACE|WORKSPACE ANATOMY|CLINICAL WORK|MEDICAL INTELLIGENCE|RECORDS &amp; DOCUMENTS|CONTINUITY/);
  assert.doesNotMatch(html, /실제 운영 UI|REAL UI|REAL PRODUCT UI/);
  assert.doesNotMatch(html, /ONE DAY · MANY SCREENS|ONE CONTINUOUS WORKFLOW/);
  assert.doesNotMatch(html, /ap-fragmented|ap-workflow/);
  assert.doesNotMatch(html, /ap-hero-panel|ap-hero-widget|ap-hero-workspace|ap-hero-wing|ap-hero-news|ap-hero-connector/);
  assert.doesNotMatch(html, /오픈.?베타|OPEN.?BETA/);
  assert.doesNotMatch(html, /바이오레가 그리는 새로운 선형을 의료인의 실제 하루로 옮긴/);
  assert.doesNotMatch(html, /의료인의 판단을 대신하지 않습니다/);
  assert.doesNotMatch(html, /href="#evidence"|href="#documents"|id="evidence"|id="documents"/);
  assert.doesNotMatch(html, /근거를 찾고 원문과 최신 업데이트까지 확인합니다|기록과 문서를 필요한 형식으로 완성합니다/);
  assert.doesNotMatch(html, /작업은 저장되고 다음번에도 이어집니다/);
  assert.doesNotMatch(html, /clinical-gallery-tab-(?:note|drug|guidelines|wing|form)"/);
  assert.doesNotMatch(html, /결과를 그대로 진료에 사용해도 되나요/);
  assert.doesNotMatch(html, /EMR이나 HIS를 대체하나요/);
  assert.doesNotMatch(html, /chickwing-logo\.svg|alphachicks\/cta-chick/);
  assert.doesNotMatch(html, /img\.hankyung\.com|it\.donga\.com|\[데스크칼럼\]|퓨리오사AI/);
  assert.doesNotMatch(html, /Ranson|핵심 정리/);
  assert.match(html, /Winter 공식 · 1967/);
  assert.match(html, /Albumin 보정 · 1998/);
  assert.match(html, /Delta gap · 1990/);
  assert.match(html, /PMID 6016545/);
  assert.match(html, /PMID 9824071/);
  assert.match(html, /PMID 2240729/);
  assert.match(html, /중환자실 항생제 재평가/);
  assert.match(html, /48시간 체크리스트 도입/);
  assert.match(html, /news-antibiotic-review-optimized\.webp/);

  assert.doesNotMatch(css, /PretendardVariable\.woff2/);
  assert.match(css, /--dark-paper-base: #08080a;/);
  assert.match(css, /--dark-paper-image: linear-gradient\(rgba\(0,0,0,\.24\),rgba\(0,0,0,\.24\)\),url\("\/media\/viore-paper-texture-dark-v2\.webp"\)/);
  assert.match(productCss, /\.alphadoc-product \{[\s\S]*?background-color: var\(--dark-paper-base\);[\s\S]*?background-image: var\(--dark-paper-image\);/);
  assert.match(productCss, /\.alphadoc-product \{[\s\S]*?background-size: var\(--dark-paper-size\);/);
  assert.match(productCss, /--ap-red: var\(--red\)/);
  assert.match(productCss, /\.ap-button-primary \{[^}]*background: var\(--ap-red\);[^}]*color: #fff;/);
  assert.match(productCss, /\.ap-hero-motion\.is-playing \.ap-motion-logo \{ animation: ap-motion-ui-in \.36s \.06s/);
  assert.match(productCss, /\.ap-hero-motion\.is-playing \.ap-motion-apps \{ animation: ap-motion-ui-in \.36s \.52s/);
  assert.match(productCss, /\.ap-motion-apps \{[^}]*grid-template-columns: repeat\(8,minmax\(0,1fr\)\);/);
  assert.match(productCss, /\.ap-hero-motion-scene \{[^}]*aspect-ratio: 16\/9;/);
  assert.doesNotMatch(productCss, /transition: aspect-ratio|\.ap-hero-motion:not\(\.is-followup\).*\.ap-hero-motion-scene/);
  assert.match(productCss, /\.ap-motion-user-bubble \{[^}]*background: linear-gradient\(155deg,#353537 0%,#171719 100%\);/);
  assert.match(productCss, /\.ap-motion-file--message \{[^}]*width: clamp\(150px,30cqw,250px\);/);
  assert.match(productCss, /\.ap-motion-composer-file \{[^}]*animation: ap-motion-file-arrive/);
  assert.match(productCss, /\.ap-motion-composer \{[^}]*border-radius: 999px;/);
  assert.match(productCss, /\.ap-hero-motion\.is-followup \.ap-motion-chat \{ opacity: 1;/);
  assert.match(productCss, /\.ap-hero-motion\.is-thinking \.ap-motion-chat,\.ap-hero-motion\.is-answer \.ap-motion-chat,\.ap-hero-motion\.is-followup \.ap-motion-chat \{ opacity: 1;/);
  assert.match(productCss, /\.ap-hero-motion\.is-answer \.ap-motion-answer \{ opacity: 1;/);
  assert.match(productCss, /@keyframes ap-motion-caret/);
  assert.match(productCss, /\.ap-motion-thinking i \{[^}]*infinite paused;/);
  assert.match(productCss, /#clinical,#alphadocs \{ scroll-margin-top: calc\(var\(--header\) \+ 44px\); \}/);
  assert.match(productCss, /\.ap-hero-copy h1 \{[^}]*white-space: normal;/);
  assert.match(productCss, /\.ap-hero-tagline \{[^}]*white-space: nowrap;/);
  assert.match(productCss, /\.ap-hero-lead \{[\s\S]*?white-space: pre-line;/);
  assert.match(productCss, /\.ap-section-head \{[\s\S]*?grid-template-columns: 1fr;[\s\S]*?align-items: start;/);
  assert.match(productCss, /\.ap-showcase-evidence \{[\s\S]*?background: rgba\(255,255,255,\.018\);/);
  assert.match(productCss, /--ap-product-motion-cycle: 12s;/);
  assert.match(productCss, /--ap-product-motion-delay: \.18s;/);
  assert.match(productCss, /\.ap-workspace-motion\.is-playing \.ap-real-calendar-palette/);
  assert.match(productCss, /\.ap-workspace-motion\.is-playing \.ap-real-calendar-palette \{ animation: ap-real-palette var\(--ap-product-motion-cycle\) var\(--ap-product-motion-delay\)/);
  assert.match(productCss, /\.ap-workspace-motion\.is-playing \.ap-real-wing-art \{ animation: ap-real-wing-flap 3\.8s/);
  assert.match(productCss, /\.ap-workspace-motion\.is-playing \.ap-real-answer-actions \{ animation: ap-real-answer-actions var\(--ap-product-motion-cycle\) var\(--ap-product-motion-delay\)/);
  assert.match(productCss, /@keyframes ap-real-send-glyph \{[^}]*color: #8e97a6;[^}]*opacity: 1;/);
  assert.doesNotMatch(productCss, /@keyframes ap-real-send-glyph \{[^}]*filter:/);
  assert.match(productCss, /@keyframes ap-real-chat-view/);
  assert.match(productCss, /@keyframes ap-real-literature-state/);
  assert.match(productCss, /@keyframes ap-real-community-state/);
  assert.match(productCss, /\.ap-feature-rail \{[^}]*scroll-behavior: auto;/);
  assert.doesNotMatch(productCss, /scroll-snap-type: x mandatory|scroll-snap-align: center/);
  assert.match(productCss, /\.ap-feature-motion \{[\s\S]*?overflow:hidden;[\s\S]*?background:#f5f6f8;/);
  assert.match(productCss, /\.ap-feature-motion-placeholder/);
  assert.match(productCss, /@keyframes ap-svg-file-drop/);
  assert.match(productCss, /@keyframes ap-svg-calculator-in/);
  assert.match(productCss, /@keyframes ap-svg-bell-ring/);
  assert.match(productCss, /\.ap-feature-card \{ flex-basis:min\(43vw,320px\); min-height:0; \}/);
  assert.match(productCss, /\.ap-feature-card-copy \{ min-height:0; \}/);
  assert.match(productCss, /\.ap-feature-card \{ flex-basis:clamp\(190px,calc\(\(100vw - 12px\)\/1\.8\),232px\); min-height:0;/);
  assert.match(productCss, /\.ap-feature-card-copy \{ min-height:0; padding:18px 17px 20px;/);
  assert.doesNotMatch(productCss, /min-height:386px|flex-basis:calc\(\(100vw - 28px\)\/1\.8\)/);
  assert.doesNotMatch(productCss, /ap-feature-(?:focus|result)-loop|ap-feature-motion-(?:scan|focus|result)/);
  assert.match(productCss, /\.ap-feature-gallery\.is-playing \.ap-feature-card\.is-motion-visible \{ --ap-feature-play-state:running; \}/);
  assert.doesNotMatch(productCss, /\.ap-feature-card\.is-motion-visible \.ap-feature-svg \*/);
  assert.doesNotMatch(productCss, /\.ap-feature-gallery\.is-playing:not\(\.is-paused\)|\.ap-feature-card\.is-current \.ap-feature-svg/);
  assert.doesNotMatch(productCss, /--ap-feature-delay: -/);
  assert.match(productCss, /@keyframes ap-svg-cursor-tools/);
  assert.match(productCss, /@keyframes ap-svg-percent-done/);
  assert.match(productCss, /@keyframes ap-community-feed-scroll/);
  assert.match(productCss, /\.ap-alphadocs-demo \{ --ap-community-cycle:10s; --ap-community-delay:\.45s;/);
  assert.match(productCss, /animation:ap-community-feed-scroll var\(--ap-community-cycle\)/);
  assert.match(productCss, /animation:ap-community-touch var\(--ap-community-cycle\)/);
  assert.doesNotMatch(productCss, /ap-community-(?:feed-scroll|touch|like|poll-fill|poll-value) 14s/);
  assert.match(productCss, /@keyframes ap-community-poll-fill/);
  assert.match(productCss, /@keyframes ap-community-touch/);
  assert.match(productCss, /\.ap-alphadocs-phone \{[\s\S]*?aspect-ratio: 393\/852;/);
  assert.match(productCss, /\.ap-community-poll \{[\s\S]*?background:#f6f9ff;/);
  assert.match(productCss, /\.ap-final-cta\.is-playing \.ap-final-logo-stage::before/);
  assert.match(productCss, /\.ap-final-cta \{[^}]*grid-template-columns: 1fr;[^}]*grid-template-rows: auto auto;[^}]*align-content: center;[^}]*justify-items: center;[^}]*gap: 28px;/);
  assert.match(productCss, /\.ap-final-screen \{ width: 100%; height: auto;[^}]*place-items: center;/);
  assert.match(productCss, /\.ap-final-logo-stage \{[^}]*width: min\(38vw,460px\);/);
  assert.match(productCss, /\.ap-final-copy \{ width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; \}/);
  assert.match(productCss, /\.ap-final-copy \.ap-hero-actions \{ justify-content: center; \}/);
  assert.match(productCss, /\.ap-final-cta \{ min-height:100svh; padding:56px 20px 72px; grid-template-rows:auto auto; align-content:center; align-items:start; gap:18px; \}/);
  assert.match(productCss, /\.ap-final-logo-stage \{ width:180px; \}/);
  assert.match(productCss, /\.ap-final-logo-stage::after,\.ap-final-screen \.ap-final-logo \{ width:72%; max-width:none; \}/);
  assert.match(productCss, /\.ap-final-copy \{ width:100%; display:flex; flex-direction:column; align-items:center; text-align:center; \}/);
  assert.match(productCss, /\.ap-final-copy \.ap-hero-actions \{ align-items:center; \}/);
  assert.doesNotMatch(productCss, /\.ap-final-screen \{ height: 430px;/);
  assert.doesNotMatch(productCss, /ap-real-cursor-ring/);
  assert.doesNotMatch(productCss, /\.ap-eyebrow|\.ap-fragmented|\.ap-workflow|\.ap-ui-badge|\.ap-hero-replay/);

  const asset = await readFile(new URL("../public/assets/product/alphadoc/01-workspace-apps.jpg", import.meta.url));
  assert.ok(asset.length > 30_000);
  const xrayAsset = await readFile(new URL("../public/assets/product/alphadoc/generated/synthetic-chest-xray-rll-optimized.webp", import.meta.url));
  const generatedNewsAsset = await readFile(new URL("../public/assets/product/alphadoc/generated/news-chest-pain-night-optimized.webp", import.meta.url));
  const generatedSecondaryNewsAsset = await readFile(new URL("../public/assets/product/alphadoc/generated/news-antibiotic-review-optimized.webp", import.meta.url));
  const generatedCommunityAsset = await readFile(new URL("../public/assets/product/alphadoc/generated/community-chest-pain-handoff-optimized.webp", import.meta.url));
  const darkTextureAsset = await readFile(new URL("../public/media/viore-paper-texture-dark-v2.webp", import.meta.url));
  for (const optimizedAsset of [xrayAsset, generatedNewsAsset, generatedSecondaryNewsAsset, generatedCommunityAsset, darkTextureAsset]) {
    assert.ok(optimizedAsset.length > 5_000);
    assert.ok(optimizedAsset.length < 40_000);
  }
});

test("server-renders a bounded Alphadoc general-chat section", async () => {
  const [response, productCss, productSource, motionSource] = await Promise.all([
    render("/ko/product/alphadoc"),
    readFile(new URL("../app/product.css", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ProductPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AlphadocGeneralChatMotion.tsx", import.meta.url), "utf8"),
  ]);
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /임상 밖의 질문도 함께/);
  assert.match(html, /일상의 궁금증은 일반 모드에서/);
  assert.match(html, /id="general" data-ap-section="true"/);
  assert.match(html, /href="#general"[^>]*>일반대화/);
  assert.match(html, /class="ap-general-motion"[^>]*role="img"/);
  assert.match(html, /드립 커피 원두는 어떻게 보관하면 좋아\?/);
  assert.match(html, /빛과 공기, 열과 습기를 피하는 게 핵심이에요\./);
  assert.match(html, /임상 질문을 물어봐 주세요/);
  assert.match(html, /메시지를 입력하세요/);
  assert.match(html, /class="ap-general-app-header"/);
  assert.match(html, /class="ap-general-chat-center"/);
  assert.match(html, /class="ap-general-input-shell"/);
  assert.doesNotMatch(html, /문서와 회의 내용의 핵심 요약|첨부한 표의 통계·변화·이상값 분석|최신 자료 조사와 출처 기반 비교|아이디어를 업무 계획과 체크리스트로 정리/);

  assert.match(productSource, /AlphadocGeneralChatMotion/);
  assert.match(motionSource, /useViewportMotion<HTMLDivElement>\(0\.16\)/);
  assert.match(motionSource, /data-motion-active=\{shouldAnimate \? "true" : "false"\}/);
  assert.match(motionSource, /ALPHADOC_ASSET_ROOT.*https:\/\/alphadoc\.ai/);
  assert.match(motionSource, /brand\/symbol\/alpha\.png/);
  assert.match(motionSource, /brand\/alphadocs-front\/logo\.svg/);
  assert.match(motionSource, /brand\/feature-icons\/chat\/attach\/logo\.svg/);
  assert.match(motionSource, /<ArrowUp aria-hidden="true" strokeWidth=\{2\.7\} \/>/);
  assert.doesNotMatch(motionSource, /ap-general-topbar|ap-general-answer-mark|copy\.send/);
  assert.doesNotMatch(motionSource, /capabilities|answerItems|followups|Gemini|OpenAI|GPT|Claude|provider/i);

  assert.match(productCss, /#general,#clinical,#alphadocs \{ scroll-margin-top: calc\(var\(--header\) \+ 44px\); \}/);
  assert.match(productCss, /\.ap-general \{[^}]*border-block: 1px solid var\(--ap-line\);/);
  assert.match(productCss, /\.ap-general-window \{[^}]*aspect-ratio:\s*16\/9;/);
  assert.match(productCss, /\.ap-general-mode-control \{[^}]*width:126px;[^}]*height:32px;/);
  assert.match(productCss, /\.ap-general-composer \{[^}]*grid-template-columns:44px minmax\(0,1fr\);/);
  assert.match(productCss, /\.ap-general-attach \{[^}]*width:44px;[^}]*height:44px;/);
  assert.match(productCss, /\.ap-general-input-shell \{[^}]*min-height:44px;/);
  assert.match(productCss, /\.ap-general-send \{[^}]*width:36px;[^}]*height:36px;/);
  assert.match(productCss, /\.ap-general-motion\.is-playing \.ap-general-mode-pill \{[^}]*var\(--ap-product-motion-cycle\) var\(--ap-product-motion-delay\)/);
  assert.match(productCss, /\.ap-general-motion\.is-playing \.ap-general-typed-question \{[^}]*steps\(24,end\)/);
  assert.match(productCss, /@keyframes ap-general-mode-switch/);
  assert.match(productCss, /@keyframes ap-general-type-question/);
  assert.match(productCss, /@keyframes ap-general-send-button/);
  assert.match(productCss, /@keyframes ap-general-answer-in/);
  assert.match(productCss, /\.ap-general-window \{ min-height:590px; aspect-ratio:auto; \}/);
  assert.match(productCss, /\.ap-general-mode-control \{ width:126px; height:44px;/);
  assert.match(productCss, /\.ap-general-motion \* \{ animation:none !important; transition:none !important; \}/);
});

test("carries the hero energy-line language into a slow scroll-linked convergence", async () => {
  const [page, energyCanvas, companyBackdrop, content, css] = await Promise.all([
    readFile(new URL("../app/components/CompanyPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CompanyEnergyCanvas.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CompanyNetworkBackdrop.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/site-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /href="#company-story"/);
  assert.match(page, /<CompanyEnergyCanvas quality="balanced" activationThreshold=\{0\.5\} \/>/);
  assert.doesNotMatch(page, /CompanyEnergyField/);
  assert.doesNotMatch(page, /CompanyLinearityVisual/);
  assert.match(energyCanvas, /requestAnimationFrame/);
  assert.match(energyCanvas, /prefers-reduced-motion: reduce/);
  assert.match(energyCanvas, /globalCompositeOperation = "multiply"/);
  assert.match(energyCanvas, /let isIntersecting = false/);
  assert.match(energyCanvas, /const GLOW_BLUR_PX = 6/);
  assert.match(energyCanvas, /const GLOW_STRENGTH = 0\.5/);
  assert.match(energyCanvas, /const GLOW_REFRESH_SECONDS = 1 \/ 20/);
  assert.match(energyCanvas, /const releaseCanvas = \(\) =>/);
  assert.match(energyCanvas, /const pixelRatio = Math\.min\(window\.devicePixelRatio \|\| 1, 2\)/);
  assert.match(energyCanvas, /hasRegularStrands/);
  assert.doesNotMatch(energyCanvas, /const FRAME_INTERVAL|const frameInterval|pixelRatioCap|shadowBlur/);
  assert.match(energyCanvas, /seconds \* \(0\.72 \+ family \* 0\.08\)/);
  assert.match(content, /title: "의료계의\\n새로운 선형을 그리다\."/);
  assert.match(content, /연결하기 위한 선\\n그것이 바이오레 입니다/);
  assert.match(css, /\.company-hero \{[^}]*background-color: var\(--paper-base\);/);
  assert.match(css, /\.company-hero-copy \{[^}]*text-align: center;/);
  assert.match(css, /\.company-hero p \{[^}]*white-space: pre-line;/);
  assert.match(css, /\.company-energy-canvas \{/);
  assert.match(css, /--paper-texture: url\("\/media\/viore-paper-texture\.webp"\);/);
  assert.match(css, /html,body \{[^}]*background-image: var\(--paper-texture\);/);
  assert.match(css, /\.detail-page \{[^}]*background-image: var\(--paper-texture\);/);
  assert.match(css, /\.company-hero \{[^}]*background-image: var\(--paper-texture\);/);
  assert.match(css, /\.legal-page \{[^}]*background-image: var\(--paper-texture\);/);
  assert.match(css, /\.product-page-v2 \{[^}]*background-image: var\(--paper-texture\);/);
  assert.match(page, /<CompanyNetworkBackdrop \/>/);
  assert.doesNotMatch(page, /viore-company-terminal-pin-dark\.png|company-pin-alpha|company-pin-mask-boost/);
  assert.match(companyBackdrop, /className="company-convergence-canvas"/);
  assert.match(companyBackdrop, /className="company-convergence-bloom-canvas"/);
  assert.doesNotMatch(companyBackdrop, /<img|\.png/);
  assert.match(companyBackdrop, /requestAnimationFrame/);
  assert.match(companyBackdrop, /prefers-reduced-motion: reduce/);
  assert.match(companyBackdrop, /const BLOOM_BLUR_PX = 7/);
  assert.match(companyBackdrop, /const BLOOM_STRENGTH = 0\.62/);
  assert.match(companyBackdrop, /const BLOOM_REFRESH_SECONDS = 1 \/ 20/);
  assert.match(companyBackdrop, /const DRAW_BUDGET_MS = 20/);
  assert.match(companyBackdrop, /renderTier < 2/);
  assert.match(companyBackdrop, /let isIntersecting = false/);
  assert.match(companyBackdrop, /gradientProgress = progress/);
  assert.match(companyBackdrop, /compact \? 32 : 48/);
  assert.match(companyBackdrop, /const pixelRatio = Math\.min\(window\.devicePixelRatio \|\| 1, 2\)/);
  assert.match(companyBackdrop, /bloomScale = Math\.min\(pixelRatio, 1\)/);
  assert.match(companyBackdrop, /hasRegularStrands/);
  assert.doesNotMatch(companyBackdrop, /const FRAME_INTERVAL|pixelRatioCap|shadowBlur/);
  assert.match(companyBackdrop, /const releaseCanvas = \(\) =>/);
  assert.match(companyBackdrop, /rect\.top <= window\.innerHeight \* 0\.5/);
  assert.match(companyBackdrop, /\{ rootMargin: "0px", threshold: 0 \}/);
  assert.match(companyBackdrop, /ORANGE_PALETTE/);
  assert.match(companyBackdrop, /RED_PALETTE/);
  assert.match(companyBackdrop, /\[255, 126, 29\]/);
  assert.match(companyBackdrop, /Math\.pow\(localProgress, 2\.6\)/);
  assert.match(companyBackdrop, /const lateralScale = 0\.64/);
  assert.match(companyBackdrop, /initialSpread = width \* spreadScale \* lateralScale/);
  assert.match(companyBackdrop, /curveScale = flowScale \* lateralScale/);
  assert.match(companyBackdrop, /spreadScale = family === 0 \? 0\.38 : family === 1 \? 0\.31 : 0\.43/);
  assert.match(companyBackdrop, /index \* 0\.13 \+ family \* 1\.7/);
  assert.match(companyBackdrop, /context\.lineWidth = 18/);
  assert.match(companyBackdrop, /context\.lineWidth = 0\.76 \+ widthGroup \* 0\.11/);
  assert.match(companyBackdrop, /context\.lineWidth = 2\.35/);
  assert.match(companyBackdrop, /join\.offsetTop - window\.innerHeight \* 0\.15/);
  assert.match(companyBackdrop, /--company-convergence-progress/);
  assert.match(companyBackdrop, /globalCompositeOperation = "source-over"/);
  assert.match(css, /\.company-network-backdrop \{[^}]*position: absolute;[^}]*inset: 0;/);
  assert.match(css, /\.company-network-viewport \{[^}]*position: sticky;[^}]*height: 100svh;/);
  assert.match(css, /\.company-network-viewport::after \{[^}]*opacity: calc\(\.82 - var\(--company-convergence-progress\) \* \.82\)/);
  assert.match(css, /\.company-convergence-canvas \{[^}]*opacity: calc\(\.82 \+ var\(--company-convergence-progress\) \* \.18\)/);
  assert.match(css, /\.company-convergence-canvas \{[^}]*position: absolute;[^}]*width: 100%;[^}]*height: 100%;/);
  assert.doesNotMatch(css, /\.company-convergence-canvas \{[^}]*will-change:/);
  assert.doesNotMatch(css, /\.company-convergence-canvas \{[^}]*filter:/);
  assert.doesNotMatch(css, /\.company-energy-canvas \{[^}]*filter:/);
  assert.match(css, /@keyframes company-scroll-energy/);
  assert.match(css, /@keyframes company-scroll-chevron/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("uses the Alphadoc intelligence lens without the retired spiral visual", async () => {
  const [lens, brandVisuals, css] = await Promise.all([
    readFile(new URL("../app/components/AlphaDocIntelligenceLens.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/BrandVisuals.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(lens, /alphadoc-intelligence-lens\.png/);
  assert.match(lens, /intelligence-lens-white-key/);
  assert.doesNotMatch(lens, /strand|spiral/i);
  assert.match(brandVisuals, /AlphaDocIntelligenceLens/);
  assert.doesNotMatch(brandVisuals, /AlphaDocSpiralCanvas/);
  assert.match(css, /@keyframes intelligence-lens-drift/);
  assert.match(css, /@keyframes intelligence-lens-sheen/);
});

test("uses accessible live count-up company metrics with a verified snapshot fallback", async () => {
  const [page, metrics, dataSource, content, css] = await Promise.all([
    readFile(new URL("../app/components/CompanyPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CompanyMetrics.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/company-metrics.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/site-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /getCompanyMetrics\(language, page\.metrics\)/);
  assert.match(page, /metrics=\{companyMetrics\?\.metrics \?\? page\.metrics\}/);
  assert.match(metrics, /IntersectionObserver/);
  assert.match(metrics, /requestAnimationFrame/);
  assert.match(metrics, /prefers-reduced-motion: reduce/);
  assert.match(metrics, /aria-label=\{metric\.ariaLabel\}/);
  assert.match(metrics, /data-metrics-source=\{source\}/);
  assert.doesNotMatch(metrics, /company-metric-index|padStart/);
  assert.match(dataSource, /viore_company_metrics/);
  assert.match(dataSource, /medical_documents_added_30d/);
  assert.match(dataSource, /standardized_medical_documents/);
  assert.match(dataSource, /clinical_guidelines/);
  assert.match(dataSource, /values\[metric\.kind\]/);
  assert.match(dataSource, /revalidate: COMPANY_METRICS_REVALIDATE_SECONDS/);
  assert.doesNotMatch(dataSource, /service_role|service-role|secret key/i);
  assert.match(content, /value: 36047/);
  assert.match(content, /value: 212891/);
  assert.match(content, /value: 9476/);
  assert.match(content, /kind: "documents", value: 212891/);
  assert.match(css, /\.company-metrics \{[^}]*grid-template-columns: repeat\(3,minmax\(0,1fr\)\);/);
  assert.match(css, /\.company-metric-value \{[^}]*font-variant-numeric: tabular-nums;/);
});

test("keeps the three connected principles text-only over the continuous company network", async () => {
  const [page, connections, content, css] = await Promise.all([
    readFile(new URL("../app/components/CompanyPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CompanyConnections.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/site-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<CompanyConnections content=\{page\.connections\} \/>/);
  assert.doesNotMatch(connections, /<img|viore-connected-principles/);
  assert.doesNotMatch(connections, /padStart|String\(index \+ 1\)/);
  assert.match(connections, /content\.nodes\.map/);
  assert.match(connections, /aria-labelledby="company-connections-title"/);
  assert.equal((content.match(/더 직관적인 경험|보안을 고려한 설계|다양한 의료 도구|빠른 의료 노트 작성|쉽게 보는 최신 의료 근거|함께 성장하는 지식 커뮤니티/g) ?? []).length, 6);
  assert.match(content, /Security-aware design/);
  assert.match(content, /A more intuitive experience/);
  assert.match(content, /A diverse range of medical tools/);
  assert.match(content, /Fast medical note drafting/);
  assert.match(content, /Clear, up-to-date medical evidence/);
  assert.match(content, /A knowledge community that grows together/);
  assert.doesNotMatch(content, /Security built in from the start/);
  assert.match(css, /\.company-connection-nodes \{[^}]*grid-template-columns: repeat\(3,minmax\(0,1fr\)\);/);
  assert.match(css, /\.company-connection-node:nth-child\(3n\+1\) \{[^}]*padding-left: 0;/);
  assert.match(css, /\.company-connections-heading h2 \{[^}]*font-size: clamp\(32px,3\.4vw,48px\);/);
  assert.doesNotMatch(css, /\.company-connections \{[^}]*border-top:/);
});

test("loops five clinical questions in a transparent, reduced-motion-safe Alphadoc field", async () => {
  const [page, questionLoop, css] = await Promise.all([
    readFile(new URL("../app/components/CompanyPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CompanyQuestionLoop.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<CompanyQuestionLoop language=\{language\} \/>/);
  assert.equal((questionLoop.match(/패혈증 초기 처치는|급성 흉통 위험 신호는|심방세동 항응고 기준은|신기능 저하 시 용량 조정은|당뇨병 혈당 목표는/g) ?? []).length, 5);
  assert.match(questionLoop, /IntersectionObserver/);
  assert.match(questionLoop, /window\.setTimeout/);
  assert.match(questionLoop, /window\.clearTimeout/);
  assert.match(questionLoop, /prefers-reduced-motion: reduce/);
  assert.match(questionLoop, /role="img"/);
  assert.match(css, /\.company-question-loop \{[^}]*background: transparent;/);
  assert.match(css, /\.company-efficiency \{[^}]*border-top: 1px solid rgba\(255,255,255,\.18\);/);
  assert.match(css, /\.company-efficiency-heading \{[^}]*grid-template-columns: max-content minmax\(0,1fr\);/);
  assert.match(css, /\.company-efficiency h2 > span \{[^}]*display: block;[^}]*white-space: nowrap;/);
  assert.match(css, /\.company-efficiency-title-brand \{[^}]*color: var\(--red\);/);
  assert.match(css, /\.company-efficiency-title-workspace \{[^}]*font-size: clamp\(32px,3\.4vw,48px\);/);
  assert.match(css, /\.company-efficiency p \{[^}]*margin: 38px 0 0;/);
  assert.match(css, /\.company-knowledge > h2 \{[^}]*font-size: clamp\(32px,3\.4vw,48px\);/);
  assert.match(css, /@keyframes company-question-cursor/);
});

test("routes Company and Contact navigation into the locale homepage", async () => {
  const [content, chrome] = await Promise.all([
    readFile(new URL("../app/site-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/SiteChrome.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(content, /if \(key === "company"\) return `\/\$\{language\}`;/);
  assert.match(content, /if \(key === "contact"\) return `\/\$\{language\}#partnership-inquiry`;/);
  assert.match(chrome, /const isCompanyPage = pathname === `\/\$\{language\}`/);
  assert.match(chrome, /const isProductPage = pathname\.includes\("\/product\/alphadoc"\)/);
  assert.match(chrome, /const isDarkPage = isTechnologyPage \|\| isProductPage/);
  assert.match(chrome, /const isDarkFooter = isCompanyPage \|\| isTechnologyPage/);
  assert.match(chrome, /nav-link \$\{isCompanyPage \? "is-active" : ""\}/);
  assert.match(chrome, /site-footer \$\{isDarkFooter \? "site-footer-dark" : ""\}/);
});

test("server-renders an accessible, expanding Technology journal with its current articles", async () => {
  const [response, englishResponse] = await Promise.all([
    render("/ko/technology"),
    render("/en/technology"),
  ]);
  assert.equal(response.status, 200);
  assert.equal(englishResponse.status, 200);
  const [html, englishHtml] = await Promise.all([
    response.text(),
    englishResponse.text(),
  ]);

  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /<html lang="ko-KR"/);
  assert.match(html, /<title>바이오레 기술 \| 의료 AI를 하나의 기술 체계로<\/title>/);
  assert.match(html, />Journal/);
  assert.doesNotMatch(html, />Tech Blog</);
  assert.match(html, /우리만의 선형을/);
  assert.match(html, /만드는 과정/);
  assert.match(html, /Viore Team/);
  assert.match(html, /하나의 답보다, 그 답이 만들어지는 전체 구조를 설계합니다/);
  assert.match(html, /서로 다른 기술은 확인된 지점에서 연결되고/);
  assert.doesNotMatch(html, /바이오레의 기술력은 무엇인가요|여섯 기술로 나눠 설계합니다/);
  assert.match(html, /모델은 바뀔 수 있습니다/);
  assert.match(html, /근거와 업무, 보호의 원칙은 남아야 합니다/);
  assert.match(html, /Evidence Foundation/);
  assert.match(html, /근거는 어디에서 왔는가/);
  assert.match(html, /자료가 판단의 맥락이 되기까지/);
  assert.match(html, /현재 확인할 수 있는 AlphaEvidence DB/);
  assert.match(html, /질문 다음의 일을 설계하다/);
  assert.match(html, /AlphaDoc Engine/);
  assert.match(html, /Medical Workflow Orchestration/);
  assert.match(html, /읽은 문서를 다시 쓰는 지식으로/);
  assert.match(html, /Deterministic Document-to-Artifact Engine/);
  assert.match(html, /해석 전에 입력을 바로 세우다/);
  assert.match(html, /Deterministic Image Artifact Compiler/);
  assert.match(html, /LLM의 자율성과 보안의 경계를 바로잡다/);
  assert.match(html, /Protected Inference Gateway/);
  for (const id of [
    "technology-alphaevidence",
    "technology-alphadoc-engine",
    "technology-alphadocument",
    "technology-alphaimage",
    "technology-alphalayer",
    "technology-alphaseal",
  ]) {
    assert.match(html, new RegExp(`<article id="${id}"`));
  }
  assert.match(html, /End-to-End Conversation Seal/);
  assert.match(html, /대화 내용과 전달 정보를 분리하다/);
  assert.match(html, /구현 · 제품 기반 운영 중/);
  assert.match(html, /구현 · 제품 기능 운영 중/);
  assert.match(html, /구현 · 적용 범위 확대 검토 중/);
  assert.match(html, /구현 · 제품 활성화 검토 중/);
  assert.match(html, /선택 경로 운영 검증/);
  assert.match(html, /구현 · 지원 1:1 쪽지/);
  assert.doesNotMatch(html, /DEVELOPED &amp; INTEGRATED/);
  assert.match(html, /2026년 7월 21일/);
  assert.match(html, /2026년 7월 30일 업데이트/);
  assert.match(html, /2026-07-30/);
  assert.match(html, /환자정보 처리 준비나 법적 적합성과도 구분됩니다/);
  assert.match(html, /그룹 대화, 완전한 순방향 비밀성, 이미 침해된 사용자 브라우저의 보호/);
  assert.doesNotMatch(html, /IN PRODUCTION|CONTROLLED WORKFLOWS|ARCHITECTURE IN DEVELOPMENT/);
  assert.doesNotMatch(html, /악성 스크립트가 침입해도|두 기기에서만 열리게|기기를 바꾸거나 데이터가 지워져도 지난 쪽지는 잃지 않습니다|그 구간 밖으로 영향이 번지지 않습니다/);
  assert.match(html, /data-snapshot-state="live"/);
  assert.match(html, /정규화 논문 레코드/);
  assert.match(html, /초록 보유 논문/);
  assert.match(html, /노출 가능한 진료지침/);
  assert.doesNotMatch(html, /출처·변경 관찰 기록|관리 중인 작업 단위/);
  assert.match(html, /최근 공개 집계/);
  assert.match(html, />집계</);
  assert.match(html, /모든 자료가 임상 검증을 마쳤다는 뜻은 아닙니다/);
  assert.match(html, /TechArticle/);
  assert.match(html, /CollectionPage/);
  assert.doesNotMatch(html, /FAQPage/);
  assert.match(html, /technology-alphaseal/);
  assert.equal((html.match(/<figcaption>/g) ?? []).length, 7);
  assert.match(html, /technology-raw-diagram-overview/);
  assert.match(html, /technology-raw-diagram-evidence/);
  assert.match(html, /technology-raw-diagram-engine/);
  assert.match(html, /technology-raw-diagram-document/);
  assert.match(html, /technology-raw-diagram-image/);
  assert.match(html, /technology-raw-diagram-layer/);
  assert.match(html, /technology-raw-diagram-seal/);
  assert.doesNotMatch(html, /개발 지시 — 비공개|개발 계약 — 비공개|내부 근거 지도/);

  assert.match(englishHtml, /Medical AI,/);
  assert.match(englishHtml, /<html lang="en-US"/);
  assert.match(englishHtml, /<title>Viore Technology \| Medical AI as a Technology System<\/title>/);
  assert.match(englishHtml, /We design the whole system behind the answer/);
  assert.doesNotMatch(englishHtml, /What makes Viore&#x27;s medical AI technology different|six distinct technologies/);
  assert.match(englishHtml, /Where did the evidence come from/);
  assert.match(englishHtml, /Designing what happens after the question/);
  assert.match(englishHtml, /From a document read once to knowledge reused/);
  assert.match(englishHtml, /Set the input straight before interpretation/);
  assert.match(englishHtml, /Resetting the boundary between LLM autonomy and security/);
  assert.match(englishHtml, /IMPLEMENTED · PRODUCT FOUNDATION ACTIVE/);
  assert.match(englishHtml, /IMPLEMENTED · PRODUCT CAPABILITY ACTIVE/);
  assert.match(englishHtml, /IMPLEMENTED · SCOPE EXPANSION REVIEW/);
  assert.match(englishHtml, /IMPLEMENTED · PRODUCT ACTIVATION REVIEW/);
  assert.match(englishHtml, /SELECTED PATHS RUNTIME-VERIFIED/);
  assert.match(englishHtml, /IMPLEMENTED · SUPPORTED 1:1 MESSAGING/);
  assert.doesNotMatch(englishHtml, /우리만의 선형|살아 있는 근거의 중심|보안을 설정이 아니라/);
  assert.match(englishHtml, /"inLanguage":"en-US"/);
});

test("keeps the public architecture contract aligned with the bounded AlphaSeal claim", async () => {
  const [markdown, jsonText, agents, copilot] = await Promise.all([
    readFile(new URL("../.viore/architecture-contract.md", import.meta.url), "utf8"),
    readFile(new URL("../.viore/architecture-contract.json", import.meta.url), "utf8"),
    readFile(new URL("../AGENTS.md", import.meta.url), "utf8"),
    readFile(new URL("../.github/copilot-instructions.md", import.meta.url), "utf8"),
  ]);
  const contract = JSON.parse(jsonText);

  assert.equal(contract.contractVersion, "2026-08-11.1");
  assert.equal(
    contract.publicClaimBoundary.alphaseal,
    "implemented-active-supported-one-to-one-content-encryption-public-claim-restricted",
  );
  assert.ok(contract.forbiddenPublicClaims.includes("alphaseal-group-encryption"));
  assert.ok(contract.forbiddenPublicClaims.includes("alphaseal-perfect-forward-secrecy"));
  assert.ok(contract.forbiddenPublicClaims.includes("alphaseal-metadata-confidentiality"));
  assert.ok(contract.forbiddenPublicClaims.includes("alphaseal-patient-data-suitability"));
  assert.match(markdown, /AlphaSeal: 지원되는 1:1 대화 본문/);
  assert.match(markdown, /그룹 대화, 완전한 순방향\s+비밀성, 메타데이터 비공개 또는 환자정보 적합성/);
  assert.match(agents, /현재 계약 버전은 `2026-08-11\.1`/);
  assert.match(copilot, /is `2026-08-11\.1`/);
});

test("implements the AlphaEvidence public snapshot and distinct public diagrams as bounded server contracts", async () => {
  const [dataSource, route, snapshot, motion, technologyPage, viewportMotion, nav, chrome, css] = await Promise.all([
    readFile(new URL("../app/alphaevidence-snapshot.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/technology/alphaevidence-snapshot/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AlphaEvidenceSnapshot.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TechnologyMotion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TechnologyPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ViewportMotion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TechnologyArticleNav.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/SiteChrome.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/technology.css", import.meta.url), "utf8"),
  ]);

  assert.match(dataSource, /viore_alphaevidence_public_snapshot/);
  assert.match(dataSource, /technology\.alphaevidence\.snapshot\.v1/);
  assert.match(dataSource, /ALPHAEVIDENCE_SNAPSHOT_STALE_AFTER_MS/);
  assert.match(dataSource, /AbortSignal\.timeout\(ALPHAEVIDENCE_SNAPSHOT_FETCH_TIMEOUT_MS\)/);
  assert.match(dataSource, /next: \{ revalidate: ALPHAEVIDENCE_SNAPSHOT_REVALIDATE_SECONDS \}/);
  assert.doesNotMatch(dataSource, /service_role|service-role|secret key/i);
  assert.doesNotMatch(dataSource, /source_health|observation_outcomes|ingestion_lag|managed_units|source_change_observations/);
  assert.match(route, /result\.state === "unavailable" \? 503 : 200/);
  assert.match(route, /"X-Robots-Tag": "noindex, nofollow"/);
  assert.match(snapshot, /집계 갱신 중/);
  assert.match(snapshot, /마지막 성공/);
  assert.match(snapshot, /모든 자료가 임상 검증을 마쳤다는 뜻은 아닙니다/);
  assert.match(snapshot, /prefers-reduced-motion: reduce/);
  assert.match(snapshot, /IntersectionObserver/);
  assert.doesNotMatch(snapshot, /Operational signal|Source health|Ingestion lag|source_change_observations|managed_units|alphaevidence-ops-table|alphaevidence-inline-stats/);
  assert.match(motion, /<svg/);
  assert.match(motion, /<title/);
  assert.match(motion, /<desc/);
  assert.doesNotMatch(motion, /<iframe|raw-paper-mint/);
  for (const diagram of [
    "OverviewDiagram",
    "EvidenceDiagram",
    "EngineDiagram",
    "DocumentDiagram",
    "ImageDiagram",
    "LayerDiagram",
    "SealDiagram",
  ]) {
    assert.match(motion, new RegExp(`function ${diagram}`));
  }
  assert.match(motion, /data-diagram-architecture=\{kind\}/);
  assert.match(motion, /technology-paper-svg-mobile/);
  assert.match(motion, /diagram-lineage-spine/);
  assert.match(motion, /diagram-image-frame/);
  assert.match(motion, /diagram-trust-boundary/);
  assert.match(motion, /diagram-browser/);
  assert.doesNotMatch(motion, /VIORE · TECHNOLOGY JOURNAL|PUBLIC CLAIM SCOPE|PUBLIC PIPELINE/);
  assert.doesNotMatch(motion, /function PublicNode|function DiagramNote|data-diagram-level="public-outcome"/);
  assert.match(motion, /출처와 변화가 남는 근거/);
  assert.match(motion, /등록된 목적과/);
  assert.match(motion, /일반 저장 경로/);
  assert.doesNotMatch(motion, /CAPABILITY FABRIC|Release Identity|Policy Transform|MINIMAL EXECUTION RECORD|Request Tokens|Response Tokens|PAYLOAD-FREE ASSURANCE|non-extractable|Biometric passkey/);
  assert.doesNotMatch(technologyPage, /technology-figure-heading/);
  assert.match(motion, /<ViewportMotion/);
  assert.match(motion, /deferChildren/);
  assert.match(motion, /is-enhanced/);
  assert.doesNotMatch(motion, /^"use client"/m);
  assert.match(viewportMotion, /new IntersectionObserver/);
  assert.match(viewportMotion, /prefers-reduced-motion: reduce/);
  assert.match(viewportMotion, /visibilityObserver\.disconnect\(\)/);
  assert.match(nav, /Technology journal contents/);
  assert.match(chrome, /href=\{technologyRouteFor\(language\)\}/);
  assert.doesNotMatch(chrome, /technologyRouteFor\(language, "(?:alphaevidence|alphadoc-engine|alphadocument|alphalayer)"\)/);
  assert.match(chrome, /\["product"\] as MenuId\[\]/);
  assert.match(chrome, /routeFor\(language, "knowledge"\)/);
  assert.doesNotMatch(chrome, /routeFor\(language, "clinical-council"\)/);
  assert.match(chrome, /nav-link nav-link-disabled/);
  assert.match(chrome, /<small>Coming soon<\/small>/);
  assert.match(css, /\.technology-article-nav \{\s*position: fixed;/);
  assert.match(css, /\.technology-post \{\s*scroll-margin-top:/);
  assert.match(css, /--technology-page: var\(--dark-paper-base\)/);
  assert.match(css, /--technology-paper: var\(--dark-paper-image\)/);
  assert.match(css, /--technology-blue: #8bb5ff/);
  assert.match(css, /--technology-red: #ff8177/);
  assert.match(css, /-apple-system, BlinkMacSystemFont, "SF Pro Text", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif/);
  assert.doesNotMatch(css, /Pretendard Variable/);
  assert.match(css, /--diagram-paper: #f7f6f1/);
  assert.match(css, /\.technology-paper-svg-mobile/);
  assert.match(css, /\.technology-paper-svg \.diagram-architecture-label/);
  assert.match(css, /\.technology-paper-svg \.diagram-lineage-spine/);
  assert.match(css, /\.technology-paper-svg \.diagram-image-frame/);
  assert.match(css, /\.technology-paper-svg \.diagram-trust-boundary/);
  assert.match(css, /\.technology-paper-svg \.diagram-browser/);
  assert.doesNotMatch(css, /diagram-public-principle|diagram-public-node-title|diagram-public-note/);
  assert.match(css, /\.technology-status-release-in-review::before,/);
  assert.match(css, /\.technology-status-integration-in-review::before/);
  assert.doesNotMatch(css, /diagram-paper-grain|diagram-orbit/);
  assert.doesNotMatch(css, /#e7efe9|raw-paper-mint|raw-paper-lilac|radial-gradient\(circle at 50% -8%/);
  assert.match(css, /\.site-header\.site-header-dark/);
  assert.match(css, /\.site-header\.site-header-dark \{[\s\S]*?color: #f5f5f7;/);
  assert.match(css, /\.site-header-dark \.contact-link \{[\s\S]*?color: #f5f5f7;/);
  assert.match(css, /\.technology-article-nav \{[\s\S]*?border: 0;[\s\S]*?background: transparent;[\s\S]*?backdrop-filter: none;/);
  assert.match(css, /\.technology-article-nav-inner \{[\s\S]*?border: 0;[\s\S]*?background: transparent;[\s\S]*?backdrop-filter: none;/);
  assert.match(css, /@media \(max-width: 1180px\) \{[\s\S]*?background: color-mix\(in srgb, var\(--technology-page\) 96%, transparent\);[\s\S]*?grid-template-columns: repeat\(6, minmax\(0, 1fr\)\);/);
  assert.match(css, /\.technology-data-section \{[\s\S]*?margin: 58px 0 0 !important;/);
  assert.doesNotMatch(css, /background: linear-gradient\(90deg, rgba\(17, 17, 20, \.68\), transparent\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  const mobileTechnologyCss = css.slice(
    css.indexOf("@media (max-width: 760px)"),
    css.indexOf("@media (max-width: 480px)"),
  );
  assert.match(mobileTechnologyCss, /\.alphaevidence-count-table \{[\s\S]*?min-width: 0;/);
  assert.match(mobileTechnologyCss, /\.alphaevidence-count-index,[\s\S]*?display: none;/);
  assert.doesNotMatch(css, /alphaevidence-ops-table|alphaevidence-inline-stats|alphaevidence-lag-pending/);
});

test("classifies fresh and stale AlphaEvidence snapshots at the fixed boundary", async () => {
  const {
    ALPHAEVIDENCE_SNAPSHOT_STALE_AFTER_MS,
    parseAlphaEvidenceSnapshot,
    snapshotStateAt,
  } = await import(new URL("../app/alphaevidence-snapshot.ts", import.meta.url));
  const generatedAt = "2026-07-20T12:00:00.000Z";
  const snapshot = parseAlphaEvidenceSnapshot({
    schema_version: "technology.alphaevidence.snapshot.v1",
    generated_at: generatedAt,
    data_as_of: generatedAt,
    counts: {
      canonical_papers: 1,
      papers_with_abstract: 1,
      visible_guidelines: 1,
      source_change_observations: 1,
      managed_units: 1,
    },
    source_health: { healthy: 1, degraded: 0, failed: 0, unknown: 0 },
    observation_outcomes_30d: { unchanged: 0, updated: 0, conflict: 0, unknown: 1 },
    ingestion_lag_hours_30d: { p50: null, p95: null, max: null, unknown_count: 1 },
    observation_window_days: 30,
    health_max_stale_hours: 48,
  });

  assert.ok(snapshot);
  assert.deepEqual(snapshot.counts, {
    canonical_papers: 1,
    papers_with_abstract: 1,
    visible_guidelines: 1,
  });
  assert.equal("source_health" in snapshot, false);
  assert.equal("observation_outcomes_30d" in snapshot, false);
  assert.equal("ingestion_lag_hours_30d" in snapshot, false);
  const generatedAtMs = Date.parse(generatedAt);
  assert.equal(
    snapshotStateAt(snapshot, generatedAtMs + ALPHAEVIDENCE_SNAPSHOT_STALE_AFTER_MS),
    "live",
  );
  assert.equal(
    snapshotStateAt(snapshot, generatedAtMs + ALPHAEVIDENCE_SNAPSHOT_STALE_AFTER_MS + 1),
    "stale",
  );
});

test("redirects legacy Technology detail routes to the matching article anchor", async () => {
  const [response, imageResponse] = await Promise.all([
    render("/ko/technology/alphaevidence"),
    render("/ko/technology/alphaimage"),
  ]);

  assert.equal(response.status, 308);
  assert.equal(imageResponse.status, 308);
  assert.match(response.headers.get("location") ?? "", /\/ko\/technology#technology-alphaevidence$/);
  assert.match(imageResponse.headers.get("location") ?? "", /\/ko\/technology#technology-alphaimage$/);
});
