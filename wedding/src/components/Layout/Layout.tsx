import { Header } from '../Header';
import { MobileNav } from '../Navigation';
import React from 'react';
import css from './Layout.module.scss';
import Image from 'next/image';
import evergreens from '../../../public/s/evergreens.png';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const showNav = process.env.NEXT_PUBLIC_TEASER_MODE !== '1';
  return (
    <>
      <Header />
      {showNav && <MobileNav />}
      <div className={css.fill}>
        <main className={css.main}>{children}</main>
        {showNav && <footer className={css.footer} />}
      </div>
    </>
  );
};
