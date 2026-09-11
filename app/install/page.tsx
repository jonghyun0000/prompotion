import type { Metadata } from "next";
import InstallGuide from "@/components/InstallGuide";

export const metadata: Metadata = {
  title: "홈 화면에 추가 — PromPotion",
  description:
    "iPhone Safari와 Android Chrome에서 PromPotion을 홈 화면에 추가하는 방법을 확인하세요.",
};

export default function InstallPage() {
  return <InstallGuide />;
}
