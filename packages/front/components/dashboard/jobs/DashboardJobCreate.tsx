import { Box, Button, Divider, Flex } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, useState } from 'react';
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

const workLocationOptions: { [key: string]: string } = {
  fullRemote: 'Full-remote',
  partialRemote: 'Partial-remote',
  onSite: 'On site'
};

const availabilityOptions: { [key: string]: string } = {
  fullTime: 'Full-time',
  partTime: 'Part-time'
};

const durationUnitOptions: { [key: string]: string } = {
  hours: 'hours',
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'year'
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
    .max(500, 'Introduction must be less than 500 characters'),
  responsibility: Yup.string()
    .required('Responsibility is required')
    .max(500, 'Responsibility must be less than 500 characters'),
  requirements: Yup.string()
    .required('Requirements is required')
    .max(500, 'Requirements must be less than 500 characters')
});

const DashboardJobCreate: FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedWorkLocation, setSelectedWorkLocation] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedDurationUnit, setSelectedDurationUnit] = useState('');
  const [workLocationOpen, setWorkLocationOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [durationUnitOpen, setDurationUnitOpen] = useState(false);

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const onSubmit = (values: FormData) => {};

  return (
    <Flex px={6} flexDir="column" w="100%" h="100%" minH="calc( 100vh - 80px )">
      <Flex
        flexDir="column"
        w="100%"
        flexGrow="1"
        bgColor="neutral.white"
        px={8}
        py={6}
        gap={8}
        borderRadius="64px"
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
              <Flex flexDir="column" gap={6} px={8}>
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
                        <Flex gap={6}>
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
                          <Flex gap={4} flexBasis="33.3%">
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
