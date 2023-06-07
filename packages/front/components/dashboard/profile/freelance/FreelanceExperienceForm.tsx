import {
  Avatar,
  Box,
  Text,
  Flex,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea
} from '@chakra-ui/react';
import { useCurrentUser } from '@workagora/front-provider';
import { FC } from 'react';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import CheckIcon from '@workagora/front/components/icons/CheckIcon';
import CloseIcon from '@workagora/front/components/icons/CloseIcon';
import TrashIcon from '@workagora/front/components/icons/TrashIcon';
import ArrowRightIcon from '@workagora/front/components/icons/ArrowRightIcon';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { useExperiences } from '@workagora/front/hooks/useExperiences';
import { useResponsive } from '@workagora/front/hooks/useResponsive';

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
    .transform((value, originalValue) => new Date(originalValue))
    .max(new Date(), 'Start Date cannot be after today')
    .max(Yup.ref('endDate'), 'Start Date should be before End Date'),
  endDate: Yup.date()
    .transform((value, originalValue) => new Date(originalValue))
    .required('End Date is required')
    .min(Yup.ref('startDate'), 'End Date should be after Start Date'),
  description: Yup.string()
    .required('Description is required')
    .max(500, 'Description must be less than 500 characters')
});

const FreelanceExperienceForm: FC<FrelanceExperienceFormProps> = ({ experience, onClose }) => {
  const { user } = useCurrentUser();
  const { loading, callAddExperience, callDeleteExperience, callUpdateExperience } =
    useExperiences();
  const {mobileDisplay, tabletDisplay, desktopDisplay} = useResponsive();


  const onSubmit = async (values: FormData) => {
    if (user) {
      const { company, role, startDate, endDate, description } = values;
      if (!experience?.id) {
        await callAddExperience({ company, role, startDate, endDate, description });
      }
      if (experience?.id) {
        await callUpdateExperience({
          id: experience.id,
          company,
          role,
          startDate,
          endDate,
          description
        });
      }
    }
  };

  const hasChanged = (values: FormData) => {
    if (!experience) return true;
    let changed = false;
    if (values.company !== experience.company) {
      changed = true;
    }

    if (values.role !== experience.role) {
      changed = true;
    }
    if (new Date(values.startDate).getTime() !== new Date(experience.startDate).getTime()) {
      changed = true;
    }
    if (new Date(values.endDate).getTime() !== new Date(experience.endDate).getTime()) {
      changed = true;
    }
    if (values.description !== experience.description) {
      changed = true;
    }
    return changed;
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
              company: experience?.company ?? '',
              role: experience?.role ?? '',
              startDate: experience?.startDate
                ? new Date(experience.startDate)
                : new Date().setMonth(new Date().getMonth() - 6),
              endDate: experience?.endDate ? new Date(experience.endDate) : new Date(),
              description: experience?.description ?? ''
            }}
            validationSchema={validationSchema}
            isInitialValid={false}
            onSubmit={async (values, actions) => {
              await onSubmit(values);
              setTimeout(() => {
                onClose();
                actions.resetForm();
              }, 500);
            }}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {({ isValid, errors, touched, resetForm, setFieldValue, values }) => (
              <Form
                style={{ width: '100%', display: 'flex', flexDirection: 'column', rowGap: '16px' }}
              >
                <Flex gap={6} flexDir={{base: 'column', lg: 'row'}}>
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
                  <Flex flexBasis="50%" alignItems="center" flexDir={{base: 'column', lg: 'row'}} rowGap={2}>
                    <Avatar
                      w="76px"
                      h="76px"
                      borderRadius="20px"
                      icon={<></>}
                      bgColor="neutral.lightGray"
                    />
                    <Box ml={{base: 0, lg: 6}}>
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
                      ml={2}
                      mt={-1}
                      color="neutral.dsGray"
                    >
                      {'.jpg / .png < 1Mo'}
                    </Box>
                    {desktopDisplay && <Box
                      color="red.500"
                      p={2}
                      ml="auto"
                      cursor="pointer"
                      borderRadius="8px"
                      transition="all ease-in-out 250ms"
                      _hover={{ bgColor: 'neutral.lightGray', color: 'red.700' }}
                      onClick={() => {
                        onClose();
                      }}
                    >
                      <CloseIcon />
                    </Box>}
                  </Flex>
                </Flex>
                <Flex gap={6} flexDir={{base: 'column', lg: 'row'}}>
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
                  <Flex flexBasis="50%" gap={4} flexDir={{base: 'column', lg: 'row'}}>
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
                  {experience?.id && (
                    <Box>
                      <Button
                        variant="outline"
                        width="100%"
                        color="red.500"
                        borderColor="red.500"
                        _hover={{ color: 'red.700', borderColor: 'red.700' }}
                        spinnerPlacement="end"
                        leftIcon={<TrashIcon />}
                        onClick={async () => {
                          await callDeleteExperience(experience.id);
                          onClose();
                          resetForm();
                        }}
                      >
                        Remove experience
                      </Button>
                    </Box>
                  )}
                  <Box ml="auto">
                    <Button
                      variant={!isValid && !hasChanged(values) ? 'outline' : 'primary'}
                      type="submit"
                      width="100%"
                      isDisabled={!isValid && !hasChanged(values)}
                      isLoading={loading}
                      loadingText="Updating profile"
                      spinnerPlacement="end"
                      leftIcon={<CheckIcon />}
                    >
                      Save experience
                    </Button>
                  </Box>
                  {(mobileDisplay || tabletDisplay) && <Box
                      color="red.500"
                      p={2}
                      ml="auto"
                      my="auto"
                      cursor="pointer"
                      borderRadius="8px"
                      transition="all ease-in-out 250ms"
                      _hover={{ bgColor: 'neutral.lightGray', color: 'red.700' }}
                      onClick={() => {
                        onClose();
                      }}
                    >
                      <CloseIcon />
                    </Box>}
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
