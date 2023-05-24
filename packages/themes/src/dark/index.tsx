import { extendTheme, ThemeOverride } from '@chakra-ui/react';
import Button from './button';
import Modal from './modal';
import Form from './form';
import Input from './input';
import Checkbox from './checkbox';
import Badge from './badge';
import textStyles from './textStyle';

export const darkTheme: ThemeOverride = extendTheme({
  colors: {
    brand: {
      primary: '#FDB81E',
      primaryHover: '#E39E02',
      green: '#38A169',
      secondary: '#002C39',
      secondaryAlpha: '#002C3966', // 66 -> 40%
      secondaryHover: '#005061'
    },
    neutral: {
      black: '#1A202C',
      dsDarkGray: '#4A5568',
      dsGray: '#8194AC',
      gray: '#E2E8F0',
      lightGray: '#EDF2F7',
      white: '#FFF'
    },
    badge: {
      yellow: '#FDB81E',
      purple: '#9E38C0',
      red: '#E53E3E',
      blue: '#3182CE',
      green: '#38A169',
      orange: '#DD6B20',
      teal: '#319795',
      pink: '#D53F8C',
      indigo: '#667EEA',
      cyan: '#48BB78',
      lime: '#84CC16',
      amber: '#F6AD55'
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
    Checkbox,
    Badge
  }
});
