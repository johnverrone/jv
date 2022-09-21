import React, { ElementType } from 'react';
import css from './Text.module.css';

type Variant =
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'body1'
  | 'body2'
  | 'body3';

interface TextProps {
  variant: Variant;
  tag?: ElementType;
  children?: React.ReactNode;
}

export const Text = ({ variant, tag, children }: TextProps) => {
  const Component = tag ? tag : getComponent(variant);
  return (
    <Component className={`${css.text} ${getClassName(variant)}`}>
      {children}
    </Component>
  );
};

const getComponent = (variant: Variant) => {
  switch (variant) {
    case 'heading1':
      return 'h1';
    case 'heading2':
      return 'h2';
    case 'heading3':
      return 'h3';
    case 'body1':
    case 'body2':
    case 'body3':
      return 'span';
    default:
      return 'span';
  }
};

const getClassName = (variant: Variant): string => {
  let className = '';
  if (variant.substring(0, 7) === 'heading') {
    className += css.heading;
  } else {
    className += css.body;
  }

  return `${className}  ${css[variant]}`;
};
