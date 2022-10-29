import { Header } from '../Header';
import { MobileNav } from '../Navigation';
import React from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const showNav = process.env.NEXT_PUBLIC_TEASER_MODE !== '1';
  return (
    <>
      <Header />
      {showNav && <MobileNav />}
      <main>{children}</main>
    </>
  );
};
