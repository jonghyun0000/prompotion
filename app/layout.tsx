import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Analytics from "@/components/Analytics";
import { SelectionProvider } from "@/context/SelectionContext";
import { ToastProvider } from "@/context/ToastContext";
import { InstallProvider } from "@/context/InstallContext";

export const viewport: Viewport = {
  themeColor: "#f7f7f5",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://prompotion.vercel.app"),
  applicationName: "PromPotion",
  appleWebApp: {
    capable: true,
    title: "PromPotion",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/icons/prompotion.svg", type: "image/svg+xml" }],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  title: "PromPotion — Visual Prompt Builder for Architecture",
  description:
    "Choose visual prompt elements, compare results, and build architectural AI prompts visually.",
  openGraph: {
    title: "프롬포션 PromPotion",
    description:
      "이미지 종류를 고르고 Before / After 를 비교하며 필요한 프롬프트 요소만 골라 하나의 프롬프트로 조합합니다.",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/elements/lighting-golden-hour.webp",
        width: 960,
        height: 720,
        alt: "PromPotion architectural lighting preview",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-canvas text-ink antialiased">
        <SelectionProvider>
          <ToastProvider>
            <InstallProvider>
              <a href="#main" className="skip-link">
                본문으로 건너뛰기
              </a>
              <Header />
              <Analytics />
              <main id="main">{children}</main>
            </InstallProvider>
          </ToastProvider>
        </SelectionProvider>
      </body>
    </html>
  );
}
