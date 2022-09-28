import { Logo } from '../Logo';
import { DesktopNav } from '../Navbar';
import React from 'react';
import css from './Header.module.css';

export const Header = () => {
  const showNav = process.env.NEXT_PUBLIC_TEASER_MODE !== '1';
  return (
    <div className={css.headerWrapper}>
      <header className={css.header}>
        <Logo />
        {showNav && <DesktopNav />}
      </header>
    </div>
  );
};
