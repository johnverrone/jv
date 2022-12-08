import { Header } from '../Header';
import React from 'react';
import css from './Layout.module.scss';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const showNav = process.env.NEXT_PUBLIC_TEASER_MODE !== '1';
  return (
    <>
      <Header />
      <div className={css.fill}>
        <main className={css.main}>{children}</main>
        {showNav && <footer className={css.footer} />}
      </div>
    </>
  );
};
