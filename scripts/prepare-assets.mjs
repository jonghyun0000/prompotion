import sharp from "sharp";
import { readFile, mkdir, copyFile } from "node:fs/promises";
const records = JSON.parse(
  await readFile(
    new URL("./asset-sources.local.json", import.meta.url),
    "utf8",
  ),
);
const root = new URL("../public/images/", import.meta.url);
await mkdir(new URL("elements/", root), { recursive: true });
for (const item of records) {
  await sharp(item.source)
    .resize(960, 720, { fit: "cover" })
    .webp({ quality: 84 })
    .toFile(new URL("elements/" + item.id + ".webp", root).pathname);
}
const aliases = {
  "material-exposed-concrete": "baseline",
  "lighting-daylight": "baseline",
  "camera-eye-level": "baseline",
  "camera-35mm": "baseline",
  "atmosphere-calm": "baseline",
  "style-minimalism": "baseline",
  "rendering-photorealistic": "baseline",
  "atmosphere-minimal": "environment-minimal",
  "atmosphere-dramatic": "lighting-dramatic",
  "rendering-cinematic": "atmosphere-cinematic",
};
for (const [target, source] of Object.entries(aliases))
  await copyFile(
    new URL("elements/" + source + ".webp", root),
    new URL("elements/" + target + ".webp", root),
  );
for (const [target, source] of Object.entries({
  perspective: "baseline",
  aerial: "camera-aerial",
  section: "type-section",
  concept: "rendering-conceptual",
}))
  await copyFile(
    new URL("elements/" + source + ".webp", root),
    new URL("types/" + target + ".webp", root),
  );
console.log("Generated assets optimized and installed:", records.length);
