import Image from 'next/image';
import localFont from 'next/font/local';
import { Catamaran } from 'next/font/google';
import { jollyLogo } from '../photos';
import { Header } from '../components/Header';
import css from './layout.module.scss';
import '../styles/line-awesome/css/line-awesome.min.css';
import '../styles/globals.scss';

export const metadata = {
  title: 'Molly & John - 8.26.23',
  description:
    'Your complete guide to the wedding of Molly Dickinson and John Verrone. Find travel information, registry details, and RSVP here.',
  manifest: '/manifest.json',
  openGraph: {
    title: "Molly Dickinson and John Verrone's Wedding",
    description:
      'Your complete guide to the wedding of Molly Dickinson and John Verrone on August 26, 2023. Find travel information, registry details, and RSVP here.',
    type: 'website',
    url: 'https://johnmolly.com/',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@johnverrone',
  },
};

const fionaFont = localFont({
  src: '../styles/fiona.woff2',
  variable: '--fiona-font',
  display: 'swap',
  declarations: [{ prop: 'size-adjust', value: '150%' }],
});

const catamaran = Catamaran({
  variable: '--catamaran-font',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showNav = process.env.NEXT_PUBLIC_TEASER_MODE !== '1';

  return (
    <html lang="en">
      <body className={`${catamaran.variable} ${fionaFont.variable}`}>
        <Header />
        <div className={css.fill}>
          <main className={css.main}>{children}</main>
          {showNav && (
            <footer className={css.footer}>
              <Image src={jollyLogo} alt="Jolly in a peach" width={100} />
            </footer>
          )}
        </div>
      </body>
    </html>
  );
}
