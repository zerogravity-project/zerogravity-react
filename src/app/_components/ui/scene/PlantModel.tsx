'use client';

import { useCursor, useGLTF } from '@react-three/drei';
import { useControls } from 'leva';
import { forwardRef, useEffect, useRef } from 'react';
import * as THREE from 'three';

import { useHoverState } from './HoverContext';

interface PlantModelProps {
  onLoad?: () => void;
  ref?: React.RefObject<THREE.Group>;
}

// GLTF 모델 컴포넌트
export const PlantModel = forwardRef<THREE.Group, PlantModelProps>(({}, ref) => {
  // 모델 위치, 회전 설정 GUI
  const { positionX, positionY, positionZ, rotationX, rotationY, rotationZ } = useControls('PlantModel', {
    positionX: { value: 0, min: -10, max: 10 },
    positionY: { value: -0.15, min: -10, max: 10 },
    positionZ: { value: 0, min: -10, max: 10 },
    rotationX: { value: 0.2, min: -Math.PI, max: Math.PI },
    rotationY: { value: 1.7, min: -Math.PI, max: Math.PI },
    rotationZ: { value: 0, min: -Math.PI, max: Math.PI },
  });

  // GLTF 모델 로드
  const { scene } = useGLTF('/models/potted-plant-04/potted_plant_04_4k.gltf');

  // Context에서 상태 업데이트 함수 가져오기
  const { hovered, setHovered, setDomCoords } = useHoverState();
  // 3D 모델과 마우스 호버 상태 연동
  useCursor(hovered);

  // 타이머 ID를 저장할 ref
  const timeoutRef = useRef<number | null>(null);

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
      position={[positionX, positionY, positionZ]}
      rotation={[rotationX, rotationY, rotationZ]}
      onPointerOver={onPointerOver}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
    />
  );
});

PlantModel.displayName = 'PlantModel';
