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
import { FC, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ArrowRightIcon from '@workagora/front/components/icons/ArrowRightIcon';
import { useCurrentCompany, useCurrentUser } from '@workagora/front-provider';
import StarIcon from '@workagora/front/components/icons/StarIcon';
import PencilIcon from '@workagora/front/components/icons/PencilIcon';
import CloseIcon from '@workagora/front/components/icons/CloseIcon';
import CheckIcon from '@workagora/front/components/icons/CheckIcon';
import WebsiteIcon from '@workagora/front/components/icons/WebsiteIcon';
import { useUpdateCompany } from '@workagora/front/hooks/useUpdateCompany';
import { locationRegex } from '@workagora/utils';
import { useResponsive } from '@workagora/front/hooks/useResponsive';

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
  location: Yup.string().matches(locationRegex, 'Invalid format. Please use "City, Country"')
});

const CompanyWithEdit: FC = () => {
  const { user } = useCurrentUser();
  const { company } = useCurrentCompany();
  const { loading, updateMyCompany } = useUpdateCompany();
  const {mobileDisplay, tabletDisplay, desktopDisplay} = useResponsive();

  const onSubmit = async (values: FormData) => {
    if (user) {
      await updateMyCompany({ ...company, ...values });
    }
  };

  const [titleEdit, setTitleEdit] = useState(false);
  const [descEdit, setDescEdit] = useState(false);
  const [linkEdit, setLinkEdit] = useState(false);
  const [locationEdit, setLocationEdit] = useState(false);

  return (
    <Formik
      initialValues={{
        name: company?.name ?? '',
        title: company?.title ?? '',
        description: company?.description ?? '',
        websiteUrl: company?.websiteUrl ?? '',
        location: company?.location ?? ''
      }}
      validationSchema={validationSchema}
      isInitialValid={false}
      validateOnChange={false}
      validateOnBlur={true}
      onSubmit={async (values, actions) => {
        await onSubmit(values);
        setTimeout(() => {
          setDescEdit(false);
          setLinkEdit(false);
          setTitleEdit(false);
          actions.resetForm();
        }, 500);
      }}
    >
      {({ errors, touched, setFieldValue, isValid, resetForm }) => (
        <Form style={{ width: '100%', display: 'flex', flexDirection: 'column', rowGap: '24px' }}>
          <Flex alignItems="center" flexDir={{base: titleEdit ? 'column' : 'row', lg: 'row'}}>
            <Flex flexDir="column" alignItems="center">
              <Avatar w={{base: '64px', lg: "128px"}} h={{base: '64px', lg: "128px"}} borderRadius="16px" ml={titleEdit ? 0 : 8} />
              {titleEdit && (
                <>
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
                </>
              )}
            </Flex>
            {!titleEdit && (
              <Flex flexDir="column" ml={8} justifyContent="center">
                <Box textStyle="h3">{company?.name}</Box>
                <Box textStyle="h4" color="neutral.dsGray">
                  {company?.title}
                </Box>
                <Flex mt={2}>
                  <Flex
                    alignItems="center"
                    borderRadius="8px"
                    borderWidth="2px"
                    borderColor="brand.primary"
                    py={1}
                    px={2}
                  >
                    <Box color="brand.primary" mr={1}>
                      <StarIcon />
                    </Box>
                    <Text
                      fontFamily="Montserrat"
                      fontWeight="700"
                      fontSize="16px"
                      lineHeight="120%"
                      color="neutral.black"
                    >
                      4,9
                    </Text>
                    <Text
                      fontFamily="Montserrat"
                      fontWeight="500"
                      fontSize="16px"
                      lineHeight="120%"
                      color="neutral.black"
                      ml={1}
                    >
                      /5
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            )}
            {titleEdit && (
              <Flex direction="column" ml={{base: 0, lg: 8}} mt={{base: 4, lg: 0}} w={{base: '100%', lg: "30%"}}>
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
            )}
            {!titleEdit && (
              <Box
                color="neutral.dsGray"
                p={2}
                ml="auto"
                mr={6}
                cursor="pointer"
                borderRadius="8px"
                transition="all ease-in-out 250ms"
                _hover={{ bgColor: 'neutral.lightGray', color: 'neutral.black' }}
                alignSelf="start"
                mt={8}
                onClick={() => setTitleEdit(true)}
              >
                <PencilIcon />
              </Box>
            )}
            {titleEdit && (
              <Flex ml="auto" mt={8} mr={{base: 'auto', lg: 6}} alignItems="center" alignSelf="start">
                <Button
                  variant={!isValid ? 'outline' : 'primary'}
                  type="submit"
                  width="100%"
                  isDisabled={!isValid}
                  isLoading={loading}
                  loadingText="Updating company"
                  spinnerPlacement="end"
                  rightIcon={<CheckIcon />}
                >
                  Save changes
                </Button>
                <Box
                  color="red.500"
                  p={2}
                  cursor="pointer"
                  borderRadius="8px"
                  ml={2}
                  transition="all ease-in-out 250ms"
                  _hover={{ bgColor: 'neutral.lightGray', color: 'red.700' }}
                  onClick={() => {
                    setTitleEdit(false);
                    resetForm();
                  }}
                >
                  <CloseIcon />
                </Box>
              </Flex>
            )}
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
            <Flex alignItems="center" flexDir={{base: descEdit ? 'column' : 'row', lg: 'row'}}>
              <Box textStyle="h4" as="span">
                Company description
              </Box>
              {!descEdit && (
                <Box
                  color="neutral.dsGray"
                  p={2}
                  ml="auto"
                  cursor="pointer"
                  borderRadius="8px"
                  transition="all ease-in-out 250ms"
                  _hover={{ bgColor: 'neutral.lightGray', color: 'neutral.black' }}
                  alignSelf="start"
                  onClick={() => setDescEdit(true)}
                >
                  <PencilIcon />
                </Box>
              )}
              {descEdit && (
                <Flex ml="auto" mr={{base: 'auto', lg: 0}} mt={{base: 4, lg: 0}} alignItems="center" alignSelf="start">
                  <Button
                    variant={!isValid ? 'outline' : 'primary'}
                    type="submit"
                    width="100%"
                    isDisabled={!isValid}
                    isLoading={loading}
                    loadingText="Updating company"
                    spinnerPlacement="end"
                    rightIcon={<CheckIcon />}
                  >
                    Save changes
                  </Button>
                  <Box
                    color="red.500"
                    p={2}
                    cursor="pointer"
                    borderRadius="8px"
                    ml={2}
                    transition="all ease-in-out 250ms"
                    _hover={{ bgColor: 'neutral.lightGray', color: 'red.700' }}
                    onClick={() => {
                      setDescEdit(false);
                      resetForm();
                    }}
                  >
                    <CloseIcon />
                  </Box>
                </Flex>
              )}
            </Flex>
            {descEdit && (
              <FormControl id="description" isRequired>
                <Field
                  name="description"
                  placeholder="Write an attractive description for your company"
                  as={Textarea}
                  isInvalid={errors.description && touched.description}
                  resize="vertical"
                  minH={{base: "300px", lg: '100px'}}
                  maxH={{base: "500px", lg: '300px'}}
                  fontWeight="500"
                />
                <ErrorMessage name="description">
                  {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                </ErrorMessage>
              </FormControl>
            )}
            {!descEdit && (
              <Box textStyle="body2" color="neutral.dsDarkGray" pl={4} pr={{base: 0, lg: 16}}>
                {company?.description}
              </Box>
            )}
          </Flex>
          <Flex flexDir={{base: 'column', lg: 'row'}} rowGap={4}>
            <Flex
              flexDir="column"
              justifyContent="center"
              p={6}
              borderRadius="32px"
              borderWidth="1px"
              borderColor="neutral.gray"
              w={{base: '100%' , lg: "35%"}}
              gap={4}
            >
              <Flex alignItems="center" flexDir={{base: linkEdit ? 'column' : 'row', lg: 'row'}} rowGap={{base: 4, lg: 0}}>
                <Box textStyle="h4" as="span">
                  Company website
                </Box>
                {!linkEdit && (
                  <Box
                    color="neutral.dsGray"
                    p={2}
                    ml="auto"
            
                    cursor="pointer"
                    borderRadius="8px"
                    transition="all ease-in-out 250ms"
                    _hover={{ bgColor: 'neutral.lightGray', color: 'neutral.black' }}
                    alignSelf="start"
                    onClick={() => setLinkEdit(true)}
                  >
                    <PencilIcon />
                  </Box>
                )}
                {linkEdit && (
                  <Flex ml="auto" mr={{base: 'auto', lg: 0}} alignItems="center" alignSelf="start">
                    <Button
                      variant={!isValid ? 'outline' : 'primary'}
                      type="submit"
                      width="100%"
                      isDisabled={!isValid}
                      isLoading={loading}
                      loadingText="Updating company"
                      spinnerPlacement="end"
                      rightIcon={<CheckIcon />}
                    >
                      Save link
                    </Button>
                    <Box
                      color="red.500"
                      p={2}
                      cursor="pointer"
                      borderRadius="8px"
                      ml={2}
                      transition="all ease-in-out 250ms"
                      _hover={{ bgColor: 'neutral.lightGray', color: 'red.700' }}
                      onClick={() => {
                        setLinkEdit(false);
                        resetForm();
                      }}
                    >
                      <CloseIcon />
                    </Box>
                  </Flex>
                )}
              </Flex>
              {linkEdit && (
                <Flex alignItems="center">
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
                  <Box
                    color="neutral.black"
                    p={2}
                    cursor="pointer"
                    borderRadius="8px"
                    ml={2}
                    transition="all ease-in-out 250ms"
                    _hover={{ bgColor: 'neutral.lightGray' }}
                    onClick={() => {
                      setFieldValue('websiteUrl', '');
                    }}
                  >
                    <CloseIcon />
                  </Box>
                </Flex>
              )}
              {!linkEdit && company?.websiteUrl !== '' && (
                <Button
                  variant="outline"
                  width="100%"
                  color="brand.secondary"
                  borderColor="brand.secondary"
                  _hover={{
                    color: 'brand.secondaryHover',
                    borderColor: 'brand.secondaryHover'
                  }}
                  onClick={() => {
                    window.open(company?.websiteUrl, '_blank');
                  }}
                  rightIcon={
                    <Box ml={2}>
                      <WebsiteIcon />
                    </Box>
                  }
                >
                  Visit our website
                </Button>
              )}
            </Flex>
            <Flex
              flexDir="column"
              justifyContent="center"
              p={6}
              borderRadius="32px"
              borderWidth="1px"
              borderColor="neutral.gray"
              gap={4}
              ml={{base:0,lg: 4}}
            >
              <Flex alignItems="center" flexDir={{base: locationEdit ? 'column' : 'row', lg: 'row'}} rowGap={{base: 4, lg: 0}}>
                <Box textStyle="h4" as="span">
                  Company location
                </Box>
                {!locationEdit && (
                  <Box
                    color="neutral.dsGray"
                    p={2}
                    ml={{base: 'auto', lg: 4}}
                    mr={{base: 'auto', lg: 0}}
                    cursor="pointer"
                    borderRadius="8px"
                    transition="all ease-in-out 250ms"
                    _hover={{ bgColor: 'neutral.lightGray', color: 'neutral.black' }}
                    alignSelf="start"
                    onClick={() => setLocationEdit(true)}
                  >
                    <PencilIcon />
                  </Box>
                )}
                {locationEdit && (
                  <Flex ml={4} alignItems="center" alignSelf="start">
                    <Button
                      variant={!isValid ? 'outline' : 'primary'}
                      type="submit"
                      width="100%"
                      isDisabled={!isValid}
                      isLoading={loading}
                      loadingText="Updating company"
                      spinnerPlacement="end"
                      rightIcon={<CheckIcon />}
                    >
                      Save location
                    </Button>
                    <Box
                      color="red.500"
                      p={2}
                      cursor="pointer"
                      borderRadius="8px"
                      ml={2}
                      transition="all ease-in-out 250ms"
                      _hover={{ bgColor: 'neutral.lightGray', color: 'red.700' }}
                      onClick={() => {
                        setLocationEdit(false);
                        resetForm();
                      }}
                    >
                      <CloseIcon />
                    </Box>
                  </Flex>
                )}
              </Flex>
              {locationEdit && (
                <Flex alignItems="center">
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
              )}
              {!locationEdit && (
                <Box textStyle="h4" color="neutral.dsGray">
                  {company?.location}
                </Box>
              )}
            </Flex>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default CompanyWithEdit;
