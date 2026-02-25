import type { Metadata } from 'next';

import SpaceoutVideo from '../_components/SpaceoutVideo';
import { VIDEO_MANIFEST_URL, type SpaceoutVideoItem } from '../_constants/spaceout-video.constants';

export const metadata: Metadata = {
  themeColor: '#000000',
};

export default async function SpaceoutVideoPage() {
  const res = await fetch(VIDEO_MANIFEST_URL, { next: { revalidate: 3600 } });

  if (!res.ok) throw new Error(`Failed to fetch video manifest (${res.status})`);

  const data: unknown = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Invalid or empty video manifest');
  }

  // Validate each item has required fields
  const videos = data.filter(
    (item): item is SpaceoutVideoItem =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.filename === 'string' &&
      typeof item.description === 'string'
  );

  if (videos.length === 0) throw new Error('No valid videos in manifest');

  return <SpaceoutVideo videos={videos} />;
}
