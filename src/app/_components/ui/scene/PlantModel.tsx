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

// GLTF 모델 컴포넌트
export const PlantModel = forwardRef<THREE.Group, PlantModelProps>(({}, ref) => {
  const router = useRouter();
  // 모델 위치, 회전 설정 GUI
  const { positionX, positionY, positionZ, rotationX, rotationY, rotationZ } = useControls('PlantModel', {
    positionX: { value: 0, min: -10, max: 10 },
    positionY: { value: -0.08, min: -10, max: 10, step: 0.01 },
    positionZ: { value: 0, min: -10, max: 10 },
    rotationX: { value: 0.2, min: -Math.PI, max: Math.PI },
    rotationY: { value: 1.7, min: -Math.PI, max: Math.PI },
    rotationZ: { value: 0, min: -Math.PI, max: Math.PI },
  });

  // GLTF 모델 로드
  const { scene } = useGLTF('/models/potted-plant/potted_plant_04_4k.gltf');

  // Context에서 상태 업데이트 함수 가져오기
  const {
    hovered,
    clickedForThreeSeconds,
    setHovered,
    setClicked,
    setDomCoords,
    setClickedForThreeSeconds,
    setProgress,
  } = useMouseEventState();
  // 3D 모델과 마우스 호버 상태 연동
  useCursor(hovered);

  // 애니메이션을 위한 상태
  const [targetY, setTargetY] = useState(positionY);
  const [currentY, setCurrentY] = useState(positionY);
  const [targetRotationY, setTargetRotationY] = useState(rotationY);
  const [currentRotationY, setCurrentRotationY] = useState(rotationY);

  // 클릭 상태에 따른 목표 Y 위치 설정
  useEffect(() => {
    if (clickedForThreeSeconds) {
      setHovered(false);
      setTimeout(() => {
        router.push('/spaceout/main');
        // 3초 이상 클릭되면 높이 올리기
        // setTargetY(positionY + 0.5);
        // setTargetRotationY(rotationY + Math.PI * 2);
      }, 1000);
    } else {
      // 일반 클릭이나 클릭 해제시 원래 위치
      setTargetY(positionY);
      setTargetRotationY(rotationY);
    }
  }, [setHovered, positionY, rotationY, clickedForThreeSeconds, router]);

  // 부드러운 애니메이션
  useFrame((_, delta) => {
    const lerpFactor = 0.5 * delta; // 애니메이션 속도 조절
    const newY = THREE.MathUtils.lerp(currentY, targetY, lerpFactor);
    const newRotationY = THREE.MathUtils.lerp(currentRotationY, targetRotationY, lerpFactor);
    setCurrentY(newY);
    setCurrentRotationY(newRotationY);

    // 진행률 계산 (클릭 중일 때만)
    if (pointerDownTimeRef.current) {
      const elapsed = Date.now() - pointerDownTimeRef.current;
      const progressPercent = Math.min(elapsed / 3000, 1); // 3초 = 100%
      setProgress(progressPercent);

      // 3초 도달 시
      if (progressPercent >= 1 && !clickedForThreeSeconds) {
        setClickedForThreeSeconds(true);
      }
    }
  });

  // 타이머 ID를 저장할 ref
  const timeoutRef = useRef<number | null>(null);
  const pointerDownTimeRef = useRef<number | null>(null);

  /**
   * 마우스 이벤트 핸들러
   */
  const onPointerOver = (event: any) => {
    setHovered(true);
    setDomCoords({ x: event.clientX, y: event.clientY });

    event.stopPropagation();
  };

  const onPointerMove = (event: any) => {
    if (!hovered) {
      setHovered(true); // Float 때문에 끊기는 호버 상태 강제 유지
    }
    setDomCoords({ x: event.clientX, y: event.clientY }); // DOM 좌표 실시간 업데이트

    event.stopPropagation();
  };

  const onPointerOut = (event: any) => {
    // Out 이벤트는 100ms 딜레이 후 처리
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setHovered(false);
      timeoutRef.current = null;
    }, 100); // 100ms 동안은 마우스가 잠깐 벗어나도 호버 상태 유지

    event.stopPropagation();
  };

  const onPointerDown = (e: any) => {
    e.stopPropagation();
    setClicked(true);

    // 클릭 시작 시간 기록
    pointerDownTimeRef.current = Date.now();
    setProgress(0);
  };

  const onPointerUp = (e: any) => {
    e.stopPropagation();
    setClicked(false);

    // 클릭 시간 리셋
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
