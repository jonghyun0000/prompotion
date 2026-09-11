import type { ImageType, OptionCategory } from "./types";

/**
 * 샘플 데이터.
 *
 * 이미지 경로 규칙
 *   썸네일        /images/types/{imageTypeId}.jpg
 *   Before/After  /images/options/{categoryId}-{optionId}-before.jpg
 *                 /images/options/{categoryId}-{optionId}-after.jpg
 *
 * public/ 아래 같은 이름의 실제 이미지 파일로 덮어쓰면 코드 수정 없이 그대로 반영된다.
 * 파일이 없거나 로드에 실패하면 ImageWithFallback 이 플레이스홀더를 대신 보여준다.
 */

const img = (categoryId: string, optionId: string) => ({
  beforeImage: `/images/options/${categoryId}-${optionId}-before.jpg`,
  afterImage: `/images/options/${categoryId}-${optionId}-after.jpg`,
});

const legacyCategories: OptionCategory[] = [
  {
    id: "camera",
    name: "카메라 / 구도",
    englishName: "Camera & Composition",
    description: "이미지를 바라보는 시점과 화각을 결정합니다.",
    required: true,
    order: 1,
    promptOptions: [
      {
        id: "eye-level",
        title: "Eye Level",
        description: "사람의 눈높이에서 바라본 자연스러운 시점",
        promptText:
          "eye-level architectural photography, natural human perspective",
        ...img("camera", "eye-level"),
      },
      {
        id: "wide-angle",
        title: "24mm / Wide Angle",
        description: "넓은 화각으로 공간 전체를 담는 구도",
        promptText:
          "wide-angle architectural view, expansive spatial composition",
        ...img("camera", "wide-angle"),
      },
      {
        id: "low-angle",
        title: "Low Angle",
        description: "아래에서 올려다보는 기념비적 시점",
        promptText:
          "low-angle architectural photography, monumental perspective",
        ...img("camera", "low-angle"),
      },
      {
        id: "aerial",
        title: "Aerial View",
        description: "상공에서 대지와 건물을 함께 내려다보는 시점",
        promptText:
          "aerial architectural view, bird's eye perspective over the site",
        ...img("camera", "aerial"),
      },
    ],
  },
  {
    id: "style",
    name: "건축 스타일",
    englishName: "Architecture Style",
    description: "건축물의 형태 언어와 디자인 방향을 결정합니다.",
    required: true,
    order: 2,
    promptOptions: [
      {
        id: "minimalism",
        title: "Minimalism",
        description: "절제된 형태와 기하학적 단순함",
        promptText:
          "minimal contemporary architecture, clean geometric forms, restrained design",
        ...img("style", "minimalism"),
      },
      {
        id: "brutalism",
        title: "Brutalism",
        description: "육중한 콘크리트 매스의 거친 조형",
        promptText:
          "brutalist architecture, massive concrete forms, raw monumental expression",
        ...img("style", "brutalism"),
      },
      {
        id: "modern",
        title: "Modern",
        description: "정돈된 선과 넓은 유리면의 현대 건축",
        promptText:
          "modern architecture, clean lines, large glazing, simple geometric volumes",
        ...img("style", "modern"),
      },
    ],
  },
  {
    id: "material",
    name: "재료",
    englishName: "Material",
    description: "입면을 구성하는 주요 마감 재료를 결정합니다.",
    required: true,
    order: 3,
    promptOptions: [
      {
        id: "exposed-concrete",
        title: "Exposed Concrete",
        description: "노출 콘크리트의 거친 질감과 모노톤 표현",
        promptText:
          "exposed raw concrete facade, subtle concrete texture, minimal material palette",
        ...img("material", "exposed-concrete"),
      },
      {
        id: "red-brick",
        title: "Red Brick",
        description: "붉은 벽돌의 조적 패턴과 따뜻한 색감",
        promptText:
          "red brick facade, detailed brick texture, warm architectural material",
        ...img("material", "red-brick"),
      },
      {
        id: "glass",
        title: "Glass",
        description: "투명한 유리 커튼월과 반사되는 입면",
        promptText:
          "transparent glass curtain wall, reflective glazing, contemporary facade",
        ...img("material", "glass"),
      },
    ],
  },
  {
    id: "lighting",
    name: "조명 / 시간",
    englishName: "Lighting & Time",
    description: "빛의 방향과 시간대가 만드는 분위기를 결정합니다.",
    required: true,
    order: 4,
    promptOptions: [
      {
        id: "golden-hour",
        title: "Golden Hour",
        description: "해질 무렵의 따뜻한 빛과 긴 그림자",
        promptText:
          "warm golden hour sunlight, long soft shadows, cinematic architectural lighting",
        ...img("lighting", "golden-hour"),
      },
      {
        id: "overcast",
        title: "Overcast",
        description: "흐린 날의 부드럽고 균질한 확산광",
        promptText:
          "soft overcast daylight, diffused lighting, neutral architectural atmosphere",
        ...img("lighting", "overcast"),
      },
      {
        id: "night",
        title: "Night",
        description: "실내 조명이 새어 나오는 야경 표현",
        promptText:
          "night architectural photography, interior lights glowing, dramatic exterior lighting",
        ...img("lighting", "night"),
      },
    ],
  },
  {
    id: "environment",
    name: "환경 / 배경",
    englishName: "Environment",
    description: "건축물을 둘러싼 주변 맥락을 결정합니다.",
    required: true,
    order: 5,
    promptOptions: [
      {
        id: "urban",
        title: "Urban",
        description: "밀도 높은 도시 맥락과 가로 환경",
        promptText:
          "dense urban surroundings, contemporary city context, realistic street environment",
        ...img("environment", "urban"),
      },
      {
        id: "nature",
        title: "Forest / Nature",
        description: "수목과 지형이 감싸는 자연 환경",
        promptText:
          "lush natural landscape, trees and vegetation surrounding architecture",
        ...img("environment", "nature"),
      },
      {
        id: "minimal",
        title: "Minimal",
        description: "배경을 비운 단순하고 정돈된 주변",
        promptText:
          "minimal clean background, simplified architectural surroundings",
        ...img("environment", "minimal"),
      },
    ],
  },
  {
    id: "rendering",
    name: "렌더링 스타일",
    englishName: "Rendering Style",
    description: "최종 이미지의 완성 방식과 표현 밀도를 결정합니다.",
    required: true,
    order: 6,
    promptOptions: [
      {
        id: "photorealistic",
        title: "Photorealistic",
        description: "사진에 가까운 사실적 재질과 높은 디테일",
        promptText:
          "photorealistic architectural visualization, realistic materials, high detail",
        ...img("rendering", "photorealistic"),
      },
      {
        id: "competition",
        title: "Competition Render",
        description: "공모전 이미지 특유의 분위기 있는 연출",
        promptText:
          "architectural competition visualization, atmospheric rendering, sophisticated composition",
        ...img("rendering", "competition"),
      },
      {
        id: "conceptual",
        title: "Conceptual",
        description: "디테일을 덜어낸 개념 중심의 표현",
        promptText:
          "conceptual architectural visualization, artistic atmosphere, simplified realistic detail",
        ...img("rendering", "conceptual"),
      },
    ],
  },
  {
    id: "diagram-type",
    name: "다이어그램 유형",
    englishName: "Diagram Type",
    description: "다이어그램이 설명하려는 내용을 결정합니다.",
    required: true,
    order: 7,
    promptOptions: [
      {
        id: "program",
        title: "Program Diagram",
        description: "용도별 영역 구성을 색으로 구분한 표현",
        promptText:
          "architectural program diagram, color-coded functional zones, clear spatial hierarchy",
        ...img("diagram-type", "program"),
      },
      {
        id: "circulation",
        title: "Circulation Diagram",
        description: "동선의 흐름을 화살표와 선으로 설명",
        promptText:
          "architectural circulation diagram, movement flow arrows, clear path hierarchy",
        ...img("diagram-type", "circulation"),
      },
      {
        id: "massing",
        title: "Massing Diagram",
        description: "매스의 변형 과정을 단계별로 보여주는 표현",
        promptText:
          "architectural massing diagram, step-by-step volume transformation, simplified blocks",
        ...img("diagram-type", "massing"),
      },
    ],
  },
  {
    id: "linework",
    name: "표현 기법",
    englishName: "Linework",
    description: "선과 면을 다루는 도면 표현 방식을 결정합니다.",
    required: true,
    order: 8,
    promptOptions: [
      {
        id: "axonometric",
        title: "Axonometric Line",
        description: "정밀한 선으로 구성한 액소노메트릭 도면",
        promptText:
          "axonometric line drawing, precise technical linework, architectural drafting style",
        ...img("linework", "axonometric"),
      },
      {
        id: "flat-vector",
        title: "Flat Vector",
        description: "면 중심의 평면적인 벡터 그래픽",
        promptText:
          "flat vector architectural illustration, clean filled shapes, graphic presentation style",
        ...img("linework", "flat-vector"),
      },
      {
        id: "hand-drawn",
        title: "Hand-drawn",
        description: "손으로 그린 듯한 스케치 질감",
        promptText:
          "hand-drawn architectural sketch, loose ink linework, analog drawing texture",
        ...img("linework", "hand-drawn"),
      },
    ],
  },
  {
    id: "color-scheme",
    name: "색채",
    englishName: "Color Scheme",
    description: "이미지 전체의 색 구성을 결정합니다.",
    required: true,
    order: 9,
    promptOptions: [
      {
        id: "monochrome",
        title: "Monochrome",
        description: "무채색 위주의 절제된 색 구성",
        promptText:
          "monochrome color scheme, grayscale architectural presentation, restrained palette",
        ...img("color-scheme", "monochrome"),
      },
      {
        id: "muted-pastel",
        title: "Muted Pastel",
        description: "채도를 낮춘 부드러운 파스텔 색조",
        promptText:
          "muted pastel color palette, soft desaturated tones, calm presentation style",
        ...img("color-scheme", "muted-pastel"),
      },
      {
        id: "high-contrast",
        title: "High Contrast",
        description: "명암 대비가 강한 선명한 색 구성",
        promptText:
          "high contrast color scheme, bold accent colors, striking graphic presentation",
        ...img("color-scheme", "high-contrast"),
      },
    ],
  },
];

