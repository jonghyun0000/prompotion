/**
 * 서비스 전체에서 사용하는 데이터 타입 정의.
 * UI는 이 타입만 알면 되고, 실제 값은 lib/data.ts 에서 주입된다.
 * 나중에 Supabase 등 DB를 붙일 때 이 타입을 그대로 테이블 스키마로 옮기면 된다.
 */

/** 하나의 선택 가능한 프롬프트 조각 (예: Exposed Concrete) */
export interface PromptOption {
  category?: string;
  tags?: string[];
  compatibleTypes?: string[];
  recommended?: boolean;
  conflictsWith?: string[];
  previewImage?: string;
  id: string;
  /** 화면에 보여줄 이름 */
  title: string;
  /** 한 줄 설명 */
  description: string;
  /** 최종 프롬프트에 실제로 들어가는 영문 텍스트 */
  promptText: string;
  /** 적용 전 이미지 경로 */
  beforeImage: string;
  /** 적용 후 이미지 경로 */
  afterImage: string;
}

/** 프롬프트 옵션의 묶음 (예: 재료, 조명/시간) */
export interface OptionCategory {
  id: string;
  name: string;
  englishName: string;
  description: string;
  /** 최종 프롬프트를 만들기 위해 반드시 선택해야 하는지 */
  required: boolean;
  /** 최종 프롬프트에서 연결되는 순서 (작을수록 앞) */
  order: number;
  promptOptions: PromptOption[];
}

/** 만들고 싶은 이미지의 종류 (예: 투시도) */
export interface ImageType {
  subject?: string;
  id: string;
  name: string;
  englishName: string;
  description: string;
  thumbnail: string;
  /** 이 이미지 종류에 필요한 옵션 카테고리 id 목록 */
  optionCategoryIds: string[];
}

/** 사용자의 현재 선택 상태 */
export interface SelectionState {
  selectedImageType: string | null;
  /** key: OptionCategory.id, value: PromptOption.id */
  selectedOptions: Record<string, string>;
}
