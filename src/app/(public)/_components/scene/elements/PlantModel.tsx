'use client';

import { useRouter } from 'next/navigation';

import { useCursor, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { forwardRef, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useMouseEventState } from '../_contexts/MouseEventContext';

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
    positionY: { value: -0.1, min: -10, max: 10, step: 0.01 },
    positionZ: { value: 0, min: -10, max: 10 },
    rotationX: { value: 0.2, min: -Math.PI, max: Math.PI },
    rotationY: { value: 1.7, min: -Math.PI, max: Math.PI },
    rotationZ: { value: 0, min: -Math.PI, max: Math.PI },
  });

  // GLTF Model Load
  const { scene } = useGLTF('/models/apple/food_apple_01_4k.gltf');

  // Get Context State Update Functions
  const {
    hovered,
    clickedForThreeSeconds,
    animationStarted,
    animationCompleted,
    setAnimationStarted,
    setAnimationCompleted,
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
  const [targetRotationX, setTargetRotationX] = useState(rotationX);
  const [currentRotationX, setCurrentRotationX] = useState(rotationX);
  // const [hasNavigated, setHasNavigated] = useState(false);
  // const [animationStarted, setAnimationStarted] = useState(false);

  // Set Target Y Position Based on Click State
  useEffect(() => {
    if (clickedForThreeSeconds) {
      setHovered(false);
      setTimeout(() => {
        setTargetY(-0.02);
        setTargetRotationY(rotationY + Math.PI * 2);
        setTargetRotationX(0);
        setAnimationStarted(true);
        // Increase Height if Clicked for 3 Seconds
      }, 1000);
    } else {
      // Original Position if Normal Click or Click Release
      setTargetY(positionY);
      setTargetRotationY(rotationY);
      setAnimationStarted(false);
    }
  }, [
    setHovered,
    positionY,
    rotationY,
    clickedForThreeSeconds,
    router,
    setTargetY,
    setTargetRotationY,
    setTargetRotationX,
    setAnimationStarted,
  ]);

  // Smooth Animation
  useFrame(() => {
    const positionLerpFactor = 0.01; // Animation Speed Adjustment (slower)
    const rotationYLerpFactor = 0.02; // Slower rotation
    const rotationXLerpFactor = 0.004; // Slower rotation
    const newY = THREE.MathUtils.lerp(currentY, targetY, positionLerpFactor);
    const newRotationY = THREE.MathUtils.lerp(currentRotationY, targetRotationY, rotationYLerpFactor);
    const newRotationX = THREE.MathUtils.lerp(currentRotationX, targetRotationX, rotationXLerpFactor);
    setCurrentY(newY);
    setCurrentRotationY(newRotationY);
    setCurrentRotationX(newRotationX);

    // Check if lerp animation is complete and navigate
    if (animationStarted && Math.abs(newRotationY - targetRotationY) < 6 && !animationCompleted) {
      setAnimationCompleted(true);
    }

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

  const onTouchStart = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    onPointerDown(e);
  };

  const onTouchMove = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    onPointerMove(e);
  };

  const onTouchEnd = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    onPointerUp(e);
  };

  useEffect(() => {
    if (!animationCompleted && !hovered) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'auto';
    }
  }, [hovered, animationCompleted]);

  return (
    <primitive
      ref={ref}
      object={scene}
      position={[positionX, currentY, positionZ]}
      rotation={[currentRotationX, currentRotationY, rotationZ]}
      scale={[2, 2, 2]}
      onPointerOver={onPointerOver}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      receiveShadow
      castShadow
    />
  );
});

PlantModel.displayName = 'PlantModel';
