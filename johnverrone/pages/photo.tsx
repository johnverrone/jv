import React from 'react';
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { WheelNav } from '@components/Navigation';

const PhotoPage: React.FC = () => {
  return (
    <>
      <SEO title="photo" />
      <WheelNav />
      <AppContainer>
        <p>🚧 coming soon 🚧</p>
      </AppContainer>
    </>
  );
};

export default PhotoPage;
