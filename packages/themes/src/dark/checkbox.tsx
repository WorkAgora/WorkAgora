import { checkboxAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  checkboxAnatomy.keys
);

const baseStyle = definePartsStyle({
  label: {
    fontFamily: 'Comfortaa',
    fontWeight: '600',
    color: 'neutral.black'
  },
  control: {
    borderWidth: '2px',
    borderRadius: '2px',
    borderColor: 'neutral.dsDarkGray',
    width: '20px',
    height: '20px',
    _hover: {
      borderColor: 'brand.primaryHover'
    },
    _checked: {
      bgColor: 'brand.primary',
      borderColor: 'brand.primary',
      _hover: {
        borderColor: 'brand.primaryHover',
        bgColor: 'brand.primaryHover'
      },
      svg: {
        width: '14px'
      }
    }
  }
});

const checkboxTheme = defineMultiStyleConfig({ baseStyle });

export default checkboxTheme;
