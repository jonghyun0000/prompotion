import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { SelectionProvider } from "@/context/SelectionContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "프롬포션 PromPotion — 건축 렌더링 프롬프트 조합",
  description:
    "이미지 종류를 고르고 Before / After 를 비교하며 필요한 프롬프트 요소만 골라 하나의 프롬프트로 조합합니다.",
  openGraph: {
    title: "프롬포션 PromPotion",
    description:
      "이미지 종류를 고르고 Before / After 를 비교하며 필요한 프롬프트 요소만 골라 하나의 프롬프트로 조합합니다.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-canvas text-ink antialiased">
        <SelectionProvider>
          <ToastProvider>
            <Header />
            <main>{children}</main>
          </ToastProvider>
        </SelectionProvider>
      </body>
    </html>
  );
}
