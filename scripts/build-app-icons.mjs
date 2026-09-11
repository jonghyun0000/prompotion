import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

// The SVG is the editable source. All artwork fits within the maskable
// central safe circle (40% radius). Keep the full-bleed opaque background.
const source = await readFile(
  new URL("../public/icons/prompotion.svg", import.meta.url),
);
const raster = (size, ico = false) => {
  const image = sharp(source).resize(size, size);
  // Next's ICO decoder requires RGBA entries, with every alpha still opaque.
  return (ico ? image.ensureAlpha() : image.removeAlpha()).png().toBuffer();
};
for (const [name, size] of [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["icon-maskable-512.png", 512],
  ["apple-touch-icon.png", 180],
]) {
  await writeFile(
    new URL("../public/icons/" + name, import.meta.url),
    await raster(size),
  );
}
// ICO with 16/32/48px PNG entries: no platform-specific image tooling required.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((size) => raster(size, true)));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
for (const [index, image] of images.entries()) {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
}
await writeFile(
  new URL("../app/favicon.ico", import.meta.url),
  Buffer.concat([header, ...images]),
);
console.log("Generated Android, maskable, Apple touch and favicon assets.");
