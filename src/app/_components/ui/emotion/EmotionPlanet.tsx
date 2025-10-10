'use client';

import { Environment, OrbitControls, Sparkles } from '@react-three/drei';
import { useControls } from 'leva';
import { useEffect } from 'react';

import { EMOTION_STEPS } from './Emotion.type';
import { WobbleMesh } from './WobbleMesh';

interface EmotionPlanetProps {
  emotionId: number;
  onLoaded: () => void;
  isSparkles?: boolean;
}

export function EmotionPlanet({ emotionId, onLoaded, isSparkles = true }: EmotionPlanetProps) {
  const { lightColor } = useControls('Light', {
    lightColor: { value: '#ffffff' },
  });

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
        color={lightColor}
        intensity={5}
        position={[0.25, 2, -2.25]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={15}
        shadow-normalBias={0.05}
      />
      {/* Wobble Mesh */}
      <WobbleMesh
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
      {isSparkles && <Sparkles count={50} scale={7} size={6} speed={0.4} />}
      {/* Controller */}
      <OrbitControls enablePan={false} enableZoom={false} makeDefault enableDamping />
    </>
  );
}
