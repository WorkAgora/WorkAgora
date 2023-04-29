import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const primary = defineStyle({
  bg: 'purple.900',
  _hover: {
    bg: 'purple.700',
    color: 'green.200'
  }
});

const link = defineStyle({});

const Button = defineStyleConfig({
  baseStyle: {
    fontFamily: 'comfortaa',
    transition: 'all ease-in-out 250ms'
  },
  variants: {
    primary,
    link
  }
});

export default Button;
