import { ChakraProvider, ChakraProviderProps } from '@chakra-ui/react';
import {
  CurrentCompanyProvider,
  CurrentUserProvider,
  JobsProvider,
  LandingProvider,
  WagmiProvider
} from '@workagora/front-provider';
import { FC, ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
  theme: ChakraProviderProps['theme'];
}

const Providers: FC<ProvidersProps> = ({ children, theme }) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <WagmiProvider>
        <CurrentUserProvider>
          <CurrentCompanyProvider>
            <JobsProvider>
              <LandingProvider>{children}</LandingProvider>
            </JobsProvider>
          </CurrentCompanyProvider>
        </CurrentUserProvider>
      </WagmiProvider>
    </ChakraProvider>
  );
};

export default Providers;
