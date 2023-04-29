import HeaderMenu from '@/components/menu/HeaderMenu';
import { chain, chains, rainbowAppInfo, rainbowTheme, WagmiClient } from '@/config/wagmi.config';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Suspense } from 'react';
import { WagmiConfig } from 'wagmi';

//Import styles
import { darkTheme } from '@/styles/dark';
import '@rainbow-me/rainbowkit/styles.css';

//Import font
import '@fontsource/comfortaa';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>WorkAurora</title>
      </Head>
      <ChakraProvider resetCSS theme={darkTheme}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <WagmiConfig client={WagmiClient}>
            <RainbowKitProvider
              chains={chains}
              modalSize="compact"
              initialChain={chain.id}
              theme={rainbowTheme}
              appInfo={{ ...rainbowAppInfo }}
            >
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
                bgColor="background"
                color="white"
              >
                <HeaderMenu />
                <Suspense fallback={'LOADING'}>
                  <Component {...pageProps} />
                </Suspense>
              </Container>
            </RainbowKitProvider>
          </WagmiConfig>
        </SessionProvider>
      </ChakraProvider>
    </>
  );
}

export default appWithTranslation(App);
