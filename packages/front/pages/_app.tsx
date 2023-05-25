import {
  CurrentUserProvider,
  DashboardProvider,
  LandingProvider,
  WagmiProvider
} from '@workagora/front-provider';
import { ChakraProvider } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import GlobalLayout from '../components/GlobalLayout';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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
              <DashboardProvider>
                <GlobalLayout>
                  <Component {...pageProps} />
                </GlobalLayout>
              </DashboardProvider>
            </LandingProvider>
          </CurrentUserProvider>
        </WagmiProvider>
      </ChakraProvider>
    </>
  );
}

export default appWithTranslation(App);
