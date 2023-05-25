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
import { useIconForLink } from '@workagora/front/hooks/useIconForLink';

interface FormData {}

const validationSchema = Yup.object().shape({});

const FreelanceLinks: FC = () => {
  const { user } = useCurrentUser();
  const [edit, setEdit] = useState(false);
  const { loading, updateProfile } = useUpdateProfile();
  const { getIcon } = useIconForLink();

  const openInTab = (url: string) => {
    window.open(url, '_blank');
  };

  const onSubmit = async (values: FormData) => {
    /*if (user) {
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
    }*/
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
          flexBasis="40%"
        >
          <Formik
            initialValues={{}}
            validationSchema={validationSchema}
            isInitialValid={false}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {({ isValid, errors, touched }) => (
              <Form
                style={{ width: '100%', display: 'flex', flexDirection: 'column', rowGap: '16px' }}
              >
                <Flex alignItems="center">
                  <Box textStyle="h4" as="span">
                    Links
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
                        onClick={() => setEdit(false)}
                      >
                        <CloseIcon />
                      </Box>
                    </Flex>
                  )}
                </Flex>
                {!edit && (
                  <Flex gap={4}>
                    {user.links &&
                      user.links.map((v, k) => {
                        const Icon = getIcon(v);
                        return (
                          <Box
                            key={k}
                            w="30px"
                            h="30px"
                            color="brand.secondary"
                            _hover={{
                              color: 'brand.secondaryHover'
                            }}
                            overflow="hidden"
                            transition="all ease-in-out 250ms"
                            cursor="pointer"
                            display="flex"
                            flexDir="column"
                            sx={{
                              svg: {
                                width: '100%',
                                height: '100%'
                              }
                            }}
                            onClick={() => openInTab(v)}
                          >
                            <Icon />
                          </Box>
                        );
                      })}
                  </Flex>
                )}
                {edit && <>Form Control goes here</>}
              </Form>
            )}
          </Formik>
        </Flex>
      )}
    </>
  );
};

export default FreelanceLinks;
