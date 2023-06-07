import { Box, Flex, FlexProps, Text } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

interface CreateJobSwitchProps extends FlexProps {
  initialValue: string;
  onSelectType: (value: string) => void;
}

const CreateJobSwitch: FC<CreateJobSwitchProps> = ({ initialValue, onSelectType, ...props }) => {
  const [type, setType] = useState('Public');

  useEffect(() => {
    if (initialValue) {
      setType(initialValue);
    }
  }, [initialValue]);

  return (
    <Flex {...props} flexDir={{base: 'column', lg: 'row'}}>
      <Flex justifyContent={{base: 'center', lg: 'initial'}} mb={{base: 4, lg: 0}}>
        <Box
          borderColor="brand.primary"
          borderWidth="1px"
          borderRightWidth={0}
          borderRadius="32px 0 0 32px"
          transition="all ease-in-out 250ms"
          py={1.5}
          px={4}
          bgColor={type === 'Public' ? 'brand.primary' : 'none'}
          cursor="pointer"
          _hover={{ bgColor: 'brand.primaryHover', borderColor: 'brand.primaryHover' }}
          onClick={() => {
            setType('Public');
            onSelectType('Public');
          }}
        >
          <Text fontFamily="Comfortaa" fontSize="sm" fontWeight="600">
            Public
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
          bgColor={type === 'Private' ? 'brand.primary' : 'none'}
          _hover={{ bgColor: 'brand.primaryHover', borderColor: 'brand.primaryHover' }}
          onClick={() => {
            setType('Private');
            onSelectType('Private');
          }}
        >
          <Text fontFamily="Comfortaa" fontSize="sm" fontWeight="600">
            Private
          </Text>
        </Box>
      </Flex>
      <Box
        textStyle="h6"
        fontSize="14px"
        fontWeight="400"
        as="span"
        ml={4}
        mt={0.5}
        color="neutral.dsGray"
        whiteSpace="pre-wrap"
      >
        {`The job will not appear in the search results, but you can share its link.\nThis may limit applications. You can switch later.`}
      </Box>
    </Flex>
  );
};

export default CreateJobSwitch;
