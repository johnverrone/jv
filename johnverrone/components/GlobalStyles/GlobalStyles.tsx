import React from 'react';
import { Global, css } from '@emotion/react';

export const GlobalStyles = () => {
  return (
    <Global
      styles={css`
        :root {
          --font-family-heading: 'Oxygen';
          --font-family-body: 'Fira Sans';
          --font-family-mono: 'Fira Code';
        }

        p {
          font-family: var(--font-family-body);
          line-height: 1.5;
        }
      `}
    />
  );
};