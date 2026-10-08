export type EventName =
  | "page_view"
  | "image_type_selected"
  | "element_viewed"
  | "element_selected"
  | "element_removed"
  | "cart_opened"
  | "prompt_generated"
  | "prompt_copied"
  | "prompt_saved"
  | "result_uploaded"
  | "install_guide_viewed"
  | "install_prompt_requested"
  | "install_prompt_outcome"
  | "app_installed"
  | "homescreen_opened"
  | "dream_home_step_viewed"
  | "dream_home_generated"
  | "dream_home_saved"
  | "dream_home_downloaded"
  | "task_started"
  | "reset";
type Properties = Record<string, string | number | boolean | string[]>;
export interface AnalyticsEvent {
  name: EventName;
  at: string;
  elapsedMs: number;
  sessionId: string;
  properties: Properties;
}
const KEY = "prompotion:events:v1";
let sessionId = "";
let startedAt = 0;
let sink: ((event: AnalyticsEvent) => void) | undefined;
// Optional future transport. Nothing leaves the browser by default.
export function setAnalyticsSink(next: typeof sink) {
  sink = next;
}
export function trackEvent(name: EventName, properties: Properties = {}) {
  if (typeof window === "undefined") return;
  try {
    if (!sessionId) {
      sessionId =
        sessionStorage.getItem("prompotion:session") || crypto.randomUUID();
      sessionStorage.setItem("prompotion:session", sessionId);
      startedAt =
        Number(sessionStorage.getItem("prompotion:started")) || Date.now();
      sessionStorage.setItem("prompotion:started", String(startedAt));
    }
    const event: AnalyticsEvent = {
      name,
      at: new Date().toISOString(),
      elapsedMs: Date.now() - startedAt,
      sessionId,
      properties,
    };
    const previous = JSON.parse(localStorage.getItem(KEY) || "[]");
    localStorage.setItem(
      KEY,
      JSON.stringify(
        [...(Array.isArray(previous) ? previous : []), event].slice(-1000),
      ),
    );
    sink?.(event);
  } catch (error) {
    if (process.env.NODE_ENV === "development")
      console.debug("Analytics unavailable", error);
  }
}
export function startTestTask() {
  sessionId = crypto.randomUUID();
  startedAt = Date.now();
  try {
    sessionStorage.setItem("prompotion:session", sessionId);
    sessionStorage.setItem("prompotion:started", String(startedAt));
  } catch {}
  trackEvent("task_started", { task: "warm-evening-residential" });
}
export function exportEvents() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
