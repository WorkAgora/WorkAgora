import { Flex, FormControl, FormLabel, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Text, FlexProps, useDisclosure, Menu, MenuButton, Button, Box, MenuList, MenuItem } from "@chakra-ui/react";
import { Field, ErrorMessage, FieldProps, useFormikContext } from "formik";
import { FC, useState } from "react";
import ChevronDownIcon from "../icons/ChevronDownIcon";

const durationUnitOptions: { [key: string]: string } = {
    hours: 'Hours',
    days: 'Days',
    months: 'Months',
    years: 'Years'
  };

interface SelectorProps extends FlexProps {
    handleSelection: (
      value: string,
      fieldName: string,
      selectField: string,
      setter: (value: any) => void
    ) => void;
  }

const ContractDuration: FC<SelectorProps> = ({handleSelection, ...props}) => {
    const { values, errors, touched, setFieldValue, setFieldTouched} = useFormikContext();
    const [selectedOption, setSelectedOption] = useState<string>();
    const {isOpen, onOpen, onClose} = useDisclosure();

    return (<Flex columnGap={6}>
           <FormControl id="workDuration" isRequired>
                <FormLabel>Work Duration</FormLabel>
                <Field name="workDuration">
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
                        isInvalid={errors.workDuration !== undefined && touched.workDuration !== undefined && touched.workDuration}
                    >
                        <NumberInputField fontWeight="700" />
                        <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    )}
                </Field>
                <ErrorMessage name="workDuration">
                    {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                </ErrorMessage>
            </FormControl>
            <FormControl id="workDurationUnit" isRequired {...props}>

        <Menu onOpen={onOpen} onClose={onClose}>
        <MenuButton
        mt={8}
            as={Button}
            variant="select"
            color={selectedOption ? 'neutral.black' : 'neutral.dsGray'}
            borderColor={isOpen ? 'brand.primary' : errors.workDurationUnit && touched.workDurationUnit ? 'red' : 'brand.primary'}
            boxShadow={
            isOpen
                ? '0 0 0 1px var(--chakra-colors-brand-primary)'
                : errors.workDurationUnit && touched.workDurationUnit
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
            {durationUnitOptions[selectedOption] || `Unit`}
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
           {Object.keys(durationUnitOptions).map((v, k) => (
          <MenuItem
            key={k}
            onClick={() => handleSelection(v, 'workDurationUnit', selectedOption, setSelectedOption)}
          >
            {durationUnitOptions[v]}
          </MenuItem>
        ))}
        </MenuList>
        <Field name="workDurationUnit" type="hidden" />
        </Menu>
        {errors.workDurationUnit && touched.workDurationUnit && <Text textStyle="errorMessage">{errors.workDurationUnit}</Text>}
    </FormControl>
        </Flex>);
};

export default ContractDuration;