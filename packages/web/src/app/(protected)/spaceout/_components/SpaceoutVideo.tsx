'use client';

import { useRouter } from 'next/navigation';

import { Text } from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';

import { CDN_BASE_URL } from '@zerogravity/shared/config';
import { cn } from '@zerogravity/shared/utils';

import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Default video URLs from CDN */
const DEFAULT_VIDEOS = [`${CDN_BASE_URL}/videos/sun.mp4`, `${CDN_BASE_URL}/videos/mercury.mp4`];

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface SpaceoutVideoProps {
  videos?: string[];
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
  videos = DEFAULT_VIDEOS,
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

  /*
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */
  const currentVideo = videos[currentVideoIndex];

  /*
   * --------------------------------------------
   * 4. Event Handlers
   * --------------------------------------------
   */
  /** Handle video end - move to next video or navigate to record page */
  const handleVideoEnd = () => {
    if (currentVideoIndex < videos.length - 1) {
      // Move to next video
      setCurrentVideoIndex(prev => prev + 1);
    } else {
      // All videos completed - navigate to record selection page
      router.replace('/record');
    }
  };

  /** Handle user interaction to enable sound */
  const handleUserInteraction = () => {
    if (!isUserInteracted && videoRef.current) {
      setIsUserInteracted(true);
      videoRef.current.muted = false;
      videoRef.current.play();
    }
  };

  /** Handle video load error */
  const handleVideoError = () => {
    openConfirmModal({
      title: 'Video Load Failed',
      description: 'Failed to load the video. Would you like to retry or skip?',
      confirmText: 'Retry',
      cancelText: 'Skip',
      onConfirm: () => {
        // Retry loading the current video
        setRetryKey(prev => prev + 1);
      },
      onCancel: () => {
        // Skip to next video or navigate to record page
        if (currentVideoIndex < videos.length - 1) {
          setCurrentVideoIndex(prev => prev + 1);
        } else {
          router.replace('/record');
        }
      },
    });
  };

  /*
   * --------------------------------------------
   * 5. Effects
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
   * 6. Return
   * --------------------------------------------
   */
  return (
    <div
      className={cn('relative h-[100dvh] w-[100dvw] overflow-hidden bg-[var(--background-dark)]', className)}
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      <video
        ref={videoRef}
        key={`${currentVideoIndex}-${retryKey}`} // Change key to force reload video
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
