import SpaceoutVideo from '../_components/SpaceoutVideo';

export default function SpaceoutVideoPage() {
  return (
    <SpaceoutVideo videos={['/videos/sun.mp4', '/videos/mercury.mp4']} autoPlay={true} loop={false} controls={false} />
  );
}
