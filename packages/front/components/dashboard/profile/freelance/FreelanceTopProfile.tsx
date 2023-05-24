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
import { User } from '@workagora/utils';
import DollarIcon from '@workagora/front/components/icons/DollarIcon';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import CheckIcon from '@workagora/front/components/icons/CheckIcon';
import { useUpdateProfile } from '@workagora/front/hooks/useUpdateProfile';

interface FormData {
  firstname: string;
  lastname: string;
  remuneration: string;
  description: string;
}

const validationSchema = Yup.object().shape({
  firstname: Yup.string().min(2).required('Firstname required'),
  lastname: Yup.string().min(2).required('Lastname required'),
  remuneration: Yup.string()
    .matches(/^\d+$/, 'Remuneration must be a number')
    .required('Remuneration required'),
  description: Yup.string()
    .max(55, 'Description must be at most 55 characters')
    .required('Description required')
});

const FreelanceTopProfile: FC = () => {
  const { user } = useCurrentUser();
  const [edit, setEdit] = useState(false);
  const { loading, updateProfile } = useUpdateProfile();

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
        <Flex alignItems={edit ? 'start' : 'center'} p={6}>
          <Avatar w="128px" h="128px" borderRadius="100%" />
          {!edit && (
            <>
              <Flex flexDir="column" ml={8} justifyContent="center">
                <Box textStyle="h3">
                  {user.firstname} {user.lastname}
                </Box>
                <Box textStyle="h4" color="neutral.dsGray">
                  {user.description}
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
                _hover={{ bgColor: 'neutral.lightGray', color: 'neutral.black' }}
                mt={-8}
                onClick={() => setEdit(true)}
              >
                <PencilIcon />
              </Box>
            </>
          )}
          {edit && (
            <Formik
              initialValues={{
                firstname: user.firstname ?? '',
                lastname: user.lastname ?? '',
                remuneration: user.freelanceProfile?.remuneration ?? '',
                description: user.description ?? ''
              }}
              validationSchema={validationSchema}
              isInitialValid={false}
              onSubmit={onSubmit}
              validateOnChange={false}
              validateOnBlur={true}
            >
              {({ isValid, errors, touched }) => (
                <Form style={{ width: '100%', marginLeft: '32px' }}>
                  <Flex>
                    <Flex flexDir="column" gap={4}>
                      <Flex columnGap={8}>
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
                    </Flex>
                    <Box ml="auto" mt={8}>
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
                  </Flex>
                </Form>
              )}
            </Formik>
          )}
        </Flex>
      )}
    </>
  );
};

export default FreelanceTopProfile;
