/* eslint-disable import/order */
'use client';

import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import CustomShaderMaterial from 'three-custom-shader-material';
import CSMVanilla from 'three-custom-shader-material/vanilla';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

import simplexNoise4d from './shaders/includes/simplexNoise4d.glsl';
import wobbleFragmentShader from './shaders/wobble/fragment.glsl';
import wobbleVertexShader from './shaders/wobble/vertex.glsl';

interface WobbleMeshProps {
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

  // Leva controls for debugging (Material properties)
  const materialControls = useControls('Material', {
    metalness: { value: metalness, min: 0, max: 1, step: 0.001 },
    roughness: { value: roughness, min: 0, max: 1, step: 0.001 },
    transmission: { value: 0, min: 0, max: 1, step: 0.001 },
    ior: { value: 1.3, min: 0, max: 10, step: 0.001 },
    thickness: { value: 1.5, min: 0, max: 10, step: 0.001 },
    iridescence: { value: 0, min: 0, max: 1, step: 0.001 },
    iridescenceIOR: { value: 1.3, min: 0, max: 2.5, step: 0.001 },
    iridescenceThicknessRange: { value: [120, 800], min: 0, max: 1000, step: 0.001 },
  });

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
    const base = new THREE.IcosahedronGeometry(2.5, 50);
    const merged = mergeVertices(base) as THREE.BufferGeometry;
    merged.computeTangents();
    return merged;
  }, []);

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
        transmission={materialControls.transmission}
        ior={materialControls.ior}
        thickness={materialControls.thickness}
        transparent={true}
        iridescence={materialControls.iridescence}
        iridescenceIOR={materialControls.iridescenceIOR}
        iridescenceThicknessRange={materialControls.iridescenceThicknessRange}
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
