import { Logo } from '../Logo';
import { DesktopNav } from '../Navbar';
import React from 'react';
import css from './Header.module.css';

export const Header = () => {
  return (
    <div className={css.headerWrapper}>
      <header className={css.header}>
        <Logo />
        {/* <DesktopNav /> */}
      </header>
    </div>
  );
};
