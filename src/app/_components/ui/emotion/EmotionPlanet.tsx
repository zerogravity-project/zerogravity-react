'use client';

import { Environment, OrbitControls, Sparkles } from '@react-three/drei';
import { useEffect } from 'react';

import { EMOTION_STEPS } from './_constants/emotion.constants';
import { WobbleMesh } from './objects/WobbleMesh';

/**
 * Default Light Properties
 */
const DEFAULT_LIGHT_PROPS = {
  color: '#ffffff',
  intensity: 5,
  position: [0.25, 2, -2.25],
  castShadow: true,
  shadowMapSize: [1024, 1024],
  shadowCameraFar: 15,
  shadowNormalBias: 0.05,
};

/**
 * Default Sparkles Properties
 */
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

interface EmotionPlanetProps {
  emotionId: number;
  onLoaded: () => void;
  isSparkles?: boolean;
  isLarge?: boolean;
}

export function EmotionPlanet({ emotionId, onLoaded, isSparkles = true, isLarge = false }: EmotionPlanetProps) {
  useEffect(() => {
    // When Suspense is resolved, this component will be mounted, so send the loading complete signal
    onLoaded();
  }, [onLoaded]);

  return (
    <>
      {/* Environment */}
      <Environment files="/environment-maps/urban_alley_01_1k.hdr" />
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
