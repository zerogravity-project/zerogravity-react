// HoverContext.tsx

import React, { createContext, useContext, useMemo, useState } from 'react';

// 1. Context의 데이터 구조 정의
interface MouseEventContextType {
  hovered: boolean;
  clicked: boolean;
  clickedForThreeSeconds: boolean;
  progress: number;
  domCoords: { x: number; y: number };
  setHovered: (isHovered: boolean) => void;
  setDomCoords: (coords: { x: number; y: number }) => void;
  setClicked: (isClicked: boolean) => void;
  setClickedForThreeSeconds: (isClickedForThreeSeconds: boolean) => void;
  setProgress: (progress: number) => void;
}

// 2. Context 생성 및 초기값 설정
const MouseEventContext = createContext<MouseEventContextType | undefined>(undefined);

// 3. Provider 컴포넌트
export function MouseEventProvider({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [domCoords, setDomCoords] = useState({ x: 0, y: 0 });
  const [clickedForThreeSeconds, setClickedForThreeSeconds] = useState(false);
  const [progress, setProgress] = useState(0);

  // 함수를 useMemo/useCallback으로 감싸 성능 최적화
  const contextValue = useMemo(
    () => ({
      hovered,
      clicked,
      clickedForThreeSeconds,
      progress,
      domCoords,
      setHovered,
      setClicked,
      setDomCoords,
      setClickedForThreeSeconds,
      setProgress,
    }),
    [hovered, clicked, clickedForThreeSeconds, progress, domCoords]
  );

  return <MouseEventContext.Provider value={contextValue}>{children}</MouseEventContext.Provider>;
}

// 4. Custom Hook (편의를 위해)
export function useMouseEventState() {
  const context = useContext(MouseEventContext);
  if (context === undefined) {
    throw new Error('useMouseEventState must be used within a MouseEventProvider');
  }
  return context;
}
