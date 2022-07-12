import React from 'react';
import css from './Logo.module.css';

export const Logo = () => {
  return (
    <div className={css.logo}>
      <span className={css.john}>John</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={css.ampersand}
        src="/heart.svg"
        height={28}
        alt="Apersand syled like a heart"
      />
      <span className={css.molly}>Molly</span>
    </div>
  );
};
