import './globals.css';
import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import { Navigation } from '../components/Navigation';

const quicksand = Quicksand({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'John and Molly',
  description: 'Personal treasure chest for our cherished memories.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <div className="layout">
          <div className="text-4xl font-bold my-7">John & Molly</div>
          <Navigation />
          <main className="py-8 layout full-bleed">{children}</main>
        </div>
      </body>
    </html>
  );
}
