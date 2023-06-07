import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const Anchor = ({ children, ...rest }: { children: ReactNode }) => (
  <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} {...rest}>
    {children}
  </motion.a>
);

export const NavItem = styled(Anchor)`
  display: block;
  text-decoration: none;
  color: black;
`;
