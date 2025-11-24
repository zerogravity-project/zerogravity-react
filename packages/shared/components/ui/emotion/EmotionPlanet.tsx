'use client';

import { useEffect } from 'react';

import { Environment, OrbitControls, Sparkles } from '@react-three/drei';

import { EMOTION_STEPS } from './constants/emotion.constants';
import { WobbleMesh } from './objects/WobbleMesh';

/**
 * ============================================
 * Constants
 * ============================================
 */

/** Default Light Properties */
const DEFAULT_LIGHT_PROPS = {
  color: '#ffffff',
  intensity: 5,
  position: [0.25, 2, -2.25],
  castShadow: true,
  shadowMapSize: [1024, 1024],
  shadowCameraFar: 15,
  shadowNormalBias: 0.05,
};

/** Default Sparkles Properties */
const DEFAULT_SPARKLES_PROPS = {
  count: 50,
  scale: 7,
  size: 6,
  speed: 0.4,
};

const DEFAULT_LARGE_SPARKLES_PROPS = {
  count: 50,
  scale: 7,
  size: 8,
  speed: 0.05,
};

/**
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
}

/**
 * ============================================
 * Component
 * ============================================
 */

export function EmotionPlanet({
  emotionId,
  onLoaded,
  environmentMapUrl = '/environment-maps/urban_alley_01_1k.hdr',
  isSparkles = true,
  isLarge = false,
}: EmotionPlanetProps) {
  /**
   * --------------------------------------------
   * 1. Effects
   * --------------------------------------------
   */
  /** Notify parent when component is mounted (Suspense resolved) */
  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  /**
   * --------------------------------------------
   * 2. Return
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
        castShadow
        shadow-mapSize={DEFAULT_LIGHT_PROPS.shadowMapSize}
        shadow-camera-far={DEFAULT_LIGHT_PROPS.shadowCameraFar}
        shadow-normalBias={DEFAULT_LIGHT_PROPS.shadowNormalBias}
      />
      {/* Wobble Mesh */}
      <WobbleMesh
        radius={2.5}
        subdivisions={isLarge ? 100 : 50}
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
          count={isLarge ? DEFAULT_LARGE_SPARKLES_PROPS.count : DEFAULT_SPARKLES_PROPS.count}
          scale={isLarge ? DEFAULT_LARGE_SPARKLES_PROPS.scale : DEFAULT_SPARKLES_PROPS.scale}
          size={isLarge ? DEFAULT_LARGE_SPARKLES_PROPS.size : DEFAULT_SPARKLES_PROPS.size}
          speed={isLarge ? DEFAULT_LARGE_SPARKLES_PROPS.speed : DEFAULT_SPARKLES_PROPS.speed}
        />
      )}
      {/* Controller */}
      <OrbitControls enablePan={false} enableZoom={false} makeDefault enableDamping />
    </>
  );
}
