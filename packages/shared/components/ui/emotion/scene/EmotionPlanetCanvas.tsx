'use client';

import { Suspense, useEffect, useState } from 'react';

import { Canvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import * as THREE from 'three';

import { EmotionPlanet } from './EmotionPlanet';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionPlanetCanvasProps {
  emotionId: number;
  width: number | string;
  height: number | string;

  environmentMapUrl?: string;
  isFreeze?: boolean;
  isSparkles?: boolean;
  isLarge?: boolean;
  performanceMode?: boolean;
  showPerf?: boolean;

  onLoaded?: () => void;
}

/*
 * ============================================
 * Component
 * ============================================
 */

/**
 * Canvas-only component for EmotionPlanet 3D rendering
 * This component is lazy-loaded to separate R3F bundle
 */
export function EmotionPlanetCanvas({
  emotionId,
  width,
  height,
  environmentMapUrl,
  isFreeze = false,
  isSparkles = true,
  isLarge = false,
  performanceMode = false,
  showPerf = false,
  onLoaded,
}: EmotionPlanetCanvasProps) {
  /*
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const [isTabVisible, setIsTabVisible] = useState(true);

  /*
   * --------------------------------------------
   * 2. Effects
   * --------------------------------------------
   */
  /** Pause render loop when tab is not visible (saves CPU/GPU) */
  useEffect(() => {
    const handleVisibilityChange = () => setIsTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  /*
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */
  /** Stop rendering when frozen or tab is hidden */
  const shouldPauseRendering = isFreeze || !isTabVisible;

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <div className="absolute inset-0 z-1 grid h-full w-full place-items-center">
      <Canvas
        frameloop={shouldPauseRendering ? 'never' : 'always'}
        resize={{ offsetSize: true }}
        style={{ width, height }}
        shadows={false}
        camera={{ position: [0, 0, -25], fov: 15, near: 0.1, far: 100 }}
        gl={{
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
          powerPreference: 'high-performance',
          precision: performanceMode ? 'mediump' : 'highp',
          preserveDrawingBuffer: false,
          logarithmicDepthBuffer: false,
          antialias: true,
        }}
        dpr={performanceMode ? [0.75, 1.5] : [1, 2]}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = false;
        }}
      >
        {/* Performance Monitor (dev mode) */}
        {showPerf && <Perf position="bottom-right" />}

        <Suspense fallback={null}>
          <EmotionPlanet
            onLoaded={onLoaded}
            emotionId={emotionId}
            environmentMapUrl={environmentMapUrl}
            isSparkles={isSparkles}
            isLarge={isLarge}
            performanceMode={performanceMode}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
