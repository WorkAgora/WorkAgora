import { CurrentUserProvider, LandingProvider, WagmiProvider } from '@workagora/front-provider';
import { ChakraProvider } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../components/Layout';

//Import styles
import { darkTheme } from '@workagora/themes';
import '@rainbow-me/rainbowkit/styles.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../assets/scrollbar.css';

//Import font
import '@fontsource/comfortaa';
import '@fontsource/montserrat';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>WorkAgora</title>
      </Head>
      <ChakraProvider resetCSS theme={darkTheme}>
        <WagmiProvider>
          <CurrentUserProvider>
            <LandingProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </LandingProvider>
          </CurrentUserProvider>
        </WagmiProvider>
      </ChakraProvider>
    </>
  );
}

export default appWithTranslation(App);
