import React from 'react';
import classNames from 'classnames';
import css from './Button.module.css';

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ variant = 'primary', ...props }: ButtonProps) => {
  return (
    <button {...props} className={classNames(props.className, css[variant])} />
  );
};
