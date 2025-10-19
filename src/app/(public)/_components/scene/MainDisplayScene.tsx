'use client';

import { useRouter } from 'next/navigation';

import { Button, Heading, Theme } from '@radix-ui/themes';
import { Environment, Float, Stage, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';

import Icon from '@/app/_components/ui/icon/Icon';
import { cn } from '@/app/_utils/styleUtils';

import { useMouseEventState } from './_contexts/MouseEventContext';
import { FloatingButton } from './elements/FloatingButton';
import { PlantModel } from './elements/PlantModel';

// const DEFAULT_SPARKLES_PROPS = {
//   count: 100,
//   scale: 1,
//   size: 1,
//   speed: 0.01,
// };
interface MainDisplaySceneProps {
  onLoad?: () => void;
  className?: string;
}

// Main Display Scene Component
export default function MainDisplayScene({ onLoad, className }: MainDisplaySceneProps) {
  const router = useRouter();
  const { animationCompleted } = useMouseEventState();
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

  const { radius, depth, count, factor, saturation, fade, speed } = useControls('Stars', {
    radius: { value: 30, min: 1, max: 100 },
    depth: { value: 10, min: 1, max: 100 },
    count: { value: 2000, min: 1, max: 10000 },
    factor: { value: 4, min: 1, max: 10 },
    saturation: { value: 0, min: 0, max: 1 },
    fade: { value: true, min: 0, max: 1 },
    speed: { value: 1.5, min: 0, max: 10 },
  });

  return (
    <Theme appearance={animationCompleted ? 'dark' : 'light'}>
      <div
        className={cn(
          'display-scene !z-3 transition-all duration-1000 ease-in-out',
          animationCompleted ? 'bg-[#0b0b0c]' : 'bg-transparent',
          className
        )}
      >
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
          style={{
            userSelect: 'none',
            touchAction: 'manipulation',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
          }}
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
            shadows={{
              type: 'contact',
              offset: 0.07,
              color: '#E6E6E6',
              opacity: !animationCompleted ? 0.9 : 0,
              blur: 3,
              smooth: true,
            }}
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

          {animationCompleted && (
            <>
              <Stars
                radius={radius}
                depth={20}
                count={count}
                factor={factor}
                saturation={saturation}
                fade={fade}
                speed={speed}
              />
              <Stars
                radius={radius}
                depth={40}
                count={count}
                factor={factor}
                saturation={saturation}
                fade={fade}
                speed={speed}
              />
              <Stars
                radius={radius}
                depth={depth}
                count={count}
                factor={factor}
                saturation={saturation}
                fade={fade}
                speed={speed}
              />
              <Stars
                radius={radius}
                depth={depth}
                count={count}
                factor={factor}
                saturation={saturation}
                fade={fade}
                speed={speed}
              />
            </>
          )}

          {/* Camera Control */}
          {/* <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={false} target={[0, 1, 0]} /> */}
        </Canvas>

        {/* Render the button outside the canvas (share state through context) */}
        {animationCompleted && (
          <div className="absolute right-0 bottom-[64px] left-0 flex flex-col items-center justify-center">
            <Heading size="7" weight="regular" className="z-10 text-[var(--accent-a9)]" mb="4">
              Welcome to ZERO GRAVITY
            </Heading>

            {/* Time Selection Buttons */}
            {/* <div className="flex max-w-[400px] flex-wrap items-center justify-center gap-3">
              {[10, 20, 30, 40, 50, 60].map(time => (
                <Button size="2" variant="surface" radius="full" key={time}>
                  {time} Minutes
                </Button>
              ))}
            </div> */}

            <Button size="3" variant="surface" radius="full" onClick={() => router.push('/spaceout')}>
              Start Meditation
              <Icon>arrow_forward</Icon>
            </Button>
          </div>
        )}
        {!animationCompleted && <FloatingButton />}
      </div>
    </Theme>
  );
}

// GLTF 모델 preload
// useGLTF.preload('/models/potted-plant-04/potted_plant_04_4k.gltf');
