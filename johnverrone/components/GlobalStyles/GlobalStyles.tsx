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

          --font-size-heading2: 1.25rem;

          --shadow-color: 0deg 0% 49%;
          --shadow-elevation-low: 0.3px 0.5px 0.4px
              hsl(var(--shadow-color) / 0.97),
            0.4px 0.7px 0.6px -2.5px hsl(var(--shadow-color) / 0.65),
            1.2px 2.4px 2px -5px hsl(var(--shadow-color) / 0.32);
          --shadow-elevation-medium: 0.3px 0.5px 0.4px
              hsl(var(--shadow-color) / 1),
            0.5px 0.9px 0.8px -1.7px hsl(var(--shadow-color) / 0.76),
            2px 3.9px 3.3px -3.3px hsl(var(--shadow-color) / 0.51),
            6px 12px 10.1px -5px hsl(var(--shadow-color) / 0.25);
          --shadow-elevation-high: 0.3px 0.5px 0.4px
              hsl(var(--shadow-color) / 0.95),
            0.4px 0.7px 0.6px -0.7px hsl(var(--shadow-color) / 0.83),
            1.1px 2.1px 1.8px -1.4px hsl(var(--shadow-color) / 0.71),
            3px 6px 5px -2.1px hsl(var(--shadow-color) / 0.59),
            6.7px 13.5px 11.3px -2.9px hsl(var(--shadow-color) / 0.47),
            12.9px 25.8px 21.6px -3.6px hsl(var(--shadow-color) / 0.35),
            22.1px 44.3px 37.1px -4.3px hsl(var(--shadow-color) / 0.24),
            35px 70px 58.7px -5px hsl(var(--shadow-color) / 0.12);
        }

        body {
          font-family: var(--font-family-body);
        }
      `}
    />
  );
};
