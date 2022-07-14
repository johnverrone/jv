import React from 'react';
import css from './Button.module.css';

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary';
}

export const Button = ({ variant = 'primary', ...props }: ButtonProps) => {
  return <button {...props} className={css[variant]} />;
};
