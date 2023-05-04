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

const inputTheme = defineMultiStyleConfig({ baseStyle });

export default inputTheme;
