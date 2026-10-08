"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { SelectionState } from "@/lib/types";
import {
  sanitizeSelection,
  getCategoriesForImageType,
  getImageType,
} from "@/lib/prompt";
import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "prompotion:selection";

const emptySelection: SelectionState = {
  selectedImageType: null,
  selectedOptions: {},
};

interface SelectionContextValue {
  selection: SelectionState;
  /** localStorage 를 읽어온 뒤 true. SSR 과 클라이언트 렌더 불일치를 막는 데 사용한다. */
  hydrated: boolean;
  selectImageType: (imageTypeId: string) => void;
  selectOption: (categoryId: string, optionId: string) => void;
  clearOption: (categoryId: string) => void;
  reset: () => void;
  restore: (value: SelectionState) => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<SelectionState>(emptySelection);
  const [hydrated, setHydrated] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);

  // 최초 마운트 시 localStorage 에서 복원.
  //
  // localStorage 는 서버에 존재하지 않으므로 초기값으로 읽을 수 없다.
  // 초기값으로 읽으면 서버가 그린 HTML 과 클라이언트의 첫 렌더가 어긋나
  // hydration 오류가 난다. 그래서 마운트 후 effect 에서 한 번만 반영한다.
  // set-state-in-effect 규칙은 이 경우를 구분하지 못하므로 이 블록에서만 끈다.
  useEffect(() => {
    let restored: SelectionState | null = null;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SelectionState;
        if (parsed && typeof parsed === "object") {
          restored = sanitizeSelection(parsed);
        }
      }
    } catch {
      // 저장된 값이 깨졌거나 localStorage 를 쓸 수 없는 환경이면 빈 상태로 시작한다.
    }

    /* eslint-disable react-hooks/set-state-in-effect */
    if (restored) setSelection(restored);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // 선택이 바뀔 때마다 저장
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
      // Browser persistence is an external system; report its availability after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStorageUnavailable(false);
    } catch {
      setStorageUnavailable(true);
    }
  }, [selection, hydrated]);

  const selectImageType = useCallback((imageTypeId: string) => {
    if (!getImageType(imageTypeId)) return;
    trackEvent("image_type_selected", { imageType: imageTypeId });
    setSelection((prev) =>
      // 다른 종류를 고르면 기존 옵션 선택은 의미가 없으므로 초기화한다.
      prev.selectedImageType === imageTypeId
        ? prev
        : { selectedImageType: imageTypeId, selectedOptions: {} },
    );
  }, []);

  const selectOption = useCallback(
    (categoryId: string, optionId: string) => {
      const valid = getCategoriesForImageType(selection.selectedImageType)
        .find((category) => category.id === categoryId)
        ?.promptOptions.some((option) => option.id === optionId);
      if (!valid) return;
      trackEvent("element_selected", {
        imageType: selection.selectedImageType || "",
        category: categoryId,
        element: optionId,
      });
      setSelection((prev) => ({
        ...prev,
        selectedOptions: { ...prev.selectedOptions, [categoryId]: optionId },
      }));
    },
    [selection.selectedImageType],
  );

  const clearOption = useCallback((categoryId: string) => {
    trackEvent("element_removed", { category: categoryId });
    setSelection((prev) => {
      const next = { ...prev.selectedOptions };
      delete next[categoryId];
      return { ...prev, selectedOptions: next };
    });
  }, []);

  const reset = useCallback(() => {
    setSelection(emptySelection);
    trackEvent("reset");
  }, []);
  const restore = useCallback(
    (value: SelectionState) => setSelection(sanitizeSelection(value)),
    [],
  );

  const value = useMemo(
    () => ({
      selection,
      hydrated,
      selectImageType,
      selectOption,
      clearOption,
      reset,
      restore,
    }),
    [
      selection,
      hydrated,
      selectImageType,
      selectOption,
      clearOption,
      reset,
      restore,
    ],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
      {storageUnavailable && selection.selectedImageType && (
        <div role="status" className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-xl rounded-lg border border-line bg-surface p-4 text-sm shadow-md">
          선택 내용을 이 브라우저에 저장하지 못했습니다. 현재 작업은 계속할 수 있지만 새로고침하면 사라질 수 있습니다. 완성된 프롬프트를 복사해 보관해주세요.
        </div>
      )}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error(
      "useSelection 은 SelectionProvider 안에서만 사용할 수 있습니다.",
    );
  }
  return context;
}
