import React, { CSSProperties } from 'react';
import { Text } from '../Text';
import { IFreeSpace } from './types';
import { height, position } from './utils';
import css from './Calendar.module.scss';
import classNames from 'classnames';
import Link from 'next/link';

interface FreeSpaceProps {
  event: IFreeSpace;
}

export const FreeSpace = ({ event }: FreeSpaceProps) => {
  const eventTop = position(event.startTime);
  const eventHeight = height(event.startTime, event.endTime);

  return (
    <div
      style={
        {
          '--top': `${eventTop}px`,
          '--height': `${eventHeight}px`,
        } as CSSProperties
      }
      className={css['free-space']}
    >
      <div>
        <Text variant="heading3">No events today!</Text>
        <Text variant="body3" tag="p">
          Check out the{' '}
          <Link href="/evergreen" className="link">
            things to do
          </Link>{' '}
          page for food, drink, golf, hike, and sightseeing recommendations. We
          hope you enjoy exploring Colorado.
        </Text>
      </div>
    </div>
  );
};
