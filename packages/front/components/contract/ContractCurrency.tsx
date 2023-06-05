import { Flex, FormControl, FormLabel, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Text, FlexProps, useDisclosure, Menu, MenuButton, Button, Box, MenuList, MenuItem } from "@chakra-ui/react";
import { Field, ErrorMessage, FieldProps, useFormikContext } from "formik";
import { FC, useState } from "react";
import ChevronDownIcon from "../icons/ChevronDownIcon";

const currencyOptions: { [key: string]: string } = {
    usdt: 'USDT',
    avax: 'AVAX',
  };

interface SelectorProps extends FlexProps {
    handleSelection: (
      value: string,
      fieldName: string,
      selectField: string,
      setter: (value: any) => void
    ) => void;
  }

const ContractCurrency: FC<SelectorProps> = ({handleSelection, ...props}) => {
    const { values, errors, touched, setFieldValue, setFieldTouched} = useFormikContext();
    const [selectedOption, setSelectedOption] = useState<string>();
    const {isOpen, onOpen, onClose} = useDisclosure();

    return (<Flex alignItems="end" columnGap={6}>
           <FormControl id="globalAmount" isRequired>
                <FormLabel>Global amount in $</FormLabel>
                <Field name="globalAmount">
                    {({ field, form }: FieldProps) => (
                    <NumberInput
                        {...field}
                        onChange={(valueString) => {
                        if (parseInt(valueString) >= 0) {
                            setFieldValue(field.name, valueString);
                        } else {
                            setFieldValue(field.name, '0');
                        }
                        }}
                        onBlur={() => setFieldTouched(field.name)}
                        placeholder="Number"
                        isInvalid={errors.globalAmount !== undefined && touched.globalAmount !== undefined && touched.globalAmount}
                    >
                        <NumberInputField fontWeight="700" />
                        <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    )}
                </Field>
                <ErrorMessage name="globalAmount">
                    {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                </ErrorMessage>
            </FormControl>
            <FormControl id="amountCurrency" isRequired {...props}>

        <Menu onOpen={onOpen} onClose={onClose}>
        <MenuButton
            as={Button}
            variant="select"
            color={selectedOption ? 'neutral.black' : 'neutral.dsGray'}
            borderColor={isOpen ? 'brand.primary' : errors.amountCurrency && touched.amountCurrency ? 'red' : 'brand.primary'}
            boxShadow={
            isOpen
                ? '0 0 0 1px var(--chakra-colors-brand-primary)'
                : errors.amountCurrency && touched.amountCurrency
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
            {currencyOptions[selectedOption] || `Currency`}
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
           {Object.keys(currencyOptions).map((v, k) => (
          <MenuItem
            key={k}
            onClick={() => handleSelection(v, 'amountCurrency', selectedOption, setSelectedOption)}
          >
            {currencyOptions[v]}
          </MenuItem>
        ))}
        </MenuList>
        <Field name="amountCurrency" type="hidden" />
        </Menu>
        {errors.amountCurrency && touched.amountCurrency && <Text textStyle="errorMessage">{errors.amountCurrency}</Text>}
    </FormControl>
        </Flex>);
};

export default ContractCurrency;