"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { SelectionState } from "@/lib/types";

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
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<SelectionState>(emptySelection);
  const [hydrated, setHydrated] = useState(false);

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
          restored = {
            selectedImageType: parsed.selectedImageType ?? null,
            selectedOptions: parsed.selectedOptions ?? {},
          };
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
    } catch {
      // 저장 실패는 무시한다. 앱 동작 자체에는 영향이 없다.
    }
  }, [selection, hydrated]);

  const selectImageType = useCallback((imageTypeId: string) => {
    setSelection((prev) =>
      // 다른 종류를 고르면 기존 옵션 선택은 의미가 없으므로 초기화한다.
      prev.selectedImageType === imageTypeId
        ? prev
        : { selectedImageType: imageTypeId, selectedOptions: {} },
    );
  }, []);

  const selectOption = useCallback((categoryId: string, optionId: string) => {
    setSelection((prev) => ({
      ...prev,
      selectedOptions: { ...prev.selectedOptions, [categoryId]: optionId },
    }));
  }, []);

  const clearOption = useCallback((categoryId: string) => {
    setSelection((prev) => {
      const next = { ...prev.selectedOptions };
      delete next[categoryId];
      return { ...prev, selectedOptions: next };
    });
  }, []);

  const reset = useCallback(() => setSelection(emptySelection), []);

  const value = useMemo(
    () => ({ selection, hydrated, selectImageType, selectOption, clearOption, reset }),
    [selection, hydrated, selectImageType, selectOption, clearOption, reset],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection 은 SelectionProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
