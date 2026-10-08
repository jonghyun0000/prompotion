import type { Metadata } from "next";
import DreamHomeBuilder from "@/components/DreamHomeBuilder";

export const metadata: Metadata = {
  title: "내가 원하는 집 만들기 | PromPotion",
  description:
    "주택과 아파트, 방과 욕실 수, 마당, 분위기와 바닥 색상을 골라 외관·거실·침실·개념 평면을 담는 통합 건축 보드 프롬프트를 만들어보세요.",
  openGraph: {
    title: "내가 원하는 집 만들기 | PromPotion",
    description: "질문에 답하고 외관·거실·침실·개념 평면을 담는 하나의 Architectural Presentation Board 프롬프트를 만들어보세요.",
    url: "/dream-home",
    locale: "ko_KR",
    type: "website",
  },
};

export default function DreamHomePage() {
  return <DreamHomeBuilder />;
}
