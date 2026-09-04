# 프롬포션 PromPotion

건축 렌더링 및 이미지 생성형 AI용 프롬프트 조합 플랫폼의 MVP.

긴 프롬프트를 통째로 복사해 고치는 대신, 재질·조명·구도 같은 요소를 Before / After 이미지로
비교하며 하나씩 골라 담고, 마지막에 하나의 프롬프트로 조합해 복사한다.

실제 AI 이미지 생성 API는 연결되어 있지 않다. 샘플 데이터와 플레이스홀더 이미지로
전체 사용자 흐름이 처음부터 끝까지 동작한다.

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
```

프로덕션 빌드는 `npm run build` 후 `npm run start`.

## 사용자 흐름

```
홈  →  이미지 종류 선택  →  프롬프트 구성  →  옵션별 선택(Before/After)  →  구성으로 복귀
                                    ↓ (모든 옵션 선택 시)
                              완성 프롬프트 모달  →  복사
```

## 파일 구조와 역할

### 데이터

| 파일 | 역할 |
|---|---|
| `lib/types.ts` | `ImageType`, `OptionCategory`, `PromptOption`, `SelectionState` 타입 정의. DB 스키마로 그대로 옮길 수 있는 형태 |
| `lib/data.ts` | 샘플 데이터 전체. 이미지 종류 6개, 옵션 카테고리 9개, 프롬프트 옵션 28개 |
| `lib/prompt.ts` | 데이터 조회와 프롬프트 조합 로직. 진행률 계산, 최종 프롬프트 생성이 모두 여기 있다 |

UI에는 프롬프트 문자열이 하드코딩되어 있지 않다. 화면은 `lib/prompt.ts`의 함수만 호출하므로,
데이터를 DB에서 가져오도록 바꾸면 컴포넌트는 수정할 필요가 없다.

### 상태

| 파일 | 역할 |
|---|---|
| `context/SelectionContext.tsx` | 선택 상태를 보관하고 localStorage에 저장·복원. 새로고침해도 선택이 유지된다 |
| `context/ToastContext.tsx` | 화면 하단 알림 표시 상태 |

### 페이지

| 파일 | 화면 |
|---|---|
| `app/page.tsx` | Page 1. 서비스 소개와 3단계 사용법 |
| `app/select/page.tsx` | Page 2. 이미지 종류 선택 (반응형 3 / 2 / 1열) |
| `app/builder/page.tsx` | Page 3. 프롬프트 구성. 진행률, 옵션 목록, 하단 고정 버튼, 결과 모달 |
| `app/builder/[categoryId]/page.tsx` | Page 4. 옵션별 프롬프트 선택. Before / After 비교 |
| `app/layout.tsx` | Provider와 헤더를 감싸는 루트 레이아웃 |
| `app/globals.css` | 디자인 토큰(색, 반경)과 애니메이션 정의 |

### 컴포넌트

| 파일 | 역할 |
|---|---|
| `components/Header.tsx` | 상단 고정 헤더 |
| `components/ProgressNavigation.tsx` | 01 이미지 선택 → 02 프롬프트 구성 → 03 결과 |
| `components/Breadcrumb.tsx` | 투시도 / 재료 / Exposed Concrete 형태의 현재 위치 |
| `components/ImageTypeCard.tsx` | Page 2의 이미지 종류 카드 |
| `components/OptionCategoryCard.tsx` | Page 3의 가로형 옵션 카드. 선택 여부를 체크로 표시 |
| `components/PromptOptionCard.tsx` | Page 4의 핵심 카드. 비교 이미지 + 프롬프트 문구 + 선택 버튼 |
| `components/BeforeAfterViewer.tsx` | 적용 전후 비교. 데스크톱 좌우, 모바일 상하 |
| `components/FinalPromptModal.tsx` | 완성된 프롬프트와 선택 요소 목록 |
| `components/CopyButton.tsx` | Clipboard API 복사. 비보안 컨텍스트에서는 대체 경로 사용 |
| `components/Toast.tsx` | 하단 알림 표시 |
| `components/Button.tsx` | 공용 버튼 (primary / secondary / ghost) |
| `components/ImageWithFallback.tsx` | 이미지 로드 실패 시 플레이스홀더로 대체 |

### 스크립트

| 파일 | 역할 |
|---|---|
| `scripts/generate-placeholders.py` | 플레이스홀더 이미지 62장 생성 (`python3 scripts/generate-placeholders.py`) |
| `scripts/e2e-test.js` | Playwright 기반 전체 플로우 테스트 31개 |

## 이미지 교체

`public/images` 아래에 같은 이름으로 실제 파일을 덮어쓰면 코드 수정 없이 반영된다.

```
public/images/types/{imageTypeId}.jpg                          썸네일
public/images/options/{categoryId}-{optionId}-before.jpg       적용 전
public/images/options/{categoryId}-{optionId}-after.jpg        적용 후
```

예: `public/images/options/material-exposed-concrete-after.jpg`

파일이 없거나 로드에 실패하면 `ImageWithFallback`이 플레이스홀더를 보여주므로
레이아웃이 무너지지 않는다.

## 데이터 추가

`lib/data.ts`만 수정하면 된다.

- **프롬프트 옵션 추가** — 해당 카테고리의 `promptOptions` 배열에 항목 추가
- **카테고리 추가** — `optionCategories`에 추가하고, 쓸 이미지 종류의 `optionCategoryIds`에 id 등록
- **이미지 종류 추가** — `imageTypes`에 추가. 필요한 카테고리 id만 골라 넣으면 옵션 개수는 자동 계산된다

최종 프롬프트의 연결 순서는 각 카테고리의 `order` 값을 따른다.

## 테스트

서버를 3100 포트로 띄운 뒤 실행한다.

```bash
npm run build && npm run start -- -p 3100
node scripts/e2e-test.js
```

검증 항목은 라우팅, 이미지 로드, 선택 상태 반영, 진행률, 버튼 활성 조건,
프롬프트 조합 순서, 클립보드 복사, 새로고침 후 상태 유지, 이미지 종류 변경 시 초기화,
모바일 레이아웃, 잘못된 경로 리다이렉트 등 31개다.

## 다음 단계 (Supabase 연동 시)

`lib/data.ts`의 상수를 DB 조회로 바꾸는 것이 전부다.

- `image_types`, `option_categories`, `prompt_options` 세 테이블이 `lib/types.ts`의 타입과 1:1로 대응한다
- `lib/prompt.ts`의 함수 시그니처를 async로 바꾸고 내부만 교체하면 컴포넌트는 그대로 쓸 수 있다
- 사용자별 저장(즐겨찾기, 내 프롬프트)은 `SelectionState`를 그대로 한 행으로 저장하면 된다

## 배포 (Vercel)

환경변수나 외부 서비스 연결이 없어 별도 설정 없이 배포된다.

1. 이 저장소를 GitHub에 푸시한다
2. Vercel에서 New Project → 저장소 선택
3. 프레임워크는 Next.js로 자동 인식된다. Build Command, Output Directory 모두 기본값 그대로 두면 된다
4. Deploy

이미지는 `public/` 에 포함되어 있어 별도 스토리지 설정이 필요 없다.
DB를 붙이기 전까지는 추가할 환경변수가 없다.

## 기술 스택

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · lucide-react
