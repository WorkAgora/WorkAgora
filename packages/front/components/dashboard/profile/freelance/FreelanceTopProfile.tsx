import {
  Avatar,
  Box,
  Text,
  Flex,
  Button,
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { useCurrentUser } from '@workagora/front-provider';
import StarIcon from '../../../icons/StarIcon';
import { FC, useState } from 'react';
import PencilIcon from '@workagora/front/components/icons/PencilIcon';
import { locationRegex, User } from '@workagora/utils';
import DollarIcon from '@workagora/front/components/icons/DollarIcon';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import CheckIcon from '@workagora/front/components/icons/CheckIcon';
import { useUpdateProfile } from '@workagora/front/hooks/useUpdateProfile';
import CloseIcon from '@workagora/front/components/icons/CloseIcon';
import { useResponsive } from '@workagora/front/hooks/useResponsive';

interface FormData {
  firstname: string;
  lastname: string;
  remuneration: string;
  description: string;
  location: string;
}

const validationSchema = Yup.object().shape({
  firstname: Yup.string().min(2).required('Firstname required'),
  lastname: Yup.string().min(2).required('Lastname required'),
  remuneration: Yup.string()
    .matches(/^\d+$/, 'Remuneration must be a number')
    .required('Remuneration required'),
  description: Yup.string()
    .max(55, 'Description must be at most 55 characters')
    .required('Description required'),
  location: Yup.string()
    .required('Location required')
    .matches(locationRegex, 'Invalid format. Please use "City, Country"')
});

const FreelanceTopProfile: FC = () => {
  const { user } = useCurrentUser();
  const [edit, setEdit] = useState(false);
  const { loading, updateProfile } = useUpdateProfile();
  const {mobileDisplay, tabletDisplay, desktopDisplay} = useResponsive();

  const onSubmit = async (values: FormData) => {
    if (user) {
      const { firstname, lastname, remuneration, description } = values;
      const updatedValues: Partial<User> = {};
      if (user?.firstname !== firstname) {
        updatedValues.firstname = firstname;
      }
      if (user?.lastname !== lastname) {
        updatedValues.lastname = lastname;
      }
      if (user?.freelanceProfile?.remuneration !== remuneration) {
        updatedValues.freelanceProfile = {};
        updatedValues.freelanceProfile.remuneration = remuneration;
      }
      if (user?.description !== description) {
        updatedValues.description = description;
      }
      await updateProfile({
        wallet: user.wallet,
        email: user.email,
        currentUserType: user.currentUserType,
        ...updatedValues
      });
      setEdit(false);
    }
  };

  return (
    <>
      {user && (
        <Formik
          initialValues={{
            firstname: user.firstname ?? '',
            lastname: user.lastname ?? '',
            remuneration: user.freelanceProfile?.remuneration ?? '',
            description: user.description ?? '',
            location: user.location ?? ''
          }}
          validationSchema={validationSchema}
          isInitialValid={false}
          onSubmit={onSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ isValid, errors, touched, resetForm }) => (
            <Flex alignItems={{base: 'center', lg: edit ? 'start' : 'center'}} p={6} flexDir={{base: !edit ? 'row' : 'column', lg: 'row'}}>
              <Avatar w={{base: '64px', lg: "128px"}} h={{base: '64px', lg: "128px"}} borderRadius="100%" mr={{base: 0, lg: '32px'}} />
              {!edit && (
                <>
                  <Flex flexDir="column" ml={{base: 4, lg: 8}} justifyContent="center">
                    <Box textStyle="h3">
                      {user.firstname} {user.lastname}
                    </Box>
                    <Flex alignItems="center" flexDir={{base: 'column', lg: 'row'}}>
                      <Box textStyle="h4" color="neutral.dsGray">
                        {user.description}
                      </Box>
                      {desktopDisplay && user.location && <Box textStyle="h4" color="neutral.dsGray" mx={1}>
                        |
                      </Box>}
                      <Box
                        ml={{base: 0, lg: 2}}
                        mt={0.5}
                        lineHeight="100%"
                        textStyle="h6"
                        color="neutral.dsDarkGray"
                      >
                        {user.location}
                      </Box>
                    </Flex>

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
                      <Flex
                        ml={4}
                        alignItems="center"
                        borderRadius="8px"
                        borderWidth="2px"
                        borderColor="brand.green"
                        py={1}
                        px={2}
                      >
                        <Box color="brand.green" mr={1}>
                          <DollarIcon />
                        </Box>
                        <Text
                          fontFamily="Montserrat"
                          fontWeight="700"
                          fontSize="16px"
                          lineHeight="120%"
                          color="neutral.black"
                        >
                          {user.freelanceProfile?.remuneration}
                        </Text>
                        <Text
                          fontFamily="Montserrat"
                          fontWeight="500"
                          fontSize="16px"
                          lineHeight="120%"
                          color="neutral.black"
                          ml={1}
                        >
                          /day
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Box
                    color="neutral.dsGray"
                    p={2}
                    ml="auto"
                    cursor="pointer"
                    borderRadius="8px"
                    transition="all ease-in-out 250ms"
                    _hover={{ bgColor: 'neutral.lightGray', color: 'neutral.black' }}
                    mt={-8}
                    onClick={() => setEdit(true)}
                  >
                    <PencilIcon />
                  </Box>
                </>
              )}
              {edit && (
                <Form style={{ width: '100%' }}>
                  <Flex flexDir={{base: !edit ? 'row' : 'column', lg: 'row'}}>
                    <Flex flexDir="column" gap={4}>
                      <Flex columnGap={8} rowGap={4} flexDir={{base: 'column', lg: 'row'}}>
                        <FormControl id="firstname" isRequired>
                          <FormLabel>Firstname</FormLabel>
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
                        <FormControl id="lastname" isRequired>
                          <FormLabel>Lastname</FormLabel>
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
                        <FormControl id="remuneration" isRequired position="relative">
                          <FormLabel>Daily rate</FormLabel>
                          <Field name="remuneration">
                            {({ field, form }: any) => (
                              <InputGroup>
                                <Input
                                  {...field}
                                  placeholder="Enter your daily rate"
                                  isInvalid={form.errors.remuneration && form.touched.remuneration}
                                />
                                <InputRightElement fontWeight="700" color="neutral.black">
                                  $
                                </InputRightElement>
                              </InputGroup>
                            )}
                          </Field>
                          <ErrorMessage name="remuneration">
                            {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                          </ErrorMessage>
                        </FormControl>
                      </Flex>
                      <Flex flexDir={{base: 'column', lg: 'row'}}>
                        <FormControl id="description" isRequired>
                          <FormLabel>Profile title</FormLabel>
                          <Field name="description">
                            {({ field, form }: any) => (
                              <InputGroup>
                                <Input
                                  {...field}
                                  placeholder="Write an attractive title"
                                  isInvalid={errors.description && touched.description}
                                />
                                <InputRightElement mr={4} fontWeight="700">
                                  <Box
                                    color={field.value.length <= 55 ? 'green.500' : 'red.500'}
                                    mr={1}
                                  >
                                    {field.value.length}
                                  </Box>
                                  /<Box mx={1}>55</Box>
                                </InputRightElement>
                              </InputGroup>
                            )}
                          </Field>
                          <ErrorMessage name="description">
                            {(msg) => (
                              <Text mt={1} textStyle="errorMessage">
                                {msg}
                              </Text>
                            )}
                          </ErrorMessage>
                        </FormControl>
                        <FormControl id="location" isRequired ml={{base: 0, lg: 6}}>
                          <FormLabel>Location</FormLabel>
                          <Field
                            name="location"
                            placeholder="Enter your location"
                            as={Input}
                            type="text"
                            isInvalid={errors.location && touched.location}
                          />
                          <ErrorMessage name="location">
                            {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                          </ErrorMessage>
                        </FormControl>
                      </Flex>
                    </Flex>
                    <Flex ml="auto" mr={{base: 'auto', lg: 0}} alignItems="start">
                      <Box mt={8}>
                        <Button
                          variant={!isValid ? 'outline' : 'primary'}
                          type="submit"
                          width="100%"
                          isDisabled={!isValid}
                          isLoading={loading}
                          loadingText="Updating profile"
                          spinnerPlacement="end"
                          rightIcon={<CheckIcon />}
                        >
                          Save changes
                        </Button>
                      </Box>
                      <Box
                        color="red.500"
                        p={2}
                        ml={2}
                        cursor="pointer"
                        borderRadius="8px"
                        transition="all ease-in-out 250ms"
                        _hover={{ bgColor: 'neutral.lightGray', color: 'red.700' }}
                        mt={9}
                        onClick={() => {
                          setEdit(false);
                          resetForm();
                        }}
                      >
                        <CloseIcon />
                      </Box>
                    </Flex>
                  </Flex>
                </Form>
              )}
            </Flex>
          )}
        </Formik>
      )}
    </>
  );
};

export default FreelanceTopProfile;
