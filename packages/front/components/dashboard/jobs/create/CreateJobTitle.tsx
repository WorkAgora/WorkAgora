import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { Field, ErrorMessage, FormikErrors, FormikTouched } from 'formik';
import { FC } from 'react';
import { FormData } from '../DashboardJobCreate';

interface FormikBag {
  errors: FormikErrors<FormData>;
  touched?: FormikTouched<FormData>;
}

const CreateJobTitle: FC<FormikBag> = ({ errors, touched }) => (
  <FormControl id="title" isRequired>
    <FormLabel>Job title</FormLabel>
    <Field
      name="title"
      placeholder="Job title max 70 characters"
      as={Input}
      isInvalid={errors?.title && touched?.title}
    />
    <ErrorMessage name="title">{(msg) => <Text textStyle="errorMessage">{msg}</Text>}</ErrorMessage>
  </FormControl>
);

export default CreateJobTitle;
