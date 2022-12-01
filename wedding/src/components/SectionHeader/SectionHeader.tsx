import React, { ReactNode } from 'react';
import { Text } from '../Text';
import css from './SectionHeader.module.css';

interface SectionHeaderProps {
  title: string;
  children?: ReactNode;
}

export const SectionHeader = ({ title, children }: SectionHeaderProps) => (
  <div className={css.headingWrapper}>
    <Text variant="heading1">{title}</Text>
    {children}
  </div>
);
