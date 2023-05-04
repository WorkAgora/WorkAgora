import Header from '../components/header/Header';
import { CurrentUserProvider, LandingProvider, WagmiProvider } from '@workagora/front-provider';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../components/layout';

//Import styles
import { darkTheme } from '@workagora/themes';
import '@rainbow-me/rainbowkit/styles.css';

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
              <Container
                maxW="100vw"
                minW="100vw"
                minH="100vh"
                w="100vw"
                h="100vh"
                p="0"
                display="flex"
                flexDir="column"
                overflow="hidden"
                position="relative"
                bgColor="neutral.lightGray"
                color="neutral.black"
              >
                <Layout>
                  <Header />
                  <Component {...pageProps} />
                </Layout>
              </Container>
            </LandingProvider>
          </CurrentUserProvider>
        </WagmiProvider>
      </ChakraProvider>
    </>
  );
}

export default appWithTranslation(App);
