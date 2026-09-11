import type { SelectionState } from "./types";
import { sanitizeSelection } from "./prompt";
export interface SavedPrompt {
  id: string;
  title: string;
  prompt: string;
  selection: SelectionState;
  createdAt: string;
  image?: string;
}
const KEY = "prompotion:saved:v1";
export function readSaved(): SavedPrompt[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.prompt === "string" &&
          typeof item.title === "string",
      )
      .slice(0, 30)
      .map((item) => ({
        ...item,
        selection: sanitizeSelection(item.selection),
        image:
          typeof item.image === "string" &&
          /^data:image\/(jpeg|png|webp);base64,/.test(item.image)
            ? item.image
            : undefined,
      }));
  } catch {
    return [];
  }
}
export function savePrompt(item: SavedPrompt) {
  const items = readSaved().filter((previous) => previous.id !== item.id);
  if (items.length >= 30) throw new Error("Saved prompt limit reached");
  localStorage.setItem(KEY, JSON.stringify([item, ...items].slice(0, 30)));
}
export function readHistory(): { prompt: string; createdAt: string }[] {
  try {
    const data = JSON.parse(
      localStorage.getItem("prompotion:history:v1") || "[]",
    );
    return Array.isArray(data)
      ? data.filter((item) => typeof item?.prompt === "string").slice(0, 10)
      : [];
  } catch {
    return [];
  }
}
export function rememberCopy(prompt: string) {
  try {
    localStorage.setItem(
      "prompotion:history:v1",
      JSON.stringify(
        [
          { prompt, createdAt: new Date().toISOString() },
          ...readHistory().filter((item) => item.prompt !== prompt),
        ].slice(0, 10),
      ),
    );
  } catch {}
}
export async function readResultImage(file: File): Promise<string> {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 10 * 1024 * 1024
  )
    throw new Error("10MB 이하의 JPG, PNG, WebP 이미지를 선택해주세요.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("이미지를 열 수 없습니다. 다른 파일로 시도해주세요.");
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/webp", 0.82);
}
