import React from 'react';
import css from './TextArea.module.scss';

interface TextAreaProps extends React.ComponentProps<'textarea'> {}

export const TextArea = (props: TextAreaProps) => {
  return <textarea {...props} className={css.input} />;
};
