'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { EMOTION_STEPS } from './Emotion.type';
import { EmotionPlanet } from './EmotionPlanet';

interface EmotionPlanetSceneProps {
  emotionId: number;
  width?: number | '100%';
  height?: number | '100%';
  isGlow?: boolean;
  isSparkles?: boolean;
  className?: string;
}

export default function EmotionPlanetScene({
  emotionId,
  width,
  height,
  isGlow = true,
  isSparkles = true,
  className,
}: EmotionPlanetSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [squareSize, setSquareSize] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const resolvedWidth = width || squareSize || '100%';
  const resolvedHeight = height || squareSize || '100%';

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof width === 'number' || typeof height === 'number') return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSquareSize(Math.min(rect.width, rect.height));
    };

    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, [width, height]);

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className || ''}`}>
      <div className="absolute inset-0 grid h-full w-full place-items-center">
        <Canvas
          style={{
            width: resolvedWidth,
            height: resolvedHeight,
          }}
          shadows
          camera={{ position: [0, 0, -25], fov: 15, near: 0.1, far: 100 }}
          gl={{ alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
          dpr={[1, 2]}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <Suspense fallback={null}>
            <EmotionPlanet onLoaded={() => setIsLoaded(true)} emotionId={emotionId} isSparkles={isSparkles} />
          </Suspense>
        </Canvas>
      </div>

      {/* Glow Overlay - Display only after loading is complete */}
      {isLoaded && isGlow && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center" style={{ zIndex: -1 }}>
          <div
            className="translate-z-0 rounded-[9999px] blur-[22px]"
            style={{
              width: resolvedWidth === '100%' ? (squareSize ? `${squareSize}px` : '100%') : resolvedWidth,
              height: resolvedHeight === '100%' ? (squareSize ? `${squareSize}px` : '100%') : resolvedHeight,
              background: `radial-gradient(circle, var(--${EMOTION_STEPS[emotionId].color}-a9) 0%, var(--${EMOTION_STEPS[emotionId].color}-a5) 40%, var(--${EMOTION_STEPS[emotionId].color}-a3) 65%, var(--${EMOTION_STEPS[emotionId].color}-a1) 70%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}
