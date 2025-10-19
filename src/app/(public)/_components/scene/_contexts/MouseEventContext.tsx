// HoverContext.tsx

import React, { createContext, useContext, useMemo, useState } from 'react';

// 1. Context Data Structure Definition
interface MouseEventContextType {
  hovered: boolean;
  clicked: boolean;
  clickedForThreeSeconds: boolean;
  animationStarted: boolean;
  animationCompleted: boolean;
  domCoords: { x: number; y: number };
  progress: number;
  setHovered: (isHovered: boolean) => void;
  setClicked: (isClicked: boolean) => void;
  setClickedForThreeSeconds: (isClickedForThreeSeconds: boolean) => void;
  setAnimationStarted: (isAnimationStarted: boolean) => void;
  setAnimationCompleted: (isAnimationCompleted: boolean) => void;
  setDomCoords: (coords: { x: number; y: number }) => void;
  setProgress: (progress: number) => void;
}

// 2. Context Creation and Initial Value Setting
const MouseEventContext = createContext<MouseEventContextType | undefined>(undefined);

// 3. Provider Component
export function MouseEventProvider({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [domCoords, setDomCoords] = useState({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);
  const [clickedForThreeSeconds, setClickedForThreeSeconds] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  // Wrap functions in useMemo/useCallback for performance optimization
  const contextValue = useMemo(
    () => ({
      hovered,
      clicked,
      clickedForThreeSeconds,
      animationStarted,
      animationCompleted,
      progress,
      domCoords,
      setHovered,
      setClicked,
      setDomCoords,
      setClickedForThreeSeconds,
      setProgress,
      setAnimationStarted,
      setAnimationCompleted,
    }),
    [hovered, clicked, clickedForThreeSeconds, animationStarted, animationCompleted, progress, domCoords]
  );

  return <MouseEventContext.Provider value={contextValue}>{children}</MouseEventContext.Provider>;
}

// 4. Custom Hook (for convenience)
export function useMouseEventState() {
  const context = useContext(MouseEventContext);
  if (context === undefined) {
    throw new Error('useMouseEventState must be used within a MouseEventProvider');
  }
  return context;
}
