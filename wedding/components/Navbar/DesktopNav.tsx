import { useRouter } from 'next/router';
import React from 'react';
import css from './DesktopNav.module.css';
import { NavLinks } from './NavLinks';

export const DesktopNav = () => {
  const { asPath } = useRouter();

  return (
    <nav className={css.navbar}>
      <ul>
        <NavLinks activeRoute={asPath} />
      </ul>
    </nav>
  );
};
