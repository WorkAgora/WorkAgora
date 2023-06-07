import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react';
import { useCurrentUser } from '@workagora/front-provider';
import CheckIcon from '@workagora/front/components/icons/CheckIcon';
import ChevronDownIcon from '@workagora/front/components/icons/ChevronDownIcon';
import CloseIcon from '@workagora/front/components/icons/CloseIcon';
import PencilIcon from '@workagora/front/components/icons/PencilIcon';
import { useUpdateProfile } from '@workagora/front/hooks/useUpdateProfile';
import { User } from '@workagora/utils';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';

interface FormData {
  workLocation: string;
  availability: string;
  hoursPerWeek: string;
  yearsOfExperience: string;
}

const workLocationOptions: { [key: string]: string } = {
  fullRemote: 'Full-remote',
  partialRemote: 'Partial-remote',
  onSite: 'On site'
};

const availabilityOptions: { [key: string]: string } = {
  fullTime: 'Full-time',
  partTime: 'Part-time',
  notAvailable: 'N/A'
};

const validationSchema = Yup.object().shape({
  workLocation: Yup.string()
    .oneOf(Object.keys(workLocationOptions))
    .required('Work location is required'),
  availability: Yup.string()
    .oneOf(Object.keys(availabilityOptions))
    .required('Availability is required'),
  hoursPerWeek: Yup.string().matches(/^\d+$/, 'Hours per week must be a number'),
  yearsOfExperience: Yup.string().matches(/^\d+$/, 'Years of experience must be a number')
});

