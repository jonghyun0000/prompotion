import assert from "node:assert/strict";

// HTTP and metadata checks only: this does not claim to automate OS installation.
const base = new URL(process.argv[2] || "http://localhost:3100");
const checked = [];
async function get(path) {
  const url = new URL(path, base);
  assert.equal(url.origin, base.origin);
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200, url.pathname);
  checked.push({ path: url.pathname + url.search, status: response.status });
  return response;
}
const manifestResponse = await get("/manifest.webmanifest");
assert.match(manifestResponse.headers.get("content-type"), /json|manifest/);
const manifest = await manifestResponse.json();
assert.equal(manifest.id, "/");
assert.equal(manifest.start_url, "/select");
assert.equal(manifest.scope, "/");
assert.equal(manifest.display, "standalone");
assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
for (const icon of [
  ...manifest.icons,
  { src: "/icons/apple-touch-icon.png", sizes: "180x180" },
]) {
  const response = await get(icon.src);
  assert.match(response.headers.get("content-type"), /image\/png/);
  const png = Buffer.from(await response.arrayBuffer());
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16) + "x" + png.readUInt32BE(20), icon.sizes);
}
await get("/icons/prompotion.svg");
await get("/favicon.ico");
const assetUrls = new Set();
for (const path of [
  "/",
  "/install",
  "/select",
  "/builder",
  "/builder/lighting",
  "/saved",
  "/test-session",
]) {
  const html = await (await get(path)).text();
  assert.match(html, /rel="manifest"[^>]+href="\/manifest.webmanifest"/);
  assert.match(
    html,
    /rel="apple-touch-icon"[^>]+href="\/icons\/apple-touch-icon.png"/,
  );
  assert.ok(
    /name="mobile-web-app-capable" content="yes"/.test(html),
    "standalone capability meta on " + path,
  );
  assert.ok(
    /name="apple-mobile-web-app-title" content="PromPotion"/.test(html),
    "Apple home screen title on " + path,
  );
  assert.match(html, /name="theme-color" content="#f7f7f5"/);
  assert.match(html, /viewport-fit=cover/);
  if (path === "/") assert.match(html, /다음 작업은, 홈 화면에서/);
  if (path === "/install") {
    assert.match(html, /iPhone · Safari/);
    assert.match(html, /Android · Chrome/);
    assert.match(html, /Safari에서 공유 메뉴 열기/);
    assert.match(html, /주소 복사/);
    for (const match of html.matchAll(
      /(?:src|href)="([^" ]*\/_next\/[^" ]+)"/g,
    ))
      assetUrls.add(match[1].replaceAll("&amp;", "&"));
  }
}
await Promise.all([...assetUrls].map(get));
console.log(
  JSON.stringify(
    {
      verifiedAt: new Date().toISOString(),
      base: base.origin,
      status: "passed",
      checkedCount: checked.length,
      checked,
      limitations:
        "HTTP, manifest and image checks only. Physical iOS/Android installation and browser interactions require separate verification.",
    },
    null,
    2,
  ),
);
