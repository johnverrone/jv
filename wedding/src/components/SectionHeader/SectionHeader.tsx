import React from 'react';
import { Text } from '../Text';
import css from './SectionHeader.module.css';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  subsubtitle?: string;
}

export const SectionHeader = ({
  title,
  subtitle,
  subsubtitle,
}: SectionHeaderProps) => (
  <div className={css.headingWrapper}>
    <Text variant="heading1">{title}</Text>
    {subtitle && <Text variant="body1">{subtitle}</Text>}
    {subsubtitle && <Text variant="body1">{subsubtitle}</Text>}
  </div>
);
