import { Box, Text, useRadio, UseRadioProps, useRadioGroupContext } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

interface RadioCardProps extends UseRadioProps {
  groupName: string;
  label: string;
}

const RadioCard = React.forwardRef((props: RadioCardProps, ref) => {
  const { label, groupName, ...radioProps } = props;
  const group = useRadioGroupContext();

  const isChecked = group.value.toString() === radioProps.value?.toString();

  const [{ checked, ...field }] = useField({
    name: groupName,
    type: 'radio',
    value: radioProps.value?.toString(),
    checked: isChecked
  });

  const { getInputProps, getRadioProps, htmlProps } = useRadio({
    isChecked: isChecked,
    ...field
  });

  return (
    <Box as="label" {...htmlProps} cursor="pointer" flexGrow={1} flex={1}>
      <input {...getInputProps({}, ref)} hidden />
      <Box
        {...getRadioProps()}
        borderWidth="3px"
        borderRadius="16px"
        _checked={{ bgColor: 'brand.primary', borderColor: 'brand.primary' }}
        _hover={{ bgColor: 'brand.primaryHover', borderColor: 'brand.primaryHover' }}
        borderColor="brand.primary"
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={6}
        py={2}
      >
        <Text fontWeight="700" fontFamily="Comfortaa" color="neutral.black">
          {label}
        </Text>
      </Box>
    </Box>
  );
});

RadioCard.displayName = 'RadioCard';

export default RadioCard;
