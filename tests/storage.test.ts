import test from "node:test";
import assert from "node:assert/strict";
import {
  readSaved,
  savePrompt,
  readHistory,
  rememberCopy,
  readResultImage,
} from "../lib/storage";
const values = new Map<string, string>();
const storage = {
  getItem: (key: string) => values.get(key) || null,
  setItem: (key: string, value: string) => {
    values.set(key, value);
  },
};
Object.defineProperty(globalThis, "localStorage", {
  value: storage,
  configurable: true,
});
test("corrupt saved data is ignored; invalid image URL cannot render", () => {
  values.clear();
  values.set("prompotion:saved:v1", "bad json");
  assert.deepEqual(readSaved(), []);
  values.set(
    "prompotion:saved:v1",
    JSON.stringify([
      {
        id: "one",
        title: "test",
        prompt: "test",
        image: "javascript:alert(1)",
        selection: { selectedImageType: "bad", selectedOptions: {} },
      },
    ]),
  );
  assert.equal(readSaved()[0].image, undefined);
  assert.equal(readSaved()[0].selection.selectedImageType, null);
});
test("saving and updating keeps prompt selection and result together", () => {
  values.clear();
  const item = {
    id: "one",
    title: "demo",
    prompt: "architectural prompt",
    createdAt: "2026-09-11",
    selection: {
      selectedImageType: "perspective",
      selectedOptions: { lighting: "night" },
    },
  };
  savePrompt(item);
  savePrompt({
    ...item,
    title: "updated",
    image: "data:image/webp;base64,abcd",
  });
  assert.equal(readSaved().length, 1);
  assert.equal(readSaved()[0].title, "updated");
  assert.equal(readSaved()[0].image, "data:image/webp;base64,abcd");
});
test("copy history is deduplicated and limited to ten", () => {
  values.clear();
  for (let i = 0; i < 14; i++) rememberCopy("prompt " + i);
  rememberCopy("prompt 13");
  assert.equal(readHistory().length, 10);
  assert.equal(readHistory()[0].prompt, "prompt 13");
});
test("invalid or oversized result uploads fail before image decoding", async () => {
  await assert.rejects(
    readResultImage(
      new File(["<svg/>"], "image.svg", { type: "image/svg+xml" }),
    ),
    /10MB/,
  );
  await assert.rejects(
    readResultImage({ type: "image/png", size: 11 * 1024 * 1024 } as File),
    /10MB/,
  );
});
test("save errors propagate while clipboard history stays nonblocking", () => {
  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
    },
    configurable: true,
  });
  assert.throws(
    () =>
      savePrompt({
        id: "one",
        title: "demo",
        prompt: "demo",
        createdAt: "today",
        selection: { selectedImageType: null, selectedOptions: {} },
      }),
    /quota/,
  );
  assert.doesNotThrow(() => rememberCopy("test"));
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
  });
});
