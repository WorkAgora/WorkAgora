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
  ...props
}) => (
  <FormControl id={id} isRequired {...props}>
    <FormLabel>{label}</FormLabel>
    <Menu onOpen={handleOpen} onClose={handleClose}>
      <MenuButton
        as={Button}
        variant="select"
        color={selectedOption ? 'neutral.black' : 'neutral.dsGray'}
        borderColor={isOpen ? 'brand.primary' : error ? 'red' : 'brand.primary'}
        boxShadow={
          isOpen ? '0 0 0 1px var(--chakra-colors-brand-primary)' : error ? '0 0 0 1px red' : 'none'
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
        {options[selectedOption] || `Select your ${label.toLowerCase()}`}
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
    {error && <Text textStyle="errorMessage">{error}</Text>}
  </FormControl>
);

export default CreateJobSelector;
