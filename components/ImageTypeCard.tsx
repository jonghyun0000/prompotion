"use client";

import { ArrowRight } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import type { ImageType } from "@/lib/types";

interface ImageTypeCardProps {
  imageType: ImageType;
  optionCount: number;
  onSelect: (imageTypeId: string) => void;
}

/** Page 2 의 이미지 종류 카드. */
export default function ImageTypeCard({
  imageType,
  optionCount,
  onSelect,
}: ImageTypeCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(imageType.id)}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface text-left transition-all duration-200 hover:-translate-y-1 hover:border-ink focus:outline-none focus-visible:border-ink"
    >
      <div className="aspect-4/3 w-full overflow-hidden bg-canvas">
        <ImageWithFallback
          src={imageType.thumbnail}
          alt={imageType.name}
          label={imageType.englishName}
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold text-ink">{imageType.name}</h3>
          <span className="text-xs tracking-wide text-subtle">
            {imageType.englishName}
          </span>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-muted">
          {imageType.description}
        </p>

        <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
          <span className="text-xs text-muted">{optionCount}개의 옵션</span>
          <ArrowRight
            size={16}
            strokeWidth={1.5}
            className="text-subtle transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink"
          />
        </div>
      </div>
    </button>
  );
}
