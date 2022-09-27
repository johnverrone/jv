import { Header } from '../Header';
import { Navbar } from '../Navbar';
import React from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const showNav = process.env.NEXT_PUBLIC_TEASER_MODE !== '1';
  return (
    <>
      <Header />
      {showNav && <Navbar />}
      <main>{children}</main>
    </>
  );
};
