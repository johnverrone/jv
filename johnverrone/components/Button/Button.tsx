import React from 'react';
import styled from '@emotion/styled';

const ButtonBase = styled.button`
  background: none;
  border: none;
  outline: none;
  appearance: none;
  resize: none;
  cursor: pointer;
`;

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => <ButtonBase ref={ref} {...props} />);

Button.displayName = 'Button';
