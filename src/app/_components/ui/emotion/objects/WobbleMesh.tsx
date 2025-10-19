/* eslint-disable import/order */
'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import CustomShaderMaterial from 'three-custom-shader-material';
import CSMVanilla from 'three-custom-shader-material/vanilla';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

import simplexNoise4d from '../shaders/includes/simplexNoise4d.glsl';
import wobbleFragmentShader from '../shaders/wobble/fragment.glsl';
import wobbleVertexShader from '../shaders/wobble/vertex.glsl';

/**
 * Default Material Properties
 */
const DEFAULT_MATERIAL_PROPS = {
  transmission: 0,
  ior: 1.3,
  thickness: 1.5,
  iridescence: 0,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [120, 800],
};

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
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  // Create shader uniforms once (stable object reference for GPU)
  const uniforms = useMemo(
    () => ({
      uTime: new THREE.Uniform(0),
      uPositionFrequency: new THREE.Uniform(0),
      uTimeFrequency: new THREE.Uniform(0),
      uStrength: new THREE.Uniform(0),
      uWarpPositionFrequency: new THREE.Uniform(0),
      uWarpTimeFrequency: new THREE.Uniform(0),
      uWarpStrength: new THREE.Uniform(0),
      uColorA: new THREE.Uniform(new THREE.Color(colorA)),
      uColorB: new THREE.Uniform(new THREE.Color(colorB)),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Empty array: create once and reuse (update .value in useFrame)
  );

  // Compose vertex shader with inlined noise function
  const composedVertexShader = useMemo(() => {
    const cleaned = wobbleVertexShader.replace('#include ../includes/simplexNoise4d.glsl', '');
    return `${simplexNoise4d}\n${cleaned}`;
  }, []);

  // Geometry with computed tangents for shader
  const geometry = useMemo<THREE.BufferGeometry>(() => {
    const base = new THREE.IcosahedronGeometry(radius, subdivisions);
    const merged = mergeVertices(base) as THREE.BufferGeometry;
    merged.computeTangents();
    return merged;
  }, [radius, subdivisions]);

  // Target colors for smooth transitions (using refs to avoid creating new objects each frame)
  const targetColorA = useRef(new THREE.Color(colorA));
  const targetColorB = useRef(new THREE.Color(colorB));

  // Update target colors when props change
  useEffect(() => {
    targetColorA.current.set(colorA);
    targetColorB.current.set(colorB);
  }, [colorA, colorB]);

  // Animate uniforms every frame
  useFrame(({ clock }) => {
    // Update time for animation
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

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      {/* Custom shader material with wobble effect */}
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
      {/* Custom depth material for shadows (reflects wobble deformation) */}
      <primitive
        attach="customDepthMaterial"
        object={useMemo(
          () =>
            new CSMVanilla({
              baseMaterial: THREE.MeshDepthMaterial,
              vertexShader: composedVertexShader,
              uniforms,
              depthPacking: THREE.RGBADepthPacking,
            }),
          [composedVertexShader, uniforms]
        )}
      />
    </mesh>
  );
}
