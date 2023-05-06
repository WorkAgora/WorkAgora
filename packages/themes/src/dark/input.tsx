import { inputAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  field: {
    fontFamily: 'Comfortaa',
    fontWeight: '700',
    _placeholder: {
      color: 'neutral.dsGray'
    },
    color: 'neutral.black'
  }
});

const searchBar = definePartsStyle({
  field: {
    py: '10px',
    px: '16px',
    borderRadius: '32px',
    borderWidth: '1px',
    borderColor: 'brand.primary'
  }
});

const inputTheme = defineMultiStyleConfig({
  baseStyle,
  variants: {
    searchBar
  }
});

export default inputTheme;
