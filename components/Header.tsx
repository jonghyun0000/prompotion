"use client";

import Link from "next/link";

/** 모든 페이지 상단에 고정되는 얇은 헤더. */
export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="text-base font-semibold tracking-tight text-ink">
            PromPotion
          </span>
          <span className="text-xs tracking-wide text-subtle">프롬포션</span>
        </Link>
        <nav
          aria-label="주요 메뉴"
          className="flex items-center gap-4 text-xs sm:gap-6"
        >
          <Link href="/select" className="py-3">
            프롬프트 만들기
          </Link>
          <Link href="/saved" className="py-3">
            내 프롬프트
          </Link>
        </nav>
      </div>
    </header>
  );
}
