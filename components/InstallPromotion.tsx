"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Smartphone } from "lucide-react";
import { useInstall } from "@/context/InstallContext";

export function InstallNavLink() {
  const { installed } = useInstall();
  if (installed) return null;
  return (
    <Link
      href="/install"
      data-install-promotion
      aria-label="홈 화면 추가 안내"
      className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-line px-3 hover:border-ink"
    >
      <Smartphone size={16} aria-hidden="true" />
      <span className="hidden md:inline">홈 화면 추가</span>
    </Link>
  );
}

export default function InstallPromotion() {
  const { installed } = useInstall();
  if (installed) return null;
  return (
    <section
      aria-label="홈 화면에 추가"
      data-install-promotion
      className="mt-8 flex flex-wrap items-center gap-5 rounded-card border border-line bg-surface p-6 sm:p-8"
    >
      <Image
        src="/icons/icon-192.png"
        width={64}
        height={64}
        alt=""
        className="rounded-2xl"
      />
      <div className="min-w-0 flex-1 basis-56">
        <p className="eyebrow">YOUR EVERYDAY DESIGN TOOL</p>
        <h2 className="mt-2 text-lg font-semibold">
          다음 작업은, 홈 화면에서.
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          아이콘 한 번으로 다시 시작하세요. iPhone과 Android 모두 추가할 수
          있어요.
        </p>
      </div>
      <Link
        href="/install"
        className="flex min-h-12 items-center gap-3 rounded-full bg-ink px-5 text-sm font-medium text-white"
      >
        홈 화면에 추가
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </section>
  );
}
