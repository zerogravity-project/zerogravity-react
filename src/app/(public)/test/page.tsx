'use client';

import { useRef, useState } from 'react';

import { EmotionPlanetScene } from '@/app/_components/ui/emotion';

export default function TestPage() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleDownload = () => {
    // Find canvas element inside the container
    const canvas = canvasContainerRef.current?.querySelector('canvas');
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    // Wait a bit for the current frame to be fully rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Convert canvas to blob and download
        canvas.toBlob(blob => {
          if (!blob) return;

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `emotion-planet-${Date.now()}.png`;
          link.href = url;
          link.click();

          // Clean up
          URL.revokeObjectURL(url);
        });
      });
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      {!isLoaded && (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black text-gray-500">
          Loading 3D scene...
        </div>
      )}
      <div ref={canvasContainerRef} style={{ opacity: isLoaded ? 1 : 0 }}>
        <EmotionPlanetScene
          emotionId={1}
          width={800}
          height={800}
          isGlow={false}
          isSparkles={false}
          onSceneLoaded={() => setIsLoaded(true)}
        />
      </div>
      <button
        onClick={handleDownload}
        disabled={!isLoaded}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Download PNG
      </button>
    </div>
  );
}
