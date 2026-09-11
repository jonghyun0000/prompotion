import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { imageTypes, optionCategories } from "../lib/data";
import {
  sanitizeSelection,
  buildFinalPrompt,
  buildPromptBreakdown,
  getCategoriesForImageType,
  isComplete,
} from "../lib/prompt";

test("invalid storage values recover safely", () => {
  for (const value of [
    null,
    2,
    "invalid",
    [],
    { selectedImageType: "unknown" },
    { selectedImageType: ["perspective"] },
  ])
    assert.deepEqual(sanitizeSelection(value), {
      selectedImageType: null,
      selectedOptions: {},
    });
  for (const selectedOptions of [
    null,
    [],
    "broken",
    { lighting: "missing", camera: "aerial", __proto__: { material: "glass" } },
  ])
    assert.deepEqual(
      sanitizeSelection({ selectedImageType: "perspective", selectedOptions }),
      { selectedImageType: "perspective", selectedOptions: {} },
    );
});
test("incompatible categories and options cannot enter the prompt", () => {
  const selection = sanitizeSelection({
    selectedImageType: "diagram",
    selectedOptions: { material: "glass", "diagram-type": "program" },
  });
  assert.deepEqual(selection.selectedOptions, { "diagram-type": "program" });
  assert.equal(buildFinalPrompt(selection).includes("glass"), false);
  assert.equal(
    getCategoriesForImageType("aerial")
      .find((c) => c.id === "camera")
      ?.promptOptions.some((o) => o.id === "eye-level"),
    false,
  );
});
test("empty selections do not generate and one valid element is enough", () => {
  assert.equal(
    buildFinalPrompt({ selectedImageType: "perspective", selectedOptions: {} }),
    "",
  );
  assert.equal(
    isComplete({
      selectedImageType: "perspective",
      selectedOptions: { lighting: "fake" },
    }),
    false,
  );
  assert.equal(
    isComplete({
      selectedImageType: "perspective",
      selectedOptions: { lighting: "golden-hour" },
    }),
    true,
  );
});
test("demo prompt includes subject and deterministic category order", () => {
  const prompt = buildFinalPrompt({
    selectedImageType: "perspective",
    selectedOptions: {
      camera: "35mm",
      lighting: "golden-hour",
      material: "exposed-concrete",
      environment: "residential",
    },
  });
  assert.match(prompt, /^Architectural perspective visualization/);
  const markers = ["concrete", "residential", "golden hour", "35mm"];
  for (let i = 1; i < markers.length; i++)
    assert.ok(prompt.indexOf(markers[i]) > prompt.indexOf(markers[i - 1]));
  assert.ok(prompt.endsWith("."));
});
test("cinematic overlap is reduced to a single instruction", () => {
  const prompt = buildFinalPrompt({
    selectedImageType: "perspective",
    selectedOptions: {
      lighting: "golden-hour",
      atmosphere: "cinematic",
      rendering: "cinematic",
    },
  });
  assert.equal((prompt.match(/cinematic/gi) || []).length, 1);
});
test("all six image types produce distinct subject instructions", () => {
  const subjects = new Set(
    imageTypes.map((type) => {
      const category = getCategoriesForImageType(type.id)[0];
      const selection = {
        selectedImageType: type.id,
        selectedOptions: { [category.id]: category.promptOptions[0].id },
      };
      assert.equal(buildPromptBreakdown(selection).length, 1);
      return buildFinalPrompt(selection).split(".")[0];
    }),
  );
  assert.equal(subjects.size, 6);
});
test("catalog IDs, compatibility, previews and local paths are valid", () => {
  assert.equal(new Set(imageTypes.map((t) => t.id)).size, imageTypes.length);
  for (const type of imageTypes)
    assert.ok(existsSync("public" + type.thumbnail), type.thumbnail);
  for (const category of optionCategories) {
    assert.equal(
      new Set(category.promptOptions.map((o) => o.id)).size,
      category.promptOptions.length,
    );
    for (const option of category.promptOptions) {
      assert.ok(option.promptText && option.description && option.title);
      assert.ok(option.compatibleTypes?.length);
      assert.ok(existsSync("public" + option.afterImage), option.afterImage);
      assert.ok(existsSync("public" + option.beforeImage), option.beforeImage);
    }
  }
});
