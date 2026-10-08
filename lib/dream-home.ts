/** A consumer's visual home brief, not a verified architectural floor plan. */
export type DreamHomeBrief = {
  homeType: "detached" | "apartment" | "townhouse";
  area: "compact" | "medium" | "large" | "unsure";
  bedrooms: number;
  bathrooms: number;
  floors: "single" | "two" | "three";
  outdoor: "none" | "garden" | "balcony" | "terrace";
  living: "open" | "separate";
  mood: "warm" | "minimal" | "natural" | "classic";
  floorMaterial: "vinyl" | "wood" | "tile";
  floorColor: "light-oak" | "warm-oak" | "walnut" | "ivory" | "gray";
  wallColor: "warm-white" | "white" | "beige" | "sage";
  lighting: "daylight" | "sunset" | "soft-evening";
  priorities: string[];
};

export type HomeScene = "living" | "exterior" | "bedroom";
export type DreamHomeOption = {
  id: string;
  label: string;
  description: string;
  swatch?: string;
};
type ChoiceField = Exclude<keyof DreamHomeBrief, "bedrooms" | "bathrooms" | "priorities">;

export const DREAM_HOME_OPTIONS: Record<ChoiceField | "priorities", DreamHomeOption[]> = {
  homeType: [
    { id: "detached", label: "단독주택", description: "독립된 한 채의 집을 상상해요." },
    { id: "apartment", label: "아파트", description: "공동주택 안의 한 세대를 꾸며요." },
    { id: "townhouse", label: "타운하우스", description: "옆집과 나란히 이어진 주택을 상상해요." },
  ],
  area: [
    { id: "compact", label: "아담하게", description: "필요한 공간을 알차게 구성해요. 면적을 확정하지 않아요." },
    { id: "medium", label: "적당히 여유롭게", description: "생활 공간과 수납의 균형을 생각해요." },
    { id: "large", label: "넉넉하게", description: "여유로운 공간감을 원해요. 정확한 평수는 별도 검토해요." },
    { id: "unsure", label: "아직 모르겠어요", description: "면적을 정하지 않고 취향부터 살펴봐요." },
  ],
  floors: [
    { id: "single", label: "한 층", description: "계단 없이 한 층에서 생활하는 구성이에요." },
    { id: "two", label: "두 층", description: "집 안에서 두 층을 나누어 사용해요." },
    { id: "three", label: "세 층", description: "집 안에서 세 층을 나누어 사용해요." },
  ],
  outdoor: [
    { id: "none", label: "없어도 괜찮아요", description: "전용 야외 공간 없이 실내에 집중해요." },
    { id: "garden", label: "마당", description: "집과 이어지는 지상의 작은 정원을 원해요." },
    { id: "balcony", label: "발코니", description: "실내와 연결되는 발코니를 원해요." },
    { id: "terrace", label: "테라스", description: "바깥에 앉아 쉴 수 있는 테라스를 원해요." },
  ],
  living: [
    { id: "open", label: "거실·주방을 함께", description: "거실, 식사 공간, 주방이 이어지는 열린 구성이에요." },
    { id: "separate", label: "거실·주방을 분리", description: "주방과 거실의 영역을 나누고 싶어요." },
  ],
  mood: [
    { id: "warm", label: "따뜻하고 아늑하게", description: "부드러운 질감과 편안한 가구를 좋아해요." },
    { id: "minimal", label: "간결하고 정돈되게", description: "장식을 줄이고 깔끔한 형태를 원해요." },
    { id: "natural", label: "자연스럽고 편안하게", description: "자연의 질감과 식물이 어울리는 분위기예요." },
    { id: "classic", label: "차분하고 클래식하게", description: "균형 잡힌 비례와 은은한 장식을 원해요." },
  ],
  floorMaterial: [
    { id: "vinyl", label: "장판", description: "선택한 색을 입힌 비닐 바닥재예요." },
    { id: "wood", label: "마루", description: "나뭇결이 있는 마루 바닥이에요." },
    { id: "tile", label: "타일", description: "줄눈이 보이는 무광 타일 바닥이에요." },
  ],
  floorColor: [
    { id: "light-oak", label: "밝은 오크색", description: "밝은 베이지 계열의 나무색이에요.", swatch: "#D8C3A4" },
    { id: "warm-oak", label: "따뜻한 오크색", description: "꿀빛이 도는 따뜻한 갈색이에요.", swatch: "#B88B5A" },
    { id: "walnut", label: "짙은 월넛색", description: "깊이감 있는 짙은 갈색이에요.", swatch: "#644735" },
    { id: "ivory", label: "아이보리", description: "은은하게 따뜻한 크림색이에요.", swatch: "#E9E3D3" },
    { id: "gray", label: "그레이", description: "차분한 중간 밝기의 회색이에요.", swatch: "#A6A6A2" },
  ],
  wallColor: [
    { id: "warm-white", label: "따뜻한 흰색", description: "노란 기가 살짝 도는 부드러운 흰색이에요.", swatch: "#F1EBDE" },
    { id: "white", label: "깨끗한 흰색", description: "밝고 선명한 흰색이에요.", swatch: "#FAFAF7" },
    { id: "beige", label: "베이지", description: "포근한 모래색 계열이에요.", swatch: "#D9C9B4" },
    { id: "sage", label: "세이지 그린", description: "회색이 섞인 차분한 연녹색이에요.", swatch: "#ADB8A3" },
  ],
  lighting: [
    { id: "daylight", label: "밝은 낮", description: "자연광 아래에서 재료와 색을 살펴봐요." },
    { id: "sunset", label: "따뜻한 노을", description: "낮게 들어오는 금빛과 긴 그림자를 원해요." },
    { id: "soft-evening", label: "은은한 저녁", description: "부드러운 간접조명과 저녁 분위기를 원해요." },
  ],
  priorities: [
    { id: "storage", label: "넉넉한 수납", description: "물건을 정리할 수 있는 수납을 중요하게 생각해요." },
    { id: "work", label: "재택근무", description: "집중할 수 있는 작은 작업 공간이 필요해요." },
    { id: "pets", label: "반려동물과 생활", description: "반려동물이 쉬는 자리와 이동 공간을 원해요." },
    { id: "children", label: "아이와 생활", description: "놀이 공간과 정돈하기 쉬운 구성을 원해요." },
  ],
};

