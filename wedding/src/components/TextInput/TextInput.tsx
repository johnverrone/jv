import React from 'react';
import css from './TextInput.module.css';

interface TextInputProps extends React.ComponentProps<'input'> {}

export const TextInput = (props: TextInputProps) => {
  return <input {...props} className={css.input} />;
};
