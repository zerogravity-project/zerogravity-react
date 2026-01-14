'use client';

import { ComponentProps, lazy, Suspense } from 'react';

import type { EmotionPlanetScene } from '../scene';

type EmotionPlanetSceneProps = ComponentProps<typeof EmotionPlanetScene>;

const LazyEmotionPlanetSceneInner = lazy(() => import('../scene').then(mod => ({ default: mod.EmotionPlanetScene })));

/**
 * Lazy-loaded EmotionPlanetScene with built-in Suspense
 * Automatically code-splits Three.js bundle
 */
export function LazyEmotionPlanetScene(props: EmotionPlanetSceneProps) {
  return (
    <Suspense fallback={null}>
      <LazyEmotionPlanetSceneInner {...props} />
    </Suspense>
  );
}
