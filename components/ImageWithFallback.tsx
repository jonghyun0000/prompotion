"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  /** 이미지가 없을 때 플레이스홀더에 표시할 짧은 라벨 */
  label?: string;
  className?: string;
}

/**
 * 이미지 로드에 실패하면 깔끔한 플레이스홀더로 대체한다.
 * public/ 아래에 실제 파일을 넣기 전에도 레이아웃이 무너지지 않는다.
 *
 * next/image 대신 일반 img 를 쓰는 이유:
 * 나중에 외부 URL(사용자 업로드, CDN)로 교체할 때 도메인 설정이 필요 없기 때문이다.
 */
export default function ImageWithFallback({
  src,
  alt,
  label,
  className = "",
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const [renderedSrc, setRenderedSrc] = useState(src);

  // src 가 바뀌면 실패 상태를 초기화한다.
  // effect 대신 렌더 중에 조정하는 방식이라 실패한 이미지가 한 프레임 보이지 않는다.
  if (src !== renderedSrc) {
    setRenderedSrc(src);
    setFailed(false);
  }

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-canvas text-subtle ${className}`}
        aria-label={alt}
      >
        <ImageOff size={20} strokeWidth={1.5} />
        {label ? (
          <span className="px-3 text-center text-xs">{label}</span>
        ) : null}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={800}
      height={600}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
