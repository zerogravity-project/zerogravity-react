'use client';

import { Footer } from '../_components/ui';

import Clock from './_components/clock/Clock';

export default function Home() {
  return (
    <>
      {/* 3D Background Scene */}
      {/* <MouseEventProvider>
        <MainDisplayScene onLoad={handleSceneLoad} />
      </MouseEventProvider> */}

      {/* Main Content */}
      <Clock />

      {/* Footer */}
      <Footer />
    </>
  );
}
