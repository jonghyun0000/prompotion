export const APP_URL = "https://prompotion.vercel.app/";
export type DevicePlatform = "ios" | "android" | "desktop";

export function detectPlatform(
  userAgent: string,
  maxTouchPoints = 0,
): DevicePlatform {
  if (
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && maxTouchPoints > 1)
  )
    return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "desktop";
}

export function isInAppBrowser(userAgent: string) {
  return /KAKAOTALK|NAVER\(|Instagram|FBAN|FBAV|Line\/|; wv\)/i.test(userAgent);
}

// One browser event can only be used once. The caller discards it before awaiting.
export interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}
export type InstallOutcome =
  "accepted" | "dismissed" | "unavailable" | "failed";
export async function promptForInstall(
  event: InstallPromptEvent | null,
): Promise<InstallOutcome> {
  if (!event) return "unavailable";
  try {
    await event.prompt();
    return (await event.userChoice).outcome;
  } catch {
    return "failed";
  }
}
