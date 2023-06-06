import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { FC } from 'react';
import ArrowRightIcon from '../../icons/ArrowRightIcon';

const Newsletter: FC = () => {
  return (
    <Flex w="100%" flexDir="column" bgColor="brand.secondary" pt={12} pb={16}>
      <Flex flexDir="column" mx="auto" width="80%" maxW="1280px">
        <Flex flexDir="column">
          <Box textStyle="h3" as="h3" color="neutral.white">
            Newsletter
          </Box>
          <Text
            fontWeight="700"
            fontSize="20px"
            lineHeight="120%"
            fontFamily="Comfortaa"
            color="neutral.dsGray"
          >
            {`Don't miss any offer !`}
          </Text>
        </Flex>
        <Flex mt={4} columnGap={8} flexDir={{base: 'column', md: 'row'}} rowGap={4}>
          <Input
            placeholder="Your mail"
            bgColor="neutral.white"
            borderRadius="32px"
            borderWidth="1px"
            borderColor="brand.primary"
            px={4}
            py="10px"
            fontFamily="Comfortaa"
            fontSize="18px"
            lineHeight="120%"
            fontWeight="700"
            _focus={{
              borderWidth: '1px',
              borderColor: 'brand.primaryHover',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-primaryHover)'
            }}
          />
          <Button variant="primary" rightIcon={<ArrowRightIcon />}>
            Stay tuned
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Newsletter;
