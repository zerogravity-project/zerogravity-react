'use client';

import { useEffect, useMemo, useRef } from 'react';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import CustomShaderMaterial from 'three-custom-shader-material';

import simplexNoise4d from '../shaders/includes/simplexNoise4d.glsl';
import wobbleFragmentShader from '../shaders/wobble/fragment.glsl';
import wobbleVertexShader from '../shaders/wobble/vertex.glsl';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Default Material Properties */
const DEFAULT_MATERIAL_PROPS = {
  transmission: 0,
  ior: 1.3,
  thickness: 1.5,
  iridescence: 0,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [120, 800],
};

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface WobbleMeshProps {
  radius?: number;
  subdivisions?: number;
  positionFrequency: number;
  timeFrequency: number;
  warpPositionFrequency: number;
  warpTimeFrequency: number;
  warpStrength: number;
  metalness: number;
  roughness: number;
  colorA: string;
  colorB: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function WobbleMesh({
  radius = 2.5,
  subdivisions = 50,
  positionFrequency,
  timeFrequency,
  warpPositionFrequency,
  warpTimeFrequency,
  warpStrength,
  metalness,
  roughness,
  colorA,
  colorB,
}: WobbleMeshProps) {
  /*
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  /** Target colors for smooth transitions (using refs to avoid creating new objects each frame) */
  const targetColorA = useRef(new THREE.Color(colorA));
  const targetColorB = useRef(new THREE.Color(colorB));

  /*
   * --------------------------------------------
   * 2. Computed Values
   * --------------------------------------------
   */
  /** Create shader uniforms once (stable object reference for GPU) */
  const uniforms = useMemo(
    () => ({
      uTime: new THREE.Uniform(0),
      uPositionFrequency: new THREE.Uniform(0),
      uTimeFrequency: new THREE.Uniform(0),
      uWarpPositionFrequency: new THREE.Uniform(0),
      uWarpTimeFrequency: new THREE.Uniform(0),
      uWarpStrength: new THREE.Uniform(0),
      uColorA: new THREE.Uniform(new THREE.Color(colorA)),
      uColorB: new THREE.Uniform(new THREE.Color(colorB)),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Empty array: create once and reuse (update .value in useFrame)
  );

  /** Compose vertex shader with inlined noise function */
  const composedVertexShader = useMemo(() => {
    return `${simplexNoise4d}\n${wobbleVertexShader}`;
  }, []);

  /** Merged geometry for optimized rendering */
  const geometry = useMemo<THREE.BufferGeometry>(() => {
    const base = new THREE.IcosahedronGeometry(radius, subdivisions);
    return mergeVertices(base) as THREE.BufferGeometry;
  }, [radius, subdivisions]);

  /*
   * --------------------------------------------
   * 3. Effects
   * --------------------------------------------
   */
  /** Update target colors when props change */
  useEffect(() => {
    targetColorA.current.set(colorA);
    targetColorB.current.set(colorB);
  }, [colorA, colorB]);

  /** Animate uniforms every frame */
  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();

    // Lerp speed: lower = smoother/slower (recommended: 0.02 ~ 0.1)
    const lerpSpeed = 0.03;

    // Smooth transitions for position-based parameters
    uniforms.uPositionFrequency.value = THREE.MathUtils.lerp(
      uniforms.uPositionFrequency.value,
      positionFrequency,
      lerpSpeed
    );
    uniforms.uWarpPositionFrequency.value = THREE.MathUtils.lerp(
      uniforms.uWarpPositionFrequency.value,
      warpPositionFrequency,
      lerpSpeed
    );
    uniforms.uWarpStrength.value = THREE.MathUtils.lerp(uniforms.uWarpStrength.value, warpStrength, lerpSpeed);

    // Instant update for time-based parameters (no lerp)
    uniforms.uTimeFrequency.value = timeFrequency;
    uniforms.uWarpTimeFrequency.value = warpTimeFrequency;

    // Smooth color transitions
    uniforms.uColorA.value.lerp(targetColorA.current, lerpSpeed);
    uniforms.uColorB.value.lerp(targetColorB.current, lerpSpeed);

    // Smooth material property transitions
    if (materialRef.current) {
      materialRef.current.metalness = THREE.MathUtils.lerp(materialRef.current.metalness, metalness, lerpSpeed);
      materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, roughness, lerpSpeed);
    }
  });

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      {/* Custom shader material with noise-based color pattern */}
      <CustomShaderMaterial
        ref={node => {
          materialRef.current = node as THREE.MeshPhysicalMaterial | null;
        }}
        baseMaterial={THREE.MeshPhysicalMaterial}
        vertexShader={composedVertexShader}
        fragmentShader={wobbleFragmentShader}
        uniforms={uniforms}
        metalness={metalness}
        roughness={roughness}
        transmission={DEFAULT_MATERIAL_PROPS.transmission}
        ior={DEFAULT_MATERIAL_PROPS.ior}
        thickness={DEFAULT_MATERIAL_PROPS.thickness}
        transparent={true}
        iridescence={DEFAULT_MATERIAL_PROPS.iridescence}
        iridescenceIOR={DEFAULT_MATERIAL_PROPS.iridescenceIOR}
        iridescenceThicknessRange={DEFAULT_MATERIAL_PROPS.iridescenceThicknessRange as [number, number]}
      />
    </mesh>
  );
}
