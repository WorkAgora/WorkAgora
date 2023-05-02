import { extendTheme, ThemeOverride } from '@chakra-ui/react';
import Button from './button';

export const darkTheme: ThemeOverride = extendTheme({
  colors: {
    brand: {},
    gradient: {}
  },
  fonts: {},
  components: {
    Button
  }
});
