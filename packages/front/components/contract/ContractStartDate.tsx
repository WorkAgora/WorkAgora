import { FormControl, FormLabel, Text } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { FC } from "react";

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

const ContractStartDate: FC = () => {
    const {errors, touched, setFieldValue} = useFormikContext();
    
    return <FormControl id="startDate" isRequired flexBasis="50%">
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
};

export default ContractStartDate;