import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import manifest from "../app/manifest";
import {
  APP_URL,
  detectPlatform,
  isInAppBrowser,
  promptForInstall,
  type InstallPromptEvent,
} from "../lib/install";

test("home screen manifest stays within the app and has Android icon sizes", () => {
  const app = manifest();
  assert.equal(app.id, "/");
  assert.equal(app.scope, "/");
  assert.equal(app.start_url, "/select");
  assert.equal(app.display, "standalone");
  assert.equal(app.prefer_related_applications, false);
  assert.equal(app.short_name, "PromPotion");
  assert.equal(new URL(APP_URL).protocol, "https:");
  for (const size of ["192x192", "512x512"])
    assert.ok(
      app.icons?.some((icon) => icon.sizes === size && icon.purpose === "any"),
    );
  assert.ok(app.icons?.some((icon) => icon.purpose === "maskable"));
});

test("all install icons are real correctly-sized opaque PNGs", () => {
  const icons = [
    ...manifest().icons!,
    { src: "/icons/apple-touch-icon.png", sizes: "180x180" },
  ];
  for (const icon of icons) {
    const data = readFileSync("public" + icon.src);
    assert.equal(data.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    const [width, height] = icon.sizes!.split("x").map(Number);
    assert.equal(data.readUInt32BE(16), width);
    assert.equal(data.readUInt32BE(20), height);
    assert.equal(data[25], 2, "RGB, not a transparent RGBA icon");
  }
  const favicon = readFileSync("app/favicon.ico");
  assert.equal(favicon.readUInt16LE(2), 1);
  assert.equal(favicon.readUInt16LE(4), 3);
  for (let entry = 6; entry < 6 + 3 * 16; entry += 16) {
    const offset = favicon.readUInt32LE(entry + 12);
    assert.equal(
      favicon[offset + 25],
      6,
      "ICO PNG entries must be RGBA for Next's decoder",
    );
  }
});

test("device detection distinguishes iPhone, Android and desktop-mode iPad", () => {
  assert.equal(
    detectPlatform("Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X)"),
    "ios",
  );
  assert.equal(
    detectPlatform("Mozilla/5.0 (Linux; Android 16) Chrome/148 Mobile"),
    "android",
  );
  assert.equal(
    detectPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari", 5),
    "ios",
  );
  assert.equal(
    detectPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari", 0),
    "desktop",
  );
  assert.equal(detectPlatform(""), "desktop");
});

test("embedded browsers get an external-browser reminder", () => {
  for (const agent of [
    "KAKAOTALK 26.0",
    "NAVER(inapp; search)",
    "Instagram 400",
    "FBAV/1",
    "Line/12",
    "Mozilla (Linux; Android 16; wv)",
  ])
    assert.equal(isInAppBrowser(agent), true);
  assert.equal(
    isInAppBrowser("Mozilla/5.0 Android Chrome/148 Mobile Safari"),
    false,
  );
  assert.equal(isInAppBrowser("iPhone Safari"), false);
});

test("install outcome respects browser acceptance and dismissal", async () => {
  for (const outcome of ["accepted", "dismissed"] as const) {
    let calls = 0;
    const event = {
      prompt: async () => {
        calls++;
      },
      userChoice: Promise.resolve({ outcome, platform: "web" }),
    } as InstallPromptEvent;
    assert.equal(await promptForInstall(event), outcome);
    assert.equal(calls, 1);
  }
});

test("unsupported and rejected install prompts fall back to instructions", async () => {
  assert.equal(await promptForInstall(null), "unavailable");
  assert.equal(
    await promptForInstall({
      prompt: async () => {
        throw new Error("not supported");
      },
    } as unknown as InstallPromptEvent),
    "failed",
  );
  assert.equal(
    await promptForInstall({
      prompt: async () => {},
      get userChoice() {
        return Promise.reject(new Error("blocked"));
      },
    } as unknown as InstallPromptEvent),
    "failed",
  );
});