export const imageTypes: ImageType[] = [
  {
    id: "perspective",
    name: "투시도",
    englishName: "Perspective Rendering",
    description: "건축물의 공간감과 시점을 표현하는 건축 렌더링",
    thumbnail: "/images/types/perspective.jpg",
    optionCategoryIds: [
      "camera",
      "style",
      "material",
      "lighting",
      "environment",
      "rendering",
    ],
  },
  {
    id: "aerial",
    name: "조감도",
    englishName: "Aerial View",
    description: "건축물과 주변 대지를 위에서 바라보는 조감 이미지",
    thumbnail: "/images/types/aerial.jpg",
    optionCategoryIds: [
      "camera",
      "style",
      "material",
      "lighting",
      "environment",
      "rendering",
    ],
  },
  {
    id: "section",
    name: "단면 투시도",
    englishName: "Section Perspective",
    description: "건축물 내부 공간과 단면 구조를 입체적으로 보여주는 이미지",
    thumbnail: "/images/types/section.jpg",
    optionCategoryIds: [
      "camera",
      "style",
      "material",
      "lighting",
      "environment",
      "rendering",
    ],
  },
  {
    id: "site-plan",
    name: "배치도",
    englishName: "Site Plan",
    description: "건물과 대지, 주변 환경의 관계를 표현하는 이미지",
    thumbnail: "/images/types/site-plan.jpg",
    optionCategoryIds: ["linework", "color-scheme", "environment", "rendering"],
  },
  {
    id: "diagram",
    name: "다이어그램",
    englishName: "Architectural Diagram",
    description: "프로그램, 동선, 매스, 개념 등을 시각적으로 설명하는 이미지",
    thumbnail: "/images/types/diagram.jpg",
    optionCategoryIds: [
      "diagram-type",
      "linework",
      "color-scheme",
      "rendering",
    ],
  },
  {
    id: "concept",
    name: "컨셉 이미지",
    englishName: "Concept Image",
    description: "건축 프로젝트의 분위기와 핵심 개념을 표현하는 이미지",
    thumbnail: "/images/types/concept.jpg",
    optionCategoryIds: [
      "style",
      "material",
      "lighting",
      "environment",
      "rendering",
    ],
  },
];

