import { Box, Button, Divider, Flex } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import CreateJobHeader from './create/CreateJobHeader';
import CreateJobTitle from './create/CreateJobTitle';
import CreateJobSelector from './create/CreateJobSelector';
import CreateJobNumber from './create/CreateJobNumber';
import CreateJobSkills from './create/CreateJobSkills';
import CreateJobSwitch from './create/CreateJobSwitch';
import CreateJobTextArea from './create/CreateJobTextArea';
import CheckIcon from '../../icons/CheckIcon';
import {
  availabilityOptions,
  CreateJob,
  UserTypeEnum,
  Visibility,
  WorkAvailability,
  workLocationOptions
} from '@workagora/utils';
import { useCreateJob } from '@workagora/front/hooks/useCreateJob';
import { useRouter } from 'next/router';
import { useLanding } from '@workagora/front-provider';

const MotionBox = motion(Box);

export interface FormData {
  title: string;
  location: string;
  situation: string;
  duration: string;
  durationUnit: string;
  visibility: string;
  skills: string[];
  introduction: string;
  responsibility: string;
  requirements: string;
}

const durationUnitOptions: { [key: string]: string } = {
  hours: 'Hours',
  days: 'Days',
  months: 'Months',
  years: 'Years'
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .max(70, 'Title must be less than 70 characters'),
  location: Yup.string()
    .required('Location is required')
    .oneOf(Object.keys(workLocationOptions), 'Invalid location selected'),
  situation: Yup.string()
    .required('Situation is required')
    .oneOf(Object.keys(availabilityOptions), 'Invalid situation selected'),
  duration: Yup.string()
    .required('Duration is required')
    .matches(/^[1-9][0-9]*$/, 'Duration must be a number and more than 0'),
  durationUnit: Yup.string()
    .required('Duration unit is required')
    .oneOf(Object.keys(durationUnitOptions), 'Invalid duration unit selected'),
  visibility: Yup.string().required('Visibility is required'),
  skills: Yup.array().required('Skills are required').min(1, 'At least one skill is required'),
  introduction: Yup.string()
    .required('Introduction is required')
    .max(1000, 'Introduction must be less than 1000 characters'),
  responsibility: Yup.string()
    .required('Responsibility is required')
    .max(2000, 'Responsibility must be less than 2000 characters'),
  requirements: Yup.string()
    .required('Requirements is required')
    .max(2000, 'Requirements must be less than 2000 characters')
});

