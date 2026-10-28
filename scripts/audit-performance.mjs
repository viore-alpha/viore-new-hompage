import process from "node:process";
import { pathToFileURL } from "node:url";

const DEFAULT_ROUTES = [
  "/ko",
  "/ko/technology",
  "/ko/knowledge",
];

const PERFORMANCE_BUDGET = {
  lcpMs: 2_800,
  cls: 0.1,
  totalBlockingTimeMs: 1_200,
  transferBytes: 650_000,
  frameP95Ms: 20,
  frameP99Ms: 33.34,
  frameOver50Ms: 1,
};

function readArgument(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch (error) {
    const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
    if (!modulePath) {
      throw new Error(
        "Playwright is required. Install it locally or set PLAYWRIGHT_MODULE_PATH to its package directory.",
        { cause: error },
      );
    }

    return import(pathToFileURL(`${modulePath}/index.mjs`).href);
  }
}

function percentile(values, fraction) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(Math.ceil(sorted.length * fraction) - 1, sorted.length - 1)];
}

async function auditRoute(browser, baseUrl, route, viewport, options) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: viewport.width <= 480 ? 2 : 1,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  await client.send("Network.enable");
  await client.send("Network.setCacheDisabled", { cacheDisabled: true });
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: options.latency,
    downloadThroughput: (options.downloadKbps * 1024) / 8,
    uploadThroughput: (options.uploadKbps * 1024) / 8,
  });
  await client.send("Emulation.setCPUThrottlingRate", { rate: options.cpuRate });

  await page.addInitScript(() => {
    window.__viorePerf = { cls: 0, lcp: 0, longTasks: [] };

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.__viorePerf.lcp = entry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__viorePerf.cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch {}

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.__viorePerf.longTasks.push(entry.duration);
      }).observe({ type: "longtask", buffered: true });
    } catch {}
  });

  const response = await page.goto(`${baseUrl}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  let loadTimedOut = false;
  await page.waitForLoadState("load", { timeout: 15_000 }).catch(() => {
    loadTimedOut = true;
  });
  await page.waitForTimeout(options.settleMs);

  const loading = await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    const paints = Object.fromEntries(
      performance.getEntriesByType("paint").map((entry) => [entry.name, entry.startTime]),
    );
    const resources = performance.getEntriesByType("resource");
    const perf = window.__viorePerf;

    const byType = {};
    for (const resource of resources) {
      const key = resource.initiatorType || "other";
      const current = byType[key] || { count: 0, transferBytes: 0, decodedBytes: 0 };
      current.count += 1;
      current.transferBytes += resource.transferSize || 0;
      current.decodedBytes += resource.decodedBodySize || 0;
      byType[key] = current;
    }

    return {
      contentLength: document.documentElement.outerHTML.length,
      bodyTextLength: document.body.innerText.trim().length,
      domNodes: document.getElementsByTagName("*").length,
      fcpMs: paints["first-contentful-paint"] || 0,
      lcpMs: perf.lcp,
      cls: perf.cls,
      ttfbMs: navigation?.responseStart || 0,
      domContentLoadedMs: navigation?.domContentLoadedEventEnd || 0,
      loadMs: navigation?.loadEventEnd || 0,
      navigationTransferBytes: navigation?.transferSize || 0,
      navigationDecodedBytes: navigation?.decodedBodySize || 0,
      transferBytes: (navigation?.transferSize || 0) + resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
      decodedBytes: (navigation?.decodedBodySize || 0) + resources.reduce((sum, resource) => sum + (resource.decodedBodySize || 0), 0),
      resourceCount: resources.length + (navigation ? 1 : 0),
      byType,
      longTaskCount: perf.longTasks.length,
      totalBlockingTimeMs: perf.longTasks.reduce(
        (sum, duration) => sum + Math.max(duration - 50, 0),
        0,
      ),
      maxLongTaskMs: Math.max(0, ...perf.longTasks),
      topResources: resources
        .map((resource) => ({
          name: new URL(resource.name).pathname,
          type: resource.initiatorType,
          transferBytes: resource.transferSize || 0,
          decodedBytes: resource.decodedBodySize || 0,
          durationMs: resource.duration,
        }))
        .sort((left, right) => right.decodedBytes - left.decodedBytes)
        .slice(0, 8),
    };
  });

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  const frameTimes = await page.evaluate(async (durationMs) => {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const samples = [];

    return new Promise((resolve) => {
      let startedAt = 0;
      let previousAt = 0;

      function step(now) {
        if (!startedAt) {
          startedAt = now;
          previousAt = now;
        } else {
          samples.push(now - previousAt);
          previousAt = now;
        }

        const progress = Math.min((now - startedAt) / durationMs, 1);
        window.scrollTo(0, maxScroll * progress);

        if (progress < 1) requestAnimationFrame(step);
        else resolve(samples);
      }

      requestAnimationFrame(step);
    });
  }, options.scrollMs);

  const frame = {
    sampleCount: frameTimes.length,
    averageMs: frameTimes.reduce((sum, value) => sum + value, 0) / Math.max(frameTimes.length, 1),
    p95Ms: percentile(frameTimes, 0.95),
    p99Ms: percentile(frameTimes, 0.99),
    over20ms: frameTimes.filter((value) => value > 20).length,
    over33ms: frameTimes.filter((value) => value > 33.34).length,
    over50ms: frameTimes.filter((value) => value > 50).length,
    maxMs: Math.max(0, ...frameTimes),
  };

  const overlay = await page.locator("[data-nextjs-dialog], .vite-error-overlay").count();
  await context.close();

  return {
    route,
    viewport: `${viewport.width}x${viewport.height}`,
    status: response?.status() || 0,
    loadTimedOut,
    errorOverlay: overlay > 0,
    loading,
    frame,
  };
}

const baseUrl = readArgument("--base-url", "http://127.0.0.1:3210").replace(/\/$/, "");
const routes = readArgument("--routes", DEFAULT_ROUTES.join(",")).split(",").filter(Boolean);
const profile = readArgument("--profile", "mobile");
const viewport = profile === "desktop" ? { width: 1440, height: 900 } : { width: 390, height: 844 };
const options = {
  cpuRate: Number(readArgument("--cpu", profile === "desktop" ? "2" : "4")),
  latency: Number(readArgument("--latency", "150")),
  downloadKbps: Number(readArgument("--download", "1638")),
  uploadKbps: Number(readArgument("--upload", "750")),
  settleMs: Number(readArgument("--settle", "2500")),
  scrollMs: Number(readArgument("--scroll", "4000")),
};
const enforce = hasFlag("--enforce");

const { chromium } = await loadPlaywright();
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const route of routes) {
    results.push(await auditRoute(browser, baseUrl, route, viewport, options));
  }
} finally {
  await browser.close();
}

const violations = results.flatMap((result) => {
  const failures = [];
  if (result.status !== 200) failures.push(`status ${result.status}`);
  if (result.loadTimedOut) failures.push("load timed out");
  if (result.errorOverlay) failures.push("framework error overlay");
  if (result.loading.lcpMs > PERFORMANCE_BUDGET.lcpMs) failures.push(`LCP ${result.loading.lcpMs.toFixed(1)}ms`);
  if (result.loading.cls > PERFORMANCE_BUDGET.cls) failures.push(`CLS ${result.loading.cls.toFixed(3)}`);
  if (result.loading.totalBlockingTimeMs > PERFORMANCE_BUDGET.totalBlockingTimeMs) failures.push(`TBT ${result.loading.totalBlockingTimeMs.toFixed(1)}ms`);
  if (result.loading.transferBytes > PERFORMANCE_BUDGET.transferBytes) failures.push(`transfer ${result.loading.transferBytes}B`);
  if (result.frame.p95Ms > PERFORMANCE_BUDGET.frameP95Ms) failures.push(`frame p95 ${result.frame.p95Ms.toFixed(1)}ms`);
  if (result.frame.p99Ms > PERFORMANCE_BUDGET.frameP99Ms) failures.push(`frame p99 ${result.frame.p99Ms.toFixed(1)}ms`);
  if (result.frame.over50ms > PERFORMANCE_BUDGET.frameOver50Ms) failures.push(`${result.frame.over50ms} frames over 50ms`);
  return failures.map((failure) => `${result.route}: ${failure}`);
});

console.log(JSON.stringify({ baseUrl, profile, options, budget: PERFORMANCE_BUDGET, violations, results }, null, 2));
if (enforce && violations.length > 0) process.exitCode = 1;
