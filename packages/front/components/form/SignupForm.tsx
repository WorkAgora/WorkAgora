import { FC, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Checkbox,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Flex
} from '@chakra-ui/react';
import ConnectButton from '../button/ConnectButton';
import RadioCard from '../radio/RadioCard';
import RadioCardGroup from '../radio/RadioCardGroup';
import { useAccount, useNetwork } from 'wagmi';
import { shortHash } from '@workaurora/utils';
import { useSignUp } from '../../hooks/useSignUp';

interface RadioUserType {
  label: string;
  description: string;
  value: string;
}

const RadioGroupUserType: RadioUserType[] = [
  {
    label: 'Freelancer',
    description: 'You are looking for a job',
    value: 'Freelancer'
  },
  {
    label: 'Employer',
    description: 'You are looking for freelancers',
    value: 'Employer'
  }
];

interface FormData {
  email: string;
  firstname: string;
  lastname: string;
  currentUserType: string;
  agreeTOS: boolean;
  agreeDataTreatment: boolean;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required(' '),
  firstname: Yup.string().min(2).required(' '),
  lastname: Yup.string().min(2).required(' '),
  currentUserType: Yup.string().oneOf(['Freelancer', 'Employer']).required(' '),
  agreeTOS: Yup.bool().oneOf([true], 'Must agree to Terms of Service'),
  agreeDataTreatment: Yup.bool().oneOf([true], 'Must agree to data treatment policy')
});

const SignupForm: FC = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { signUp } = useSignUp();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: FormData) => {
    if (address && chain && !loading) {
      setLoading(true);
      const res = await signUp({ address, chain, ...values });
      if (res) {
        //@TODO display success
      } else {
        //@TODO display error
      }
      setLoading(false);
    }
  };
  return (
    <Formik
      initialValues={{
        email: '',
        firstname: '',
        lastname: '',
        currentUserType: RadioGroupUserType[0].value,
        agreeTOS: false,
        agreeDataTreatment: false
      }}
      validationSchema={validationSchema}
      isInitialValid={false}
      onSubmit={onSubmit}
    >
      {({ isValid, errors, touched }) => (
        <Form>
          <Heading as="h2" size="xl" mb={4}>
            Sign Up
          </Heading>
          <Box width="100%" px={5} py={3} mx="auto">
            <FormControl id="email" mb={4} display="flex" flexDir="column" isRequired>
              <FormLabel>Email</FormLabel>
              <Field
                name="email"
                as={Input}
                type="email"
                isInvalid={errors.email && touched.email}
              />
              <ErrorMessage name="email">
                {(msg) => <Text color="red.300">{msg}</Text>}
              </ErrorMessage>
            </FormControl>
            <FormControl id="firstname" mb={4} display="flex" flexDir="column" isRequired>
              <FormLabel>Firstname</FormLabel>
              <Field
                name="firstname"
                as={Input}
                type="text"
                isInvalid={errors.firstname && touched.firstname}
              />
              <ErrorMessage name="firstname">
                {(msg) => <Text color="red.300">{msg}</Text>}
              </ErrorMessage>
            </FormControl>
            <FormControl id="lastname" mb={6} display="flex" flexDir="column" isRequired>
              <FormLabel>Lastname</FormLabel>
              <Field
                name="lastname"
                as={Input}
                type="text"
                isInvalid={errors.lastname && touched.lastname}
              />
              <ErrorMessage name="lastname">
                {(msg) => <Text color="red.300">{msg}</Text>}
              </ErrorMessage>
            </FormControl>
            <RadioCardGroup name="userType" display="flex" columnGap={2} mb={4}>
              {RadioGroupUserType.map((v, k) => {
                return (
                  <RadioCard
                    key={k}
                    groupName="userType"
                    label={v.label}
                    description={v.description}
                    value={v.value}
                  />
                );
              })}
            </RadioCardGroup>
            <Flex flexDirection="column" mb={4}>
              <FormControl id="agreeTOS" isRequired>
                <Field name="agreeTOS" type="checkbox">
                  {({ field }: FieldProps<string>) => (
                    <Checkbox
                      {...field}
                      isChecked={field.checked}
                      isInvalid={errors.agreeTOS !== undefined && touched.agreeTOS}
                    >
                      I agree to the Terms of Service
                    </Checkbox>
                  )}
                </Field>
              </FormControl>
              <ErrorMessage name="agreeTOS">
                {(msg) => <Text color="red.300">{msg}</Text>}
              </ErrorMessage>
            </Flex>
            <Flex flexDirection="column" mb={4}>
              <FormControl id="agreeDataTreatment" isRequired>
                <Field name="agreeDataTreatment" type="checkbox">
                  {({ field }: FieldProps<string>) => (
                    <Checkbox
                      {...field}
                      isChecked={field.checked}
                      isInvalid={
                        errors.agreeDataTreatment !== undefined && touched.agreeDataTreatment
                      }
                    >
                      I agree to the data treatment policy
                    </Checkbox>
                  )}
                </Field>
              </FormControl>
              <ErrorMessage name="agreeDataTreatment">
                {(msg) => <Text color="red.300">{msg}</Text>}
              </ErrorMessage>
            </Flex>
            {!isConnected && (
              <ConnectButton width="100%" mb={4}>
                <Button variant="primary" size="md" width="100%">
                  Link Wallet
                </Button>
              </ConnectButton>
            )}
            {isConnected && address && (
              <Text mb={4}>
                Connected with {shortHash(address, { padLeft: 6, padRight: 6, separator: '...' })}
              </Text>
            )}
            <Button
              variant="primary"
              type="submit"
              width="100%"
              isDisabled={!isValid || !address}
              isLoading={loading}
              loadingText="Waiting for wallet signature"
              spinnerPlacement="end"
            >
              Submit
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;
