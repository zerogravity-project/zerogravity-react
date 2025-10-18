'use client';

import { Footer } from '../_components/ui';

import Clock from './_components/clock/Clock';
import MainDisplayScene from './_components/scene/MainDisplayScene';

export default function Home() {
  const handleSceneLoad = () => {
    // eslint-disable-next-line no-console
    console.log('3D Scene loaded successfully!');
  };

  return (
    <>
      {/* 3D Background Scene */}
      <MainDisplayScene onLoad={handleSceneLoad} />

      {/* Main Content */}
      <Clock />

      {/* Footer */}
      <Footer />
    </>
  );
}
