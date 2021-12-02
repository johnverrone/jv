import React from 'react';
import { SEO } from '@components/SEO';
import { AppContainer } from '@components/AppContainer';
import { WheelNav } from '@components/Navigation';
import { WorkItem, WorkList } from '@components/WorkList';

const WorkPage: React.FC = () => {
  return (
    <>
      <SEO title="work" />
      <WheelNav />
      <AppContainer>
        <WorkList>
          <WorkItem
            title="Advent of Code 2021"
            link="https://github.com/johnverrone/aoc2021"
          />
          <WorkItem
            title="Advent of CSS/JS 2021"
            link="https://johnverrone-aoc2021.vercel.app"
          />
        </WorkList>
      </AppContainer>
    </>
  );
};

export default WorkPage;
