import { Metadata } from 'next';
import VideoPage from './video-page';

export const metadata: Metadata = {
  title: 'video',
};

export default function Page() {
  return <VideoPage />;
}
