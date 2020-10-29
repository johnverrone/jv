import React from 'react';
import App from './src/components/core/App';

export const wrapPageElement = ({ element, props }) => {
  return <App {...props}>{element}</App>;
};
