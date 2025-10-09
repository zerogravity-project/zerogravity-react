'use client';
import { Button } from '@radix-ui/themes';
import { motion } from 'motion/react';
import { useRef } from 'react';

import { useMouseEventState } from './MouseEventContext';

// Button Component Rendered Outside the Canvas
export function FloatingButton() {
  const { hovered, clicked, domCoords, progress } = useMouseEventState();
  const { x, y } = domCoords;
  const buttonRef = useRef<HTMLDivElement>(null);

  // Fixed button size to prevent overlap
  const buttonSize = { width: 100, height: 48 };

  return (
    <motion.div
      ref={buttonRef}
      style={{
        position: 'fixed',
        left: x - buttonSize.width / 2, // Actual button width half
        top: y - buttonSize.height / 2, // Actual button height half
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
      {/* Progress Background Container (4px larger area) */}
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
        {/* Button */}
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
