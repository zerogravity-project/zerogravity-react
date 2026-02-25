import type { Metadata } from 'next';

import SpaceoutVideo from '../_components/SpaceoutVideo';

export const metadata: Metadata = {
  themeColor: '#0b0b0c',
};

export default function SpaceoutVideoPage() {
  return <SpaceoutVideo />;
}
