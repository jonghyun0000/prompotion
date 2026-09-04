"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Toast from "@/components/Toast";

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((next: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(next);
    timerRef.current = setTimeout(() => setMessage(null), 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={message} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast 는 ToastProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
