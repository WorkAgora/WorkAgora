import {
  Avatar,
  Box,
  Flex,
  Input,
  FormControl,
  FormLabel,
  Button,
  Text,
  Textarea
} from '@chakra-ui/react';
import { FC } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ArrowRightIcon from '@workagora/front/components/icons/ArrowRightIcon';
import CheckIcon from '@workagora/front/components/icons/CheckIcon';
import { useCreateCompany } from '@workagora/front/hooks/useCreateCompany';
import { useCurrentUser } from '@workagora/front-provider';
import { locationRegex } from '@workagora/utils';

interface FormData {
  name: string;
  title: string;
  description: string;
  websiteUrl: string;
  location: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Company Name is required')
    .max(50, 'Company Name must be less than 50 characters'),
  title: Yup.string()
    .required('Company Title is required')
    .max(50, 'Company Title must be less than 50 characters'),
  description: Yup.string()
    .required('Description is required')
    .max(2000, 'Description must be less than 2000 characters'),
  websiteUrl: Yup.string().url('Website URL must be a valid URL'),
  location: Yup.string()
    .required()
    .matches(locationRegex, 'Invalid format. Please use "City, Country"')
});

const CompanyForm: FC = () => {
  const { loading, createNewCompany } = useCreateCompany();
  const { user } = useCurrentUser();
  const onSubmit = async (values: FormData) => {
    if (user) {
      await createNewCompany(values);
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        title: '',
        description: '',
        websiteUrl: '',
        location: ''
      }}
      validationSchema={validationSchema}
      isInitialValid={false}
      validateOnChange={false}
      validateOnBlur={true}
      onSubmit={onSubmit}
    >
      {({ errors, touched, setFieldValue, isValid }) => (
        <Form style={{ width: '100%', display: 'flex', flexDirection: 'column', rowGap: '24px' }}>
          <Flex alignItems="center" flexDir={{base: 'column', lg: 'row'}}>
            <Flex flexDir="column" alignItems="center">
              <Avatar w={{base: '64px', lg: "128px"}} h={{base: '64px', lg: "128px"}} borderRadius="16px" />
              <Box mt={2}>
                <Button
                  variant="outline"
                  width="100%"
                  color="brand.secondary"
                  borderColor="brand.secondary"
                  _hover={{
                    color: 'brand.secondaryHover',
                    borderColor: 'brand.secondaryHover'
                  }}
                  spinnerPlacement="end"
                  leftIcon={
                    <Box transform="rotate(-90deg)">
                      <ArrowRightIcon />
                    </Box>
                  }
                >
                  Upload logo
                </Button>
              </Box>
              <Box
                textStyle="h6"
                fontSize="14px"
                fontWeight="400"
                as="span"
                mt={2}
                color="neutral.dsGray"
              >
                {'.jpg / .png < 1Mo'}
              </Box>
            </Flex>
            <Flex direction="column" ml={{base: 0, lg: 8}} w={{base: "100%", lg: "30%"}} mt={{base: 4, lg: 0}}>
              <FormControl isRequired>
                <FormLabel>Company Name</FormLabel>
                <Field
                  name="name"
                  placeholder="Enter company name"
                  as={Input}
                  isInvalid={errors.name && touched.name}
                />
                <ErrorMessage name="name">
                  {(msg) => <Text color="red.500">{msg}</Text>}
                </ErrorMessage>
              </FormControl>
              <FormControl isRequired mt={3}>
                <FormLabel>Company Title</FormLabel>
                <Field
                  name="title"
                  placeholder="Enter company title"
                  as={Input}
                  isInvalid={errors.title && touched.title}
                />
                <ErrorMessage name="title">
                  {(msg) => <Text color="red.500">{msg}</Text>}
                </ErrorMessage>
              </FormControl>
            </Flex>
          </Flex>
          <Flex
            flexDir="column"
            justifyContent="center"
            p={6}
            borderRadius="32px"
            borderWidth="1px"
            borderColor="neutral.gray"
            w="100%"
            gap={4}
          >
            <Flex alignItems="center">
              <Box textStyle="h4" as="span">
                Company description
              </Box>
            </Flex>
            <FormControl id="description" isRequired>
              <Field
                name="description"
                placeholder="Write an attractive description for your company"
                as={Textarea}
                isInvalid={errors.description && touched.description}
                resize="vertical"
                minH="100px"
                maxH="300px"
                fontWeight="500"
              />
              <ErrorMessage name="description">
                {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
              </ErrorMessage>
            </FormControl>
          </Flex>
          <Flex flexDir={{base: 'column', lg: 'row'}}>
            <Flex
              flexDir="column"
              justifyContent="center"
              p={6}
              borderRadius="32px"
              borderWidth="1px"
              borderColor="neutral.gray"
              w={{base: "100%", lg: "35%"}}
              gap={4}
            >
              <Flex alignItems="center">
                <Box textStyle="h4" as="span">
                  Company website
                </Box>
              </Flex>
              <FormControl
                id="websiteUrl"
                isInvalid={errors.websiteUrl !== undefined && touched.websiteUrl}
              >
                <Field
                  name="websiteUrl"
                  placeholder="https://"
                  as={Input}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                    console.log(e.target.value.includes('https://'));
                    if (!e.target.value.includes('https://')) {
                      setFieldValue('websiteUrl', 'https://');
                    }
                  }}
                />
                <ErrorMessage name="websiteUrl">
                  {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                </ErrorMessage>
              </FormControl>
            </Flex>
            <Flex
              flexDir="column"
              justifyContent="center"
              p={6}
              borderRadius="32px"
              borderWidth="1px"
              borderColor="neutral.gray"
              w={{base: "100%", lg: "35%"}}
              ml={{base: 0, lg: 4}}
              mt={{base: 4, lg: 0}}
              gap={4}
            >
              <Flex alignItems="center">
                <Box textStyle="h4" as="span">
                  Company location
                </Box>
              </Flex>
              <FormControl
                id="location"
                isInvalid={errors.location !== undefined && touched.location}
                isRequired
              >
                <Field name="location" placeholder="City, Country" as={Input} />
                <ErrorMessage name="location">
                  {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                </ErrorMessage>
              </FormControl>
            </Flex>
          </Flex>
          <Box mt={4} mb={{base: 4, lg: 0}} mx={{base: "auto", lg: 0}}>
            <Button
              variant={!isValid ? 'outline' : 'primary'}
              type="submit"
              isDisabled={!isValid}
              isLoading={loading}
              loadingText="Creating company"
              spinnerPlacement="end"
              leftIcon={<CheckIcon />}
            >
              Create Company
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CompanyForm;
