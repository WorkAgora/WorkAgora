import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  overlay: {
    bgColor: 'brand.secondaryAlpha'
  },
  dialog: {
    borderRadius: '32px',
    borderWidth: '3px',
    borderColor: 'brand.primary',
    padding: '48px',
    bg: `neutral.lightGray`
  },
  header: {
    fontSize: '36px',
    fontFamily: 'Comfortaa',
    color: 'neutral.black',
    padding: '0',
    mb: 8
  },
  body: {
    padding: '0'
  },
  closeButton: {
    top: '32px',
    right: '32px',
    color: 'neutral.black',
    transition: 'all ease-in-out 250ms',
    '& svg': {
      width: '20px',
      height: '20px'
    },
    _hover: {
      bg: 'none',
      color: 'brand.primaryHover'
    }
  }
});

const modalTheme = defineMultiStyleConfig({
  baseStyle
});

export default modalTheme;
