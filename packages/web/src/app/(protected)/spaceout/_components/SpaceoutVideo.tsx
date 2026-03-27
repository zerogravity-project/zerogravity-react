'use client';

import { useRouter } from 'next/navigation';

import { Text } from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@zerogravity/shared/utils';

import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';

import { MAX_VIDEOS, VIDEO_BASE_URL, type SpaceoutVideoItem } from '../_constants/spaceout-video.constants';

/*
 * ============================================
 * Utilities
 * ============================================
 */

/** Fisher-Yates shuffle - returns a new shuffled array */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface SpaceoutVideoProps {
  videos: SpaceoutVideoItem[];
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  onLoadStart?: () => void;
  onLoadedData?: () => void;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function SpaceoutVideo({
  videos,
  poster,
  autoPlay = true,
  loop = false,
  controls = false,
  className,
  onLoadStart,
  onLoadedData,
}: SpaceoutVideoProps) {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const router = useRouter();
  const { openConfirmModal } = useModal();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Shuffle and pick up to MAX_VIDEOS on mount
  const shuffledRef = useRef<SpaceoutVideoItem[] | null>(null);
  if (!shuffledRef.current) {
    shuffledRef.current = shuffleArray(videos).slice(0, MAX_VIDEOS);
  }
  const shuffledVideos = shuffledRef.current;

  /*
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */
  const currentVideo = shuffledVideos[currentVideoIndex];

  /*
   * --------------------------------------------
   * 4. Helper Functions
   * --------------------------------------------
   */
  /** Advance to next video, or navigate to record page if all done */
  const advanceOrFinish = () => {
    if (currentVideoIndex < shuffledVideos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } else {
      router.replace('/record');
    }
  };

  /*
   * --------------------------------------------
   * 5. Event Handlers
   * --------------------------------------------
   */
  /** Handle video end - move to next video or navigate to record page */
  const handleVideoEnd = () => {
    advanceOrFinish();
  };

  /** Handle user interaction to enable sound */
  const handleUserInteraction = () => {
    if (!isUserInteracted && videoRef.current) {
      setIsUserInteracted(true);
      videoRef.current.muted = false;
      void videoRef.current.play();
    }
  };

  /** Handle video load error */
  const handleVideoError = () => {
    openConfirmModal({
      id: 'spaceout-video-playback-error',
      title: 'Video Load Failed',
      description: 'Failed to load the video. Would you like to retry or skip?',
      confirmText: 'Retry',
      cancelText: 'Skip',
      onConfirm: () => {
        setRetryKey(prev => prev + 1);
      },
      onCancel: advanceOrFinish,
    });
  };

  /*
   * --------------------------------------------
   * 6. Effects
   * --------------------------------------------
   */
  /** Unmute video when user has interacted */
  useEffect(() => {
    if (videoRef.current && isUserInteracted) {
      videoRef.current.muted = false;
    }
  }, [isUserInteracted, currentVideoIndex]);

  /*
   * --------------------------------------------
   * 7. Return
   * --------------------------------------------
   */
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Click to enable sound"
      className={cn('relative h-[100dvh] w-[100dvw] overflow-hidden bg-[var(--background-dark)]', className)}
      onClick={handleUserInteraction}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleUserInteraction();
        }
      }}
      onTouchStart={handleUserInteraction}
    >
      {/* Screen reader description for ambient video content */}
      <p id="spaceout-video-description" className="sr-only">
        {currentVideo.description}
      </p>

      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- Ambient meditation video without speech */}
      <video
        ref={videoRef}
        key={`${currentVideoIndex}-${retryKey}`}
        className="absolute inset-0 h-full w-full object-cover"
        src={`${VIDEO_BASE_URL}/${currentVideo.filename}`}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={!isUserInteracted}
        controls={controls}
        playsInline
        preload="auto"
        aria-describedby="spaceout-video-description"
        onLoadStart={onLoadStart}
        onLoadedData={onLoadedData}
        onEnded={handleVideoEnd}
        onError={handleVideoError}
      />

      {/* Sound activation guide */}
      {!isUserInteracted && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
          <div className="flex flex-col gap-1 rounded-lg bg-black/70 px-6 py-4 text-center text-white">
            <Text size="3" weight="regular">
              Touch to enable sound
            </Text>
            <Text size="2" weight="regular" color="gray">
              Click or tap the screen
            </Text>
          </div>
        </div>
      )}
    </div>
  );
}
