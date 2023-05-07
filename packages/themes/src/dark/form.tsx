import { formAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  container: {
    label: {
      fontFamily: 'Comfortaa',
      fontWeight: '700',
      color: 'neutral.black'
    },
    input: {
      borderRadius: '6px',
      borderColor: 'brand.primary',
      borderWidth: '1px',
      bgColor: 'neutral.white',
      px: '16px',
      py: '10px',
      '&:focus': {
        borderWidth: '1px',
        borderColor: 'brand.primaryHover',
        boxShadow: '0 0 0 1px var(--chakra-colors-brand-primaryHover)'
      }
    },
    textarea: {
      fontFamily: 'Comfortaa',
      fontWeight: '700',
      borderRadius: '6px',
      borderColor: 'brand.primary',
      borderWidth: '1px',
      bgColor: 'neutral.white',
      px: '16px',
      py: '10px',
      '&:focus': {
        borderWidth: '1px',
        borderColor: 'brand.primaryHover',
        boxShadow: '0 0 0 1px var(--chakra-colors-brand-primaryHover)'
      }
    },
    select: {
      fontFamily: 'Comfortaa',
      borderRadius: '6px',
      borderColor: 'brand.primary',
      borderWidth: '1px',
      bgColor: 'neutral.white',
      cursor: 'pointer',
      px: '16px',
      py: '10px',
      '&:focus': {
        borderWidth: '1px',
        borderColor: 'brand.primaryHover',
        boxShadow: '0 0 0 1px var(--chakra-colors-brand-primaryHover)'
      },
      option: {
        px: '16px',
        py: '10px',
        bgColor: 'neutral.white',
        color: 'neutral.black'
      }
    }
  },
  requiredIndicator: {
    color: 'neutral.black'
  },
  helperText: {
    color: 'neutral.dsDarkGray',
    fontWeight: '400',
    fontFamily: 'Montserrat',
    fontSize: '12px',
    cursor: 'default'
  }
});

const formTheme = defineMultiStyleConfig({
  baseStyle
});

export default formTheme;
