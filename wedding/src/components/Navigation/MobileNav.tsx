import React from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import css from './MobileNav.module.css';
import { NavLinks } from './NavLinks';
import { useRouter } from 'next/router';

export const MobileNav = () => {
  const { basePath } = useRouter();
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => setOpen(false);

  return (
    <div className={css.navbar}>
      <button
        className={css.mobileNavHamburger}
        onClick={() => setOpen((p) => !p)}
        name="hamburger menu button"
      >
        {open ? (
          <i className="las la-times la-2x" />
        ) : (
          <i className="las la-bars la-2x" />
        )}
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
                <NavLinks onClick={handleLinkClick} activeRoute={basePath} />
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
