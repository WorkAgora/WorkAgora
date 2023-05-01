import { defineStyle, defineStyleConfig, ComponentStyleConfig } from '@chakra-ui/react';

const primary = defineStyle({
  bg: 'purple.900',
  color: 'white',
  _hover: {
    bg: 'purple.700',
    color: 'green.200'
  },
  _loading: {
    bg: 'purple.700',
    color: 'green.200',
    _hover: {
      bg: 'purple.700',
      color: 'green.200'
    }
  },
  _disabled: {
    bg: 'white',
    borderWidth: '1px',
    borderColor: 'purple.500',
    color: 'gray.900',
    _hover: {
      bg: 'white',
      borderWidth: '1px',
      borderColor: 'purple.500',
      color: 'gray.900'
    }
  }
});

const link = defineStyle({});

const baseStyle = { fontFamily: 'comfortaa', transition: 'all ease-in-out 250ms' };

const buttonTheme: ComponentStyleConfig = defineStyleConfig({
  baseStyle,
  variants: {
    primary,
    link
  }
});

export default buttonTheme;
