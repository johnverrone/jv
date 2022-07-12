import React from 'react';

export const Hamburger = () => {
  return (
    <svg
      width="24"
      height="22"
      viewBox="0 0 24 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="1"
        y1="1"
        x2="23"
        y2="1"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="11"
        x2="23"
        y2="11"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="21"
        x2="23"
        y2="21"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
