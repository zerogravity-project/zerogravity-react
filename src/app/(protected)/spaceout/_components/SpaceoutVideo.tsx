'use client';

import { useRouter } from 'next/navigation';

import { useEffect, useRef, useState } from 'react';

import { getTodayString } from '@/app/_utils/dateTimeUtils';
import { cn } from '@/app/_utils/styleUtils';

interface SpaceoutVideoProps {
  videos?: string[];
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  onLoadStart?: () => void;
  onLoadedData?: () => void;
  onError?: (error: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
}

export default function SpaceoutVideo({
  videos = ['/videos/sun.mp4', '/videos/mercury.mp4'],
  poster,
  autoPlay = true,
  loop = false,
  controls = false,
  className,
  onLoadStart,
  onLoadedData,
  onError,
}: SpaceoutVideoProps) {
  const router = useRouter();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = videos[currentVideoIndex];

  const handleVideoEnd = () => {
    if (currentVideoIndex < videos.length - 1) {
      // Move to next video
      setCurrentVideoIndex(prev => prev + 1);
    } else {
      // All videos completed - navigate to record/daily page
      const today = getTodayString();
      router.replace(`/record/daily?date=${today}`);
    }
  };

  const handleUserInteraction = () => {
    if (!isUserInteracted && videoRef.current) {
      setIsUserInteracted(true);
      videoRef.current.muted = false;
      videoRef.current.play();
    }
  };

  useEffect(() => {
    if (videoRef.current && isUserInteracted) {
      videoRef.current.muted = false;
    }
  }, [isUserInteracted, currentVideoIndex]);

  return (
    <div
      className={cn('relative h-screen w-screen overflow-hidden', className)}
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      <video
        ref={videoRef}
        key={currentVideoIndex} // Change key to force load new video
        className="absolute inset-0 h-full w-full object-cover"
        src={currentVideo}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={!isUserInteracted}
        controls={controls}
        playsInline
        preload="auto"
        onLoadStart={onLoadStart}
        onLoadedData={onLoadedData}
        onEnded={handleVideoEnd}
        onError={onError}
      />

      {/* Video progress indicator */}
      <div className="absolute top-4 left-4 z-10 rounded bg-black/50 px-3 py-1 text-white">
        {currentVideoIndex + 1} / {videos.length}
      </div>

      {/* Sound activation guide */}
      {!isUserInteracted && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
          <div className="rounded-lg bg-black/70 px-6 py-4 text-center text-white">
            <p className="mb-2 text-lg font-medium">Touch to enable sound</p>
            <p className="text-sm text-gray-300">Click or tap the screen</p>
          </div>
        </div>
      )}
    </div>
  );
}
