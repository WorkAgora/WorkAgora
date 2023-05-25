import { Field, ErrorMessage, useFormikContext } from 'formik';
import { FormControl, Textarea, Text, FormLabel } from '@chakra-ui/react';
import { FC } from 'react';

interface CreateJobTextAreaProps {
  label: string;
  name: string;
  placeholder: string;
  isRequired: boolean;
}

const CreateJobTextArea: FC<CreateJobTextAreaProps> = ({
  label,
  name,
  placeholder,
  isRequired
}) => {
  const { errors } = useFormikContext();
  return (
    <FormControl id={name} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Field
        name={name}
        placeholder={placeholder}
        as={Textarea}
        isInvalid={errors[name]}
        resize="vertical"
        minH="100px"
        maxH="200px"
        fontWeight="500"
      />
      <ErrorMessage name={name}>
        {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
      </ErrorMessage>
    </FormControl>
  );
};

export default CreateJobTextArea;