export const DEFAULT_DREAM_HOME_BRIEF: DreamHomeBrief = {
  homeType: "detached",
  area: "medium",
  bedrooms: 3,
  bathrooms: 2,
  floors: "single",
  outdoor: "garden",
  living: "open",
  mood: "warm",
  floorMaterial: "wood",
  floorColor: "light-oak",
  wallColor: "warm-white",
  lighting: "daylight",
  priorities: [],
};

/** Validate persisted answers before rendering or compiling. Never pass unknown text through. */
export function normalizeDreamHomeBrief(input: unknown): DreamHomeBrief {
  const result = { ...DEFAULT_DREAM_HOME_BRIEF, priorities: [] as string[] };
  if (!input || typeof input !== "object" || Array.isArray(input)) return result;
  const source = input as Record<string, unknown>;
  const owns = (key: string) => Object.prototype.hasOwnProperty.call(source, key);
  const choice = <K extends ChoiceField>(key: K): DreamHomeBrief[K] => {
    const value = owns(key) ? source[key] : undefined;
    return typeof value === "string" && DREAM_HOME_OPTIONS[key].some((option) => option.id === value)
      ? (value as DreamHomeBrief[K])
      : DEFAULT_DREAM_HOME_BRIEF[key];
  };
  const count = (key: "bedrooms" | "bathrooms", min: number, max: number) => {
    const value = owns(key) ? source[key] : undefined;
    return typeof value === "number" && Number.isFinite(value)
      ? Math.min(max, Math.max(min, Math.trunc(value)))
      : DEFAULT_DREAM_HOME_BRIEF[key];
  };
  result.homeType = choice("homeType");
  result.area = choice("area");
  result.bedrooms = count("bedrooms", 0, 6);
  result.bathrooms = count("bathrooms", 1, 4);
  result.floors = choice("floors");
  result.outdoor = choice("outdoor");
  result.living = choice("living");
  result.mood = choice("mood");
  result.floorMaterial = choice("floorMaterial");
  result.floorColor = choice("floorColor");
  result.wallColor = choice("wallColor");
  result.lighting = choice("lighting");
  const priorities = owns("priorities") && Array.isArray(source.priorities) ? source.priorities : [];
  // Catalog order also deduplicates answers and gives prompts a stable order.
  result.priorities = DREAM_HOME_OPTIONS.priorities
    .filter((option) => priorities.includes(option.id))
    .map((option) => option.id);
  if (result.homeType === "apartment") {
    result.floors = "single";
    if (result.outdoor === "garden") result.outdoor = "balcony";
  }
  return result;
}

