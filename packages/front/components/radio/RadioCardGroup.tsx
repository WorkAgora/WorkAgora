import { RadioGroup, RadioGroupProps } from '@chakra-ui/react';
import React, { FC, Children, isValidElement } from 'react';
import { useField } from 'formik';

interface RadioCardGroupProps extends RadioGroupProps {
  name: string;
}

const RadioCardGroup: FC<RadioCardGroupProps> = ({
  name,
  children,
  ...props
}: RadioCardGroupProps) => {
  const [field, , { setValue }] = useField({ name, value: props.value });

  const namedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return;

    return React.cloneElement(child, {
      ...child.props,
      name
    });
  });

  return (
    <RadioGroup {...props} {...field} onChange={setValue}>
      {namedChildren}
    </RadioGroup>
  );
};

export default RadioCardGroup;
