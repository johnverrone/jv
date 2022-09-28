import Document, {
  Html,
  Head as IHead,
  Main,
  NextScript as INextScript,
} from 'next/document';

const Head = IHead as any;
const NextScript = INextScript as any;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Icons */}
          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👩‍❤️‍💋‍👨</text></svg>"
          />

          {/* PWA */}
          <link rel="manifest" href="/manifest.json" />

          {/* Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@100;200;300;400;500;600;700&family=Oxygen:wght@400;700&family=Fira+Code&display=swap"
            rel="stylesheet"
          />

          {/* Facebook Open Graph Meta Tags */}
          <meta
            property="og:title"
            content="Molly Dickinson and John Verrone's Wedding"
          />
          <meta
            property="og:description"
            content="Your complete guide to the wedding of Molly Dickinson and John Verrone. Find travel information, registry details, and RSVP here."
          />
          <meta
            property="og:image"
            content="https://johnmolly.com/s/teaser-desktop.png"
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://johnmolly.com/" />

          {/* Twitter Meta Tags */}
          <meta property="twitter:domain" content="johnmolly.com" />
          <meta property="twitter:url" content="https://johnmolly.com/" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:creator" content="@johnverrone" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
