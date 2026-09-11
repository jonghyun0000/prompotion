"use client";

/**
 * 현재 위치를 알려주는 경로 표시.
 * 예: 투시도 / 재료 / Exposed Concrete
 */
export default function Breadcrumb({
  items,
}: {
  items: (string | undefined)[];
}) {
  const visible = items.filter((item): item is string => Boolean(item));
  if (visible.length === 0) return null;

  return (
    <p className="text-xs text-muted sm:text-sm">
      {visible.map((item, i) => (
        <span key={`${item}-${i}`}>
          {i > 0 ? <span className="mx-2 text-subtle">/</span> : null}
          <span className={i === visible.length - 1 ? "text-ink" : undefined}>
            {item}
          </span>
        </span>
      ))}
    </p>
  );
}
