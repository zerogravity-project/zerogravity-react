'use client';
import { Button } from '@radix-ui/themes';
import { motion } from 'motion/react';
import { useRef } from 'react';

import { useMouseEventState } from './MouseEventContext';

// 캔버스 외부에 렌더링될 버튼 컴포넌트
export function FloatingButton() {
  const { hovered, clicked, domCoords, progress } = useMouseEventState();
  const { x, y } = domCoords;
  const buttonRef = useRef<HTMLDivElement>(null);

  // 고정된 버튼 크기 사용 (밀림 방지)
  const buttonSize = { width: 100, height: 48 };

  return (
    <motion.div
      ref={buttonRef}
      style={{
        position: 'fixed',
        left: x - buttonSize.width / 2, // 실제 버튼 너비의 절반
        top: y - buttonSize.height / 2, // 실제 버튼 높이의 절반
        zIndex: 9999,
        pointerEvents: 'none',
        width: 'fit-content',
        height: 'fit-content',
      }}
      initial={{ opacity: 0, scale: 1 }}
      animate={{
        opacity: hovered ? 1 : 0,
        scale: clicked ? 0.8 : 1,
      }}
      transition={{
        opacity: { duration: 0.2 },
        scale: {
          duration: 0.2,
          ease: 'easeOut',
        },
      }}
    >
      {/* Progress 배경 컨테이너 (4px 큰 영역) */}
      <div
        style={{
          position: 'relative',
          width: `96px`,
          height: `96px`,
          borderRadius: '50%',
          overflow: 'hidden',
          background: `conic-gradient(from 0deg, var(--accent-a9) 0deg, var(--accent-a9) ${progress * 360}deg, transparent ${progress * 360}deg, transparent 360deg)`,
          padding: '3px',
        }}
      >
        {/* 버튼 */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button size="4" variant="surface" radius="full" style={{ width: 90, height: 90 }}>
            <span className="material-symbols-outlined !text-[48px]">arrow_forward</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
