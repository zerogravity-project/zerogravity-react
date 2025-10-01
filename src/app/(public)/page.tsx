'use client';

import { Clock, Footer, MainDisplayScene } from '../_components/ui';

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
      <div className="relative space-y-4 p-8">
        <Clock />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
