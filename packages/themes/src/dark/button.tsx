import { defineStyle, defineStyleConfig, ComponentStyleConfig } from '@chakra-ui/react';

const primary = defineStyle({
  bgColor: 'brand.primary',
  paddingLeft: '24px !important',
  paddingRight: '24px !important',
  paddingTop: '10px',
  paddingBottom: '10px',
  _loading: {
    bgColor: 'brand.primaryHover',
    _hover: {
      bgColor: 'brand.primaryHover'
    }
  },
  _hover: {
    bgColor: 'brand.primaryHover'
  }
});

const secondary = defineStyle({
  bgColor: 'brand.secondary',
  paddingLeft: '24px !important',
  paddingRight: '24px !important',
  paddingTop: '10px',
  paddingBottom: '10px',
  color: 'neutral.white',
  _loading: {
    bgColor: 'brand.secondaryHover',
    _hover: {
      bgColor: 'brand.secondaryHover'
    }
  },
  _hover: {
    bgColor: 'brand.secondaryHover'
  }
});

const outline = defineStyle({
  borderColor: 'brand.primary',
  paddingLeft: '24px !important',
  paddingRight: '24px !important',
  paddingTop: '10px',
  paddingBottom: '10px',
  borderWidth: '1px',
  _disabled: {
    color: 'neutral.dsGray',
    borderColor: 'neutral.dsGray'
  }
});

const link = defineStyle({
  color: 'neutral.black',
  textDecoration: 'none',
  _hover: {
    color: 'brand.primary',
    textDecoration: 'none'
  }
});

const icon = defineStyle({
  color: 'neutral.black',
  _hover: {
    color: 'brand.primary'
  }
});

const baseStyle = {
  fontWeight: '700',
  fontFamily: 'Comfortaa',
  transition: 'all ease-in-out 250ms',
  borderRadius: '32px'
};

const buttonTheme: ComponentStyleConfig = defineStyleConfig({
  baseStyle,
  variants: {
    primary,
    secondary,
    link,
    outline,
    icon
  }
});

export default buttonTheme;
