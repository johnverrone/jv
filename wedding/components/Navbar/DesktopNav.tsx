import React from 'react';
import css from './DesktopNav.module.css';
import { NavLinks } from './NavLinks';

export const DesktopNav = () => {
  return (
    <nav className={css.navbar}>
      <ul>
        <NavLinks />
      </ul>
    </nav>
  );
};
