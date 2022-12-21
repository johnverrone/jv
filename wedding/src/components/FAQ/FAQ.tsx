import React from 'react';
import { Text } from '../Text';
import css from './FAQ.module.scss';

interface FAQProps {
  question: string;
  answer: string;
}

export const FAQ = ({ question, answer }: FAQProps) => {
  return (
    <div className={css.faq}>
      <Text variant="heading2">{question}</Text>
      <Text variant="body2" tag="p">
        {answer}
      </Text>
    </div>
  );
};
