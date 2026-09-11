import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const dir = new URL("../public/images/", import.meta.url);
await mkdir(new URL("diagrams/", dir), { recursive: true });
const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720"><rect width="960" height="720" fill="#f4f2ec"/><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#b25739"/></marker><pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8L8 0" stroke="#d5d1c6" stroke-width="1"/></pattern></defs>${body}</svg>`;
const plan = (colors = ["#c5c8bd", "#ded3ba", "#b7c6c8"], arrows = false) =>
  `<g transform="translate(135 95)"><path d="M0 0H690V530H0Z" fill="none" stroke="#9faaa0" stroke-width="2"/><path d="M-60 580H750M-60 610H750" stroke="#9c9b94" stroke-width="3"/><path d="M75 70H375V200H205V400H75Z" fill="${colors[0]}" stroke="#39433e" stroke-width="5"/><path d="M410 70H600V260H410Z" fill="${colors[1]}" stroke="#39433e" stroke-width="5"/><path d="M290 315H600V430H290Z" fill="${colors[2]}" stroke="#39433e" stroke-width="5"/><path d="M215 215H390V300H215Z" fill="#e5e1d7"/><path d="M80 170H195M130 210V395M415 170H595M390 320V425M485 320V425" fill="none" stroke="#7f8881" stroke-width="2"/>${[
    [40, 45],
    [645, 55],
    [650, 320],
    [40, 450],
    [240, 480],
    [620, 485],
    [340, 260],
  ]
    .map(
      ([x, y]) =>
        `<circle cx="${x}" cy="${y}" r="23" fill="#cbd2bd" stroke="#9da995"/><circle cx="${x}" cy="${y}" r="14" fill="none" stroke="#abb5a1"/>`,
    )
    .join(
      "",
    )}${arrows ? '<path d="M350 550V450L250 270L380 265L460 275" fill="none" stroke="#b25739" stroke-width="9" marker-end="url(#arrow)"/><path d="M250 270L190 250" fill="none" stroke="#b25739" stroke-width="9" marker-end="url(#arrow)"/>' : ""}<path d="M650 135V80L638 103M650 80L662 103" fill="none" stroke="#39433e" stroke-width="3"/><path d="M450 495H580M450 490V500M515 490V500M580 490V500" stroke="#39433e" stroke-width="3"/></g>`;
const block = (x, y, w, h, d, fill) =>
  `<g transform="translate(${x} ${y})"><path d="M0 0L${w} -${w / 2}L${w + d} ${(d - w) / 2}L${d} ${d / 2}Z" fill="${fill}" stroke="#515c57" stroke-width="2"/><path d="M0 0V${h}L${d} ${h + d / 2}V${d / 2}Z" fill="#b8c0b6" stroke="#515c57" stroke-width="2"/><path d="M${d} ${d / 2}L${w + d} ${(d - w) / 2}V${h + (d - w) / 2}L${d} ${h + d / 2}Z" fill="#e0e1d8" stroke="#515c57" stroke-width="2"/></g>`;
const massing =
  block(80, 300, 140, 130, 100, "#d2d7cb") +
  block(330, 300, 140, 130, 100, "#d2d7cb") +
  block(590, 300, 140, 130, 100, "#d2d7cb") +
  block(650, 205, 80, 85, 75, "#b8c8bc") +
  '<path d="M280 360H325M540 360H585" stroke="#b25739" stroke-width="5" marker-end="url(#arrow)"/>';
const axon =
  block(220, 295, 250, 175, 220, "#e4e5dd") +
  block(490, 230, 95, 175, 115, "#d0d8c9") +
  '<path d="M240 420L440 520L670 400M220 295L440 405L690 280" fill="none" stroke="#65746a" stroke-width="2"/>';
const entries = {
  "types/site-plan": plan(),
  "types/diagram": massing,
  "elements/diagram-type-program": plan(["#91b3ad", "#d8b483", "#b4b0c8"]),
  "elements/diagram-type-circulation": plan(
    ["#d9dbd3", "#d9dbd3", "#d9dbd3"],
    true,
  ),
  "elements/diagram-type-massing": massing,
  "elements/linework-axonometric": axon,
  "elements/linework-flat-vector": plan(["#628879", "#d6b178", "#b8a697"]),
  "elements/linework-hand-drawn":
    '<g stroke-linejoin="round" transform="rotate(-1 480 360)">' +
    axon +
    '</g><g opacity=".25" transform="translate(3 -3)">' +
    axon +
    "</g>",
  "elements/color-scheme-monochrome": plan(["#7b817e", "#aeb2ae", "#d5d7d3"]),
  "elements/color-scheme-muted-pastel": plan(["#b9ceca", "#e2cbbb", "#cac6dd"]),
  "elements/color-scheme-high-contrast": plan([
    "#263f39",
    "#dd7546",
    "#eceacb",
  ]),
};
for (const [name, body] of Object.entries(entries)) {
  const source = svg(body);
  await writeFile(
    new URL("diagrams/" + name.replaceAll("/", "-") + ".svg", dir),
    source,
  );
  await sharp(Buffer.from(source))
    .webp({ quality: 90 })
    .toFile(new URL(name + ".webp", dir).pathname);
}
console.log("Authored diagram previews:", Object.keys(entries).length);
