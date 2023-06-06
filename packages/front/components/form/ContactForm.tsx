import { FC, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Box,
  Textarea,
  useToast
} from '@chakra-ui/react';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().min(2).required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  subject: Yup.string().min(2).required('Subject is required'),
  message: Yup.string().min(2).required('Message is required')
});

const ContactForm: FC = () => {
  const toast = useToast();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);
  const selectOptions: { [key: string]: string } = {
    generalInquiry: 'General Inquiry',
    technicalSupport: 'Technical Support',
    billingPayments: 'Billing & Payments',
    accountIssues: 'Account Issues',
    featureRequest: 'Feature Request',
    reportBug: 'Report a Bug',
    partnershipOpportunities: 'Partnership Opportunities',
    feedbackSuggestions: 'Feedback and Suggestions',
    disputeResolution: 'Dispute Resolution',
    pressMedia: 'Press and Media'
  };

  const onSubmit = async (values: FormData) => {
    // Your form submission logic here
    // For example, you can send the form data to an API endpoint
  };

  /**    setSelectedSubject(value);
    setFieldValue('subject', value); */

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        subject: '',
        message: ''
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, isValid, errors, touched }) => {
        const handleSubjectSelection = (value: string) => {
          if (selectedSubject === value) {
            setSelectedSubject('');
            setFieldValue('subject', '');
          } else {
            setSelectedSubject(value);
            setFieldValue('subject', value);
          }
        };
        return (
          <Form>
            <Flex columnGap={12} flexDir={{base: 'column', md: 'row'}}>
              <FormControl id="name" isRequired mb={6}>
                <FormLabel>Name</FormLabel>
                <Field
                  name="name"
                  placeholder="Enter your name"
                  as={Input}
                  type="text"
                  isInvalid={errors.name && touched.name}
                />
                <ErrorMessage name="name">
                  {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                </ErrorMessage>
              </FormControl>
              <FormControl id="email" isRequired mb={6}>
                <FormLabel>Email</FormLabel>
                <Field
                  name="email"
                  placeholder="Enter your email"
                  as={Input}
                  type="email"
                  isInvalid={errors.email && touched.email}
                />
                <ErrorMessage name="email">
                  {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                </ErrorMessage>
              </FormControl>
            </Flex>
            <FormControl id="subject" isRequired mb={6}>
              <FormLabel>What kind of service are you looking for ?</FormLabel>
              <Menu onOpen={() => setSelectOpen(true)} onClose={() => setSelectOpen(false)}>
                <MenuButton
                  as={Button}
                  variant="select"
                  color={selectedSubject ? 'neutral.black' : 'neutral.dsGray'}
                  opacity={selectedSubject ? 1 : 0.75}
                  borderBottomLeftRadius={selectOpen ? '0' : '6px'}
                  rightIcon={
                    <Box
                      transform={selectOpen ? 'rotate(180deg)' : 'none'}
                      transition="all ease-in-out 250ms"
                    >
                      <ChevronDownIcon />
                    </Box>
                  }
                  w="100%"
                >
                  {selectOptions[selectedSubject] || 'Select a subject'}
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
                  {Object.keys(selectOptions).map((v, k) => (
                    <MenuItem key={k} onClick={() => handleSubjectSelection(v)}>
                      {selectOptions[v]}
                    </MenuItem>
                  ))}
                </MenuList>
                <Field name="subject" type="hidden" />
              </Menu>
              <ErrorMessage name="subject">
                {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
              </ErrorMessage>
            </FormControl>
            <FormControl id="message" isRequired mb={6}>
              <FormLabel>Message</FormLabel>
              <Field
                name="message"
                placeholder="Enter your message"
                as={Textarea}
                isInvalid={errors.message && touched.message}
                resize="vertical"
                minH="200px"
                maxH="300px"
              />
              <ErrorMessage name="message">
                {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
              </ErrorMessage>
            </FormControl>
            <Flex alignItems="center" justifyContent="end">
              <Button variant="primary" type="submit" rightIcon={<ArrowRightIcon />}>
                Send the message
              </Button>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ContactForm;
