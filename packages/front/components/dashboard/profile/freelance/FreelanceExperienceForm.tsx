import {
  Avatar,
  Box,
  Text,
  Flex,
  Button,
  Input,
  FormControl,
  FormLabel,
  NumberInput,
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
import TrashIcon from '@workagora/front/components/icons/TrashIcon';
import ArrowRightIcon from '@workagora/front/components/icons/ArrowRightIcon';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';

interface FormData {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface FrelanceExperienceFormProps {
  experience?: any;
  onClose: () => void;
}

const datePickerConfig = {
  dateNavBtnProps: {
    colorScheme: 'brand.primary',
    variant: 'outline'
  },
  dayOfMonthBtnProps: {
    defaultBtnProps: {
      borderColor: 'brand.primaryHover',
      _hover: {
        background: 'brand.primary'
      }
    },
    isInRangeBtnProps: {
      color: 'yellow'
    },
    selectedBtnProps: {
      background: 'brand.primary',
      color: 'neutral.black'
    },
    todayBtnProps: {
      background: 'brand.primary'
    }
  },
  popoverCompProps: {
    popoverContentProps: {
      background: 'neutral.lightGray',
      color: 'neutral.black'
    }
  }
};

const validationSchema = Yup.object().shape({
  company: Yup.string()
    .required('Company is required')
    .max(50, 'Company name must be less than 50 characters'),
  role: Yup.string().required('Role is required').max(50, 'Role must be less than 50 characters'),
  startDate: Yup.date()
    .required('Start Date is required')
    .max(Yup.ref('endDate'), 'Start Date should be before End Date'),
  endDate: Yup.date()
    .required('End Date is required')
    .min(Yup.ref('startDate'), 'End Date should be after Start Date'),
  description: Yup.string()
    .required('Description is required')
    .max(255, 'Description must be less than 255 characters')
});

const FreelanceExperienceForm: FC<FrelanceExperienceFormProps> = ({ experience, onClose }) => {
  const { user } = useCurrentUser();
  const { loading, updateProfile } = useUpdateProfile();

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
        >
          <Formik
            initialValues={{
              company: experience ?? '',
              role: experience ?? '',
              startDate: experience ?? new Date().setMonth(new Date().getMonth() - 6),
              endDate: experience ?? new Date(),
              description: experience ?? ''
            }}
            validationSchema={validationSchema}
            isInitialValid={false}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {({ isValid, errors, touched, resetForm, setFieldValue }) => (
              <Form
                style={{ width: '100%', display: 'flex', flexDirection: 'column', rowGap: '16px' }}
              >
                <Flex gap={6}>
                  <FormControl id="company" isRequired flexBasis="50%">
                    <FormLabel>Company</FormLabel>
                    <Field
                      name="company"
                      placeholder="Enter company name"
                      as={Input}
                      isInvalid={errors.company && touched.company}
                    />
                    <ErrorMessage name="company">
                      {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                    </ErrorMessage>
                  </FormControl>
                  <Flex flexBasis="50%" alignItems="center">
                    <Avatar
                      w="76px"
                      h="76px"
                      borderRadius="20px"
                      icon={<></>}
                      bgColor="neutral.lightGray"
                    />
                    <Box ml={6}>
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
                        onClick={onClose}
                      >
                        Upload logo
                      </Button>
                    </Box>
                    <Box
                      textStyle="h6"
                      fontSize="14px"
                      fontWeight="400"
                      as="span"
                      ml={2}
                      mt={-1}
                      color="neutral.dsGray"
                    >
                      {'.jpg / .png < 1Mo'}
                    </Box>
                  </Flex>
                </Flex>
                <Flex gap={6}>
                  <FormControl id="role" isRequired flexBasis="50%">
                    <FormLabel>Role</FormLabel>
                    <Field
                      name="role"
                      placeholder="Enter role max 50 characters"
                      as={Input}
                      isInvalid={errors.role && touched.role}
                    />
                    <ErrorMessage name="role">
                      {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                    </ErrorMessage>
                  </FormControl>
                  <Flex flexBasis="50%" gap={4}>
                    <FormControl id="startDate" isRequired flexBasis="50%">
                      <FormLabel>Start date</FormLabel>
                      <Field name="startDate" isInvalid={errors.startDate && touched.startDate}>
                        {({ field, form }) => (
                          <SingleDatepicker
                            name="startDate"
                            date={field.value}
                            propsConfigs={{
                              ...datePickerConfig,
                              inputProps: {
                                borderColor:
                                  errors.startDate && touched.startDate
                                    ? 'red !important'
                                    : 'brand.primary !important',
                                boxShadow:
                                  errors.startDate && touched.startDate
                                    ? '0 0 0 1px #E53E3E'
                                    : 'none',
                                _focus: {
                                  boxShadow:
                                    errors.startDate && touched.startDate
                                      ? '0 0 0 1px #E53E3E'
                                      : '0 0 0 1px var(--chakra-colors-brand-primary)'
                                }
                              }
                            }}
                            onDateChange={(date: Date) => {
                              setFieldValue(field.name, date, true);
                              form.setFieldTouched(field.name, true, false);
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="startDate">
                        {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                      </ErrorMessage>
                    </FormControl>
                    <FormControl id="endDate" isRequired flexBasis="50%">
                      <FormLabel>End date</FormLabel>
                      <Field name="endDate" isInvalid={errors.endDate && touched.endDate}>
                        {({ field, form }) => (
                          <SingleDatepicker
                            name="endDate"
                            date={field.value}
                            propsConfigs={datePickerConfig}
                            onDateChange={(date: Date) => {
                              setFieldValue(field.name, date, true);
                              form.setFieldTouched(field.name, true, false);
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="endDate">
                        {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                      </ErrorMessage>
                    </FormControl>
                  </Flex>
                </Flex>
                <FormControl id="description" isRequired>
                  <FormLabel>Description</FormLabel>
                  <Field
                    name="description"
                    placeholder="Write a short description of your experience"
                    as={Textarea}
                    isInvalid={errors.description && touched.description}
                    resize="vertical"
                    minH="100px"
                    maxH="200px"
                    fontWeight="500"
                  />
                  <ErrorMessage name="description">
                    {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
                  </ErrorMessage>
                </FormControl>
                <Flex justifyContent="space-between">
                  <Box>
                    <Button
                      variant="outline"
                      width="100%"
                      color="red.500"
                      borderColor="red.500"
                      _hover={{ color: 'red.700', borderColor: 'red.700' }}
                      spinnerPlacement="end"
                      leftIcon={<TrashIcon />}
                      onClick={onClose}
                    >
                      Remove experience
                    </Button>
                  </Box>
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
                      Save experience
                    </Button>
                  </Box>
                </Flex>
              </Form>
            )}
          </Formik>
        </Flex>
      )}
    </>
  );
};

export default FreelanceExperienceForm;
