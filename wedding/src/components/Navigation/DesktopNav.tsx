'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import css from './DesktopNav.module.css';
import { NavLinks } from './NavLinks';

export const DesktopNav = () => {
  const pathname = usePathname();

  return (
    <nav className={css.navbar}>
      <ul>
        <NavLinks activeRoute={pathname ?? undefined} />
      </ul>
    </nav>
  );
};
