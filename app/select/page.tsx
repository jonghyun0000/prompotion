"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import ImageTypeCard from "@/components/ImageTypeCard";
import ProgressNavigation from "@/components/ProgressNavigation";
import { imageTypes } from "@/lib/data";
import { getCategoriesForImageType } from "@/lib/prompt";
import { useSelection } from "@/context/SelectionContext";

/** Page 2 — 이미지 종류 선택 */
export default function ImageTypePage() {
  const router = useRouter();
  const { selectImageType } = useSelection();

  const handleSelect = (imageTypeId: string) => {
    selectImageType(imageTypeId);
    router.push("/builder");
  };

  return (
    <div className="animate-fade-in mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <div className="flex flex-col gap-6 py-8 sm:py-12">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            처음으로
          </Link>
          <ProgressNavigation current="image" />
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            어떤 이미지를 만들고 싶나요?
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            이미지 종류를 선택하면 해당 이미지에 필요한 프롬프트 옵션을 구성할
            수 있습니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {imageTypes.map((imageType) => (
          <ImageTypeCard
            key={imageType.id}
            imageType={imageType}
            optionCount={getCategoriesForImageType(imageType.id).length}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
