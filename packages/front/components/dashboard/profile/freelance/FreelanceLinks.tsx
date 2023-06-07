import { Box, Text, Flex, Button, Input, FormControl } from '@chakra-ui/react';
import { useCurrentUser } from '@workagora/front-provider';
import { FC, useState } from 'react';
import PencilIcon from '../../../icons/PencilIcon';
import { User } from '@workagora/utils';
import * as Yup from 'yup';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import CheckIcon from '../../../icons/CheckIcon';
import { useUpdateProfile } from '@workagora/front/hooks/useUpdateProfile';
import CloseIcon from '../../../icons/CloseIcon';
import { useIconForLink } from '@workagora/front/hooks/useIconForLink';
import AddIcon from '../../../icons/AddIcon';

interface FormData {
  links: string[];
}

const validationSchema = Yup.object().shape({
  links: Yup.array()
    .of(
      Yup.string()
        .url('Invalid URL')
        .test('not-only-https', 'URL should not be only "https://"', (value) => {
          return value !== 'https://';
        })
    )
    .max(6, 'Maximum 6 links allowed')
});

const FreelanceLinks: FC = () => {
  const { user } = useCurrentUser();
  const [edit, setEdit] = useState(false);
  const { loading, updateProfile } = useUpdateProfile();
  const { getIcon } = useIconForLink();

  const openInTab = (url: string) => {
    window.open(url, '_blank');
  };

  const onSubmit = async (values: FormData) => {
    if (user) {
      const { links } = values;
      const updatedValues: Partial<User> = {};

      let update = false;

      const linkToUpdate = links.filter((v) => v !== '' && v !== 'https://');

      if (user.links?.length === linkToUpdate.length) {
        user.links?.forEach((v, k) => {
          if (v !== linkToUpdate[k]) {
            update = true;
          }
        });
      } else {
        update = true;
      }

      if (update) {
        updatedValues.links = linkToUpdate;
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
          flexBasis="40%"
        >
          <Formik
            initialValues={{ links: user?.links || [''] }}
            validationSchema={validationSchema}
            isInitialValid={false}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {({ isValid, errors, touched, values, resetForm, setFieldValue, validateForm }) => (
              <Form
                style={{ width: '100%', display: 'flex', flexDirection: 'column', rowGap: '16px' }}
              >
                <Flex alignItems="center" flexDir={{base: edit ? 'column' : 'row', lg: 'row'}}>
                  <Flex alignItems="center">
                    <Box textStyle="h4" as="span">
                      Links
                    </Box>
                    {edit && (
                      <Box
                        textStyle="h6"
                        fontSize="14px"
                        fontWeight="400"
                        as="span"
                        ml={4}
                        mt={0.5}
                        color="neutral.dsGray"
                      >
                        {values.links.length} / 6
                      </Box>
                    )}
                  </Flex>
                  {!edit && (
                    <Box
                      color="neutral.dsGray"
                      p={2}
                      ml="auto"
                      cursor="pointer"
                      borderRadius="8px"
                      _hover={{ bgColor: 'neutral.lightGray', color: 'neutral.black' }}
                      onClick={() => {
                        setEdit(true);
                      }}
                    >
                      <PencilIcon />
                    </Box>
                  )}
                  {edit && (
                    <Flex ml="auto" mr={{base: 'auto', lg: 0}} mt={{base: 4, lg: 0}} alignItems="center">
                      <Box>
                        <Button
                          variant={!isValid ? 'outline' : 'primary'}
                          type="submit"
                          width="100%"
                          isDisabled={!isValid}
                          isLoading={loading}
                          loadingText="Updating profile"
                          spinnerPlacement="end"
                          leftIcon={<CheckIcon />}
                        >
                          Save links
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
                {edit && (
                  <FieldArray name="links">
                    {({ push, remove }) => (
                      <>
                        {values.links.map((v, k) => (
                          <Flex key={k} alignItems="start">
                            <FormControl
                              id={`links.${k}`}
                              isInvalid={errors.links !== undefined && touched.links}
                            >
                              <Field
                                name={`links.${k}`}
                                placeholder="https://"
                                as={Input}
                                onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                                  console.log(e.target.value.includes('https://'));
                                  if (!e.target.value.includes('https://')) {
                                    setFieldValue(`links.${k}`, 'https://');
                                  }
                                }}
                              />
                              <ErrorMessage name={`links.${k}`}>
                                {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                              </ErrorMessage>
                            </FormControl>
                            <Box>
                              <Button
                                variant="icon"
                                onClick={() => {
                                  remove(k);
                                  validateForm();
                                }}
                              >
                                <CloseIcon />
                              </Button>
                            </Box>
                          </Flex>
                        ))}
                        {values.links.length < 6 && (
                          <Box>
                            <Button
                              type="button"
                              onClick={() => push('')}
                              mt={2}
                              color="neutral.dsGray"
                              display="flex"
                              leftIcon={
                                <Box w="15px" h="15px" ml={1} mr={2} mt={-1}>
                                  <AddIcon />
                                </Box>
                              }
                            >
                              Add Link
                            </Button>
                          </Box>
                        )}
                      </>
                    )}
                  </FieldArray>
                )}
              </Form>
            )}
          </Formik>
        </Flex>
      )}
    </>
  );
};

export default FreelanceLinks;
