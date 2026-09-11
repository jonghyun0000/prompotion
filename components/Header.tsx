"use client";

import Link from "next/link";
import { InstallNavLink } from "./InstallPromotion";

/** 모든 페이지 상단에 고정되는 얇은 헤더. */
export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="text-base font-semibold tracking-tight text-ink">
            PromPotion
          </span>
          <span className="hidden text-xs tracking-wide text-subtle lg:inline">
            프롬포션
          </span>
        </Link>
        <nav
          aria-label="주요 메뉴"
          className="flex shrink-0 items-center gap-3 text-xs sm:gap-5"
        >
          <Link href="/select" className="py-3" aria-label="프롬프트 만들기">
            <span className="sm:hidden">만들기</span>
            <span className="hidden sm:inline">프롬프트 만들기</span>
          </Link>
          <Link href="/saved" className="py-3" aria-label="내 프롬프트">
            <span className="sm:hidden">보관함</span>
            <span className="hidden sm:inline">내 프롬프트</span>
          </Link>
          <InstallNavLink />
        </nav>
      </div>
    </header>
  );
}
