import React from 'react';
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { WheelNav } from '@components/Navigation';

const VideoPage: React.FC = () => {
  return (
    <>
      <SEO title="video" />
      <WheelNav />
      <AppContainer>
        <p>🚧 coming soon 🚧</p>
      </AppContainer>
    </>
  );
};

export default VideoPage;
