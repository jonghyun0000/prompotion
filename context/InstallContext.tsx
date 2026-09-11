"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  detectPlatform,
  isInAppBrowser,
  promptForInstall,
  type InstallOutcome,
  type InstallPromptEvent,
} from "@/lib/install";
import { trackEvent } from "@/lib/analytics";

const subscribeDevice = () => () => {};
const getPlatform = () =>
  detectPlatform(navigator.userAgent, navigator.maxTouchPoints);
const getInApp = () => isInAppBrowser(navigator.userAgent);
const getStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;
const subscribeStandalone = (callback: () => void) => {
  const media = window.matchMedia("(display-mode: standalone)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const InstallContext = createContext<{
  platform: ReturnType<typeof detectPlatform>;
  inAppBrowser: boolean;
  installed: boolean;
  canInstall: boolean;
  installing: boolean;
  requestInstall: () => Promise<InstallOutcome>;
} | null>(null);

export function InstallProvider({ children }: { children: React.ReactNode }) {
  const platform = useSyncExternalStore(
    subscribeDevice,
    getPlatform,
    () => "desktop" as const,
  );
  const inAppBrowser = useSyncExternalStore(
    subscribeDevice,
    getInApp,
    () => false,
  );
  const standalone = useSyncExternalStore(
    subscribeStandalone,
    getStandalone,
    () => false,
  );
  const pending = useRef<InstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installedHere, setInstalledHere] = useState(false);
  const launched = useRef(false);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      // This invitation is for phones. Keep the browser's own desktop UX.
      if (platform !== "android") return;
      event.preventDefault();
      pending.current = event as InstallPromptEvent;
      setCanInstall(true);
    };
    const onInstalled = () => {
      pending.current = null;
      setCanInstall(false);
      setInstalledHere(true);
      trackEvent("app_installed", { platform });
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [platform]);

  useEffect(() => {
    if (standalone && !launched.current) {
      launched.current = true;
      trackEvent("homescreen_opened", { platform });
    }
  }, [standalone, platform]);

  const requestInstall = useCallback(async () => {
    const event = pending.current;
    if (!event) return "unavailable" as const;
    pending.current = null;
    setCanInstall(false);
    setInstalling(true);
    trackEvent("install_prompt_requested", { platform });
    const outcome = await promptForInstall(event);
    setInstalling(false);
    trackEvent("install_prompt_outcome", { platform, outcome });
    return outcome;
  }, [platform]);

  return (
    <InstallContext.Provider
      value={{
        platform,
        inAppBrowser,
        installed: standalone || installedHere,
        canInstall,
        installing,
        requestInstall,
      }}
    >
      {children}
    </InstallContext.Provider>
  );
}

export function useInstall() {
  const context = useContext(InstallContext);
  if (!context) throw new Error("InstallProvider is required");
  return context;
}
