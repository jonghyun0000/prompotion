"use client";

import { Check } from "lucide-react";

/**
 * 화면 하단 중앙에 잠깐 떠오르는 알림.
 * 표시 시간과 상태는 ToastContext 가 관리하고, 이 컴포넌트는 그리기만 한다.
 */
export default function Toast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-toast-in fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-ink bg-ink px-5 py-3 text-sm text-white shadow-sm"
    >
      <Check size={16} strokeWidth={2} />
      {message}
    </div>
  );
}
