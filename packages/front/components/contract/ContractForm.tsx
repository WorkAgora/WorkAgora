import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { FC, useState } from "react";
import * as Yup from 'yup';
import ContractRelatedJob from "./ContractRelatedJob";
import ContractStartDate from "./ContractStartDate";
import ContractDuration from "./ContractDuration";
import ContractCurrency from "./ContractCurrency";
import ContractAmountSelector from "./ContractAmountSelector";
import ContractDefferedAmountSelector from "./ContractDefferedAmountSelect";
import FileIcon from "../icons/FileIcon";

export interface FormData {
    jobRelated: string;
    startDate: string;
    workDuration: string;
    workDurationUnit: string;
    globalAmount: string;
    amountCurrency: string;
    initialDeposit: string;
    lockedAmount: string;
    defferedAmount: string;
  }

  const validationSchema = Yup.object().shape({
    jobRelated: Yup.string().required(),
    startDate: Yup.date()
      .transform((value, originalValue) => new Date(originalValue))
      .min(new Date(), "Start date cannot be in the past")
      .required(),
    workDuration: Yup.number().transform((value, originalValue) => parseInt(originalValue)).moreThan(0).required(),
    workDurationUnit: Yup.string().oneOf(['hours', 'days', 'months', 'years']).required(),
    globalAmount: Yup.number().transform((value, originalValue) => parseInt(originalValue)).moreThan(0).required(),
    amountCurrency: Yup.string().oneOf(['usdt', 'avax']).required(),
    initialDeposit: Yup.string().oneOf(["0", "20", "40", "60", "80"]).required(),
    lockedAmount: Yup.string().oneOf(["0", "20", "40", "60", "80"]).required(),
    defferedAmount: Yup.string().oneOf(["0", "20", "40", "60", "80"]),
  });

interface ContractFormProps {
    relatedJob?: string;
}

const ContractForm: FC<ContractFormProps> = ({relatedJob}) => {
    const [snapshotDone, setSnapshotDone] = useState(false);
    const onSubmit = () => {}

    return <Flex>
         <Formik
            initialValues={{
                jobRelated: relatedJob ?? '',
                startDate: new Date(),
                workDuration: '',
                workDurationUnit: '',
                globalAmount: '',
                amountCurrency: '',
                initialDeposit: '',
                lockedAmount: '',
                defferedAmount: '',
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
                    return (<Form style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: '24px'
                      }}>
                    <ContractRelatedJob
                            id="jobRelated"
                            label="Job Related"
                            handleSelection={handleSelection}
                            error={errors.jobRelated}
                            touched={touched.jobRelated}
                          />
                    <ContractStartDate />
                    <ContractDuration handleSelection={handleSelection}/>
                    <Divider borderColor="neutral.black" />
                    <ContractCurrency handleSelection={handleSelection} />
                    <ContractAmountSelector id="initialDeposit" label="Initial deposit" />
                    <ContractAmountSelector id="lockedAmount" label="Locked amount" />
                    <ContractDefferedAmountSelector id="defferedAmount" label="Deffered amount" snapshotDone={snapshotDone} onSnapshot={(isGood: boolean) => {setSnapshotDone(isGood)}}/>
                    <Box ml="auto" mt="auto" mr={{base: 'auto', lg: 0}}>
                        <Button variant={!isValid ? 'outline' : 'primary'} leftIcon={<Box><FileIcon/></Box>}>
                            Send this contract
                        </Button>
                    </Box>
                    </Form>)
                 }}
                  </Formik>
    </Flex>;
}

export default ContractForm;