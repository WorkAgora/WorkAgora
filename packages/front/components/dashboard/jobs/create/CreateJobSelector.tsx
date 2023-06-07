import React, { FC } from 'react';
import {
  Button,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FormControl,
  FormLabel,
  Text,
  FlexProps
} from '@chakra-ui/react';
import ChevronDownIcon from '@workagora/front/components/icons/ChevronDownIcon';
import { Field } from 'formik';
import { useResponsive } from '@workagora/front/hooks/useResponsive';

interface SelectorProps extends FlexProps {
  id: string;
  label: string;
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  options: Record<string, string>;
  handleSelection: (
    value: string,
    fieldName: string,
    selectField: string,
    setter: (value: any) => void
  ) => void;
  error?: string;
  touched?: boolean;
}

const CreateJobSelector: FC<SelectorProps> = ({
  id,
  label,
  isOpen,
  handleOpen,
  handleClose,
  selectedOption,
  setSelectedOption,
  options,
  handleSelection,
  error,
  touched,
  ...props
}) => {
  const {mobileDisplay, tabletDisplay, desktopDisplay} = useResponsive();
  
  return (
  <FormControl id={id} isRequired {...props}>
    <FormLabel>{label}</FormLabel>
    <Menu onOpen={handleOpen} onClose={handleClose}>
      <MenuButton
        as={Button}
        variant="select"
        color={selectedOption ? 'neutral.black' : 'neutral.dsGray'}
        borderColor={isOpen ? 'brand.primary' : error && touched ? 'red' : 'brand.primary'}
        boxShadow={
          isOpen
            ? '0 0 0 1px var(--chakra-colors-brand-primary)'
            : error && touched
            ? '0 0 0 1px red'
            : 'none'
        }
        opacity={selectedOption ? 1 : 0.75}
        borderBottomLeftRadius={isOpen ? '0' : '6px'}
        rightIcon={
          <Box transform={isOpen ? 'rotate(180deg)' : 'none'} transition="all ease-in-out 250ms">
            <ChevronDownIcon />
          </Box>
        }
        w="100%"
      >
        {options[selectedOption] || desktopDisplay ? `Select your ${label.toLowerCase()}` : label.toLowerCase()}
      </MenuButton>
      <MenuList
        mt={-2}
        borderColor="brand.primary"
        borderWidth="1px"
        fontFamily="Comfortaa"
        fontWeight="700"
        borderTopRadius={0}
        borderTopWidth={0}
        py={0}
        sx={{
          button: {
            transition: 'all ease-in-out 250ms',
            fontSize: '14px',
            fontWeight: '700',
            _hover: {
              bgColor: 'brand.primary',
              color: 'neutral.white'
            }
          }
        }}
      >
        {Object.keys(options).map((v, k) => (
          <MenuItem
            key={k}
            onClick={() => handleSelection(v, id, selectedOption, setSelectedOption)}
          >
            {options[v]}
          </MenuItem>
        ))}
      </MenuList>
      <Field name={id} type="hidden" />
    </Menu>
    {error && touched && <Text textStyle="errorMessage">{error}</Text>}
  </FormControl>
);
        }

export default CreateJobSelector;
