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
  InputRightElement,
  Textarea
} from '@chakra-ui/react';
import { useCurrentUser } from '@workagora/front-provider';
import { FC, useEffect, useState } from 'react';
import PencilIcon from '@workagora/front/components/icons/PencilIcon';
import { User } from '@workagora/utils';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import CheckIcon from '@workagora/front/components/icons/CheckIcon';
import { useUpdateProfile } from '@workagora/front/hooks/useUpdateProfile';
import CloseIcon from '@workagora/front/components/icons/CloseIcon';

interface FormData {
  longDesc: string;
}

const validationSchema = Yup.object().shape({
  longDesc: Yup.string()
    .max(500, 'Description must be at most 500 characters')
    .required('Description required')
});

const FreelanceResume: FC = () => {
  const { user } = useCurrentUser();
  const [edit, setEdit] = useState(false);
  const { loading, updateProfile } = useUpdateProfile();

  const onSubmit = async (values: FormData) => {
    if (user) {
      const { longDesc } = values;
      const updatedValues: Partial<User> = {};

      if (user.freelanceProfile?.longDesc !== longDesc) {
        updatedValues.freelanceProfile = { longDesc };
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
          <Formik
            initialValues={{
              longDesc: user.freelanceProfile?.longDesc ?? ''
            }}
            validationSchema={validationSchema}
            isInitialValid={false}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {({ isValid, errors, touched, resetForm }) => (
              <Form
                style={{ width: '100%', display: 'flex', flexDirection: 'column', rowGap: '16px' }}
              >
                <Flex alignItems="center">
                  <Box textStyle="h4" as="span">
                    Resume
                  </Box>
                  {!edit && (
                    <Box
                      color="neutral.dsGray"
                      p={2}
                      ml="auto"
                      cursor="pointer"
                      borderRadius="8px"
                      _hover={{ bgColor: 'neutral.lightGray', color: 'neutral.black' }}
                      onClick={() => setEdit(true)}
                    >
                      <PencilIcon />
                    </Box>
                  )}
                  {edit && (
                    <Flex ml="auto" alignItems="center">
                      <Box>
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
                        onClick={() => {
                          setEdit(false);
                          resetForm();
                        }}
                      >
                        <CloseIcon />
                      </Box>
                    </Flex>
                  )}
                </Flex>
                {!edit && (
                  <Box textStyle="body2" color="neutral.dsDarkGray" pl={4} pr={16}>
                    {user.freelanceProfile?.longDesc}
                  </Box>
                )}
                {edit && (
                  <FormControl id="longDesc" isRequired mb={6}>
                    <Field
                      name="longDesc"
                      placeholder="Write an attractive bio of your profile"
                      as={Textarea}
                      isInvalid={errors.longDesc && touched.longDesc}
                      resize="vertical"
                      minH="100px"
                      maxH="200px"
                      fontWeight="500"
                    />
                    <ErrorMessage name="longDesc">
                      {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                    </ErrorMessage>
                  </FormControl>
                )}
              </Form>
            )}
          </Formik>
        </Flex>
      )}
    </>
  );
};

export default FreelanceResume;
