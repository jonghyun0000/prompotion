"use client";

import { Copy } from "lucide-react";
import Button from "./Button";
import { useToast } from "@/context/ToastContext";

/** 클립보드 복사 버튼. Clipboard API 를 쓸 수 없는 환경에서는 대체 방식으로 복사한다. */
export default function CopyButton({ text }: { text: string }) {
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // http 로 접속했거나 권한이 없을 때의 대체 경로
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      showToast("프롬프트가 복사되었습니다.");
    } catch {
      showToast("복사에 실패했습니다. 직접 선택해 복사해주세요.");
    }
  };

  return (
    <Button onClick={handleCopy} size="lg" className="w-full sm:w-auto">
      <Copy size={16} strokeWidth={1.75} />
      프롬프트 복사
    </Button>
  );
}
