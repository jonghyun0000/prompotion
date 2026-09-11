"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Ellipsis,
  EllipsisVertical,
  PlusSquare,
  Share,
  Smartphone,
} from "lucide-react";
import { useInstall } from "@/context/InstallContext";
import { APP_URL, detectPlatform } from "@/lib/install";
import { trackEvent } from "@/lib/analytics";

const guides = {
  ios: [
    {
      title: "Safari에서 공유 메뉴 열기",
      description:
        "Safari로 PromPotion에 접속한 뒤 공유 버튼을 누르세요. 더 보기(···) 안에 공유가 있는 화면도 있어요.",
      icon: Share,
      label: "공유",
    },
    {
      title: "‘홈 화면에 추가’ 선택",
      description:
        "공유 목록을 아래로 내려 홈 화면에 추가를 찾으세요. 보이지 않으면 목록 맨 아래의 동작 편집에서 추가할 수 있어요.",
      icon: PlusSquare,
      label: "홈 화면에 추가",
    },
    {
      title: "이름을 확인하고 추가",
      description:
        "PromPotion 아이콘과 이름을 확인하세요. ‘웹 앱으로 열기’가 보이면 켜고, 추가를 누르면 끝이에요.",
      icon: Check,
      label: "추가",
    },
  ],
  android: [
    {
      title: "Chrome에서 메뉴 열기",
      description:
        "Chrome으로 PromPotion에 접속한 뒤 주소창 옆 더보기(⋮)를 누르세요.",
      icon: EllipsisVertical,
      label: "더보기",
    },
    {
      title: "설치 메뉴 선택",
      description:
        "‘설치 및 바로가기 만들기’를 누르세요. Chrome 버전에 따라 ‘홈 화면에 추가’ 또는 ‘앱 설치’로 보일 수 있어요.",
      icon: Download,
      label: "설치 및 바로가기 만들기",
    },
    {
      title: "설치 또는 추가 확인",
      description:
        "PromPotion 이름과 아이콘을 확인하고 설치를 누르세요. 추가 확인창이 나타나면 화면 안내에 따라 마무리하세요.",
      icon: Check,
      label: "설치",
    },
  ],
};