const FreelancePreferences: FC = () => {
  const { user } = useCurrentUser();
  const [edit, setEdit] = useState(false);
  const { loading, updateProfile } = useUpdateProfile();
  const [selectedWorkLocation, setSelectedWorkLocation] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [workLocationOpen, setWorkLocationOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const findKeyByValue = (
    value: string,
    options: { [key: string]: string }
  ): string | undefined => {
    return Object.keys(options).find((key) => options[key] === value);
  };

  const onSubmit = async (values: FormData) => {
    if (user) {
      const { workLocation, availability, hoursPerWeek, yearsOfExperience } = values;
      const updatedValues: Partial<User> = {};

      if (user.freelanceProfile?.workLocation !== workLocationOptions[workLocation]) {
        updatedValues.freelanceProfile = {
          ...updatedValues.freelanceProfile,
          workLocation: workLocationOptions[workLocation]
        };
      }

      if (user.freelanceProfile?.availability !== availabilityOptions[availability]) {
        updatedValues.freelanceProfile = {
          ...updatedValues.freelanceProfile,
          availability: availabilityOptions[availability]
        };
        if (availability !== 'notAvailable') {
          updatedValues.freelanceProfile = {
            ...updatedValues.freelanceProfile,
            situation: 'Available'
          };
        } else {
          updatedValues.freelanceProfile = {
            ...updatedValues.freelanceProfile,
            situation: 'Unavailable'
          };
        }
      }

      if (user.freelanceProfile?.hoursPerWeek !== parseInt(hoursPerWeek)) {
        updatedValues.freelanceProfile = {
          ...updatedValues.freelanceProfile,
          hoursPerWeek: parseInt(hoursPerWeek)
        };
      }

      if (user.freelanceProfile?.yearsOfExperience !== yearsOfExperience) {
        updatedValues.freelanceProfile = { ...updatedValues.freelanceProfile, yearsOfExperience };
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

  useEffect(() => {
    if (!edit) {
      if (user?.freelanceProfile?.workLocation) {
        setSelectedWorkLocation(
          findKeyByValue(user?.freelanceProfile?.workLocation, workLocationOptions) ?? ''
        );
      }

      if (user?.freelanceProfile?.availability) {
        setSelectedAvailability(
          findKeyByValue(user?.freelanceProfile?.availability, availabilityOptions) ?? ''
        );
      }
    }
  }, [
    availabilityOptions,
    edit,
    user?.freelanceProfile?.availability,
    user?.freelanceProfile?.workLocation,
    workLocationOptions
  ]);

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
          flexBasis="60%"
        >
          <Formik
            initialValues={{
              workLocation: user.freelanceProfile?.workLocation
                ? findKeyByValue(user.freelanceProfile?.workLocation, workLocationOptions) ?? ''
                : '',
              availability: user.freelanceProfile?.availability
                ? findKeyByValue(user.freelanceProfile?.availability, availabilityOptions) ?? ''
                : '',
              hoursPerWeek: user.freelanceProfile?.hoursPerWeek?.toString() ?? '',
              yearsOfExperience: user.freelanceProfile?.yearsOfExperience ?? ''
            }}
            validationSchema={validationSchema}
            isInitialValid={false}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {({
              isValid,
              errors,
              touched,
              values,
              setFieldValue,
              validateField,
              setFieldTouched,
              resetForm
            }) => {
              const handleSelectionWorkLocation = (value: string) => {
                if (selectedWorkLocation === value) {
                  setSelectedWorkLocation('');
                  setFieldTouched('workLocation', false);
                  setFieldValue('workLocation', '', true);
                } else {
                  setSelectedWorkLocation(value);
                  setFieldTouched('workLocation', true);
                  setFieldValue('workLocation', value, true);
                }
                if (
                  workLocationOptions[selectedWorkLocation] === user.freelanceProfile?.workLocation
                ) {
                  setFieldTouched('workLocation', false);
                }
              };
              const handleSelectionAvailability = (value: string) => {
                if (selectedAvailability === value) {
                  setSelectedAvailability('');
                  setFieldTouched('availability', false);
                  setFieldValue('availability', '', true);
                } else {
                  setSelectedAvailability(value);
                  setFieldTouched('availability', true);
                  setFieldValue('availability', value, true);
                }
                if (
                  availabilityOptions[selectedAvailability] === user.freelanceProfile?.availability
                ) {
                  setFieldTouched('availability', false);
                }
              };
              return (
                <Form
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: '16px'
                  }}
                >
                  <Flex alignItems="center" flexDir={{base: edit ? 'column' : 'row', lg: 'row'}}>
                    <Box textStyle="h4" as="span">
                      Preferences
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
                      <Flex ml="auto" mr={{base: 'auto', lg: 0}} mt={{base: 4, lg: 0}} alignItems="center">
                        <Box>
                          <Button
                            variant={isValid ? 'primary' : 'outline'}
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
                    <Flex gap={2} flexWrap={{base: 'wrap', lg: 'nowrap'}}>
                      {user.freelanceProfile?.workLocation && (
                        <Badge
                          color="neutral.black"
                          bgColor="neutral.gray"
                          cursor="default"
                          borderWidth="1px"
                          borderColor={'none'}
                          variant="filter"
                        >
                          {user.freelanceProfile?.workLocation}
                        </Badge>
                      )}
                      {user.freelanceProfile?.situation && (
                        <Badge
                          color="neutral.black"
                          bgColor="neutral.gray"
                          cursor="default"
                          borderWidth="1px"
                          borderColor={'none'}
                          variant="filter"
                        >
                          {user.freelanceProfile?.situation}
                        </Badge>
                      )}
                      {user.freelanceProfile?.availability && (
                        <Badge
                          color="neutral.black"
                          bgColor="neutral.gray"
                          cursor="default"
                          borderWidth="1px"
                          borderColor={'none'}
                          variant="filter"
                        >
                          {user.freelanceProfile?.availability}
                        </Badge>
                      )}
                      {user.freelanceProfile?.hoursPerWeek !== 0 &&
                        user.freelanceProfile?.hoursPerWeek && (
                          <Badge
                            color="neutral.black"
                            bgColor="neutral.gray"
                            cursor="default"
                            borderWidth="1px"
                            borderColor={'none'}
                            variant="filter"
                          >
                            {user.freelanceProfile?.hoursPerWeek.toString()} hrs/week
                          </Badge>
                        )}
                      {user.freelanceProfile?.yearsOfExperience && (
                        <Badge
                          color="neutral.black"
                          bgColor="neutral.gray"
                          borderWidth="1px"
                          borderColor={'none'}
                          cursor="default"
                          variant="filter"
                          mr={2}
                        >
                          {user.freelanceProfile?.yearsOfExperience}{' '}
                          {user.freelanceProfile?.yearsOfExperience != undefined &&
                          parseInt(user.freelanceProfile?.yearsOfExperience) > 1
                            ? 'Years'
                            : 'Year'}{' '}
                          of Exp
                        </Badge>
                      )}
                    </Flex>
                  )}
                  {edit && (
                    <Flex flexDir="column" gap={4}>
                      <FormControl id="workLocation" isRequired>
                        <FormLabel>Work location</FormLabel>
                        <Menu
                          onOpen={() => setWorkLocationOpen(true)}
                          onClose={() => setWorkLocationOpen(false)}
                        >
                          <MenuButton
                            as={Button}
                            variant="select"
                            color={selectedWorkLocation ? 'neutral.black' : 'neutral.dsGray'}
                            opacity={selectedWorkLocation ? 1 : 0.75}
                            borderBottomLeftRadius={workLocationOpen ? '0' : '6px'}
                            rightIcon={
                              <Box
                                transform={workLocationOpen ? 'rotate(180deg)' : 'none'}
                                transition="all ease-in-out 250ms"
                              >
                                <ChevronDownIcon />
                              </Box>
                            }
                            w="100%"
                          >
                            {workLocationOptions[selectedWorkLocation] ||
                              'Select your work location'}
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
                            {Object.keys(workLocationOptions).map((v, k) => (
                              <MenuItem key={k} onClick={() => handleSelectionWorkLocation(v)}>
                                {workLocationOptions[v]}
                              </MenuItem>
                            ))}
                          </MenuList>
                          <Field name="workLocation" type="hidden" />
                        </Menu>
                        {errors['workLocation'] && (
                          <Text textStyle="errorMessage">{errors['workLocation']}</Text>
                        )}
                      </FormControl>
                      <FormControl id="availability" isRequired>
                        <FormLabel>Work availability</FormLabel>
                        <Menu
                          onOpen={() => setAvailabilityOpen(true)}
                          onClose={() => setAvailabilityOpen(false)}
                        >
                          <MenuButton
                            as={Button}
                            variant="select"
                            color={selectedAvailability ? 'neutral.black' : 'neutral.dsGray'}
                            opacity={selectedAvailability ? 1 : 0.75}
                            borderBottomLeftRadius={availabilityOpen ? '0' : '6px'}
                            rightIcon={
                              <Box
                                transform={availabilityOpen ? 'rotate(180deg)' : 'none'}
                                transition="all ease-in-out 250ms"
                              >
                                <ChevronDownIcon />
                              </Box>
                            }
                            w="100%"
                          >
                            {availabilityOptions[selectedAvailability] ||
                              'Select your availability'}
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
                            {Object.keys(availabilityOptions).map((v, k) => (
                              <MenuItem key={k} onClick={() => handleSelectionAvailability(v)}>
                                {availabilityOptions[v]}
                              </MenuItem>
                            ))}
                          </MenuList>
                          <Field name="availability" type="hidden" />
                        </Menu>
                        {errors['availability'] && (
                          <Text textStyle="errorMessage">{errors['availability']}</Text>
                        )}
                      </FormControl>
                      <FormControl id="hoursPerWeek">
                        <FormLabel>Hours per week</FormLabel>
                        <Field
                          name="hoursPerWeek"
                          placeholder="Enter your hours per week"
                          as={Input}
                          type="string"
                          isInvalid={errors.hoursPerWeek && touched.hoursPerWeek}
                        />
                        <ErrorMessage name="hoursPerWeek">
                          {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                        </ErrorMessage>
                      </FormControl>
                      <FormControl id="yearsOfExperience">
                        <FormLabel>Years of experience</FormLabel>
                        <Field
                          name="yearsOfExperience"
                          placeholder="Enter your years of experience"
                          as={Input}
                          type="string"
                          isInvalid={errors.yearsOfExperience && touched.yearsOfExperience}
                        />
                        <ErrorMessage name="yearsOfExperience">
                          {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                        </ErrorMessage>
                      </FormControl>
                    </Flex>
                  )}
                </Form>
              );
            }}
          </Formik>
        </Flex>
      )}
    </>
  );
};

export default FreelancePreferences;
