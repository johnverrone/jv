import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    fonts: {
      body: string;
      heading: string;
      monospace: string;
    };
    colors: {
      text: string;
      background: string;
      hover: string;
      accent: string;
      modes: {
        dark: {
          text: string;
          background: string;
          accent: string;
        };
      };
    };
    fontWeights: {
      normal: number;
      semiBold: number;
      bold: number;
    };
    responsive: {
      small: string;
      medium: string;
      large: string;
      max: string;
    };
  }
}
