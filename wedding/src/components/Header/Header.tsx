import { Logo } from '../Logo';
import { DesktopNav, MobileNav } from '../Navigation';
import React from 'react';
import css from './Header.module.css';

export const Header = () => {
  const showNav = process.env.NEXT_PUBLIC_TEASER_MODE !== '1';
  return (
    <header className={css.header}>
      <Logo />
      {showNav && <DesktopNav />}
      {showNav && <MobileNav />}
    </header>
  );
};
