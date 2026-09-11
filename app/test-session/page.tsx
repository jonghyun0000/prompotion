"use client";
import { useRouter } from "next/navigation";
import { startTestTask, exportEvents } from "@/lib/analytics";
import { useSelection } from "@/context/SelectionContext";
import Button from "@/components/Button";
export default function TestSession() {
  const router = useRouter();
  const { reset } = useSelection();
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="eyebrow">USER TEST · 01</p>
      <h1 className="mt-3 text-3xl font-semibold">따뜻한 저녁의 주거 건축물</h1>
      <p className="my-6 leading-7">
        주거 건축물의 따뜻한 저녁 분위기 렌더링 프롬프트를 만들고 복사해보세요.
        정답은 없습니다. 원하는 재료와 시점을 자유롭게 골라주세요.
      </p>
      <p className="mb-6 text-sm leading-6 text-muted">
        시작·선택·생성·복사 시점과 요소 수를 익명 세션으로 이 브라우저에
        기록합니다. 이름이나 연락처는 수집하지 않으며 자동으로 전송하지
        않습니다. 완료 후 이 화면에서 기록을 내려받아 진행자에게 전달해주세요.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => {
            reset();
            startTestTask();
            router.push("/select");
          }}
        >
          과제 시작
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const url = URL.createObjectURL(
              new Blob(
                [
                  JSON.stringify(
                    { schemaVersion: 1, events: exportEvents() },
                    null,
                    2,
                  ),
                ],
                { type: "application/json" },
              ),
            );
            const link = document.createElement("a");
            link.href = url;
            link.download = "prompotion-test-events.json";
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }}
        >
          테스트 기록 내보내기
        </Button>
      </div>
    </div>
  );
}
