import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <h1 className="text-2xl font-semibold">페이지를 찾을 수 없습니다.</h1>
      <Link href="/select" className="mt-6 inline-block underline">
        이미지 유형 선택으로 돌아가기
      </Link>
    </div>
  );
}
