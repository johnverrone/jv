import { withTRPC } from '@trpc/next';
import { Layout } from '../components//Layout';
import { AppProps } from 'next/app';
import { AppRouter } from '../server/routers/_app';
import '../styles/globals.css';
import { Catamaran } from '@next/font/google';
import localFont from '@next/font/local';

const fionaFont = localFont({
  src: '../styles/fiona.woff2',
  variable: '--fiona-font',
});

const catamaran = Catamaran({
  variable: '--catamaran-font',
  subsets: ['latin'],
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  if (typeof window !== 'undefined' && window.document) {
    if (process.env.NEXT_PUBLIC_TEASER_MODE == '1') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    document.documentElement.setAttribute(
      'class',
      `${catamaran.variable} ${fionaFont.variable}`
    );
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc';

    return {
      url,
      /**
       * @link https://react-query-v3.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
