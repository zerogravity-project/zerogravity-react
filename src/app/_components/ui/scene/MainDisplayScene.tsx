'use client';

import { Environment, Float, Stage, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';

import { FloatingButton } from './FloatingButton';
import { MouseEventProvider } from './MouseEventContext';
import { PlantModel } from './PlantModel';

interface MainDisplaySceneProps {
  onLoad?: () => void;
  className?: string;
}

// Main Display Scene Component
export default function MainDisplayScene({ onLoad, className }: MainDisplaySceneProps) {
  // Environment, Camera, Performance Monitoring GUI
  const {
    environmentIntensity,
    cameraPosition,
    fov,
    perfVisible,
    environmentRotationX,
    environmentRotationY,
    environmentRotationZ,
  } = useControls({
    environmentIntensity: { value: 1, min: 1, max: 12 },
    cameraPosition: { value: [0, 0.2, 1.8], min: -10, max: 10 },
    fov: { value: 15, min: 1, max: 100 },
    perfVisible: { value: false },
    environmentRotationX: { value: 0, min: -Math.PI, max: Math.PI },
    environmentRotationY: { value: 0, min: -Math.PI, max: Math.PI },
    environmentRotationZ: { value: 0, min: -Math.PI, max: Math.PI },
  });

  // Model Floating Animation Settings GUI
  const { floatSpeed, floatRotationIntensity, floatFloatIntensity, floatFloatingRange } = useControls('Float', {
    floatSpeed: { value: 5, min: 1, max: 10 },
    floatRotationIntensity: { value: 1, min: 1, max: 10 },
    floatFloatIntensity: { value: 1, min: 1, max: 20 },
    floatFloatingRange: { value: [-0.01, 0.02], min: -10, max: 10 },
  });

  return (
    <MouseEventProvider>
      <div className={`display-scene !z-3 ${className || ''}`}>
        <Canvas
          camera={{ position: cameraPosition, fov: fov, rotation: [-Math.PI / 39, 0, 0] }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
            precision: 'highp',
            preserveDrawingBuffer: false,
            logarithmicDepthBuffer: false,
          }}
          dpr={[1, 1.5]} // Lower device pixel ratio for performance improvement
          performance={{ min: 0.5 }} // Performance monitoring
          shadows
        >
          {perfVisible && <Perf position="top-left" />}

          <Environment
            files="/environment-maps/kloofendal_misty_morning_puresky_4k.hdr"
            environmentIntensity={environmentIntensity}
            environmentRotation={[environmentRotationX, environmentRotationY, environmentRotationZ]}
          />

          {/* 모델 */}

          <Stage
            environment={null}
            adjustCamera={false}
            center={{ disable: true }}
            shadows={{ type: 'contact', color: '#E6E6E6', opacity: 0.9 }}
          >
            <Float
              speed={floatSpeed} // Animation speed, defaults to 1
              rotationIntensity={floatRotationIntensity} // XYZ rotation intensity, defaults to 1
              floatIntensity={floatFloatIntensity} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
              floatingRange={floatFloatingRange} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
            >
              <PlantModel onLoad={onLoad} />
            </Float>
          </Stage>

          {/* Camera Control */}
          {/* <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={false} target={[0, 1, 0]} /> */}
        </Canvas>

        {/* Render the button outside the canvas (share state through context) */}
        <FloatingButton />
      </div>
    </MouseEventProvider>
  );
}

// GLTF 모델 preload
useGLTF.preload('/models/potted-plant-04/potted_plant_04_4k.gltf');
