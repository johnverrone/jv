import React from 'react';
import { Text } from '@components/Text';
import css from './SectionHeader.module.css';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
  <div className={css.headingWrapper}>
    <Text variant="heading1">{title}</Text>
    {subtitle && <Text variant="body2">{subtitle}</Text>}
  </div>
);
