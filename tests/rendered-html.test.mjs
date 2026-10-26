import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Tokens forbidden anywhere in rendered copy: unreplaced template placeholders and
// institution-type wording (2026-09 brief, kept for the 2026-10 Alphadoc 2.0 update).
// Assembled from fragments so the literal tokens never appear in this file or its diff.
const FORBIDDEN_TOKENS = new RegExp(["\\{" + "\\{", "검진" + "기관"].join("|"));

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
  assert.match(englishHtml, /class="footer-company-primary"><strong>Viore Inc\.<\/strong><span>Representative Seok Jin Go<\/span><span>Business Registration No\. 709-88-03418<\/span>/);
  assert.match(englishHtml, /B101-102 and 104, Building A, 660 Daewangpangyo-ro/);
  assert.match(englishHtml, /<h1>New linearity\nin medicine\.<\/h1>/);
  assert.match(englishHtml, /Medical AI that draws decades of expertise and systems into one line\. That&#x27;s Viore\./);
  assert.doesNotMatch(englishHtml, /Viore builds a Medical OS that connects the expertise/);
  assert.match(englishHtml, /class="company-efficiency-product">Alphadoc<\/strong> puts papers, guidelines, and internal documents on one screen, so the work becomes one flow\./);
  assert.match(englishHtml, /Its one-way learning architecture keeps your data inside, and clinical answers come with sources from the latest Korean and global literature and guidelines\./);
  assert.match(englishHtml, /Be part of\nthe new linearity\./);
  assert.match(englishHtml, /Our first linearity: <span class="company-join-product-name">Alphadoc<\/span>/);
  assert.match(englishHtml, /<small>Deployment and partnerships<\/small>/);
  assert.doesNotMatch(englishHtml, /Medical OS|AI Medical Workspace connecting/);
  assert.doesNotMatch(englishHtml, /one natural flow|focus on what matters most/);
  assert.match(englishHtml, /class="company-join-next"><a href="\/en\/technology#technology-medical-model">Coming soon: Viore&#x27;s own medical AI model, built to run inside your institution\. See Technology →<\/a><\/p>/);
  assert.doesNotMatch(englishHtml, FORBIDDEN_TOKENS);
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
  assert.match(html, /의료계가 오랜 시간 축적해 온 전문성과 시스템을 하나의 선으로 잇는 의료 AI,/);
  assert.match(html, /그것이 바이오레입니다\./);
  assert.doesNotMatch(html, /연결하기 위한 선|그것이 바이오레 입니다/);
  assert.match(html, /의료인의 모든 업무를/);
  assert.match(html, /하나의 흐름으로/);
  assert.match(html, /혁신은, 더 많이 더하는 일이 아닙니다\./);
  assert.match(html, /이미 존재하는 의료의 전문성과 시스템이 더 자연스럽게 이어지도록 만드는 일입니다\./);
  assert.match(html, /바이오레는 데이터가 어디에 저장되고 어디서 처리되는지를 직접 정하여, 의료기관과 의료기업이 안전하게 쓰는 AI 에이전트 워크스페이스 알파닥을 만듭니다\./);
  assert.doesNotMatch(html, /Medical OS/);
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
  assert.match(html, /class="company-efficiency-product">알파닥<\/strong>은 논문과 의료 지침, 사내 문서를 한 화면에 모아 이 과정을 하나의 흐름으로 연결합니다\./);
  assert.match(html, /데이터 반출 없는 일방향 학습형 AI 아키텍처로 임상 질문의 답에는 최신 국내외 의학 문헌과 진료지침의 출처가 함께 제시됩니다\. 계속 업데이트되는 사내 자료와 내 노트를 바탕으로 노트 작성도 알파닥에게 맡길 수 있습니다\./);
  assert.match(html, /class="company-efficiency-demo"/);
  assert.match(html, /class="company-note-motion[^"]*"[^>]*role="img"/);
  assert.match(html, /사내 자료와 내 노트를 바탕으로 결정 사항과 할 일을 정리해 줘/);
  assert.match(html, /노트 끝에 넣기/);
  assert.match(html, /<small>도입 및 파트너십 문의<\/small>/);
  assert.doesNotMatch(html, /하나의 자연스러운 흐름으로 연결하여|가장 중요한 일에 집중할 수 있도록/);
  assert.match(html, /class="company-join-next"><a href="\/ko\/technology#technology-medical-model">Coming soon — 기관 안에서 구동하는 바이오레의 의료 특화 AI 모델\. Technology 보기 →<\/a><\/p><\/div><\/section>/);
  assert.doesNotMatch(html, /company-knowledge-next|Technology에서 보기/);
  assert.ok(html.indexOf('class="company-join-product"') < html.indexOf('id="partnership-inquiry"'));
  assert.ok(html.indexOf('id="partnership-inquiry"') < html.indexOf('class="company-join-next"'));
  assert.doesNotMatch(html, FORBIDDEN_TOKENS);
  assert.match(html, /class="company-connections"/);
  assert.ok(html.indexOf('class="company-efficiency"') < html.indexOf('class="company-knowledge"'));
  assert.ok(html.indexOf('class="company-knowledge"') < html.indexOf('class="company-metrics"'));
  assert.doesNotMatch(html, /CONNECTED BY DESIGN/);
  assert.doesNotMatch(html, /기존의 가치를 대체하지 않으며/);
  assert.match(html, /One connected flow/);
  assert.match(html, /for medicine\./);
  assert.match(html, /보안을 고려한 설계/);
  assert.match(html, /더 직관적인 경험/);
  assert.match(html, /올인원 워크스페이스/);
  assert.match(html, /에이전틱 워크플로우/);
  assert.match(html, /쉽게 보는 최신 의료 근거/);
  assert.match(html, /간편한 도입 방식/);
  assert.doesNotMatch(html, /다양한 의료 도구|빠른 의료 노트 작성|함께 성장하는 지식 커뮤니티/);
  assert.ok(html.indexOf("더 직관적인 경험") < html.indexOf("보안을 고려한 설계"));
  assert.ok(html.indexOf("보안을 고려한 설계") < html.indexOf("올인원 워크스페이스"));
  assert.ok(html.indexOf("올인원 워크스페이스") < html.indexOf("에이전틱 워크플로우"));
  assert.ok(html.indexOf("쉽게 보는 최신 의료 근거") < html.indexOf("간편한 도입 방식"));
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
  assert.doesNotMatch(englishKnowledgeHtml, /class="knowledge-paper-brief" lang="ko"/);
  assert.match(knowledgeHtml, /<span>실시간 갱신<\/span><time dateTime="[^"]+"><span>최근 갱신<\/span>[\s\S]{0,60}KST<\/time>/);
  assert.match(englishKnowledgeHtml, /<span>Live feed<\/span><time dateTime="[^"]+"><span>Last refreshed<\/span>[\s\S]{0,60}KST<\/time>/);
  assert.doesNotMatch(knowledgeHtml, /<span>LIVE<\/span>/);
  const renderedBriefs = [...knowledgeHtml.matchAll(/class="knowledge-paper-brief" lang="ko">([^<]*)<\/p>/g)].map((match) => match[1]);
  assert.ok(renderedBriefs.length > 0);
  for (const brief of renderedBriefs) {
    assert.doesNotMatch(brief, /\d\. \d/);
    assert.doesNotMatch(brief, /\d\.\s*$/);
  }
  if (/>medRxiv</.test(knowledgeHtml)) {
    assert.match(knowledgeHtml, /data-paper-preprint="true"/);
    assert.match(knowledgeHtml, /<span data-kind="preprint">동료심사 전 프리프린트<\/span>/);
    assert.match(englishKnowledgeHtml, /<span data-kind="preprint">Preprint · not peer reviewed<\/span>/);
  }
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
  const repairMigration = await readFile(new URL("../supabase/migrations/20260915090000_knowledge_brief_repair_and_english_excerpt.sql", import.meta.url), "utf8");

  assert.match(contract, /KNOWLEDGE_PAGE_SIZE = 12/);
  assert.match(contract, /export function repairKnowledgeBrief/);
  assert.match(contract, /brief_en: string \| null/);
  assert.match(dataSource, /brief: repairKnowledgeBrief\(row\.brief\)/);
  assert.match(paperLibrary, /item\.brief_en/);
  assert.match(paperLibrary, /data-kind="preprint"/);
  assert.match(paperLibrary, /item\.source === "medrxiv"/);
  assert.match(component, /최근 갱신/);
  assert.doesNotMatch(component, /"LIVE"/);
  assert.match(repairMigration, /add column if not exists brief_en text/);
  assert.match(repairMigration, /viore_knowledge_repair_brief/);
  assert.match(repairMigration, /viore_knowledge_english_excerpt/);
  assert.match(repairMigration, /select private\.refresh_viore_knowledge_public_papers\(\);/);
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
    repairKnowledgeBrief,
  } = await import(new URL("../app/knowledge-contract.ts", import.meta.url));
  assert.equal(
    repairKnowledgeBrief("종양 성장 속도에 따른 맞춤형 분할 조사가 표준 치료 대비 무진행 생존 기간을 96. 7일 연장할 수 있음을 확인했습니다."),
    "종양 성장 속도에 따른 맞춤형 분할 조사가 표준 치료 대비 무진행 생존 기간을 96.7일 연장할 수 있음을 확인했습니다.",
  );
  assert.equal(
    repairKnowledgeBrief("PTE 발생 위험을 예측하는 다유전자 모델(AUC=0. 97)을 구축했습니다."),
    "PTE 발생 위험을 예측하는 다유전자 모델(AUC=0.97)을 구축했습니다.",
  );
  assert.equal(
    repairKnowledgeBrief("Epic Cosmos 데이터를 활용해 2023-2024년 출생아 2,624,186명을 대상으로 모아 연계 코호트를 구축했습니다. 임신 1분기 수축기 혈압 140mmHg 이상은 자간전증 위험 증가와 연관(aRR 1."),
    "Epic Cosmos 데이터를 활용해 2023-2024년 출생아 2,624,186명을 대상으로 모아 연계 코호트를 구축했습니다.",
  );
  assert.equal(
    repairKnowledgeBrief("2021~2025년 탄자니아 수술 부위 감염(SSI) 감시 데이터 분석 결과, 전체 SSI 발생률은 3. 1%에서 2."),
    "2021~2025년 탄자니아 수술 부위 감염(SSI) 감시 데이터 분석 결과, 전체 SSI 발생률은 3.1%에서…",
  );
  assert.equal(repairKnowledgeBrief("완결된 문장은 그대로 둡니다."), "완결된 문장은 그대로 둡니다.");
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
  assert.equal(parseKnowledgePaperPage(validPage).items[0].brief_en, null);
  assert.equal(
    parseKnowledgePaperPage({ ...validPage, items: [{ ...validPage.items[0], brief_en: "A bounded English excerpt for the English page." }] }).items[0].brief_en,
    "A bounded English excerpt for the English page.",
  );
  assert.equal(parseKnowledgePaperPage({ ...validPage, items: [{ ...validPage.items[0], brief_en: "short" }] }), null);
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

test("server-renders the Alphadoc 2.0 product story", async () => {
  const [response, css, productCss, kitCss, featureCss, securityCss, productSource, productRoute, featureRailSource, featureCardSource, featureSceneSource, kitSource, viewportMotionSource, deferredViewportMotionSource, energyCanvasSource, threadRenderQualitySource, nextConfigSource] = await Promise.all([
    render("/ko/product/alphadoc"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/product.css", import.meta.url), "utf8"),
    readFile(new URL("../app/alphadoc-v2.css", import.meta.url), "utf8"),
    readFile(new URL("../app/alphadoc-v2-features.css", import.meta.url), "utf8"),
    readFile(new URL("../app/alphadoc-v2-security.css", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ProductPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/[lang]/product/alphadoc/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AlphadocFeatureRail.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AlphadocFeatureCard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/alphadoc2/FeatureScene.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/alphadoc2/kit.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/useViewportMotion.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ViewportMotion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CompanyEnergyCanvas.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/threadRenderQuality.ts", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
  ]);
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>알파닥 \| 의료기관과 의료기업을 위한 AI 에이전트 워크스페이스<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/vioreai\.com\/ko\/product\/alphadoc"/);
  assert.match(html, /class="alphadoc-product lang-ko"/);
  assert.match(html, /class="site-header site-header-dark"/);
  assert.match(html, /class="site-footer "/);
  assert.match(html, /class="ap-hero-brand">알파닥, <\/span><span class="ap-hero-tagline">의료기관과 의료기업을 위한 AI 에이전트 워크스페이스<\/span>/);
  assert.match(html, /근거를 찾는 일도, 노트를 쓰는 일도 알파닥에게 맡기세요\.\s*최신 의학 문헌과 진료지침, 계속 업데이트되는 사내 자료를 바탕으로 답하고 정리합니다\./);
  assert.match(html, /href="#overview"[^>]*>인터페이스/);
  assert.match(html, /href="#general"[^>]*>근거 대화/);
  assert.match(html, /href="#clinical"[^>]*>기능/);
  assert.match(html, /href="#alphadocs"[^>]*>보안/);

  // 2.0 motions: home → @ mention → document answer, papers reader, source scope and citations, Zero Trust steps.
  assert.match(html, /class="a2-stage a2-hero[^"]*"[^>]*role="img"/);
  assert.match(html, /김지원님, 안녕하세요\./);
  assert.match(html, /이 지침에서 바뀐 손 위생 기준을 표로 정리해 줘/);
  assert.match(html, /class="a2-stage a2-papers[^"]*"[^>]*role="img"/);
  assert.match(html, /TRIPOD\+AI statement/);
  assert.match(html, /class="a2-stage a2-evidence[^"]*"[^>]*role="img"/);
  assert.match(html, /참조 범위/);
  assert.match(html, /자료: 사내 게시판/);
  assert.match(html, /신규 직원 손 위생 교육은 언제까지 마쳐야 해\?/);
  assert.match(html, /class="a2-sec-stage[^"]*"[^>]*role="img"/);
  assert.match(html, /기관 단위 보안 체계/);
  assert.match(html, /구축 중/);
  assert.match(html, /\[이름 1\]/);
  assert.match(html, /\[전화 1\]/);
  assert.match(html, /\/brand\/alphadoc-alpha\.png/);

  assert.match(html, /모든 것이 하나의 화면 안에/);
  assert.match(html, /놓치지 않는 근거/);
  assert.match(html, /사내 문서도, 나만의 노트도, 그리고 최신 의학 자료도 같은 입력창에서 시작합니다\./);
  assert.match(html, /모든 가능성은 한눈에/);
  for (const id of ["evidence-chat", "notes", "board", "guidelines", "papers", "favorites"]) {
    assert.match(html, new RegExp(`data-feature-card="${id}"`));
  }
  assert.match(html, /참고할 자료를, 질문하기 전에 고릅니다\./);
  assert.match(html, /노트를 쓰다가, 정리는 알파닥에게 맡깁니다\./);
  assert.match(html, /class="ap-feature-motion-placeholder"/);
  assert.match(html, /정보의 모든 순간을,\s*더 직관적이고 책임 있게/);
  assert.match(html, /알파닥은 보안을 최우선으로 하여 분리 클라우드와 사내망에서 유연하게 작동합니다\./);
  assert.match(html, /<h3>Lightweight<\/h3>/);
  assert.match(html, /<h3>One-way<\/h3>/);
  assert.match(html, /<h3>Zero Trust<\/h3>/);
  assert.match(html, /일방향 학습형 AI 구조로서 기관 데이터를 학습에 쓰지 않고 밖으로 내보내지 않습니다\./);
  assert.match(html, /입력, 경로, 응답까지 검증 로직을 더한 보안 체계를 구현하고 있습니다\./);
  assert.match(html, /class="ap-deploy-proof-label">사내망 첫 적용<\/span><span class="ap-deploy-proof-name">KMI 한국의학연구소<\/span>/);
  assert.match(productSource, /const KMI_LOGO_SRC: string \| null = null;/);
  assert.match(html, /바이오레의 첫번째 선형,/);
  assert.match(html, /이제 시작해보세요\./);
  assert.match(html, /class="ap-button ap-button-primary" href="https:\/\/alphadoc\.ai"[^>]*>알파닥 시작하기/);
  assert.match(html, /class="ap-final-logo-stage"/);
  assert.match(html, /class="company-energy-canvas"/);
  assert.match(html, /"@type":"SoftwareApplication"/);
  assert.match(html, /"@id":"https:\/\/alphadoc\.ai\/#software"/);
  assert.match(html, /클라우드 & 사내망 안에서 작동하는, 의료기관과 의료기업을 위한 일방향 학습형 AI 에이전트 워크스페이스/);
  assert.match(html, /"inLanguage":"ko-KR"/);

  // 1.x content and the copy rules for 2.0.
  assert.doesNotMatch(html, /의료 업무를 하나의 AI Workspace로|알파닥스|일반대화|TTP와 DIC|모든 가능성은 앱 하나로/);
  assert.doesNotMatch(html, /ap-hero-motion|ap-workspace-motion|ap-general-motion"|ap-alphadocs-phone|alphadoc\.ai\/brand/);
  assert.doesNotMatch(html, /온프레미스|폐쇄망|채팅|Medical OS|오픈.?베타|OPEN.?BETA/);
  assert.doesNotMatch(html, /GPT|Gemini|OpenAI|Llama|Qwen/);
  assert.doesNotMatch(html, /10월|11월/);
  assert.doesNotMatch(featureSceneSource, /"\d{2}\.\d{2}"/);
  assert.doesNotMatch(kitSource, /\d{1,2}월/);

  assert.match(productRoute, /import "\.\.\/\.\.\/\.\.\/alphadoc-v2\.css";/);
  assert.match(productRoute, /import "\.\.\/\.\.\/\.\.\/alphadoc-v2-security\.css";/);
  assert.match(productSource, /<CompanyEnergyCanvas quality="balanced" \/>/);
  assert.match(productSource, /<AlphadocLocalNav items=\{content\.nav\} language=\{language\} \/>/);
  assert.match(productSource, /<ViewportMotion as="section" className="ap-final-cta" threshold=\{0\.12\}>/);
  assert.doesNotMatch(productSource, /^"use client"/m);
  assert.match(nextConfigSource, /"img-src 'self' data:",/);
  assert.doesNotMatch(nextConfigSource, /img-src[^"]*alphadoc\.ai/);

  assert.match(viewportMotionSource, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
  assert.match(viewportMotionSource, /document\.addEventListener\("visibilitychange"/);
  assert.match(viewportMotionSource, /shouldAnimate: inView && pageVisible && !reducedMotion/);
  assert.match(deferredViewportMotionSource, /new IntersectionObserver/);
  assert.match(deferredViewportMotionSource, /media\.addEventListener\("change", syncMotionPreference\)/);
  assert.match(energyCanvasSource, /const GLOW_BLUR_PX = 6/);
  assert.match(energyCanvasSource, /getThreadRenderTier/);
  assert.match(threadRenderQualitySource, /sharedThreadRenderTier/);
  assert.match(energyCanvasSource, /frame = window\.requestAnimationFrame\(animate\)/);

  assert.match(featureRailSource, /const AUTO_SCROLL_PX_PER_SECOND = 18/);
  assert.match(featureRailSource, /const RAIL_COPIES = \[0, 1\] as const/);
  assert.match(featureRailSource, /useViewportMotion<HTMLDivElement>\(0\.04\)/);
  assert.match(featureRailSource, /motionVisible=\{visibleInstances\.has\(instanceId\)\}/);
  assert.match(featureRailSource, /event\.key !== "ArrowLeft" && event\.key !== "ArrowRight"/);
  assert.match(featureCardSource, /const AlphadocV2FeatureScene = lazy\(async \(\) =>/);
  assert.match(featureCardSource, /<A2NavIcon nav=\{featureIcons\[item\.id\]\} \/>/);
  assert.match(featureCardSource, /aria-hidden=\{duplicate \? "true" : undefined\}/);
  assert.doesNotMatch(featureCardSource, /AlphadocFeatureMotionSvg|loading="lazy"/);

  // Motion timelines pause off screen and show the final frame when motion is reduced.
  assert.match(kitCss, /\.a2-anim \{[^}]*animation-play-state: var\(--a2-play, paused\);/);
  assert.match(kitCss, /\.is-playing \.a2,\s*\.is-playing\.a2 \{ --a2-play: running; \}/);
  assert.match(kitCss, /\.is-reduced \.a2-anim,\s*\.is-reduced\.a2-anim \{ animation: none !important; \}/);
  assert.match(featureCss, /animation-play-state: var\(--ap-feature-play-state, paused\);/);
  assert.match(securityCss, /@property --a2-sec-dim/);
  assert.match(securityCss, /\.a2-sec-steps \{[^}]*align-self: start;/);

  assert.doesNotMatch(css, /PretendardVariable\.woff2/);
  assert.match(css, /--dark-paper-base: #000000;/);
  assert.match(productCss, /\.alphadoc-product \{[\s\S]*?background-color: var\(--dark-paper-base\);[\s\S]*?background-image: var\(--dark-paper-image\);/);
  assert.match(productCss, /--ap-red: var\(--red\)/);
  assert.match(productCss, /\.ap-button-primary \{[^}]*background: var\(--ap-red\);[^}]*color: #fff;/);
  assert.match(productCss, /#general,#clinical,#alphadocs \{ scroll-margin-top: calc\(var\(--header\) \+ 44px\); \}/);
  assert.match(productCss, /\.ap-hero-tagline \{[^}]*white-space: nowrap;/);
  assert.match(productCss, /\.ap-hero-tagline \{ margin-top: 12px;[^}]*white-space: normal; word-break: keep-all; text-wrap: balance; \}/);
  assert.match(productCss, /\.ap-feature-rail \{[^}]*scroll-behavior: auto;/);
  assert.match(productCss, /\.ap-feature-gallery\.is-playing \.ap-feature-card\.is-motion-visible \{ --ap-feature-play-state:running; \}/);
  assert.match(productCss, /\.ap-final-cta\.is-playing \.ap-final-logo-stage::before/);
  assert.doesNotMatch(productCss, /ap-hero-motion|ap-workspace-motion|ap-real-|ap-svg-|ap-community-|ap-general-window|ap-alphadocs-phone/);

  const darkTextureAsset = await readFile(new URL("../public/media/viore-paper-texture-dark-v2.webp", import.meta.url));
  assert.ok(darkTextureAsset.length > 5_000 && darkTextureAsset.length < 40_000);
});

test("server-renders the English Alphadoc product page in its own voice", async () => {
  const response = await render("/en/product/alphadoc");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Alphadoc \| The AI Agent Workspace for Healthcare<\/title>/);
  assert.match(html, /class="ap-hero-brand">Alphadoc,<\/span><span class="ap-hero-tagline">the AI agent workspace for healthcare\.<\/span>/);
  assert.match(html, /href="#overview"[^>]*>Overview/);
  assert.match(html, /href="#general"[^>]*>Evidence/);
  assert.match(html, /href="#clinical"[^>]*>Features/);
  assert.match(html, /href="#alphadocs"[^>]*>Security/);
  assert.match(html, /Everything, on one screen\./);
  assert.match(html, /Never miss the evidence\./);
  assert.match(html, /Every possibility, at a glance\./);
  assert.match(html, /Sources: Internal board/);
  assert.match(html, /Institution-level security/);
  assert.match(html, /\[Name 1\]/);
  assert.match(html, /Every moment of information,\s*handled with clarity and care\./);
  assert.match(html, /class="ap-deploy-proof-label">First deployed at<\/span><span class="ap-deploy-proof-name">KMI \(Korea Medical Institute\)<\/span>/);
  assert.match(html, /Viore(?:&#x27;|')s first linearity\./);
  assert.match(html, /Start here\./);
  assert.match(html, /"inLanguage":"en-US"/);

  const article = html.slice(html.indexOf("<article"), html.indexOf("</article>")).replace(/<script[\s\S]*?<\/script>/g, "");
  assert.doesNotMatch(article, /[가-힣]/);
  assert.doesNotMatch(article, /on-premise|closed network|Medical OS/i);
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
  assert.match(content, /하나의 선으로 잇는 의료 AI,\\n그것이 바이오레입니다\./);
  assert.match(css, /\.company-hero \{[^}]*background-color: var\(--paper-base\);/);
  assert.match(css, /\.company-hero-copy \{[^}]*text-align: center;/);
  assert.match(css, /\.company-hero p \{[^}]*white-space: pre-line;/);
  assert.match(css, /\.company-energy-canvas \{/);
  assert.match(css, /--paper-base: #ffffff;/);
  assert.match(css, /--paper-texture: none;/);
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
  assert.equal((content.match(/더 직관적인 경험|보안을 고려한 설계|올인원 워크스페이스|에이전틱 워크플로우|쉽게 보는 최신 의료 근거|간편한 도입 방식/g) ?? []).length, 6);
  assert.match(content, /Security-focused design/);
  assert.match(content, /A more intuitive experience/);
  assert.match(content, /An all-in-one workspace/);
  assert.match(content, /Agentic workflows/);
  assert.match(content, /Always up-to-date medical evidence/);
  assert.match(content, /Easy deployment/);
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
  assert.match(questionLoop, /function PlusIcon/);
  assert.match(questionLoop, /className="company-question-scope"/);
  assert.match(css, /\.company-question-loop \{[^}]*grid-template-columns: 32px minmax\(0,1fr\) auto 56px;/);
  assert.match(css, /@keyframes company-note-inserted/);
  assert.match(css, /\.company-note-motion\.is-reduced \.company-note-anim \{ animation: none; \}/);
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
  assert.match(html, /답이 만들어지는 과정 전체를 설계합니다/);
  assert.match(html, /각 기술은 동작을 확인한 곳에서만 서로 연결되고, 그 연결이 알파닥이 됩니다\./);
  assert.match(html, /모델은 바뀔 수 있습니다/);
  assert.match(html, /근거와 업무, 보안의 원칙은 남아야 합니다/);
  assert.match(html, /Evidence Foundation/);
  assert.match(html, /근거는 어디에서 왔는가/);
  assert.match(html, /자료가 근거가 되기까지/);
  assert.match(html, /현재 확인할 수 있는 AlphaEvidence DB/);
  assert.match(html, /질문 다음의 일을 설계하다/);
  assert.match(html, /AlphaDoc Engine은 바이오레가 만든 거대언어모델이 아니라/);
  assert.match(html, /바이오레가 개발 중인 <a href="#technology-medical-model">의료 특화 AI 모델<\/a>도 이 계층에서 지금 쓰는 모델을 대신할 예정입니다\./);
  assert.match(html, /Medical Workflow Orchestration/);
  assert.match(html, /읽은 문서를 다시 쓰는 지식으로/);
  assert.match(html, /원본의 표, 이미지, 페이지 배치를 모두 그대로 재현하지는 못합니다/);
  assert.match(html, /Deterministic Document-to-Artifact Engine/);
  assert.match(html, /해석하기 전에 입력부터 맞추다/);
  assert.match(html, /AlphaImage는 영상을 판독하거나 진단하지 않으며, 환자정보 처리 준비나 법적 적합성은 확인하지 않았습니다\./);
  assert.match(html, /Deterministic Image Artifact Compiler/);
  assert.match(html, /외부 AI를 쓸 때의 경계를 정하다/);
  assert.match(html, /환자정보 처리 준비나 법적 적합성을 뜻하지도 않습니다/);
  assert.match(html, /Protected Inference Gateway/);
  assert.match(html, /End-to-End Conversation Seal/);
  assert.match(html, /대화 내용과 전달 정보를 분리하다/);
  assert.match(html, /그룹 대화, 완전한 순방향 비밀성, 이미 침해된 사용자 브라우저의 보호, 환자정보 전송 적합성은 포함하지 않습니다\./);
  for (const id of [
    "technology-alphaevidence",
    "technology-alphadoc-engine",
    "technology-alphadocument",
    "technology-alphaimage",
    "technology-alphalayer",
    "technology-alphaseal",
    "technology-medical-model",
    "technology-onpremise-security",
    "technology-one-way-architecture",
  ]) {
    assert.match(html, new RegExp(`<article id="${id}"`));
  }
  assert.ok(html.indexOf('<article id="technology-alphaseal"') < html.indexOf('<article id="technology-medical-model"'));
  assert.ok(html.indexOf('<article id="technology-medical-model"') < html.indexOf('<article id="technology-onpremise-security"'));
  assert.ok(html.indexOf('<article id="technology-onpremise-security"') < html.indexOf('<article id="technology-one-way-architecture"'));
  assert.match(html, /POST <!-- -->07<\/span><div><p class="technology-section-english">Medical-specialized AI Model<\/p><h2>의료 특화 AI 모델<\/h2><p class="technology-section-lead">바이오레가 직접 미세조정하는 의료 AI 모델<\/p>/);
  assert.match(html, /POST <!-- -->08<\/span><div><p class="technology-section-english">Corporate Network Deployment &amp; Zero Trust Extension<\/p><h2>사내망 알파닥과 기관 단위 보안 체계<\/h2><p class="technology-section-lead">개인이 쓰던 AI를 기관이 도입하고 관리할 수 있게 만듭니다\.<\/p>/);
  assert.match(html, /POST <!-- -->09<\/span><div><p class="technology-section-english">One-way AI Architecture<\/p><h2>일방향 AI 구조<\/h2><p class="technology-section-lead">의학 근거는 기관 환경으로 보내고, 기관의 데이터는 그 안에 둡니다\.<\/p>/);
  assert.match(html, /technology-status technology-status-coming-soon">Coming soon · 개발 중</);
  assert.match(html, /technology-status technology-status-first-site-installed">첫 기관 설치 · 보안 체계 구축 중</);
  assert.match(html, /technology-status technology-status-first-site-applied">구현 · 첫 기관 적용</);
  assert.match(html, /모델을 직접 만드는 이유/);
  assert.match(html, /모델을 만드는 방법/);
  assert.match(html, /사내망과 분리 클라우드 모두 기관 환경 안의 모델로 답하며, 외부 모델을 부르지 않습니다\./);
  assert.match(html, /개인의 AI를 기관의 AI로 넓히다/);
  assert.match(html, /AlphaLayer의 통제를 기관 전체로/);
  assert.match(html, /사내망 알파닥은 KMI 한국의학연구소에 설치를 마쳤고 기관 환경에서 공개 기반 모델로 돌아갑니다\./);
  assert.match(html, /이 모델은 바이오레의 <a href="#technology-medical-model">의료 특화 AI 모델<\/a>로 바꿀 예정입니다\./);
  assert.match(html, /<a href="#technology-alphalayer">AlphaLayer<\/a>는 지금 일부 텍스트 기능에서/);
  assert.match(html, /데이터가 머무는 곳을 먼저 정하다/);
  assert.match(html, /근거를 한 방향으로 보내다/);
  assert.match(html, /새 지침과 문헌은 <a href="#technology-alphaevidence">AlphaEvidence<\/a>에서 정리한 뒤 각 기관 환경으로 보냅니다\./);
  assert.match(html, /이 구조는 KMI 한국의학연구소의 사내망에 적용돼 있습니다\./);
  assert.match(html, /법적 적합성까지 확인해 주지는 않습니다/);
  assert.match(html, /<strong>그림<!-- --> <!-- -->08<\/strong><span>바이오레의 의료 특화 AI 모델\(V1\)은 AlphaDoc Engine에서 지금의 공개 기반 모델이 있던 자리를 그대로 대신합니다\. 개발 구상을 설명하는 다이어그램\.<\/span>/);
  assert.match(html, /<strong>그림<!-- --> <!-- -->09<\/strong><span>사내망에서 답을 만드는 모델은 인터넷에 연결되지 않고, 의학 자료는 바이오레에서 한 방향으로만 받습니다\./);
  assert.match(html, /<strong>그림<!-- --> <!-- -->10<\/strong><span>의학 근거는 바이오레에서 각 기관으로 한 방향으로만 갱신되고/);
  assert.match(html, /현재 기술/);
  assert.match(html, /technology-article-nav-next-title">다음 기술</);
  assert.match(html, /<small>09<\/small><span>일방향 AI 구조<\/span>/);
  assert.match(html, /<small>07<\/small><span>의료 특화 AI 모델<small class="technology-article-nav-tag">Coming soon<\/small><\/span>/);
  assert.match(html, /<small>08<\/small><span>사내망 알파닥과 기관 단위 보안 체계<\/span>/);
  assert.doesNotMatch(html, FORBIDDEN_TOKENS);
  assert.doesNotMatch(html, /온프레미스|폐쇄망|기관 내부 서버|업데이트 노트|\(0[0-9]\)<\/a>/);
  assert.doesNotMatch(html, /계보|선택 경로 운영 검증|노출 가능한 진료지침/);
  assert.match(html, /구현 · 제품 기반 운영 중/);
  assert.match(html, /구현 · 제품 기능 운영 중/);
  assert.match(html, /구현 · 적용 범위 확대 검토 중/);
  assert.match(html, /구현 · 제품 적용 검토 중/);
  assert.match(html, /일부 기능에서 운영 검증/);
  assert.match(html, /구현 · 1:1 쪽지에 적용/);
  assert.doesNotMatch(html, /DEVELOPED &amp; INTEGRATED/);
  assert.match(html, /2026년 7월 21일/);
  assert.match(html, /2026년 10월 26일 업데이트/);
  assert.equal((html.match(/<time dateTime="2026-07-30">2026-07-30<\/time>/g) ?? []).length, 6);
  assert.equal((html.match(/<time dateTime="2026-10-26">2026-10-26<\/time>/g) ?? []).length, 3);
  assert.match(html, /"@type":"CollectionPage","@id":"https:\/\/vioreai\.com\/ko\/technology","name":"바이오레 기술 저널","description":"[^"]*","dateModified":"2026-10-26"/);
  assert.equal((html.match(/"@type":"TechArticle"/g) ?? []).length, 9);
  assert.match(html, /"hasPart":\[[^\]]*\{"@id":"https:\/\/vioreai\.com\/ko\/technology#technology-onpremise-security"\},\{"@id":"https:\/\/vioreai\.com\/ko\/technology#technology-one-way-architecture"\}\]/);
  assert.match(html, /"@id":"https:\/\/vioreai\.com\/ko\/technology#technology-one-way-architecture","headline":"일방향 AI 구조 — One-way AI Architecture"/);
  assert.match(html, /data-snapshot-state="live"/);
  assert.match(html, /정규화 논문 레코드/);
  assert.match(html, /초록 보유 논문/);
  assert.match(html, /열람 가능한 진료지침/);
  assert.doesNotMatch(html, /출처·변경 관찰 기록|관리 중인 작업 단위/);
  assert.match(html, /모든 자료가 임상 검증을 마쳤다는 뜻은 아닙니다/);
  assert.match(html, /CollectionPage/);
  assert.doesNotMatch(html, /FAQPage/);
  assert.equal((html.match(/<figcaption>/g) ?? []).length, 10);
  for (const kind of ["overview", "evidence", "engine", "document", "image", "layer", "seal", "model", "onpremise", "oneway"]) {
    assert.match(html, new RegExp(`technology-raw-diagram-${kind}`));
  }
  assert.doesNotMatch(html, /개발 지시 — 비공개|개발 계약 — 비공개|내부 근거 지도/);

  assert.match(englishHtml, /<html lang="en-US"/);
  assert.match(englishHtml, /<title>Viore Technology \| Medical AI, Built as a System<\/title>/);
  assert.match(englishHtml, /Drawing<br\/>our own linearity\./);
  assert.match(englishHtml, /We design everything behind the answer\./);
  assert.match(englishHtml, /Where did the evidence come from\?/);
  assert.match(englishHtml, /Designing what comes after the question/);
  assert.match(englishHtml, /From read once to reused/);
  assert.match(englishHtml, /Get the input right first/);
  assert.match(englishHtml, /Drawing the line for external AI/);
  assert.match(englishHtml, /AlphaImage does not read or diagnose images, and patient-information readiness and legal suitability have not been established\./);
  assert.match(englishHtml, /Group conversations, perfect forward secrecy, protection for an already compromised browser, and suitability for sending patient information are out of scope\./);
  assert.match(englishHtml, /IMPLEMENTED · PRODUCT FOUNDATION ACTIVE/);
  assert.match(englishHtml, /IMPLEMENTED · PRODUCT INTEGRATION REVIEW/);
  assert.match(englishHtml, /RUNTIME-VERIFIED IN SELECTED FEATURES/);
  assert.match(englishHtml, /IMPLEMENTED · APPLIED TO 1:1 MESSAGES/);
  assert.match(englishHtml, /technology-status-first-site-installed">Installed at first institution · Security framework in progress</);
  assert.match(englishHtml, /technology-status-first-site-applied">IMPLEMENTED · APPLIED AT FIRST INSTITUTION</);
  assert.match(englishHtml, /Updated October 26, 2026/);
  assert.match(englishHtml, /<h2>Our own medical AI model<\/h2><p class="technology-section-lead">Fine-tuned by Viore, built for medicine\.<\/p>/);
  assert.match(englishHtml, /<h2>Alphadoc on your corporate network, with institution-level security<\/h2>/);
  assert.match(englishHtml, /<h2>One-way AI Architecture<\/h2><p class="technology-section-lead">Evidence flows in\. Your data stays put\.<\/p>/);
  assert.match(englishHtml, /Corporate-network Alphadoc is installed at KMI \(Korea Medical Institute\)/);
  assert.match(englishHtml, /This architecture runs on the corporate network at KMI \(Korea Medical Institute\)\./);
  assert.match(englishHtml, /technology-article-nav-next-title">What&#x27;s next</);
  assert.match(englishHtml, /Our own medical AI model<small class="technology-article-nav-tag">Coming soon<\/small>/);
  assert.match(englishHtml, /<small>09<\/small><span>One-way AI Architecture<\/span>/);
  assert.doesNotMatch(englishHtml, /On-premise|on-premise|closed network|Evidence lineage/);
  assert.doesNotMatch(englishHtml, FORBIDDEN_TOKENS);
});

test("keeps the public architecture contract aligned with the bounded AlphaSeal claim", async () => {
  const [markdown, jsonText, agents, copilot] = await Promise.all([
    readFile(new URL("../.viore/architecture-contract.md", import.meta.url), "utf8"),
    readFile(new URL("../.viore/architecture-contract.json", import.meta.url), "utf8"),
    readFile(new URL("../AGENTS.md", import.meta.url), "utf8"),
    readFile(new URL("../.github/copilot-instructions.md", import.meta.url), "utf8"),
  ]);
  const contract = JSON.parse(jsonText);

  assert.equal(contract.contractVersion, "2026-10-26.1");
  assert.equal(contract.publicClaimBoundary["institution-zero-trust"], "in-build-public-claim-restricted");
  assert.equal(contract.publicClaimBoundary["medical-model-v1"], "in-development-public-claim-restricted");
  assert.ok(contract.forbiddenPublicClaims.includes("zero-trust-implemented"));
  assert.ok(contract.forbiddenPublicClaims.includes("medical-model-benchmark-disclosure"));
  assert.ok(contract.forbiddenPublicClaims.includes("institution-type-naming"));
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
  assert.match(markdown, /기관 단위 보안 체계\(Zero Trust\)는 구축 중으로 표현한다/);
  assert.match(agents, /현재 계약 버전은 `2026-10-26\.1`/);
  assert.match(copilot, /is `2026-10-26\.1`/);
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
    "ModelDiagram",
    "OnpremiseDiagram",
    "OnewayDiagram",
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
  assert.match(css, /@media \(max-width: 1180px\) \{[\s\S]*?\.technology-post \{\s*scroll-margin-top: calc\(var\(--header\) \+ 96px \+ 24px\);/);
  assert.match(css, /@media \(max-width: 760px\) \{[\s\S]*?scroll-margin-top: calc\(var\(--header\) \+ 96px \+ 16px\);/);
  assert.match(css, /--technology-page: var\(--dark-paper-base\)/);
  assert.match(css, /--technology-paper: var\(--dark-paper-image\)/);
  assert.doesNotMatch(css, /#111114;\s*backdrop-filter: none|rgba\(17, 17, 20|site-header-dark/);
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
  const globalsCss = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(globalsCss, /\.site-header\.site-header-dark \{\s*--technology-page: #000000;/);
  assert.match(globalsCss, /\.site-header\.site-header-dark \{[\s\S]*?color: #f5f5f7;/);
  assert.match(globalsCss, /\.site-header-dark \.contact-link \{[\s\S]*?color: #f5f5f7;/);
  assert.match(globalsCss, /@media \(max-width: 760px\) \{\s*\.site-header\.site-header-dark \{\s*background: #000000;/);
  assert.doesNotMatch(globalsCss, /rgba\(17, 17, 20|rgba\(17,17,20|#08080a|#fdfdfc/);
  assert.match(css, /\.technology-article-nav \{[\s\S]*?border: 0;[\s\S]*?background: transparent;[\s\S]*?backdrop-filter: none;/);
  assert.match(css, /\.technology-article-nav-inner \{[\s\S]*?border: 0;[\s\S]*?background: transparent;[\s\S]*?backdrop-filter: none;/);
  assert.match(css, /@media \(max-width: 1180px\) \{[\s\S]*?background: color-mix\(in srgb, var\(--technology-page\) 96%, transparent\);[\s\S]*?grid-template-columns: repeat\(7, minmax\(0, 1fr\)\);/);
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
