import { Box, Flex, FlexProps, Text } from '@chakra-ui/react';
import { FC, useState } from 'react';

const possibleType: string[] = ['Freelance', 'Company'];

type UserType = (typeof possibleType)[number];

interface UserTypeSwitchProps extends FlexProps {
  userType: UserType;
  onTypeChange?: (userType: UserType) => void;
}

const UserTypeSwitch: FC<UserTypeSwitchProps> = (props: UserTypeSwitchProps) => {
  const { userType, onTypeChange, ...flexProps } = props;
  const [currentType, setCurrentType] = useState<UserType>(userType);

  const switchType = (userType: UserType) => {
    setCurrentType(userType);
    if (onTypeChange) {
      onTypeChange(userType);
    }
  };

  return (
    <Flex {...flexProps}>
      <Box
        borderColor="brand.primary"
        borderWidth="1px"
        borderRightWidth={0}
        borderRadius="32px 0 0 32px"
        transition="all ease-in-out 250ms"
        py={1.5}
        px={4}
        bgColor={currentType === possibleType[0] ? 'brand.primary' : 'none'}
        cursor="pointer"
        _hover={{ bgColor: 'brand.primaryHover', borderColor: 'brand.primaryHover' }}
        onClick={() => switchType(possibleType[0])}
      >
        <Text fontFamily="Comfortaa" fontSize="sm" fontWeight="600">
          Freelance
        </Text>
      </Box>
      <Box
        borderColor="brand.primary"
        borderWidth="1px"
        borderLeftWidth={0}
        borderRadius="0 32px 32px 0"
        transition="all ease-in-out 250ms"
        py={1.5}
        px={4}
        cursor="pointer"
        bgColor={currentType === possibleType[1] ? 'brand.primary' : 'none'}
        _hover={{ bgColor: 'brand.primaryHover', borderColor: 'brand.primaryHover' }}
        onClick={() => switchType(possibleType[1])}
      >
        <Text fontFamily="Comfortaa" fontSize="sm" fontWeight="600">
          Company
        </Text>
      </Box>
    </Flex>
  );
};

export default UserTypeSwitch;
