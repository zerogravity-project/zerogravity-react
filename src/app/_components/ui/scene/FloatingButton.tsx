'use client';
import { Button } from '@radix-ui/themes';

import { useHoverState } from './HoverContext';

// 캔버스 외부에 렌더링될 버튼 컴포넌트
export function FloatingButton() {
  const { hovered, domCoords } = useHoverState();
  const { x, y } = domCoords;

  return (
    <Button
      size="4"
      variant="solid"
      radius="full"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s',
        transform: 'translate(-50%, -50%)',
      }}
    >
      START
      <span className="material-symbols-outlined">arrow_forward</span>
    </Button>
  );
}