const extra = (
  id: string,
  title: string,
  description: string,
  promptText: string,
) => ({
  id,
  title,
  description,
  promptText,
  beforeImage: "/images/elements/baseline.webp",
  afterImage: "",
  tags: ["architecture"],
  recommended: false,
});
const additions: Record<string, ReturnType<typeof extra>[]> = {
  material: [
    extra(
      "wood",
      "Wood",
      "수직 목재 패널의 따뜻한 결",
      "natural timber cladding",
    ),
    extra(
      "stone",
      "Stone",
      "천연 석재의 차분한 질감과 줄눈",
      "natural limestone facade",
    ),
    extra(
      "metal",
      "Metal",
      "금속 패널의 정교한 선과 은은한 반사",
      "brushed zinc metal cladding",
    ),
  ],
  camera: [
    extra(
      "35mm",
      "35mm Lens",
      "공간과 건물의 균형을 잡는 표준 광각",
      "35mm lens, balanced architectural perspective",
    ),
    extra(
      "50mm",
      "50mm Lens",
      "원근 왜곡을 줄이고 입면에 집중",
      "50mm lens, restrained perspective",
    ),
  ],
  lighting: [
    extra(
      "daylight",
      "Daylight",
      "재료의 색이 선명하게 보이는 낮의 빛",
      "natural daylight",
    ),
    extra(
      "dramatic",
      "Dramatic Light",
      "강한 방향성과 깊은 그림자로 강조한 형태",
      "dramatic directional light, deep architectural shadows",
    ),
    extra(
      "soft-light",
      "Soft Light",
      "밝고 부드러운 빛으로 드러나는 표면",
      "soft luminous daylight, gentle shadows",
    ),
  ],
  environment: [
    extra(
      "waterfront",
      "Waterfront",
      "잔잔한 물가와 이어지는 열린 풍경",
      "waterfront setting beside a calm lake",
    ),
    extra(
      "residential",
      "Residential",
      "낮은 주택과 정원이 이어지는 주거 지역",
      "quiet residential neighborhood",
    ),
    extra(
      "commercial",
      "Commercial",
      "오피스와 광장으로 둘러싸인 상업 지역",
      "commercial district with offices and a public plaza",
    ),
  ],
  atmosphere: [
    extra(
      "minimal",
      "Minimal",
      "주변 요소를 덜어낸 절제된 분위기",
      "restrained minimal atmosphere",
    ),
    extra(
      "dramatic",
      "Dramatic",
      "깊은 명암 대비가 만드는 긴장감",
      "dramatic atmosphere",
    ),
  ],
  rendering: [
    extra(
      "editorial",
      "Editorial",
      "건축 잡지처럼 절제된 색과 사진의 질감",
      "editorial architectural photography",
    ),
    extra(
      "cinematic",
      "Cinematic",
      "영화처럼 깊은 명암과 색감",
      "cinematic architectural photography",
    ),
  ],
};
const promptOrder: Record<string, number> = {
  material: 10,
  environment: 20,
  lighting: 30,
  camera: 40,
  "diagram-type": 45,
  atmosphere: 50,
  style: 60,
  rendering: 70,
  linework: 80,
  "color-scheme": 90,
};
// Keep existing IDs and specialized diagram categories, so saved selections remain compatible.
for (const type of imageTypes) {
  if (["perspective", "aerial", "section", "concept"].includes(type.id))
    type.optionCategoryIds.push("atmosphere");
  type.thumbnail = `/images/types/${type.id}.webp`;
}
export const optionCategories: OptionCategory[] = [
  ...legacyCategories,
  {
    id: "atmosphere",
    name: "분위기",
    englishName: "Atmosphere / Mood",
    description: "이미지에서 느껴지는 감정과 공기의 밀도를 선택합니다.",
    required: false,
    order: 50,
    promptOptions: [
      extra(
        "calm",
        "Calm",
        "차분하고 고요한 공간의 분위기",
        "calm serene atmosphere",
      ),
      extra(
        "cinematic",
        "Cinematic",
        "깊은 명암과 영화 같은 색감",
        "cinematic atmosphere",
      ),
      extra(
        "foggy",
        "Foggy",
        "옅은 안개로 부드러워진 공간의 깊이",
        "gentle atmospheric fog",
      ),
    ],
  },
].map((category) => ({
  ...category,
  required: false,
  order: promptOrder[category.id] ?? 100,
  promptOptions: [
    ...category.promptOptions,
    ...(additions[category.id] ?? []),
  ].map((option) => ({
    ...option,
    category: category.id,
    title:
      category.id === "lighting" && option.id === "golden-hour"
        ? "Warm Sunset"
        : option.title,
    beforeImage: "/images/elements/baseline.webp",
    afterImage: `/images/elements/${category.id}-${option.id}.webp`,
    previewImage: `/images/elements/${category.id}-${option.id}.webp`,
    tags: ["architecture", category.id],
    recommended: ["golden-hour", "exposed-concrete", "35mm"].includes(
      option.id,
    ),
    compatibleTypes: imageTypes
      .filter(
        (type) =>
          type.optionCategoryIds.includes(category.id) &&
          !(
            category.id === "camera" &&
            type.id === "aerial" &&
            ["eye-level", "low-angle"].includes(option.id)
          ) &&
          !(
            category.id === "camera" &&
            type.id === "perspective" &&
            option.id === "aerial"
          ),
      )
      .map((type) => type.id),
  })),
}));
