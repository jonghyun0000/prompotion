import { imageTypes, optionCategories } from "./data";
import type { ImageType, OptionCategory, PromptOption, SelectionState } from "./types";

/** id 로 이미지 종류 찾기 */
export function getImageType(id: string | null): ImageType | undefined {
  if (!id) return undefined;
  return imageTypes.find((type) => type.id === id);
}

/** id 로 옵션 카테고리 찾기 */
export function getCategory(id: string): OptionCategory | undefined {
  return optionCategories.find((category) => category.id === id);
}

/**
 * 특정 이미지 종류에 필요한 옵션 카테고리를 order 순으로 반환.
 * 최종 프롬프트의 연결 순서도 이 순서를 그대로 따른다.
 */
export function getCategoriesForImageType(imageTypeId: string | null): OptionCategory[] {
  const imageType = getImageType(imageTypeId);
  if (!imageType) return [];

  return imageType.optionCategoryIds
    .map((categoryId) => getCategory(categoryId))
    .filter((category): category is OptionCategory => Boolean(category))
    .sort((a, b) => a.order - b.order);
}

/** 카테고리 안에서 선택된 옵션 객체를 찾기 */
export function getSelectedOption(
  category: OptionCategory,
  selection: SelectionState,
): PromptOption | undefined {
  const optionId = selection.selectedOptions[category.id];
  if (!optionId) return undefined;
  return category.promptOptions.find((option) => option.id === optionId);
}

/** 현재 이미지 종류에서 필수로 선택해야 하는 카테고리 수 */
export function getRequiredCategories(imageTypeId: string | null): OptionCategory[] {
  return getCategoriesForImageType(imageTypeId).filter((category) => category.required);
}

/** 선택 완료 개수와 전체 개수 */
export function getProgress(selection: SelectionState): { done: number; total: number } {
  const categories = getRequiredCategories(selection.selectedImageType);
  const done = categories.filter((category) => Boolean(selection.selectedOptions[category.id])).length;
  return { done, total: categories.length };
}

/** 모든 필수 옵션이 선택되었는지 */
export function isComplete(selection: SelectionState): boolean {
  const { done, total } = getProgress(selection);
  return total > 0 && done === total;
}

/**
 * 선택된 프롬프트 조각들을 카테고리 order 순으로 이어 붙여
 * 최종 프롬프트 문자열을 만든다.
 */
export function buildFinalPrompt(selection: SelectionState): string {
  return getCategoriesForImageType(selection.selectedImageType)
    .map((category) => getSelectedOption(category, selection)?.promptText)
    .filter((text): text is string => Boolean(text))
    .join(", ");
}

/** 결과 화면에서 카테고리별로 나눠 보여주기 위한 형태 */
export function buildPromptBreakdown(
  selection: SelectionState,
): { category: OptionCategory; option: PromptOption }[] {
  return getCategoriesForImageType(selection.selectedImageType)
    .map((category) => {
      const option = getSelectedOption(category, selection);
      return option ? { category, option } : null;
    })
    .filter((entry): entry is { category: OptionCategory; option: PromptOption } => entry !== null);
}
