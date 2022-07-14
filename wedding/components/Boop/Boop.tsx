import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BoopProps {
  rotation?: number;
  timing?: number;
  children?: React.ReactNode;
}

export const Boop = ({ rotation = 20, timing = 150, children }: BoopProps) => {
  const [isBooped, setIsBooped] = useState(false);

  const style = {
    display: 'inline-block',
  };

  useEffect(() => {
    if (!isBooped) return;

    const timeoutId = window.setTimeout(() => {
      setIsBooped(false);
    }, timing);

    return () => window.clearTimeout(timeoutId);
  }, [timing, isBooped]);

  const trigger = () => setIsBooped(true);

  return (
    <motion.span
      onMouseEnter={trigger}
      style={style}
      animate={{ rotate: isBooped ? rotation : 0 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {children}
    </motion.span>
  );
};
