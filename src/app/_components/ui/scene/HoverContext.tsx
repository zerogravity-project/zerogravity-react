// HoverContext.tsx

import React, { createContext, useContext, useMemo, useState } from 'react';

// 1. Context의 데이터 구조 정의
interface HoverContextType {
  hovered: boolean;
  domCoords: { x: number; y: number };
  setHovered: (isHovered: boolean) => void;
  setDomCoords: (coords: { x: number; y: number }) => void;
}

// 2. Context 생성 및 초기값 설정
const HoverContext = createContext<HoverContextType | undefined>(undefined);

// 3. Provider 컴포넌트
export function HoverProvider({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [domCoords, setDomCoords] = useState({ x: 0, y: 0 });

  // 함수를 useMemo/useCallback으로 감싸 성능 최적화
  const contextValue = useMemo(
    () => ({
      hovered,
      domCoords,
      setHovered,
      setDomCoords,
    }),
    [hovered, domCoords]
  );

  return <HoverContext.Provider value={contextValue}>{children}</HoverContext.Provider>;
}

// 4. Custom Hook (편의를 위해)
export function useHoverState() {
  const context = useContext(HoverContext);
  if (context === undefined) {
    throw new Error('useHoverState must be used within a HoverProvider');
  }
  return context;
}
