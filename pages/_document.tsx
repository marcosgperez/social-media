import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html lang="es" suppressHydrationWarning>
      <Head>
        <meta property="og:title" name="title" content="Social Media" />
        <meta
          property="og:description"
          name="description"
          content="Social Media"
        />
      </Head>
      <body suppressHydrationWarning>
        <div className="site-preloader" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
