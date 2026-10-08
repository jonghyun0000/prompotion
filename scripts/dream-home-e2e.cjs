#!/usr/bin/env node
/**
 * Headless, isolated Dream Home flow verification. Does not start a server.
 * NODE_PATH=/path/to/runtime/node_modules node scripts/dream-home-e2e.cjs \
 *   http://127.0.0.1:3100 /optional/screenshot/directory
 *
 * Uses Playwright's installed browsers, never a user's profile. Set the optional
 * CHROMIUM_EXECUTABLE_PATH / WEBKIT_EXECUTABLE_PATH to automation-only
 * Chromium / WebKit executables.
 * Clipboard permissions and storage failures are simulated. WebKit/mobile
 * viewports do not constitute physical iPhone or Android verification.
 * JSON is the only stdout output; exit code 1 means a required check failed.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");

const base = new URL(process.argv[2] || "http://127.0.0.1:3100");
const screenshotDir = process.argv[3] ? path.resolve(process.argv[3]) : null;
const HOME_KEY = "prompotion:dream-home:v1";
const report = {
  base: base.origin,
  startedAt: new Date().toISOString(),
  checks: [],
  browsers: [],
  screenshots: [],
  consoleErrors: [],
  pageErrors: [],
  failedRequests: [],
  limitations: [
    "Local browser state only; no image API or paid service is invoked.",
    "Clipboard and storage failures are simulated, not real-device permission tests.",
    "Mobile Chromium/WebKit are viewport and engine checks, not physical Android/iPhone verification.",
    "External image quality, deployment, and home-screen installation are outside this suite.",
  ],
};
const contexts = [];
const browsers = [];
let currentPage;

async function check(name, action) {
  const started = Date.now();
  try {
    const detail = await action();
    report.checks.push({ name, status: "passed", durationMs: Date.now() - started, ...(detail === undefined ? {} : { detail }) });
  } catch (error) {
    report.checks.push({ name, status: "failed", durationMs: Date.now() - started, error: error.message });
    throw error;
  }
}

async function screenshot(page, name) {
  if (!screenshotDir) return;
  await fs.mkdir(screenshotDir, { recursive: true });
  const filename = path.join(screenshotDir, `${name}.png`);
  await page.screenshot({ path: filename, fullPage: name !== "dream-home-desktop-board" });
  report.screenshots.push(filename);
}

async function newPage(browser, label, options = {}) {
  const context = await browser.newContext({ acceptDownloads: true, ...options });
  contexts.push(context);
  const page = await context.newPage();
  currentPage = page;
  page.setDefaultTimeout(12000);
  page.setDefaultNavigationTimeout(30000);
  page.on("console", (message) => {
    if (message.type() === "error") report.consoleErrors.push({ browser: label, text: message.text(), location: message.location() });
  });
  page.on("pageerror", (error) => report.pageErrors.push({ browser: label, message: error.message }));
  page.on("requestfailed", (request) => report.failedRequests.push({ browser: label, url: request.url(), failure: request.failure()?.errorText }));
  return page;
}

async function openHome(page) {
  const response = await page.goto(new URL("/dream-home", base).href, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200);
  await page.getByRole("heading", { name: "내가 원하는 집 만들기", exact: true }).waitFor();
}

async function choose(page, label) {
  const radio = page.getByRole("radio", { name: new RegExp(`^${label}`) });
  // Click the visible native label, not the visually hidden radio's 1px box.
  await radio.locator("..").click();
  assert.equal(await radio.isChecked(), true, `${label} should be selected`);
}

async function step(page, title) {
  await page.getByRole("navigation", { name: "내 집 질문 단계" }).getByRole("button", { name: new RegExp(title) }).click();
  await page.getByRole("heading", { name: title, exact: true }).waitFor();
}

async function fillHouse(page) {
  await choose(page, "단독주택");
  await choose(page, "마당");
  await choose(page, "두 층");
  await page.getByRole("button", { name: "다음 질문", exact: true }).click();
  await page.locator("#home-bedrooms").selectOption("4");
  await page.locator("#home-bathrooms").selectOption("2");
  await page.getByRole("checkbox", { name: /^재택근무/ }).check();
  await page.getByRole("button", { name: "다음 질문", exact: true }).click();
  await choose(page, "자연스럽고 편안하게");
  await choose(page, "장판");
  await choose(page, "짙은 월넛색");
  await choose(page, "세이지 그린");
  await choose(page, "따뜻한 노을");
  await page.getByRole("button", { name: "다음 질문", exact: true }).click();
  await page.getByRole("heading", { name: "확인하고 만들기", exact: true }).waitFor();
}

async function generate(page) {
  await page.getByRole("button", { name: "통합 보드 프롬프트 만들기", exact: true }).click();
  await page.getByRole("heading", { name: "Architectural Presentation Board 통합 프롬프트", exact: true }).waitFor();
  return page.locator("#home-final-prompt").inputValue();
}

async function withConfirmation(page, buttonName, accept) {
  const [message] = await Promise.all([
    page.waitForEvent("dialog").then(async (dialog) => {
      assert.equal(dialog.type(), "confirm");
      const text = dialog.message();
      if (accept) await dialog.accept();
      else await dialog.dismiss();
      return text;
    }),
    page.getByRole("button", { name: buttonName, exact: true }).click(),
  ]);
  return message;
}

async function assertNoOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewport: innerWidth,
    root: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert.ok(dimensions.root <= dimensions.viewport + 1, `Root horizontal overflow: ${JSON.stringify(dimensions)}`);
  assert.ok(dimensions.body <= dimensions.viewport + 1, `Body horizontal overflow: ${JSON.stringify(dimensions)}`);
  return dimensions;
}

async function desktopFlow(chromium) {
  const page = await newPage(chromium, "chromium-desktop", { viewport: { width: 1440, height: 1000 } });
  await check("desktop: landing entry preserves architecture links", async () => {
    const response = await page.goto(new URL("/", base).href, { waitUntil: "networkidle" });
    assert.equal(response?.status(), 200);
    assert.ok(await page.getByRole("link", { name: "프롬프트 만들기", exact: true }).count() >= 1);
    await page.getByRole("link", { name: "내가 원하는 집 구상하기", exact: true }).click();
    await page.getByRole("heading", { name: "내가 원하는 집 만들기", exact: true }).waitFor();
    assert.equal(new URL(page.url()).pathname, "/dream-home");
  });

  await check("desktop: native radio keyboard navigation and apartment compatibility", async () => {
    const detached = page.getByRole("radio", { name: /^단독주택/ });
    await detached.focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.getByRole("radio", { name: /^아파트/ }).isChecked(), true);
    assert.equal(await page.getByRole("radio", { name: /^발코니/ }).isChecked(), true);
    assert.equal(await page.getByRole("radio", { name: /^마당/ }).count(), 0);
    assert.equal(await page.getByRole("radio", { name: /^두 층/ }).count(), 0);
    await page.getByText("아파트는 한 층 세대로 구상하도록 설정했어요.", { exact: false }).waitFor();
    await page.getByText("개인 마당은 이 버전에서 다루지 않아 외부 공간을 발코니로 바꿨어요.", { exact: false }).waitFor();
    await page.keyboard.press("ArrowLeft");
    assert.equal(await detached.isChecked(), true);
  });

  let board;
  await check("desktop: house/garden/4 bedrooms/2 bathrooms and finishes generate", async () => {
    await fillHouse(page);
    const summary = await page.getByRole("complementary", { name: "내 집 선택 요약" }).innerText();
    for (const phrase of ["단독주택", "마당", "장판", "짙은 월넛색", "자연스럽고 편안하게"]) assert.ok(summary.includes(phrase), phrase);
    assert.match(summary, /침실\s+4개/);
    assert.match(summary, /욕실\s+2개/);
    board = await generate(page);
    assert.equal(await page.locator('input[name="home-scene"]').count(), 0);
    assert.equal(await page.getByRole("textbox").count(), 1);
    assert.equal(await page.getByText(/먼저 어떤 장면을 만들까요|어떤 결과물을 만들까요/).count(), 0);
    for (const phrase of ["Architectural Presentation Board", "CONCEPT PLANS:", "4 bedrooms and 2 bathrooms in total", "Show 2 separate top-down conceptual floor plans", "CONCEPT ONLY — NOT TO SCALE — NOT FOR CONSTRUCTION"]) assert.ok(board.includes(phrase), phrase);
    await page.getByText("한 장의 보드 구성 안내", { exact: true }).waitFor();
    await screenshot(page, "dream-home-desktop-board");
    for (const phrase of ["a detached house", "4 bedrooms and 2 bathrooms", "two storeys", "LIVING ROOM:", "BEDROOM:", "EXTERIOR:", "matte vinyl sheet flooring", "deep walnut-brown", "sage-green", "golden sunset", "ground-level private garden", "work-from-home"]) assert.ok(board.includes(phrase), phrase);
    assert.ok(board.length > 500);
    await page.getByText("이미지는 아직 생성하지 않았어요.", { exact: false }).waitFor();
    await page.getByText("한국어 요구사항 요약 보기", { exact: true }).click();
    await page.getByText("내가 원하는 집 · 요구사항", { exact: false }).waitFor();
    await screenshot(page, "dream-home-desktop-result");
    return { boardPromptLength: board.length };
  });

  await check("desktop: clipboard success copies the single integrated board prompt", async () => {
    await page.evaluate(() => {
      window.__dreamHomeCopied = [];
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text) => { window.__dreamHomeCopied.push(text); } } });
    });
    assert.equal(await page.evaluate(() => isSecureContext), true, "Use localhost or HTTPS for clipboard success test");
    await page.getByRole("button", { name: "프롬프트 복사", exact: true }).click();
    await page.getByRole("button", { name: "복사 완료!", exact: true }).waitFor();
    assert.deepEqual(await page.evaluate(() => window.__dreamHomeCopied), [board]);
  });

  await check("desktop: clipboard rejection plus execCommand false is recoverable", async () => {
    await page.evaluate(() => {
      window.__dreamHomeCopyFallbackCalls = 0;
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new DOMException("Simulated clipboard denial", "NotAllowedError"); } } });
      document.execCommand = () => { window.__dreamHomeCopyFallbackCalls += 1; return false; };
    });
    await page.getByRole("button", { name: "복사 완료!", exact: true }).click();
    await page.getByRole("alert").filter({ hasText: "복사하지 못했습니다." }).waitFor();
    assert.ok(await page.evaluate(() => window.__dreamHomeCopyFallbackCalls > 0));
    assert.equal(await page.locator("#home-final-prompt").inputValue(), board);
    assert.equal(await page.getByRole("button", { name: "복사 완료!", exact: true }).count(), 0);
    assert.equal(await page.locator("textarea").count(), 1, "Fallback textarea should be removed");
  });

  await check("desktop: text download includes summary and only one board prompt", async () => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "전체 내용 내려받기", exact: true }).click(),
    ]);
    assert.equal(await download.failure(), null);
    assert.equal(download.suggestedFilename(), "prompotion-my-home.txt");
    const temporaryPath = await download.path();
    assert.ok(temporaryPath, "Playwright should provide its temporary download file");
    const text = await fs.readFile(temporaryPath, "utf8");
    for (const phrase of ["침실: 4개", "욕실: 2개", "바닥 재료: 장판", "바닥 색: 짙은 월넛색", board, "실제 설계도"]) assert.ok(text.includes(phrase), `Download missing ${phrase.slice(0, 60)}`);
    assert.doesNotMatch(text, /거실 이미지용 프롬프트|침실 이미지용 프롬프트|외관 이미지용 프롬프트/);
    assert.equal(text.split(board).length, 2, "Exactly one integrated prompt is exported");
    return { filename: download.suggestedFilename(), characters: text.length };
  });

  await check("desktop: save, reload, cancel restore, and explicitly confirmed restore", async () => {
    await page.getByRole("button", { name: "답변 저장", exact: true }).click();
    const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), HOME_KEY);
    assert.equal(stored.version, 1);
    assert.equal(stored.brief.bedrooms, 4);
    assert.equal(stored.brief.floorMaterial, "vinyl");
    await page.reload({ waitUntil: "networkidle" });
    await step(page, "생활과 공간");
    assert.equal(await page.locator("#home-bedrooms").inputValue(), "3", "Saved answers must not silently overwrite defaults");
    const prompt = await withConfirmation(page, "저장한 답변 불러오기", false);
    assert.ok(prompt.includes("현재 입력한 답변"));
    assert.equal(await page.locator("#home-bedrooms").inputValue(), "3");
    await withConfirmation(page, "저장한 답변 불러오기", true);
    await page.getByRole("heading", { name: "집의 형태", exact: true }).waitFor();
    assert.equal(await page.getByRole("radio", { name: /^마당/ }).isChecked(), true);
    await step(page, "생활과 공간");
    assert.equal(await page.locator("#home-bedrooms").inputValue(), "4");
    assert.equal(await page.locator("#home-bathrooms").inputValue(), "2");
    await step(page, "분위기와 마감");
    assert.equal(await page.getByRole("radio", { name: /^장판/ }).isChecked(), true);
    assert.equal(await page.getByRole("radio", { name: /^짙은 월넛색/ }).isChecked(), true);
  });

  await check("desktop: reset removes only Dream Home answers and preserves other work", async () => {
    const before = await page.evaluate(() => {
      localStorage.setItem("prompotion:saved:v1", JSON.stringify([{ id: "e2e-existing", title: "기존 건축 프롬프트", prompt: "A retained architectural prompt", selection: {}, createdAt: "2026-01-01T00:00:00Z" }]));
      localStorage.setItem("dream-home-e2e:unrelated", "retain-me");
      return Object.fromEntries(["prompotion:saved:v1", "prompotion:history:v1", "prompotion:selection", "dream-home-e2e:unrelated"].map((key) => [key, localStorage.getItem(key)]));
    });
    await withConfirmation(page, "처음부터", false);
    assert.ok(await page.evaluate((key) => localStorage.getItem(key), HOME_KEY));
    await withConfirmation(page, "처음부터", true);
    assert.equal(await page.evaluate((key) => localStorage.getItem(key), HOME_KEY), null);
    const after = await page.evaluate((keys) => Object.fromEntries(keys.map((key) => [key, localStorage.getItem(key)])), Object.keys(before));
    assert.deepEqual(after, before);
    assert.equal(await page.locator("#home-final-prompt").count(), 0);
    await step(page, "생활과 공간");
    assert.equal(await page.locator("#home-bedrooms").inputValue(), "3");
  });

  await check("desktop: invalid persisted data has friendly errors and leaves current answers usable", async () => {
    for (const invalid of ["{not-json", JSON.stringify({ version: 2, brief: {} }), JSON.stringify({ version: 1, brief: [] })]) {
      await page.evaluate(({ key, value }) => localStorage.setItem(key, value), { key: HOME_KEY, value: invalid });
      await page.getByRole("button", { name: "저장한 답변 불러오기", exact: true }).click();
      const alert = page.getByRole("alert").filter({ hasText: "저장한 답변을 불러오지 못했어요." });
      await alert.waitFor();
      assert.ok(!/TypeError|SyntaxError|JSON\.parse/.test(await alert.innerText()));
      assert.equal(await page.locator("#home-bedrooms").inputValue(), "3");
    }
    await page.evaluate((key) => localStorage.removeItem(key), HOME_KEY);
  });

  await check("desktop: storage read/write/remove exceptions stay within the feature", async () => {
    await page.evaluate((key) => {
      const original = { getItem: Storage.prototype.getItem, setItem: Storage.prototype.setItem, removeItem: Storage.prototype.removeItem };
      window.__dreamHomeStorageOriginal = original;
      for (const method of ["getItem", "setItem", "removeItem"]) {
        Storage.prototype[method] = function (storageKey, ...args) {
          if (storageKey === key) throw new DOMException("Simulated storage restriction", "SecurityError");
          return original[method].call(this, storageKey, ...args);
        };
      }
    }, HOME_KEY);
    try {
      await page.getByRole("button", { name: "답변 저장", exact: true }).click();
      await page.getByRole("alert").filter({ hasText: "이 브라우저에 저장하지 못했어요." }).waitFor();
      await page.getByRole("button", { name: "저장한 답변 불러오기", exact: true }).click();
      await page.getByRole("alert").filter({ hasText: "저장한 답변을 불러오지 못했어요." }).waitFor();
      await withConfirmation(page, "처음부터", true);
      await page.getByRole("alert").filter({ hasText: "브라우저에 저장한 답변은 삭제하지 못했어요." }).waitFor();
      await step(page, "확인하고 만들기");
      assert.ok((await generate(page)).includes("3 bedrooms"));
    } finally {
      await page.evaluate(() => {
        for (const [method, original] of Object.entries(window.__dreamHomeStorageOriginal)) Storage.prototype[method] = original;
        delete window.__dreamHomeStorageOriginal;
      });
    }
  });
  await check("desktop: no horizontal overflow", () => assertNoOverflow(page));
}

async function mobileFlow(browser, engine, width) {
  const label = `${engine}-mobile-${width}`;
  const page = await newPage(browser, label, { viewport: { width, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await check(`${label}: navigation and questionnaire fit viewport`, async () => {
    await openHome(page);
    await page.getByRole("navigation", { name: "주요 메뉴" }).getByRole("link", { name: "질문으로 내가 원하는 집 구상하기", exact: true }).waitFor();
    await assertNoOverflow(page);
    await choose(page, "단독주택");
    await choose(page, "마당");
    await page.getByRole("button", { name: "다음 질문", exact: true }).click();
    await page.locator("#home-bedrooms").selectOption("4");
    await page.locator("#home-bathrooms").selectOption("2");
    await assertNoOverflow(page);
    await page.getByRole("button", { name: "다음 질문", exact: true }).click();
    await choose(page, "장판");
    await choose(page, "짙은 월넛색");
    await assertNoOverflow(page);
    await page.getByRole("button", { name: "다음 질문", exact: true }).click();
    await assertNoOverflow(page);
  });
  await check(`${label}: single integrated board output fits viewport without scene selection`, async () => {
    const prompt = await generate(page);
    assert.ok(prompt.includes("Architectural Presentation Board"));
    assert.ok(prompt.includes("4 bedrooms and 2 bathrooms"));
    assert.ok(prompt.includes("matte vinyl sheet flooring"));
    await assertNoOverflow(page);
    await screenshot(page, `dream-home-${label}-board`);
    assert.equal(await page.locator('input[name="home-scene"]').count(), 0);
    assert.equal(await page.getByRole("textbox").count(), 1);
  });
}

async function main() {
  const { chromium, webkit } = require("playwright");
  const chrome = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH } : {}),
  });
  browsers.push(chrome);
  report.browsers.push({ engine: "chromium", version: chrome.version(), status: "launched" });
  await desktopFlow(chrome);
  for (const width of [320, 390]) await mobileFlow(chrome, "chromium", width);
  let safari;
  try {
    safari = await webkit.launch({
      headless: true,
      ...(process.env.WEBKIT_EXECUTABLE_PATH ? { executablePath: process.env.WEBKIT_EXECUTABLE_PATH } : {}),
    });
    browsers.push(safari);
    report.browsers.push({ engine: "webkit", version: safari.version(), status: "launched" });
  } catch (error) {
    report.browsers.push({ engine: "webkit", status: "unavailable", reason: error.message.slice(0, 1000) });
    report.checks.push({ name: "webkit-mobile-390", status: "skipped", reason: "Optional WebKit engine could not launch; real iOS remains unverified." });
  }
  if (safari) await mobileFlow(safari, "webkit", 390);
  await check("all browsers: no console errors or uncaught page errors", () => {
    assert.deepEqual(report.consoleErrors, []);
    assert.deepEqual(report.pageErrors, []);
  });
  report.ok = true;
}

main().catch(async (error) => {
  report.ok = false;
  report.error = error.stack || error.message;
  if (currentPage && !currentPage.isClosed()) {
    try { await screenshot(currentPage, "dream-home-failure"); } catch (screenshotError) { report.screenshotError = screenshotError.message; }
  }
  process.exitCode = 1;
}).finally(async () => {
  for (const context of contexts) await context.close().catch(() => {});
  for (const browser of browsers) await browser.close().catch(() => {});
  report.finishedAt = new Date().toISOString();
  report.summary = {
    passed: report.checks.filter((item) => item.status === "passed").length,
    failed: report.checks.filter((item) => item.status === "failed").length,
    skipped: report.checks.filter((item) => item.status === "skipped").length,
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
});
