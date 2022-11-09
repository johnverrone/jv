import React, { useState } from 'react';
import { motion } from 'framer-motion';
import css from './Logo.module.css';

const johnVariants = {
  and: {
    marginRight: 6,
  },
  o: {
    marginRight: 1,
  },
};

const mollyVariants = {
  and: {
    marginLeft: 1,
  },
  o: {
    marginLeft: 1,
  },
};

export const Logo = () => {
  const [jollyMode, setJollyMode] = useState(false);

  const toggleJollyMode = () => setJollyMode((prev) => !prev);

  return (
    <motion.div
      className={css.logo}
      initial={false}
      animate={jollyMode ? 'o' : 'and'}
      onClick={toggleJollyMode}
      whileTap={{ scale: 1.2 }}
    >
      <motion.span variants={johnVariants}>
        {jollyMode ? 'J' : 'John'}
      </motion.span>
      <Heartpersand />
      <motion.span className={css.molly} variants={mollyVariants}>
        {jollyMode ? 'lly' : 'Molly'}
      </motion.span>
    </motion.div>
  );
};

const containerVariants = {
  and: {
    width: 34,
    height: 30,
    viewBox: '0 0 34 30',
    strokeWidth: 2,
  },
  o: {
    width: 15,
    height: 24,
    viewBox: '0 0 26 24',
    strokeWidth: 3,
  },
};

const pathVariants = {
  and: {
    d: 'M21.7132 14.6462C21.7132 19.5448 19.4842 23.5 18.2895 24.7934M18.2895 24.7934C16.624 26.5964 14.1811 29.1671 10.0727 28.9922C5.2796 28.7881 1.32734 26.2892 1 20.7695C0.999943 15 4.48432 13 5.9643 12.0219M18.2895 24.7934C19.9842 26.5 23.1854 28.9922 25.6504 28.9922C29.7588 28.9922 30.9571 27.9425 31.9842 26.8928M18.2895 24.7934C15.3223 22.4024 9.21681 16.5357 7.16261 13.5965C4.59486 9.92251 2.97203 7.29159 3.22539 4.67398C3.48421 2.00001 5.48421 1 7.16261 1C8.87445 1 10.9842 3.5 10.9842 3.5C10.9842 3.5 12.7453 1 15.4842 1C18.2231 1 19.3959 3.44136 18.9842 5.5C18.4842 8 15.4843 11 14.01 12.1969',
  },
  o: {
    d: 'M19.126 2.00001C15.3974 2.00001 13 5.57143 13 5.57143C13 5.57143 10.6026 2 6.87399 2C3.14536 2 1.54878 5.48765 2.10929 8.42857C2.78996 12 10.9929 20.2902 13 22C15.0071 20.2902 23.21 12 23.8907 8.42858C24.4512 5.48766 22.8547 2.00001 19.126 2.00001Z',
  },
};

const Heartpersand = () => (
  <motion.svg
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    variants={containerVariants}
  >
    <motion.path
      className={css.heartpersand}
      strokeLinecap="square"
      variants={pathVariants}
    />
  </motion.svg>
);
