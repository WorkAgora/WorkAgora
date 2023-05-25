import { CurrentUserProvider, LandingProvider, WagmiProvider } from '@workagora/front-provider';
import { ChakraProvider } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import GlobalLayout from '../components/GlobalLayout';

//Import styles
import { darkTheme } from '@workagora/themes';
import '@rainbow-me/rainbowkit/styles.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../assets/scrollbar.css';

//Import font
import '@fontsource/comfortaa';
import '@fontsource/montserrat';
import CustomHead from '../components/CustomHead';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CustomHead />
      <ChakraProvider resetCSS theme={darkTheme}>
        <WagmiProvider>
          <CurrentUserProvider>
            <LandingProvider>
              <GlobalLayout>
                <Component {...pageProps} />
              </GlobalLayout>
            </LandingProvider>
          </CurrentUserProvider>
        </WagmiProvider>
      </ChakraProvider>
    </>
  );
}

export default appWithTranslation(App);
