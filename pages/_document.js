import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest/manifest.webmanifest" />
          <link rel="apple-touch-icon" href="/manifest/icon.png"></link>
          <meta name="description" content="Arena Demo" />
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/favicon.ico"
          ></link>
          <meta name="theme-color" content="#fff" />
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