function label(field: ChoiceField | "priorities", id: string): string {
  return DREAM_HOME_OPTIONS[field].find((option) => option.id === id)?.label ?? "미정";
}

const HOME = {
  detached: "a detached house",
  apartment: "a single-level apartment dwelling within a multi-unit apartment building",
  townhouse: "an attached townhouse in a row of homes",
} as const;
const AREA = {
  compact: "a compact sense of space",
  medium: "a moderately spacious sense of space",
  large: "a generous sense of space",
  unsure: "size not yet decided",
} as const;
const FLOOR_COLOR = {
  "light-oak": "a pale light-oak beige tone",
  "warm-oak": "a warm honey-oak brown tone",
  walnut: "a deep walnut-brown tone",
  ivory: "an ivory cream tone",
  gray: "a neutral gray tone",
} as const;
const WALL = {
  "warm-white": "warm-white painted walls",
  white: "clean white painted walls",
  beige: "soft beige painted walls",
  sage: "muted sage-green painted walls",
} as const;
const MOOD = {
  warm: "a warm, cozy atmosphere with gentle textures and comfortable furnishings",
  minimal: "a minimal, uncluttered atmosphere with simple forms and restrained decoration",
  natural: "a relaxed, nature-inspired atmosphere with tactile natural textures and a restrained use of plants",
  classic: "a calm, classic atmosphere with balanced proportions and subtle decorative details",
} as const;
const EXTERIOR_MOOD = {
  warm: "a welcoming, warm residential character with soft visual contrasts",
  minimal: "a minimal residential character with simple forms and restrained detailing",
  natural: "a relaxed, nature-inspired residential character with tactile surfaces",
  classic: "a calm, classic residential character with balanced proportions and subtle detailing",
} as const;
const LIGHT = {
  daylight: "bright natural daylight with soft shadows and readable material colors",
  sunset: "warm golden sunset light from a low angle, with long gentle shadows",
  "soft-evening": "a soft evening setting with gentle indirect interior lighting, avoiding harsh glare",
} as const;
const EXTERIOR_LIGHT = {
  daylight: "bright natural daylight with soft shadows and readable materials",
  sunset: "warm golden sunset light from a low angle, with long gentle shadows",
  "soft-evening": "a soft evening setting with subtle warm light visible through windows and restrained entrance lighting",
} as const;
const PRIORITY = {
  storage: "integrated storage with a calm, uncluttered appearance",
  work: "a compact work-from-home desk area without adding a separate office room",
  pets: "a designated pet-resting spot and unobstructed movement routes",
  children: "a flexible children's play area, rounded furniture edges, and accessible toy storage",
} as const;

function flooring(brief: DreamHomeBrief): string {
  const material = {
    vinyl: "matte vinyl sheet flooring (not solid wood or ceramic tile)",
    wood: "wood plank flooring with visible wood grain",
    tile: "matte tile flooring with subtle grout joints (not wood boards)",
  }[brief.floorMaterial];
  return `${material}, finished in ${FLOOR_COLOR[brief.floorColor]}; the color describes the finish, not a change of flooring material`;
}

function outdoor(brief: DreamHomeBrief): string {
  switch (brief.outdoor) {
    case "garden": return "a ground-level private garden connected to the home; its dimensions and planting are not specified";
    case "balcony": return "a balcony connected to the dwelling, without assuming a private ground-level yard";
    case "terrace": return "an outdoor terrace connected to the dwelling; do not assume rooftop ownership or a private ground-level yard";
    case "none": return "no dedicated private garden, balcony, or terrace";
  }
}

