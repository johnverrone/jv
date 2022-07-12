import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hamburger } from './Hamburger';
import css from './Navbar.module.css';

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => setOpen(false);

  return (
    <div className={css.navbar}>
      <button
        className={css.mobileNavHamburger}
        onClick={() => setOpen((p) => !p)}
      >
        <Hamburger />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={css.mobileNavWrapper}
          >
            <nav className={css.mobileNav}>
              <ul>
                <li>
                  <Link href="/">
                    <a onClick={handleLinkClick}>Home</a>
                  </Link>
                </li>
                <li>
                  <Link href="/our-story">
                    <a onClick={handleLinkClick}>Our Story</a>
                  </Link>
                </li>
                <li>
                  <Link href="/weekend">
                    <a onClick={handleLinkClick}>Wedding Weekend</a>
                  </Link>
                </li>
                <li>
                  <Link href="/registry">
                    <a onClick={handleLinkClick}>Registry</a>
                  </Link>
                </li>
                <li>
                  <Link href="/rsvp">
                    <a onClick={handleLinkClick}>RSVP</a>
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
