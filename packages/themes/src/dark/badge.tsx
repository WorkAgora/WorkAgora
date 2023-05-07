import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const filter = defineStyle({
  borderRadius: '8px',
  py: '2px',
  px: '12px',
  textTransform: 'none',
  cursor: 'pointer',
  fontFamily: 'Montserrat',
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '150%',
  transition: 'all ease-in-out 200ms'
});

const badgeTheme = defineStyleConfig({
  variants: { filter }
});

export default badgeTheme;
