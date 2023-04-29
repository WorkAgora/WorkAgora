import { extendTheme, ThemeOverride } from '@chakra-ui/react';
import Button from './button';

export const darkTheme: ThemeOverride = extendTheme({
  colors: {
    background: '#07131E'
  },
  fonts: {},
  components: {
    Button
  }
});
