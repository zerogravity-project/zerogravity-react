'use client';

import { useRouter } from 'next/navigation';

import { useCursor, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { forwardRef, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useMouseEventState } from './MouseEventContext';

interface PlantModelProps {
  onLoad?: () => void;
  ref?: React.RefObject<THREE.Group>;
}

// GLTF Model Component
export const PlantModel = forwardRef<THREE.Group, PlantModelProps>(({}, ref) => {
  const router = useRouter();
  // Model Position, Rotation Settings GUI
  const { positionX, positionY, positionZ, rotationX, rotationY, rotationZ } = useControls('PlantModel', {
    positionX: { value: 0, min: -10, max: 10 },
    positionY: { value: -0.08, min: -10, max: 10, step: 0.01 },
    positionZ: { value: 0, min: -10, max: 10 },
    rotationX: { value: 0.2, min: -Math.PI, max: Math.PI },
    rotationY: { value: 1.7, min: -Math.PI, max: Math.PI },
    rotationZ: { value: 0, min: -Math.PI, max: Math.PI },
  });

  // GLTF Model Load
  const { scene } = useGLTF('/models/potted-plant/potted_plant_04_4k.gltf');

  // Get Context State Update Functions
  const {
    hovered,
    clickedForThreeSeconds,
    setHovered,
    setClicked,
    setDomCoords,
    setClickedForThreeSeconds,
    setProgress,
  } = useMouseEventState();
  // 3D Model and Mouse Hover State Connection
  useCursor(hovered);

  // State for Animation
  const [targetY, setTargetY] = useState(positionY);
  const [currentY, setCurrentY] = useState(positionY);
  const [targetRotationY, setTargetRotationY] = useState(rotationY);
  const [currentRotationY, setCurrentRotationY] = useState(rotationY);

  // Set Target Y Position Based on Click State
  useEffect(() => {
    if (clickedForThreeSeconds) {
      setHovered(false);
      setTimeout(() => {
        router.push('/spaceout/main');
        // Increase Height if Clicked for 3 Seconds
        // setTargetY(positionY + 0.5);
        // setTargetRotationY(rotationY + Math.PI * 2);
      }, 1000);
    } else {
      // Original Position if Normal Click or Click Release
      setTargetY(positionY);
      setTargetRotationY(rotationY);
    }
  }, [setHovered, positionY, rotationY, clickedForThreeSeconds, router]);

  // Smooth Animation
  useFrame((_, delta) => {
    const lerpFactor = 0.5 * delta; // Animation Speed Adjustment
    const newY = THREE.MathUtils.lerp(currentY, targetY, lerpFactor);
    const newRotationY = THREE.MathUtils.lerp(currentRotationY, targetRotationY, lerpFactor);
    setCurrentY(newY);
    setCurrentRotationY(newRotationY);

    // Calculate Progress (Only When Clicked)
    if (pointerDownTimeRef.current) {
      const elapsed = Date.now() - pointerDownTimeRef.current;
      const progressPercent = Math.min(elapsed / 3000, 1); // 3 Seconds = 100%
      setProgress(progressPercent);

      // 3 Seconds Reached
      if (progressPercent >= 1 && !clickedForThreeSeconds) {
        setClickedForThreeSeconds(true);
      }
    }
  });

  // Ref to Save Timer ID
  const timeoutRef = useRef<number | null>(null);
  const pointerDownTimeRef = useRef<number | null>(null);

  /**
   * Mouse Event Handler
   */
  const onPointerOver = (event: any) => {
    setHovered(true);
    setDomCoords({ x: event.clientX, y: event.clientY });

    event.stopPropagation();
  };

  const onPointerMove = (event: any) => {
    if (!hovered) {
      setHovered(true); // Force Keep Hovered State Due to Float
    }
    setDomCoords({ x: event.clientX, y: event.clientY }); // DOM Coordinates Update in Real Time

    event.stopPropagation();
  };

  const onPointerOut = (event: any) => {
    // Out Event is Processed After 100ms Delay
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setHovered(false);
      timeoutRef.current = null;
    }, 100); // Hovered State is Maintained for 100ms

    event.stopPropagation();
  };

  const onPointerDown = (e: any) => {
    e.stopPropagation();
    setClicked(true);

    // Record Click Start Time
    pointerDownTimeRef.current = Date.now();
    setProgress(0);
  };

  const onPointerUp = (e: any) => {
    e.stopPropagation();
    setClicked(false);

    // Reset Click Time
    pointerDownTimeRef.current = null;
    setProgress(0);
  };

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'auto';
    }
  }, [hovered]);

  return (
    <primitive
      ref={ref}
      object={scene}
      position={[positionX, currentY, positionZ]}
      rotation={[rotationX, currentRotationY, rotationZ]}
      onPointerOver={onPointerOver}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      receiveShadow
      castShadow
    />
  );
});

PlantModel.displayName = 'PlantModel';
