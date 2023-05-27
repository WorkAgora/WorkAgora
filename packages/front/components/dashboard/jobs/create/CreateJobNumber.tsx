import React from 'react';
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
  Text
} from '@chakra-ui/react';
import { Field, ErrorMessage, FieldProps } from 'formik';

interface NumberInputFieldComponentProps {
  id: string;
  label: string;
  name: string;
  placeholder: string;
  error?: string;
  touched?: boolean;
}

const CreateJobNumber: React.FC<NumberInputFieldComponentProps> = ({
  id,
  label,
  name,
  placeholder,
  error,
  touched
}) => {
  return (
    <FormControl id={id} isRequired>
      <FormLabel>{label}</FormLabel>
      <Field name={name}>
        {({ field, form }: FieldProps) => (
          <NumberInput
            {...field}
            onChange={(valueString) => {
              if (parseInt(valueString) >= 0) {
                form.setFieldValue(field.name, valueString);
              } else {
                form.setFieldValue(field.name, '0');
              }
            }}
            onBlur={() => form.setFieldTouched(field.name)}
            placeholder={placeholder}
            isInvalid={error !== undefined && touched !== undefined && touched}
          >
            <NumberInputField fontWeight="700" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        )}
      </Field>
      <ErrorMessage name={name}>
        {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
      </ErrorMessage>
    </FormControl>
  );
};

export default CreateJobNumber;
