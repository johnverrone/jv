import { Logo } from 'components/Logo';
import React from 'react';
import css from './Header.module.css';

export const Header = () => {
  return (
    <div className={css.headerWrapper}>
      <header className={css.header}>
        <Logo />
      </header>
    </div>
  );
};
