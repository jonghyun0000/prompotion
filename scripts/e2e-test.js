const { chromium } = require("playwright");

const BASE = "http://localhost:3100";
const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " :: " + detail : ""}`);
}

/** lazy 이미지까지 모두 로드될 때까지 스크롤하며 대기 */
async function waitForImages(page, timeout = 8000) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const broken = await page.evaluate(() =>
      Array.from(document.querySelectorAll("img")).filter((i) => !i.complete || i.naturalWidth === 0).length
    );
    if (broken === 0) break;
    await page.waitForTimeout(200);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  return page.evaluate(() =>
    Array.from(document.querySelectorAll("img")).filter((i) => !i.complete || i.naturalWidth === 0).length
  );
}

(async () => {
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message));

  // 1. 홈
  await page.goto(BASE, { waitUntil: "networkidle" });
  check("홈 헤드라인 렌더", (await page.locator("h1").innerText()).includes("프롬프트를 선택"));

  // 2. CTA -> 이미지 종류 선택
  await page.getByRole("link", { name: /이미지 종류 선택하기/ }).click();
  await page.waitForURL("**/select");
  const cards = page.locator("main button");
  check("이미지 종류 6개 노출", (await cards.count()) === 6, `count=${await cards.count()}`);

  // 썸네일 이미지가 실제로 로드되는지 (lazy 로딩이 끝난 뒤 확인)
  const brokenThumbs = await waitForImages(page);
  check("썸네일 이미지 로드", brokenThumbs === 0, `broken=${brokenThumbs}`);

  // 3. 투시도 선택 -> builder
  await page.getByRole("button", { name: /투시도/ }).first().click();
  await page.waitForURL("**/builder");
  await page.waitForTimeout(300);
  check("빌더 제목", (await page.locator("h1").innerText()).includes("투시도 프롬프트 구성"));
  const catNames = ["카메라 / 구도", "건축 스타일", "재료", "조명 / 시간", "환경 / 배경", "렌더링 스타일"];
  let catFound = 0;
  for (const n of catNames) if ((await page.getByRole("button", { name: new RegExp(n.replace(/[/]/g, "\\/")) }).count()) > 0) catFound++;
  check("옵션 카테고리 6개", catFound === 6, `found=${catFound}`);
  check("초기 진행률 0/6", (await page.getByText("0 / 6 옵션 선택 완료").count()) === 1);

  const receiveBtn = page.getByRole("button", { name: "프롬프트 받기" });
  check("초기 버튼 비활성", await receiveBtn.isDisabled());
  check("남은 개수 안내", (await page.getByText("6개의 옵션이 남았습니다.").count()) === 1);

  // 4. 재료 -> Exposed Concrete
  await page.getByRole("button", { name: /재료/ }).first().click();
  await page.waitForURL("**/builder/material");
  await page.waitForTimeout(300);
  check("옵션 페이지 제목", (await page.locator("h1").innerText()).includes("재료 선택"));
  check("BEFORE/AFTER 라벨 노출", (await page.getByText("BEFORE", { exact: true }).count()) === 3 && (await page.getByText("AFTER", { exact: true }).count()) === 3);
  const brokenBA = await waitForImages(page);
  check("Before/After 이미지 로드", brokenBA === 0, `broken=${brokenBA}`);
  check("프롬프트 텍스트 노출", (await page.getByText("exposed raw concrete facade", { exact: false }).count()) > 0);

  await page.getByRole("button", { name: "이 프롬프트 선택" }).first().click();
  await page.waitForURL("**/builder");
  await page.waitForTimeout(300);
  check("선택 후 빌더 복귀 + 즉시 반영", (await page.getByText("Exposed Concrete").count()) > 0);
  check("진행률 1/6", (await page.getByText("1 / 6 옵션 선택 완료").count()) === 1);

  // 5. 재진입 시 선택됨 표시
  await page.getByRole("button", { name: /재료/ }).first().click();
  await page.waitForURL("**/builder/material");
  await page.waitForTimeout(300);
  check("재진입 시 선택됨 표시", (await page.getByText("선택됨").count()) === 1);
  await page.getByRole("link", { name: /프롬프트 구성으로/ }).click();
  await page.waitForURL("**/builder");
  await page.waitForTimeout(300);

  // 6. 나머지 5개 선택
  for (const cat of ["카메라 / 구도", "건축 스타일", "조명 / 시간", "환경 / 배경", "렌더링 스타일"]) {
    await page.getByRole("button", { name: new RegExp(cat.replace(/[/]/g, "\\/")) }).first().click();
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: "이 프롬프트 선택" }).first().click();
    await page.waitForURL("**/builder");
    await page.waitForTimeout(250);
  }
  check("진행률 6/6", (await page.getByText("6 / 6 옵션 선택 완료").count()) === 1);
  check("완료 문구", (await page.getByText("모든 옵션을 선택했습니다.").count()) === 1);
  check("버튼 활성화", await page.getByRole("button", { name: "프롬프트 받기" }).isEnabled());

  // 7. 새로고침 후 상태 유지 (localStorage)
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  check("새로고침 후 선택 유지", (await page.getByText("6 / 6 옵션 선택 완료").count()) === 1);

  // 8. 결과 모달
  await page.getByRole("button", { name: "프롬프트 받기" }).click();
  await page.waitForTimeout(400);
  const dialog = page.getByRole("dialog");
  check("모달 표시", await dialog.isVisible());
  const finalText = await dialog.locator("p.font-mono").first().innerText();
  check("최종 프롬프트 조합됨", finalText.includes("eye-level") && finalText.includes("exposed raw concrete"), finalText.slice(0, 90) + "...");
  const order = ["eye-level", "minimal contemporary", "exposed raw concrete", "golden hour", "urban", "photorealistic"];
  let lastIdx = -1, ordered = true;
  for (const frag of order) {
    const i = finalText.indexOf(frag);
    if (i < 0 || i < lastIdx) { ordered = false; break; }
    lastIdx = i;
  }
  check("카테고리 order 순서대로 연결", ordered);
  check("선택 요소 6개 목록", (await dialog.locator("li").count()) === 6);

  // 9. 복사
  await dialog.getByRole("button", { name: /프롬프트 복사/ }).click();
  await page.waitForTimeout(500);
  check("복사 토스트 노출", (await page.getByText("프롬프트가 복사되었습니다.").count()) === 1);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  check("클립보드 내용 일치", clip.trim() === finalText.trim(), `clip=${clip.slice(0, 60)}...`);

  // 10. 다시 수정하기
  await dialog.getByRole("button", { name: "다시 수정하기" }).click();
  await page.waitForTimeout(300);
  check("모달 닫힘", (await page.getByRole("dialog").count()) === 0);

  // 11. 이미지 종류 바꾸면 옵션 초기화 + 카테고리 수 변경
  await page.getByRole("link", { name: /이미지 종류 변경/ }).click();
  await page.waitForURL("**/select");
  await page.getByRole("button", { name: /다이어그램/ }).first().click();
  await page.waitForURL("**/builder");
  await page.waitForTimeout(400);
  check("종류 변경 시 옵션 초기화", (await page.getByText("0 / 4 옵션 선택 완료").count()) === 1);

  // 12. 반응형
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check("모바일 가로 스크롤 없음", !overflow);

  await page.goto(`${BASE}/builder/material`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const stacked = await page.evaluate(() => {
    const figs = document.querySelectorAll("figure");
    if (figs.length < 2) return false;
    const a = figs[0].getBoundingClientRect(), b = figs[1].getBoundingClientRect();
    return b.top >= a.bottom - 2;
  });
  check("모바일 Before/After 세로 배치", stacked);

  // 13. 잘못된 경로 처리
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${BASE}/builder/does-not-exist`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  check("존재하지 않는 카테고리 리다이렉트", page.url().endsWith("/builder"), page.url());

  check("콘솔 에러 없음", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== ${results.length - failed.length}/${results.length} passed ===`);
  process.exit(failed.length ? 1 : 0);
})();
