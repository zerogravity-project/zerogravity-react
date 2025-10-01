'use client';

import { Environment, Float, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';

import { FloatingButton } from './FloatingButton';
import { HoverProvider } from './HoverContext';
import { PlantModel } from './PlantModel';

interface MainDisplaySceneProps {
  onLoad?: () => void;
  className?: string;
}

// 메인 씬 컴포넌트
export default function MainDisplayScene({ onLoad, className }: MainDisplaySceneProps) {
  // 환경, 카메라, 성능 모니터링 설정 GUI
  const { environmentIntensity, cameraPosition, fov, perfVisible } = useControls({
    environmentIntensity: { value: 1, min: 1, max: 12 },
    cameraPosition: { value: [0, 0, 2], min: -10, max: 10 },
    fov: { value: 15, min: 1, max: 100 },
    perfVisible: { value: true },
  });

  // 모델 무중력 애니메이션 설정 GUI
  const { floatSpeed, floatRotationIntensity, floatFloatIntensity, floatFloatingRange } = useControls('Float', {
    floatSpeed: { value: 5, min: 1, max: 10 },
    floatRotationIntensity: { value: 1, min: 1, max: 10 },
    floatFloatIntensity: { value: 1, min: 1, max: 10 },
    floatFloatingRange: { value: [-0.01, 0.02], min: -10, max: 10 },
  });

  return (
    <HoverProvider>
      <div className={`display-scene !z-3 ${className || ''}`}>
        <Canvas
          camera={{ position: cameraPosition, fov: fov }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
            precision: 'highp',
            preserveDrawingBuffer: false,
            logarithmicDepthBuffer: false,
          }}
          dpr={[1, 1.5]} // 디바이스 픽셀 비율을 낮춰서 성능 향상
          performance={{ min: 0.5 }} // 성능 모니터링
          shadows
        >
          {perfVisible && <Perf position="top-left" />}

          <Environment
            preset="apartment"
            // files={[
            //   '/environment-maps/cube/cube-01/px.jpg',
            //   '/environment-maps/cube/cube-01/nx.jpg',
            //   '/environment-maps/cube/cube-01/py.jpg',
            //   '/environment-maps/cube/cube-01/ny.jpg',
            //   '/environment-maps/cube/cube-01/pz.jpg',
            //   '/environment-maps/cube/cube-01/nz.jpg',
            // ]}
            environmentIntensity={environmentIntensity}
            // background={false}
          />

          {/* 모델 */}
          <Float
            speed={floatSpeed} // Animation speed, defaults to 1
            rotationIntensity={floatRotationIntensity} // XYZ rotation intensity, defaults to 1
            floatIntensity={floatFloatIntensity} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
            floatingRange={floatFloatingRange} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
          >
            <PlantModel onLoad={onLoad} />
          </Float>

          {/* 카메라 컨트롤 */}
          {/* <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} autoRotate={false} /> */}
        </Canvas>

        {/* Canvas 밖에 버튼을 렌더링 (Context를 통해 상태 공유) */}
        <FloatingButton />
      </div>
    </HoverProvider>
  );
}

// GLTF 모델 preload
useGLTF.preload('/models/potted-plant-04/potted_plant_04_4k.gltf');
