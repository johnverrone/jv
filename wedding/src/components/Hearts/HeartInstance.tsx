import React, { CSSProperties } from 'react';
import css from './Hearts.module.css';

interface HeartInstanceProps {
  color: string;
  size: number;
  style: CSSProperties;
}

export const HeartInstance = ({ color, size, style }: HeartInstanceProps) => (
  <span className={css.heartWrapper} style={style}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={css.heartSvg}
      viewBox="0 0 752 752"
    >
      <defs>
        <clipPath id="a">
          <path d="M139.21 168h473.58v416H139.21z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <path
          d="M198.4 406.38c-41.27-40.5-59.191-84.898-59.191-124.63 0-67.762 45.184-112.95 113.71-112.95 63.859 0 85.699 29.609 123.08 72.445 37.387-42.836 59.191-72.441 123.05-72.441 68.559 0 113.75 45.184 113.75 112.95 0 39.73-17.922 84.133-59.188 124.63l-177.61 176.81z"
          fill={color}
        />
      </g>
    </svg>
  </span>
);
