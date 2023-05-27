import { Box, Button, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import Image from 'next/image';
import SearchIcon from '@workagora/front/components/icons/SearchIcon';
import { useRouter } from 'next/router';

const CompanyOpportunities: FC = () => {
  const { push } = useRouter();

  return (
    <Flex
      bgColor="brand.secondary"
      position="relative"
      borderRadius="24px"
      minH="250px"
      overflow="hidden"
    >
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
          src="/images/dashboard/freelance_oppurtinities.png"
          alt="Your Image Description"
          fill
        />
      </Box>
      <Flex
        flexDir="column"
        w="61%"
        pr={6}
        py={4}
        rowGap={4}
        justifyContent="center"
        _before={{
          content: '""',
          position: 'absolute',
          top: '0',
          left: '-11%',
          width: '100%',
          height: '100%',
          bgColor: 'brand.secondary',
          transform: 'skewY(-75deg)',
          zIndex: '3'
        }}
        _after={{
          content: '""',
          position: 'absolute',
          top: '0',
          left: '-12%',
          width: '100%',
          height: '100%',
          bgColor: 'brand.primary',
          transform: 'skewY(-75deg)',
          zIndex: '2'
        }}
      >
        <Box
          w="100%"
          textStyle="h3"
          as="h2"
          color="neutral.white"
          textAlign="right"
          zIndex="4"
        >{`Begin your research`}</Box>
        <Box
          w="100%"
          textStyle="body"
          as="span"
          color="neutral.white"
          textAlign="right"
          whiteSpace="pre-wrap"
          zIndex="4"
        >
          {`Whether you are a designer, a community manager, or a corgi,\nyou will find what you are looking for.`}
        </Box>
        <Box ml="auto">
          <Button
            variant="primary"
            rightIcon={<SearchIcon />}
            onClick={() => push('/dashboard/offers')}
          >
            Start to hire
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default CompanyOpportunities;
