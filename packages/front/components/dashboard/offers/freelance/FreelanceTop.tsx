import { Box, Button, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import Image from 'next/image';

const FreelanceTop: FC = () => {
  return (
    <Flex
      bgColor="neutral.lightGray"
      position="relative"
      borderRadius="24px"
      minH="225px"
      overflow="hidden"
    >
      <Flex
        flexDir="column"
        w="61%"
        pl={6}
        py={4}
        rowGap={4}
        justifyContent="center"
        _before={{
          content: '""',
          position: 'absolute',
          top: '0',
          right: '-11%',
          width: '100%',
          height: '100%',
          bgColor: 'neutral.lightGray',
          transform: 'skewY(75deg)',
          zIndex: '3'
        }}
        _after={{
          content: '""',
          position: 'absolute',
          top: '0',
          right: '-12%',
          width: '100%',
          height: '100%',
          bgColor: 'brand.primary',
          transform: 'skewY(75deg)',
          zIndex: '2'
        }}
      >
        <Box
          w="100%"
          textStyle="h3"
          as="h2"
          color="brand.secondary"
          textAlign="left"
          zIndex="4"
        >{`Your profile is still not complete`}</Box>
        <Box
          w="100%"
          textStyle="body"
          as="span"
          color="brand.secondary"
          textAlign="left"
          whiteSpace="pre-wrap"
          zIndex="4"
        >
          {`A fully completed profile is more likely to be chosen by\ncompanies. Don't miss your chance`}
        </Box>
        <Box mr="auto">
          <Button variant="primary">
             Complete my profile
          </Button>
        </Box>
      </Flex>
      <Box
        w="39%"
        position="relative"
        bg="url('')"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        backgroundPosition="center"
        borderLeftRadius="24px"
        overflow="hidden"
      >
        <Image
          src="/images/dashboard/freelance_offers_top.png"
          alt="Your Image Description"
          fill
        />
      </Box>
    </Flex>
  );
};

export default FreelanceTop;