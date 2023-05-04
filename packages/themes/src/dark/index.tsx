import { extendTheme, ThemeOverride } from '@chakra-ui/react';
import Button from './button';
import Modal from './modal';
import Form from './form';
import Input from './input';
import Checkbox from './checkbox';
import textStyles from './textStyle';

export const darkTheme: ThemeOverride = extendTheme({
  colors: {
    brand: {
      primary: '#FDB81E',
      primaryHover: '#E39E02',
      secondary: '#002C39',
      secondaryAlpha: 'rgba(0, 44 ,57 , .4)',
      secondaryHover: '#005061'
    },
    neutral: {
      black: '#1A202C',
      dsDarkGray: '#4A5568',
      dsGray: '#8194AC',
      gray: '#E2E8F0',
      lightGray: '#EDF2F7',
      white: '#FFF'
    }
  },
  fonts: {
    body: 'Montserrat',
    Heading: 'Comfortaa'
  },
  textStyles,
  components: {
    Button,
    Modal,
    Form,
    Input,
    Checkbox
  }
});
