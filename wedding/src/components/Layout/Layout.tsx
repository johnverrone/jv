import { Header } from '../Header';
import { MobileNav } from '../Navigation';
import React from 'react';

export const Layout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const showNav = process.env.NEXT_PUBLIC_TEASER_MODE !== '1';
  return (
    <>
      <Header />
      {showNav && <MobileNav />}
      <main className={className}>{children}</main>
    </>
  );
};
