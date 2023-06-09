import { Metadata } from 'next';
import { Fira_Code, Fira_Sans, Oxygen } from 'next/font/google';
import React from 'react';
import { GlobalStyles } from '../components/GlobalStyles';
import { ThemeProvider } from './theme-provider';

const firaCode = Fira_Code({
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fira-code',
  subsets: ['latin'],
  display: 'swap',
});

const firaSans = Fira_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-fira-sans',
  subsets: ['latin'],
  display: 'swap',
});

const oxygen = Oxygen({
  weight: ['300', '400', '700'],
  variable: '--font-oxygen',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: 'John Verrone | %s',
    default: 'John Verrone',
  },
  description: '',
  twitter: {
    card: 'summary',
    creator: '@johnverrone',
  },
};

// <meta property="og:description" content={description} />
// <meta property="og:site_name" content={fullTitle} />
// <meta property="twitter:card" content="summary" />
// <meta property="twitter:creator" content="@johnverrone" />
// <meta property="twitter:title" content={fullTitle} />
// <meta property="twitter:description" content={description} />

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${oxygen.variable} ${firaSans.variable} ${firaCode.variable}`}
    >
      <body>
        <GlobalStyles />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
