import { Header } from '../Header';
import React from 'react';
import { jollyLogo } from '../../photos';
import Image from 'next/image';
import { Waves } from '../Waves';
import css from './Layout.module.scss';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const showNav = process.env.NEXT_PUBLIC_TEASER_MODE !== '1';
  return (
    <>
      <Header />
      <div className={css.fill}>
        <main className={css.main}>{children}</main>
        {showNav && (
          <footer className={css.footer}>
            {/* <span className={css.withLove}>
              made with <i className={`las la-heart ${css.icon}`} /> by john
            </span> */}
            {/* <Waves /> */}
            <Image src={jollyLogo} alt="Jolly in a peach" width={100} />
          </footer>
        )}
      </div>
    </>
  );
};
