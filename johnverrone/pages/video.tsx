import React from 'react';
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { WheelNav } from '@components/Navigation';
import { YouTubeVideo } from '@components/YouTubeVideo';

const VideoPage: React.FC = () => {
  return (
    <>
      <SEO title="video" />
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
