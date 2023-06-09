'use client';

import { AppContainer } from '@components/AppContainer';
import { WheelNav } from '@components/Navigation';
import { YouTubeVideo } from '@components/YouTubeVideo';

const VideoPage = () => {
  return (
    <>
      <WheelNav />
      <AppContainer>
        <YouTubeVideo videoId="GAp0sDY30U4" title="Colorado Hiking" />
        <div style={{ height: 100 }} />
        <YouTubeVideo videoId="B4JxmDm1bA0" title="Southwest Roadtrip" />
      </AppContainer>
    </>
  );
};

export default VideoPage;
