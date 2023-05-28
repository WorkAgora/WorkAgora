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
import Providers from '../components/Providers';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CustomHead />
      <Providers theme={darkTheme}>
        <GlobalLayout>
          <Component {...pageProps} />
        </GlobalLayout>
      </Providers>
    </>
  );
}

export default appWithTranslation(App);
