'use client';

import { AppContainer } from '@components/AppContainer';
import { WheelNav } from '@components/Navigation';
import { WorkItem, WorkList } from '@components/WorkList';

const WorkPage = () => {
  return (
    <>
      <WheelNav />
      <AppContainer>
        <WorkList>
          <WorkItem
            title="Bunkie Bois"
            link="https://github.com/johnverrone/bunkie-bois"
          />
          <WorkItem
            title="Advent of Code 2022"
            link="https://github.com/johnverrone/aoc2022"
          />
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
