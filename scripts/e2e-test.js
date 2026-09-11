/**
 * Browser flow checks, shared by a browser automation adapter.
 * Pass an existing controlled tab with the documented Playwright locator API.
 * No hard-coded Chromium binary, account access, or production data mutation.
 * Saves only a local browser test prompt if the optional save test is performed.
 */
async function verifyMvp(tab, base) {
  const checks = [];
  const check = (name, ok) => { checks.push({name,ok}); if (!ok) throw new Error(name); };
  await tab.goto(base);
  await tab.playwright.getByRole("heading", {level:1}).waitFor({state:"visible"});
  check("landing", (await tab.playwright.getByRole("heading", {level:1}).innerText()).includes("건축 프롬프트"));
  await tab.playwright.getByRole("link", {name:"프롬프트 만들기",exact:true}).first().click();
  await tab.playwright.getByRole("heading", {name:"어떤 이미지를 만들고 싶나요?",exact:true}).waitFor({state:"visible"});
  check("six image types", await tab.playwright.locator("main button").count() === 6);
  await tab.playwright.getByRole("button", {name:/^투시도 투시도/}).click();
  await tab.playwright.getByRole("heading", {name:"투시도 프롬프트 구성",exact:true}).waitFor({state:"visible"});
  await tab.playwright.getByRole("button", {name:"Warm Sunset 담기",exact:true}).click();
  await tab.playwright.getByRole("button", {name:"재료",exact:true}).click();
  await tab.playwright.getByRole("button", {name:"Exposed Concrete 담기",exact:true}).click();
  await tab.playwright.getByRole("button", {name:"카메라 / 구도",exact:true}).click();
  await tab.playwright.getByRole("button", {name:"35mm Lens 담기",exact:true}).click();
  const cart = await tab.playwright.getByRole("complementary", {name:"Prompt Cart"}).innerText();
  check("cart", ["Exposed Concrete","Warm Sunset","35mm Lens"].every(text=>cart.includes(text)));
  await tab.playwright.getByRole("button", {name:"프롬프트 생성",exact:true}).first().click();
  const prompt = await tab.playwright.getByRole("textbox", {name:"FINAL PROMPT"}).evaluate(element=>element.value);
  check("generation", ["Architectural perspective","exposed raw concrete","warm golden hour","35mm"].every(text=>prompt.includes(text)));
  await tab.playwright.getByRole("button", {name:"프롬프트 복사",exact:true}).click();
  check("copy feedback", await tab.playwright.getByRole("button", {name:"복사 완료!",exact:true}).isVisible());
  await tab.playwright.getByRole("button", {name:"닫기",exact:true}).click();
  await tab.playwright.getByRole("button", {name:"Warm Sunset 삭제",exact:true}).click();
  check("removal", !(await tab.playwright.getByRole("complementary", {name:"Prompt Cart"}).innerText()).includes("Warm Sunset"));
  await tab.playwright.getByRole("button", {name:"↺ 전체 초기화",exact:true}).click();
  await tab.playwright.getByRole("heading", {name:"어떤 이미지를 만들고 싶나요?",exact:true}).waitFor({state:"visible"});
  check("reset", true);
  check("no overflow", await tab.playwright.evaluate(()=>document.documentElement.scrollWidth <= innerWidth));
  return checks;
}
module.exports = { verifyMvp };
