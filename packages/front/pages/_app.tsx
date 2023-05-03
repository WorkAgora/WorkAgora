import Header from '../components/header/Header';
import { WagmiProvider } from '@workaurora/front-provider';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Suspense } from 'react';

//Import styles
import { darkTheme } from '@workaurora/themes';
import '@rainbow-me/rainbowkit/styles.css';

//Import font
import '@fontsource/comfortaa';
import { CurrentUserProvider } from '../hooks/useCurrentUser';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>WorkAurora</title>
      </Head>
      <ChakraProvider resetCSS theme={darkTheme}>
        <WagmiProvider>
          <CurrentUserProvider>
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
              <Header />
              <Suspense fallback={'LOADING'}>
                <Component {...pageProps} />
              </Suspense>
            </Container>
          </CurrentUserProvider>
        </WagmiProvider>
      </ChakraProvider>
    </>
  );
}

export default appWithTranslation(App);