const DashboardJobCreate: FC = () => {
  const [selectedWorkLocation, setSelectedWorkLocation] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedDurationUnit, setSelectedDurationUnit] = useState('');
  const [workLocationOpen, setWorkLocationOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [durationUnitOpen, setDurationUnitOpen] = useState(false);
  const { createNewJob, loading } = useCreateJob();
  const { push } = useRouter();
  const { type } = useLanding();

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  useEffect(() => {
    if (type !== UserTypeEnum.Company) {
      push('/dashboard/jobs');
    }
  }, [type]);

  const onSubmit = async (values: FormData) => {
    const {
      title,
      location,
      situation,
      introduction,
      responsibility,
      requirements,
      skills,
      visibility
    } = values;
    const updatedValues: Partial<CreateJob> = {
      title,
      location: selectedWorkLocation,
      availability: selectedAvailability as WorkAvailability,
      duration: {
        years: 0,
        months: 0,
        days: 0,
        hours: 0
      },
      jobMission: introduction,
      responsibilities: responsibility,
      requirements,
      tags: skills,
      visibility: visibility as Visibility
    };
    if (updatedValues.duration) {
      switch (values.durationUnit) {
        case 'hours':
          updatedValues.duration.hours = parseInt(values.duration);
          break;
        case 'days':
          updatedValues.duration.days = parseInt(values.duration);
          break;
        case 'months':
          updatedValues.duration.months = parseInt(values.duration);
          break;
        case 'years':
          updatedValues.duration.years = parseInt(values.duration);
          break;
      }
    }
    await createNewJob(updatedValues);
    setTimeout(() => {
      push('/dashboard/jobs');
    }, 500);
  };

  return (
    <Flex px={{base: 0, lg: 6}} flexDir="column" w="100%" h="100%" minH="calc( 100vh - 80px )">
      <Flex
        flexDir="column"
        w="100%"
        flexGrow="1"
        bgColor="neutral.white"
        px={{base: 4, lg: 8}}
        py={{base: 2, lg: 6}}
        gap={{base: 4, lg: 8}}
        borderRadius={{base: '32px', lg: "64px"}}
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key="company"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
          >
            <Flex flexDir="column" gap={4}>
              <CreateJobHeader />
              <Flex flexDir="column" gap={6} px={{base: 2, lg: 8}}>
                <Formik
                  initialValues={{
                    title: '',
                    location: '',
                    situation: '',
                    duration: '',
                    durationUnit: '',
                    skills: [],
                    visibility: 'Public',
                    introduction: '',
                    responsibility: '',
                    requirements: ''
                  }}
                  validationSchema={validationSchema}
                  isInitialValid={false}
                  onSubmit={onSubmit}
                  validateOnChange={false}
                >
                  {({
                    isValid,
                    errors,
                    touched,
                    resetForm,
                    setFieldTouched,
                    setFieldValue,
                    initialValues
                  }) => {
                    const handleSelection = (
                      value: string,
                      fieldName: string,
                      selectField: string,
                      setter: (value: any) => void
                    ) => {
                      if (selectField === value) {
                        setter('');
                        setFieldTouched(fieldName, false);
                        setFieldValue(fieldName, '', true);
                      } else {
                        setter(value);
                        setFieldTouched(fieldName, true);
                        setFieldValue(fieldName, value, true);
                      }
                    };
                    return (
                      <Form
                        style={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          rowGap: '24px'
                        }}
                      >
                        <CreateJobTitle errors={errors} touched={touched} />
                        <Flex gap={6} flexDir={{base: 'column', xl: 'row'}}>
                          <CreateJobSelector
                            id="location"
                            label="Work location"
                            isOpen={workLocationOpen}
                            handleOpen={() => setWorkLocationOpen(true)}
                            handleClose={() => setWorkLocationOpen(false)}
                            selectedOption={selectedWorkLocation}
                            setSelectedOption={setSelectedWorkLocation}
                            options={workLocationOptions}
                            handleSelection={handleSelection}
                            error={errors.location}
                            touched={touched.location}
                            flexBasis="33.3%"
                          />
                          <CreateJobSelector
                            id="situation"
                            label="Work Availability"
                            isOpen={availabilityOpen}
                            handleOpen={() => setAvailabilityOpen(true)}
                            handleClose={() => setAvailabilityOpen(false)}
                            selectedOption={selectedAvailability}
                            setSelectedOption={setSelectedAvailability}
                            options={availabilityOptions}
                            handleSelection={handleSelection}
                            error={errors.situation}
                            touched={touched.situation}
                            flexBasis="33.3%"
                          />
                          <Flex gap={4} flexBasis="33.3%" flexDir={{base: 'column', lg: 'row'}}>
                            <CreateJobNumber
                              id="duration"
                              label="Work duration"
                              name="duration"
                              placeholder="Duration"
                              error={errors.duration}
                              touched={touched.duration}
                            />
                            <CreateJobSelector
                              id="durationUnit"
                              label="Unit"
                              isOpen={durationUnitOpen}
                              handleOpen={() => setDurationUnitOpen(true)}
                              handleClose={() => setDurationUnitOpen(false)}
                              selectedOption={selectedDurationUnit}
                              setSelectedOption={setSelectedDurationUnit}
                              options={durationUnitOptions}
                              handleSelection={handleSelection}
                              touched={touched.durationUnit}
                              error={errors.durationUnit}
                            />
                          </Flex>
                        </Flex>
                        <CreateJobSkills />
                        <CreateJobSwitch
                          initialValue={initialValues.visibility}
                          onSelectType={(value: string) => {
                            setFieldValue('visibility', value);
                          }}
                        />
                        <Divider borderColor="neutral.black" />
                        <CreateJobTextArea
                          label="Introduce your mission"
                          placeholder="Write an attractive introduction"
                          name="introduction"
                          isRequired
                        />
                        <CreateJobTextArea
                          label="Job responsibilities"
                          placeholder="Detail role, tasks and responsibilities"
                          name="responsibility"
                          isRequired
                        />
                        <CreateJobTextArea
                          label="Job requirements"
                          placeholder="Describe the ideal profile for this job"
                          name="requirements"
                          isRequired
                        />
                        <Flex>
                          <Box ml="auto">
                            <Button
                              variant={!isValid ? 'outline' : 'primary'}
                              type="submit"
                              width="100%"
                              isDisabled={!isValid}
                              isLoading={loading}
                              loadingText="Creating job"
                              spinnerPlacement="end"
                              leftIcon={<CheckIcon />}
                            >
                              Publish this job
                            </Button>
                          </Box>
                        </Flex>
                      </Form>
                    );
                  }}
                </Formik>
              </Flex>
            </Flex>
          </MotionBox>
        </AnimatePresence>
      </Flex>
    </Flex>
  );
};

export default DashboardJobCreate;
