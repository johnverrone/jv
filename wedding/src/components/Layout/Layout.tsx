import { Header } from '../Header';
import { Navbar } from '../Navbar';
import React from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {/* <Navbar /> */}
      <main>{children}</main>
    </>
  );
};