export default function InstallGuide() {
  const {
    platform,
    inAppBrowser,
    installed,
    canInstall,
    installing,
    requestInstall,
  } = useInstall();
  const [chosen, setChosen] = useState<"ios" | "android" | null>(null);
  const selected = chosen || (platform === "android" ? "android" : "ios");
  const [status, setStatus] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const urlRef = useRef<HTMLInputElement>(null);
  const viewed = useRef(false);

  useEffect(() => {
    if (!viewed.current) {
      viewed.current = true;
      // Read on the client so the SSR fallback does not mislabel a mobile visit.
      trackEvent("install_guide_viewed", {
        platform: detectPlatform(navigator.userAgent, navigator.maxTouchPoints),
      });
    }
  }, []);

  const install = async () => {
    const outcome = await requestInstall();
    setStatus(
      {
        accepted:
          "설치 요청을 보냈어요. 홈 화면의 PromPotion 아이콘을 확인해주세요.",
        dismissed:
          "지금은 추가하지 않았어요. 언제든 아래 메뉴 순서로 다시 추가할 수 있어요.",
        unavailable: "이 브라우저에서는 아래 메뉴 순서로 추가해주세요.",
        failed: "설치창을 열지 못했어요. 아래 메뉴 순서로 직접 추가해주세요.",
      }[outcome],
    );
  };

  const copyAddress = async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(APP_URL);
      copied = true;
    } catch {
      urlRef.current?.focus();
      urlRef.current?.select();
      try {
        copied = document.execCommand("copy");
      } catch {}
    }
    setCopyStatus(
      copied
        ? "주소를 복사했어요. Safari 또는 Chrome 주소창에 붙여넣으세요."
        : "주소를 길게 눌러 직접 복사해주세요.",
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16 sm:px-8">
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-muted"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        PromPotion으로 돌아가기
      </Link>
      <section className="grid items-center gap-8 border-b border-line py-8 sm:py-12 md:grid-cols-[1fr_200px]">
        <div>
          <p className="eyebrow">ONE TAP, BACK TO CREATING</p>
          <h1 className="mt-3 text-3xl font-semibold leading-snug tracking-tight sm:text-4xl">
            PromPotion을
            <br />홈 화면에 담아두세요.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-muted">
            주소를 다시 찾을 필요 없이, 아이콘 한 번으로.
            <br />
            앱스토어 다운로드 없이 쓰는 나만의 건축 프롬프트 도구예요.
          </p>
          <p className="mt-3 text-xs text-muted">
            추가하지 않아도 모든 기능을 사용할 수 있어요.
          </p>
        </div>
        <figure className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 md:flex-col md:py-8">
          <Image
            src="/icons/icon-192.png"
            width={88}
            height={88}
            priority
            alt="검은 바탕에 요소를 조합한 흰색 P 모양의 PromPotion 앱 아이콘"
            className="rounded-[22px]"
          />
          <figcaption>
            <p className="text-sm font-medium">PromPotion</p>
            <p className="mt-1 text-[11px] text-muted">
              홈 화면 아이콘 미리보기
            </p>
          </figcaption>
        </figure>
      </section>

      {installed ? (
        <section
          className="mt-8 rounded-card border border-line bg-surface p-6"
          aria-label="홈 화면 앱 상태"
        >
          <p className="flex items-center gap-2 font-medium">
            <Check size={18} />
            앱으로 사용할 준비가 되었어요.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">
            다음에는 홈 화면의 PromPotion 아이콘으로 열어주세요.
          </p>
          <Link
            href="/select"
            className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm text-white"
          >
            프롬프트 만들기
            <ArrowUpRight size={16} />
          </Link>
        </section>
      ) : (
        <section className="pt-8" aria-label="기기별 홈 화면 추가 방법">
          {inAppBrowser && (
            <div
              role="note"
              className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-ink"
            >
              <strong>먼저 외부 브라우저에서 열어주세요.</strong>
              <br />
              카카오톡·인스타그램 등의 내부 브라우저에서는 추가 메뉴가 없을 수
              있어요. 앱 메뉴의 ‘다른 브라우저로 열기’를 이용하거나, 아래 주소를
              복사해 iPhone은 Safari, Android는 Chrome에서 열어주세요.
            </div>
          )}
          {platform === "desktop" && (
            <p className="mb-5 text-sm leading-6 text-muted">
              컴퓨터에서 보고 계시네요. 휴대폰에서 이 사이트를 연 뒤, 아래에서
              기기를 골라 따라 해보세요.
            </p>
          )}
          <div
            className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-[#eaeae6] p-1.5"
            aria-label="안내 기기 선택"
          >
            {(["ios", "android"] as const).map((device) => (
              <button
                key={device}
                aria-pressed={selected === device}
                onClick={() => setChosen(device)}
                className={
                  "min-h-12 rounded-full px-3 text-sm font-medium " +
                  (selected === device
                    ? "bg-ink text-white"
                    : "text-muted hover:text-ink")
                }
              >
                {device === "ios" ? "iPhone · Safari" : "Android · Chrome"}
              </button>
            ))}
          </div>

          {selected === "android" &&
            platform === "android" &&
            canInstall &&
            !inAppBrowser && (
              <div className="mb-6 rounded-card border border-line bg-surface p-5">
                <button
                  disabled={installing}
                  onClick={install}
                  className="flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white disabled:opacity-50"
                >
                  <Download size={17} />
                  {installing ? "설치창 확인 중…" : "PromPotion 설치하기"}
                </button>
                <p className="mt-3 text-xs leading-6 text-muted">
                  버튼을 누르면 Chrome의 설치 확인창이 열려요. 메뉴로 직접
                  추가해도 괜찮아요.
                </p>
              </div>
            )}
          {installing && (
            <p role="status" className="mb-4 text-sm">
              브라우저의 설치 확인창에서 계속 진행해주세요.
            </p>
          )}
          {status && (
            <p role="status" className="mb-5 text-sm leading-6">
              {status}
            </p>
          )}

          <ol
            className="grid gap-4 md:grid-cols-3"
            aria-label={
              selected === "ios" ? "iPhone 추가 순서" : "Android 추가 순서"
            }
          >
            {guides[selected].map((step, index) => (
              <li
                key={selected + index}
                className="flex flex-col rounded-card border border-line bg-surface p-5 sm:p-6"
              >
                <span className="eyebrow">STEP 0{index + 1}</span>
                <div
                  aria-hidden="true"
                  className="my-5 flex min-h-24 items-center justify-center rounded-xl bg-canvas px-3"
                >
                  {index === 2 ? (
                    <div className="flex items-center gap-3">
                      <Image
                        src="/icons/icon-192.png"
                        width={40}
                        height={40}
                        alt=""
                        className="rounded-[10px]"
                      />
                      <div>
                        <p className="text-xs font-medium">PromPotion</p>
                        <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                          <step.icon size={12} />
                          {step.label}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-3 text-xs">
                      <step.icon size={18} />
                      {step.label}
                      {selected === "ios" && index === 0 && (
                        <Ellipsis size={14} className="ml-3 text-muted" />
                      )}
                    </div>
                  )}
                </div>
                <h2 className="text-base font-semibold">{step.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs leading-6 text-muted">
            위 그림은 설명용이에요. 운영체제·브라우저 버전과 메뉴 설정에 따라
            위치와 이름이 조금 다를 수 있어요.
          </p>
          <p className="mt-2 text-xs text-muted">
            공식 안내:{" "}
            <a
              className="underline underline-offset-4"
              href={
                selected === "ios"
                  ? "https://support.apple.com/ko-kr/guide/iphone/iph42ab2f3a7/ios"
                  : "https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=ko"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {selected === "ios"
                ? "Apple Safari 도움말"
                : "Google Chrome 도움말"}{" "}
              ↗
            </a>
          </p>
        </section>
      )}

      <section
        className="mt-8 rounded-card border border-line p-5 sm:p-6"
        aria-label="사이트 주소 복사"
      >
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Smartphone size={16} />
          휴대폰 브라우저에서 열 주소
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            ref={urlRef}
            readOnly
            aria-label="PromPotion 사이트 주소"
            value={APP_URL}
            className="min-h-12 min-w-0 flex-1 basis-52 rounded-lg border border-line bg-surface px-3 text-sm"
          />
          <button
            onClick={copyAddress}
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-4 text-sm"
          >
            <Copy size={15} />
            주소 복사
          </button>
        </div>
        {copyStatus && (
          <p role="status" className="mt-3 text-sm leading-6">
            {copyStatus}
          </p>
        )}
      </section>
      <details className="mt-6 border-b border-line pb-6 text-sm">
        <summary className="min-h-11 py-3 font-medium">
          추가 전에 알아두세요
        </summary>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-6 text-muted">
          <li>
            별도 앱스토어 앱이 아닌 웹 앱이에요. 인터넷 연결이 필요합니다.
          </li>
          <li>
            저장한 프롬프트는 사용한 브라우저·웹 앱에만 보관돼요. 다른
            브라우저나 기기와 자동 동기화되지 않으므로 중요한 프롬프트는 따로
            복사해두세요.
          </li>
          <li>
            이미지를 직접 생성하는 앱은 아니에요. 조합한 프롬프트를 이미지 생성
            AI에서 사용하세요.
          </li>
          <li>
            추가 메뉴가 보이지 않으면 일반 Safari 또는 Chrome 탭에서 다시
            열어주세요. 설치 버튼이 없어도 위 메뉴 순서로 추가할 수 있어요.
          </li>
        </ul>
      </details>
    </div>
  );
}
