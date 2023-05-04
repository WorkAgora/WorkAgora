import { FC, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Checkbox,
  Text,
  FormControl,
  FormLabel,
  Input,
  Flex,
  useToast,
  FormHelperText,
  Box
} from '@chakra-ui/react';
import ConnectButton from '../button/ConnectButton';
import RadioCard from '../radio/RadioCard';
import RadioCardGroup from '../radio/RadioCardGroup';
import { useAccount, useNetwork } from 'wagmi';
import { shortHash } from '@workaurora/utils';
import { useSignUp } from '../../hooks/useSignUp';

interface RadioUserType {
  label: string;
  value: string;
}

const RadioGroupUserType: RadioUserType[] = [
  {
    label: 'Freelancer',
    value: 'Freelancer'
  },
  {
    label: 'Employer',
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
  email: Yup.string().email('Invalid email').required('Email is required'),
  firstname: Yup.string().min(2).required('Firstname required'),
  lastname: Yup.string().min(2).required('Lastname required'),
  currentUserType: Yup.string().oneOf(['Freelancer', 'Employer']).required(' '),
  agreeTOS: Yup.bool().oneOf([true], 'Must agree to Terms of Service'),
  agreeDataTreatment: Yup.bool().oneOf([true], 'Must agree to data treatment policy')
});

interface SignupFormProps {
  onSubmitSuccess: () => void;
}

const SignupForm: FC<SignupFormProps> = ({ onSubmitSuccess }) => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { signUp } = useSignUp();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: FormData) => {
    if (address && chain && !loading) {
      setLoading(true);
      const res = await signUp({ address, chain, ...values });
      if (res === true) {
        toast({
          title: <Text mt={-0.5}>Account registered</Text>,
          status: 'success',
          isClosable: true,
          position: 'top-right'
        });
        onSubmitSuccess();
      } else {
        toast({
          title: <Text mt={-0.5}>Error while registering</Text>,
          description: typeof res === 'string' ? res : null,
          status: 'error',
          isClosable: true,
          position: 'top-right'
        });
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
      validateOnChange={false}
      validateOnBlur={true}
    >
      {({ isValid, errors, touched }) => (
        <Form>
          <FormControl id="email" isRequired mb={6}>
            <FormLabel>Your mail</FormLabel>
            <Field
              name="email"
              placeholder="Enter your mail"
              as={Input}
              type="email"
              isInvalid={errors.email && touched.email}
            />
            <ErrorMessage name="email">
              {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
            </ErrorMessage>
          </FormControl>
          <FormControl id="firstname" isRequired mb={6}>
            <FormLabel>Your firstname</FormLabel>
            <Field
              name="firstname"
              placeholder="Enter your firstname"
              as={Input}
              type="text"
              isInvalid={errors.firstname && touched.firstname}
            />
            <ErrorMessage name="firstname">
              {(msg) => (
                <Text mt={1} textStyle="errorMessage">
                  {msg}
                </Text>
              )}
            </ErrorMessage>
          </FormControl>
          <FormControl id="lastname" isRequired mb={6}>
            <FormLabel>Your lastname</FormLabel>
            <Field
              name="lastname"
              placeholder="Enter your lastname"
              as={Input}
              type="text"
              isInvalid={errors.lastname && touched.lastname}
            />
            <ErrorMessage name="lastname">
              {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
            </ErrorMessage>
          </FormControl>
          <FormControl id="currentUserType" mb={6}>
            <FormLabel>Your are a</FormLabel>
            <RadioCardGroup name="currentUserType" display="flex" columnGap={2}>
              {RadioGroupUserType.map((v, k) => {
                return (
                  <RadioCard key={k} groupName="currentUserType" label={v.label} value={v.value} />
                );
              })}
            </RadioCardGroup>
            <FormHelperText>You’ll be able to switch at any moment *</FormHelperText>
          </FormControl>
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
              {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
            </ErrorMessage>
          </Flex>
          <Flex flexDirection="column" mb={6}>
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
              {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
            </ErrorMessage>
          </Flex>
          <FormControl mb={4}>
            {!isConnected && (
              <ConnectButton width="100%">
                <Button variant="primary" size="md" width="100%">
                  Connect Wallet
                </Button>
              </ConnectButton>
            )}
            {isConnected && (
              <Box
                borderWidth="1px"
                borderColor="green.300"
                color="green.300"
                borderRadius="32px"
                fontWeight="600"
                textAlign="center"
                px={6}
                py={2.5}
                cursor="default"
              >
                Connected with {shortHash(address, { padLeft: 6, padRight: 6, separator: '...' })}
              </Box>
            )}
            <FormHelperText>
              Once connected, you can change address with your wallet provider *
            </FormHelperText>
          </FormControl>
          <Button
            variant={!isValid || !address ? 'outline' : 'primary'}
            type="submit"
            width="100%"
            isDisabled={!isValid || !address}
            isLoading={loading}
            loadingText="Waiting for wallet signature"
            spinnerPlacement="end"
          >
            Register
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;
