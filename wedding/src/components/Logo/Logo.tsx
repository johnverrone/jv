import React from 'react';
import css from './Logo.module.css';

export const Logo = () => {
  return (
    <div className={css.logo}>
      <span className={css.john}>John</span>
      <Heartpersand />
      <span className={css.molly}>Molly</span>
    </div>
  );
};

const Heartpersand = () => (
  <svg
    width="34"
    height="30"
    viewBox="0 0 34 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className={css.heartpersand}
      d="M21.7132 14.6462C21.7132 19.5448 19.4842 23.5 18.2895 24.7934M18.2895 24.7934C16.624 26.5964 14.1811 29.1671 10.0727 28.9922C5.2796 28.7881 1.32734 26.2892 1 20.7695C0.999943 15 4.48432 13 5.9643 12.0219M18.2895 24.7934C19.9842 26.5 23.1854 28.9922 25.6504 28.9922C29.7588 28.9922 30.9571 27.9425 31.9842 26.8928M18.2895 24.7934C15.3223 22.4024 9.21681 16.5357 7.16261 13.5965C4.59486 9.92251 2.97203 7.29159 3.22539 4.67398C3.48421 2.00001 5.48421 1 7.16261 1C8.87445 1 10.9842 3.5 10.9842 3.5C10.9842 3.5 12.7453 1 15.4842 1C18.2231 1 19.3959 3.44136 18.9842 5.5C18.4842 8 15.4843 11 14.01 12.1969"
      strokeWidth="2"
      strokeLinecap="square"
    />
  </svg>
);
