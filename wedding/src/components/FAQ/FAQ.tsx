import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactNode, useState } from 'react';
import { Text } from '../Text';
import css from './FAQ.module.scss';

interface FAQProps {
  question: string;
  answer: ReactNode;
}

export const FAQ = ({ question, answer }: FAQProps) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <li className={css.faq}>
      <button className={css.faqToggle} onClick={toggleOpen}>
        <Text variant="heading2">{question}</Text>
        {open ? (
          <i className="las la-minus la-2x" />
        ) : (
          <i className="las la-plus la-2x" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            className={css.answer}
          >
            <Text variant="body2" tag="p">
              {answer}
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};
