import React from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hamburger } from './Hamburger';
import css from './Navbar.module.css';
import { NavLinks } from './NavLinks';

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
                <NavLinks onClick={handleLinkClick} />
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
