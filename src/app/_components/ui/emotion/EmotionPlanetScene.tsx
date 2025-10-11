'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { EmotionPlanet } from './EmotionPlanet';
import { EmotionPlanetGlow } from './EmotionPlanetGlow';
import { EmotionPlanetLoading } from './EmotionPlanetLoading';

interface EmotionPlanetSceneProps {
  emotionId: number;
  width?: number | '100%';
  height?: number | '100%';
  isFreeze?: boolean;
  isGlow?: boolean;
  isSparkles?: boolean;
  isResize?: boolean;
  className?: string;
  onSceneLoaded?: () => void;
}

export default function EmotionPlanetScene({
  emotionId,
  width,
  height,
  isFreeze = false,
  isGlow = true,
  isSparkles = true,
  isResize = true,
  className,
  onSceneLoaded,
}: EmotionPlanetSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [squareSize, setSquareSize] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const resolvedWidth = width || squareSize || '100%';
  const resolvedHeight = height || squareSize || '100%';

  const handleLoaded = () => {
    setIsLoaded(true);
    onSceneLoaded?.();
  };

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      if (!isResize) return;
      const rect = el.getBoundingClientRect();
      setSquareSize(Math.min(rect.width, rect.height));
    };

    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, [width, height, isFreeze, isResize]);

  // Calculate display sizes
  const getDisplaySize = (dimension: number | string, isFull: boolean) => {
    if (isFull) {
      return squareSize ? `${squareSize}px` : '100%';
    }
    return typeof dimension === 'number' ? dimension : dimension;
  };

  const getLoadingSize = (dimension: number | string, isFull: boolean, scale = 0.85) => {
    if (isFull) {
      return squareSize ? `${squareSize * scale}px` : `${scale * 100}%`;
    }
    return typeof dimension === 'number' ? dimension * scale : dimension;
  };

  const displayWidth = getDisplaySize(resolvedWidth, resolvedWidth === '100%');
  const displayHeight = getDisplaySize(resolvedHeight, resolvedHeight === '100%');
  const loadingWidth = getLoadingSize(resolvedWidth, resolvedWidth === '100%');
  const loadingHeight = getLoadingSize(resolvedHeight, resolvedHeight === '100%');

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className || ''}`} style={{ width, height }}>
      {/* 3D Canvas */}
      <div className="absolute inset-0 grid h-full w-full place-items-center">
        <Canvas
          frameloop={isFreeze ? 'never' : 'always'}
          resize={{ offsetSize: true }}
          style={{ width: resolvedWidth, height: resolvedHeight }}
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
            <EmotionPlanet onLoaded={handleLoaded} emotionId={emotionId} isSparkles={isSparkles} />
          </Suspense>
        </Canvas>
      </div>

      {/* Glow Effect */}
      {isGlow && (
        <EmotionPlanetGlow emotionId={emotionId} isVisible={isLoaded} width={displayWidth} height={displayHeight} />
      )}

      {/* Loading Indicator */}
      <EmotionPlanetLoading emotionId={emotionId} isVisible={!isLoaded} width={loadingWidth} height={loadingHeight} />
    </div>
  );
}
