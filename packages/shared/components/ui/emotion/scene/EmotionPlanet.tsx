'use client';

import { useEffect } from 'react';

import { Environment, OrbitControls, Sparkles } from '@react-three/drei';

import { EMOTION_STEPS } from '../../../../entities/emotion';

import { WobbleMesh } from './objects/WobbleMesh';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Default Light Properties */
const DEFAULT_LIGHT_PROPS = {
  color: '#ffffff',
  intensity: 5,
  position: [0.25, 2, -2.25],
  shadowCameraFar: 15,
  shadowNormalBias: 0.05,
} as const;

/** Shadow Configuration by Performance Mode */
const SHADOW_CONFIG = {
  /** Desktop - High quality shadows */
  desktop: { enabled: true, mapSize: [512, 512] as [number, number] },
  /** Mobile - Shadows disabled for performance */
  performance: { enabled: false, mapSize: [256, 256] as [number, number] },
} as const;

/** Sparkles Configuration */
const SPARKLES_CONFIG = {
  desktop: {
    normal: { count: 50, scale: 7, size: 6, speed: 0.4 },
    large: { count: 50, scale: 7, size: 8, speed: 0.05 },
  },
  /** Mobile - Reduced sparkles for performance */
  performance: {
    normal: { count: 25, scale: 7, size: 6, speed: 0.4 },
    large: { count: 25, scale: 7, size: 8, speed: 0.05 },
  },
} as const;

/** LOD Subdivision Configuration */
const LOD_SUBDIVISIONS = {
  /** Desktop - High quality */
  desktop: { large: 48, normal: 32 },
  /** Mobile/Low-end - Performance mode */
  performance: { large: 32, normal: 28 },
} as const;

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionPlanetProps {
  emotionId: number;
  onLoaded: () => void;
  environmentMapUrl?: string;
  isSparkles?: boolean;
  isLarge?: boolean;
  /** Enable performance mode for mobile/low-end devices (reduces geometry complexity) */
  performanceMode?: boolean;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function EmotionPlanet({
  emotionId,
  onLoaded,
  environmentMapUrl = '/environment-maps/urban_alley_01_512.hdr',
  isSparkles = true,
  isLarge = false,
  performanceMode = false,
}: EmotionPlanetProps) {
  /*
   * --------------------------------------------
   * 1. Derived Values
   * --------------------------------------------
   */
  const configKey = performanceMode ? 'performance' : 'desktop';

  /** Get subdivision count based on LOD settings */
  const lodConfig = LOD_SUBDIVISIONS[configKey];
  const subdivisions = isLarge ? lodConfig.large : lodConfig.normal;

  /** Get shadow configuration */
  const shadowConfig = SHADOW_CONFIG[configKey];

  /** Get sparkles configuration */
  const sparklesConfig = SPARKLES_CONFIG[configKey][isLarge ? 'large' : 'normal'];

  /*
   * --------------------------------------------
   * 2. Effects
   * --------------------------------------------
   */
  /** Notify parent when component is mounted (Suspense resolved) */
  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <>
      {/* Environment */}
      <Environment files={environmentMapUrl} />
      {/* Directional Light */}
      <directionalLight
        color={DEFAULT_LIGHT_PROPS.color}
        intensity={DEFAULT_LIGHT_PROPS.intensity}
        position={DEFAULT_LIGHT_PROPS.position as [number, number, number]}
        castShadow={shadowConfig.enabled}
        shadow-mapSize={shadowConfig.mapSize}
        shadow-camera-far={DEFAULT_LIGHT_PROPS.shadowCameraFar}
        shadow-normalBias={DEFAULT_LIGHT_PROPS.shadowNormalBias}
      />
      {/* Wobble Mesh */}
      <WobbleMesh
        radius={2.5}
        subdivisions={subdivisions}
        positionFrequency={EMOTION_STEPS[emotionId].style.planet.positionFrequency}
        timeFrequency={EMOTION_STEPS[emotionId].style.planet.timeFrequency}
        warpPositionFrequency={EMOTION_STEPS[emotionId].style.planet.warpPositionFrequency}
        warpTimeFrequency={EMOTION_STEPS[emotionId].style.planet.warpTimeFrequency}
        warpStrength={EMOTION_STEPS[emotionId].style.planet.warpStrength}
        metalness={EMOTION_STEPS[emotionId].style.planet.metalness}
        roughness={EMOTION_STEPS[emotionId].style.planet.roughness}
        colorA={EMOTION_STEPS[emotionId].style.planet.colorA}
        colorB={EMOTION_STEPS[emotionId].style.planet.colorB}
      />
      {isSparkles && (
        <Sparkles
          count={sparklesConfig.count}
          scale={sparklesConfig.scale}
          size={sparklesConfig.size}
          speed={sparklesConfig.speed}
        />
      )}
      {/* Controller */}
      <OrbitControls enablePan={false} enableZoom={false} makeDefault enableDamping />
    </>
  );
}
