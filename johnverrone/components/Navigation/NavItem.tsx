import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const Anchor: React.FC = ({ children, ...rest }) => (
  <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} {...rest}>
    {children}
  </motion.a>
);

export const NavItem = styled(Anchor)`
  display: block;
  text-decoration: none;
  color: black;
`;
