"use client";

import ImageWithFallback from "./ImageWithFallback";

interface BeforeAfterViewerProps {
  beforeImage: string;
  afterImage: string;
  title: string;
}

/**
 * 프롬프트 적용 전후를 나란히 보여준다.
 * 데스크톱에서는 좌우, 모바일에서는 위아래로 배치된다.
 *
 * 슬라이더 비교 방식으로 바꾸고 싶다면 이 컴포넌트만 교체하면 된다.
 */
export default function BeforeAfterViewer({
  beforeImage,
  afterImage,
  title,
}: BeforeAfterViewerProps) {
  const panes = [
    { key: "before", label: "BEFORE", src: beforeImage, emphasis: false },
    { key: "after", label: "AFTER", src: afterImage, emphasis: true },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {panes.map((pane) => (
        <figure key={pane.key} className="flex flex-col gap-2">
          <div
            className={[
              "relative aspect-4/3 w-full overflow-hidden rounded-[10px] border bg-canvas",
              pane.emphasis ? "border-ink" : "border-line",
            ].join(" ")}
          >
            <ImageWithFallback
              src={pane.src}
              alt={`${title} ${pane.label}`}
              label={`${pane.label} 이미지 없음`}
              className="h-full w-full"
            />
            <figcaption
              className={[
                "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.1em]",
                pane.emphasis
                  ? "bg-ink text-white"
                  : "bg-surface/90 text-muted",
              ].join(" ")}
            >
              {pane.label}
            </figcaption>
          </div>
        </figure>
      ))}
    </div>
  );
}
