import { Box, Text, useRadio, UseRadioProps, useRadioGroupContext } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

interface RadioCardProps extends UseRadioProps {
  groupName: string;
  label: string;
  description: string;
}

const RadioCard = React.forwardRef((props: RadioCardProps, ref) => {
  const { label, description, groupName, ...radioProps } = props;
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
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{ bg: 'purple.900', color: 'white', borderColor: 'purple.700' }}
        _hover={{ bg: 'purple.900', color: 'white', borderColor: 'purple.700' }}
        bg="white"
        borderColor="purple.900"
        px={3}
        py={3}
      >
        <Text fontWeight="bold">{label}</Text>
        <Text mx={2} mb={2}>
          {description}
        </Text>
      </Box>
    </Box>
  );
});

RadioCard.displayName = 'RadioCard';

export default RadioCard;
