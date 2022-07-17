import { Header } from 'components/Header';
import { Navbar } from 'components/Navbar';
import React from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Navbar />
      <main>{children}</main>
    </>
  );
};