export function buildDreamHomeResult(input: DreamHomeBrief): {
  summary: Array<{ label: string; value: string }>;
  briefText: string;
  prompts: Record<HomeScene, string>;
  boardPrompt: string;
  warnings: string[];
} {
  const brief = normalizeDreamHomeBrief(input);
  const summary = [
    { label: "주거 형태", value: label("homeType", brief.homeType) },
    { label: "공간 크기", value: label("area", brief.area) },
    { label: "침실", value: brief.bedrooms === 0 ? "별도 침실 없음 (오픈형 수면 공간)" : `${brief.bedrooms}개` },
    { label: "욕실", value: `${brief.bathrooms}개` },
    { label: "집 안 층 구성", value: brief.homeType === "apartment" ? "한 층 세대 (건물 전체 층수 아님)" : label("floors", brief.floors) },
    { label: "야외 공간", value: label("outdoor", brief.outdoor) },
    { label: "거실과 주방", value: label("living", brief.living) },
    { label: "분위기", value: label("mood", brief.mood) },
    { label: "바닥 재료", value: label("floorMaterial", brief.floorMaterial) },
    { label: "바닥 색", value: label("floorColor", brief.floorColor) },
    { label: "벽 색", value: label("wallColor", brief.wallColor) },
    { label: "빛", value: label("lighting", brief.lighting) },
    { label: "생활 우선순위", value: brief.priorities.length ? brief.priorities.map((id) => label("priorities", id)).join(", ") : "별도 선택 없음" },
  ];
  const warnings = [
    "취향을 시각화하는 컨셉용 프롬프트입니다. 실제 도면, 정확한 방 배치, 구조·법규·시공 가능성을 검증하지 않습니다.",
    "방과 욕실 수는 집 전체의 희망 조건입니다. 한 장의 이미지에서 모든 공간이 보이거나 수량이 정확히 반영되는 것은 아닙니다.",
    "AI마다 결과가 다르며, 한 장의 보드 안에서도 외관·거실·침실과 개념 평면도의 형태와 재료가 정확히 일치하지 않을 수 있습니다.",
    "통합 보드의 평면도는 축척 없는 개념도입니다. 방 수·문·창·계단·이미지 간 일치 여부를 직접 확인해야 하며, 이 자료만으로 시공할 수 없습니다.",
  ];
  if (brief.homeType === "apartment") {
    warnings.push("아파트는 한 층 세대를 기준으로 하며, 마당은 발코니로 조정합니다. 발코니·테라스의 실제 사용과 변경 가능 여부는 별도 확인이 필요합니다.");
  }
  if (brief.area === "compact" && (brief.bedrooms >= 4 || brief.bathrooms >= 3)) {
    warnings.push("아담한 크기에 많은 침실·욕실을 선택했습니다. 희망 조건을 기록하되, 실제 면적과 배치는 건축 전문가와 검토해야 합니다.");
  }
  const briefText = [
    "내가 원하는 집 · 요구사항",
    ...summary.map((item) => `${item.label}: ${item.value}`),
    "",
    "이 내용은 취향과 희망 조건을 정리한 브리프입니다. 면적·대지·예산은 확정하지 않았으며, 실제 설계와 시공 가능성은 별도 검토가 필요합니다.",
  ].join("\n");
  const roomCount = brief.bedrooms === 0
    ? "no separate bedrooms, with an open-plan sleeping area"
    : `${brief.bedrooms} ${brief.bedrooms === 1 ? "bedroom" : "bedrooms"}`;
  const floorCount = brief.homeType === "apartment"
    ? "The apartment occupies one level; the overall building height and number of units are unspecified."
    : `The dwelling has ${{ single: "one storey", two: "two storeys", three: "three storeys" }[brief.floors]}.`;
  const context = `Whole-home brief: ${HOME[brief.homeType]}, ${AREA[brief.area]}, ${roomCount} and ${brief.bathrooms} ${brief.bathrooms === 1 ? "bathroom" : "bathrooms"} in total. ${floorCount} These room counts describe the whole dwelling, not spaces that must all be visible in this image. No exact floor area, site, budget, or geographical location has been supplied.`;
  const plan = brief.living === "open"
    ? "The living, dining, and kitchen zones should feel connected in an open-plan arrangement."
    : "Keep the living area distinct from an enclosed kitchen; do not depict an open-plan kitchen merging into the living room.";
  const priorities = brief.priorities.length
    ? `Lifestyle priorities where relevant to this view: ${brief.priorities.map((id) => PRIORITY[id as keyof typeof PRIORITY]).join("; ")}. Keep circulation legible and do not force every feature into one view.`
    : "Do not add specialized lifestyle spaces that were not requested.";
  const interiorFinish = `Interior finishes: ${flooring(brief)}. Use ${WALL[brief.wallColor]}. Aim for ${MOOD[brief.mood]}.`;
  const render = "Produce one coherent residential concept image with a natural eye-level perspective, straight verticals, believable scale, and legible material textures. Avoid collage layouts, floor-plan diagrams, text labels, and watermarks. This is a visual concept, not a construction-ready design or a verified room layout.";
  const living = [
    "Create an interior concept view focused on the main living room.",
    context, plan, interiorFinish,
    `Lighting: ${LIGHT[brief.lighting]}.`,
    `Outdoor preference: ${outdoor(brief)}. If a natural sightline permits, suggest that connection through an opening; do not force an outdoor space into the scene.`,
    priorities, render,
  ].join("\n\n");
  const exteriorSubject = brief.homeType === "apartment"
    ? "Create an exterior residential concept view of a multi-unit apartment building, expressing the focal dwelling's outdoor preference. Do not depict a standalone detached house, allocate the dwelling's room count to the whole building, or invent a particular building height."
    : brief.homeType === "townhouse"
      ? "Create an exterior residential concept view focused on one attached townhouse, with neighboring homes indicated only enough to make the attached housing type clear. Do not turn it into an isolated detached villa."
      : "Create an exterior residential concept view focused on a detached house.";
  const exterior = [
    exteriorSubject, context,
    `Outdoor preference: ${outdoor(brief)}.`,
    `Architectural mood: ${EXTERIOR_MOOD[brief.mood]}. Exterior materials and site dimensions have not been selected; use restrained concept-level detailing without assigning interior finishes to the facade.`,
    `Lighting: ${EXTERIOR_LIGHT[brief.lighting]}.`,
    "Interior layouts, finishes, and lifestyle furniture are outside the scope of this exterior view. Do not reveal every room with cutaways or transparent walls.",
    render,
  ].join("\n\n");
  const bedroom = [
    brief.bedrooms === 0
      ? "Create an interior concept view of an open-plan sleeping nook within the dwelling, not a separate enclosed bedroom. Do not invent an extra bedroom."
      : "Create an interior concept view focused on one bedroom in the dwelling, not a collage of all bedrooms.",
    context, interiorFinish,
    `Lighting: ${LIGHT[brief.lighting]}.`,
    "Prioritize the sleeping area and restful furniture proportions. The whole-home living and kitchen arrangement does not mean a kitchen should appear in this sleeping view.",
    priorities,
    "Do not invent an en-suite bathroom or a private bedroom balcony; the whole-home brief does not specify those connections.",
    render,
  ].join("\n\n");
  // A board is one coordinated multi-panel composition, not three single-image
  // prompts concatenated with contradictory "no collage / no plans" clauses.
  const levels = brief.homeType === "apartment" ? 1 : { single: 1, two: 2, three: 3 }[brief.floors];
  const boardProgram = `Shared whole-home program: ${HOME[brief.homeType]}, ${AREA[brief.area]}, ${roomCount} and ${brief.bathrooms} ${brief.bathrooms === 1 ? "bathroom" : "bathrooms"} in total across the entire dwelling. ${floorCount} No exact floor area, site dimensions, orientation, budget, existing survey, or geographical location has been supplied. Room allocation and geometry are hypothetical design proposals, not measured existing conditions.`;
  const planScope = levels === 1
    ? `Show one top-down conceptual floor plan of the dwelling.${brief.homeType === "apartment" ? " Draw only the focal apartment unit, not the entire apartment building." : ""}`
    : `Show ${levels} separate top-down conceptual floor plans, one per dwelling level, labelled L1${levels === 3 ? ", L2, L3" : ", L2"}. Distribute the requested room totals across these levels; do not repeat the full bedroom and bathroom counts on every floor. Align stair connections between levels and keep their landings clear.`;
  const bedroomPanel = brief.bedrooms === 0
    ? "SLEEPING NOOK: show an open-plan sleeping area consistent with the plan; do not add a separate enclosed bedroom."
    : "BEDROOM: show one representative bedroom from the proposed plan, not every bedroom and not an extra room. Do not assume an en-suite bathroom or private balcony that the brief did not request.";
  const bedroomLabels = brief.bedrooms === 0
    ? "Label an open SLEEPING NOOK instead of creating an enclosed bedroom."
    : `Label the ${brief.bedrooms} requested ${brief.bedrooms === 1 ? "bedroom B1" : `bedrooms B1 through B${brief.bedrooms}`}.`;
  const exteriorPanel = brief.homeType === "apartment"
    ? "EXTERIOR: show a contextual facade view of a multi-unit apartment building and suggest the focal dwelling's balcony or terrace only if requested. Building height and the surrounding units are illustrative context, not user-selected design requirements. Do not depict a detached villa or treat the dwelling's room totals as the entire building program. Changes to common facades or structure are not authorized by this concept."
    : brief.homeType === "townhouse"
      ? "EXTERIOR: show one attached townhouse with neighbors visible enough to establish its attached character, matching the selected dwelling level count."
      : "EXTERIOR: show the detached house and its selected outdoor space, matching the selected dwelling level count.";
  const boardPrompt = [
    "Create ONE landscape Architectural Presentation Board as a single composed image for an initial conversation with an architect. Present one coherent residential concept, not a collection of unrelated houses. This is a concept consultation board, not a construction-ready design.",
    boardProgram,
    "BOARD LAYOUT: use a clean white background, restrained black typography, generous margins, thin rules and a consistent editorial grid. Reserve roughly the left 60% for a large exterior view above two smaller living-room and bedroom views, and the right 40% for readable conceptual floor plans. Add a compact material/color palette and requirements strip along the bottom. Keep plans and captions legible rather than filling the board with decorative graphics.",
    `SHARED DESIGN: ${plan} ${interiorFinish} Outdoor preference: ${outdoor(brief)}. ${priorities}`,
    `${exteriorPanel} Use ${EXTERIOR_MOOD[brief.mood]}. Exterior materials are unspecified; keep facade detailing restrained and identify it as a proposed concept. Do not apply the selected interior flooring or wall paint to the facade. Exterior light: ${EXTERIOR_LIGHT[brief.lighting]}.`,
    `LIVING ROOM: depict the living space from the proposed plan with the selected kitchen connection, floor material, floor color and wall finish. ${bedroomPanel} Both interior views use ${LIGHT[brief.lighting]}. Use natural eye-level perspectives, straight verticals and believable furniture proportions within these rendering panels only.`,
    `CONCEPT PLANS: ${planScope} Use an orthographic top-down view, simple black linework, room boundaries, doors with swings, window positions, basic furniture and clear circulation. Represent exactly the requested bedroom and bathroom totals as the design intent. ${bedroomLabels} Label ${brief.bathrooms === 1 ? "the bathroom W1" : `bathrooms W1 through W${brief.bathrooms}`}. Show a living area and kitchen, with their selected connection. Keep access routes unobstructed and doors clear of furniture. Draw requested outdoor space as a conceptual connection, not a surveyed property boundary. Do not invent additional rooms to fill the board.`,
    "CROSS-PANEL CONSISTENCY: establish one tentative spatial arrangement and reuse it across the plan and renderings. Match the depicted openings, outdoor connections, number of dwelling levels, room relationships and interior finishes. These are requested consistency constraints, not verified geometry; flag unresolved spatial assumptions instead of claiming accuracy.",
    `PALETTE AND BRIEF: show labelled swatches for ${flooring(brief)} and ${WALL[brief.wallColor]}. Include a short requested-program strip stating ${roomCount}, ${brief.bathrooms} ${brief.bathrooms === 1 ? "bathroom" : "bathrooms"}, and ${levels} dwelling ${levels === 1 ? "level" : "levels"}. Distinguish the requested program from the unverified drawn plan. Do not substitute solid wood for vinyl because the chosen color is a wood tone.`,
    "LABELS AND LIMITS: use short English panel headings (EXTERIOR, LIVING, BEDROOM or SLEEPING NOOK, CONCEPT PLAN, MATERIALS). Print a visible footer: 'CONCEPT ONLY — NOT TO SCALE — NOT FOR CONSTRUCTION'. Do not fabricate dimensions, dimension strings, scale bars, north arrows, site boundaries, structural member sizes, approval stamps, compliance claims or verified area schedules. Do not claim that the drawings are permit-ready or buildable. The board requires an architect's site-specific design and technical review before any construction use.",
  ].join("\n\n");
  return { summary, briefText, prompts: { living, exterior, bedroom }, boardPrompt, warnings };
}
