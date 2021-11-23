import React from 'react';
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { WheelNav } from '@components/Navigation';

const WorkPage: React.FC = () => {
  return (
    <>
      <SEO title="work" />
      <WheelNav />
      <AppContainer>
        <p>🚧 coming soon 🚧</p>
      </AppContainer>
    </>
  );
};

export default WorkPage;
