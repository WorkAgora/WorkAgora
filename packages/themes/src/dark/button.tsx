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
  paddingLeft: '24px !important',
  paddingRight: '24px !important',
  paddingTop: '10px',
  paddingBottom: '10px',
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

const select = defineStyle({
  fontFamily: 'Comfortaa',
  fontWeight: '700',
  color: 'neutral.black',
  borderRadius: '6px',
  borderColor: 'brand.primary',
  borderWidth: '1px',
  bgColor: 'neutral.white',
  textAlign: 'left',
  cursor: 'pointer',
  px: '16px',
  py: '10px',
  '&:focus': {
    borderWidth: '1px',
    borderColor: 'brand.primaryHover',
    boxShadow: '0 0 0 1px var(--chakra-colors-brand-primaryHover)'
  }
});

const baseStyle = {
  fontWeight: '700',
  fontFamily: 'Comfortaa',
  transition: 'all ease-in-out 250ms',
  borderRadius: '32px',
  lineHeight: '100%'
};

const buttonTheme: ComponentStyleConfig = defineStyleConfig({
  baseStyle,
  variants: {
    primary,
    secondary,
    link,
    outline,
    icon,
    select
  }
});

export default buttonTheme;
