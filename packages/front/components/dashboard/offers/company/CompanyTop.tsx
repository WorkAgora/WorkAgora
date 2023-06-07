import { Box, Button, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import Image from 'next/image';
import AddIcon from '@workagora/front/components/icons/AddIcon';
import { useRouter } from 'next/router';
import { useResponsive } from '@workagora/front/hooks/useResponsive';

const CompanyTop: FC = () => {
  const { push } = useRouter();
  const {mobileDisplay, tabletDisplay, desktopDisplay} = useResponsive();

  return (<>
    {desktopDisplay && <Flex
      bgColor="neutral.lightGray"
      position="relative"
      borderRadius="24px"
      minH="250px"
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
        >{`Post your first offer`}</Box>
        <Box
          w="100%"
          textStyle="body"
          as="span"
          color="brand.secondary"
          textAlign="left"
          whiteSpace="pre-wrap"
          zIndex="4"
        >
          {`Whether you search for a designer, a community manager, or\na corgi, you will find what you are looking for.`}
        </Box>
        <Box mr="auto">
          <Button
            variant="primary"
            rightIcon={
              <Box h="16px" w="16px" ml={2}>
                <AddIcon />
              </Box>
            }
            onClick={() => push('/dashboard/jobs/create')}
          >
            Create my offer
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
        <Image src="/images/dashboard/freelance_offers_top.png" alt="Your Image Description" fill />
      </Box>
    </Flex>}
    {(mobileDisplay || tabletDisplay) &&  <Flex
      bgColor="neutral.lightGray"
      position="relative"
      borderRadius="24px"
      overflow="hidden"
      flexDir="column"
      px={2}
      py={4}
      rowGap={4}
    >
             <Box
          w="100%"
          textStyle="h3"
          as="h2"
          color="brand.secondary"
          textAlign="center"
          zIndex="4"
        >{`Post your first offer`}</Box>
        <Box
          w="100%"
          textStyle="body"
          as="span"
          color="brand.secondary"
          textAlign="center"
          whiteSpace="pre-wrap"
          zIndex="4"
        >
          {`Whether you search for a designer, a community manager, or\na corgi, you will find what you are looking for.`}
        </Box>
        <Box mx="auto">
          <Button
            variant="primary"
            rightIcon={
              <Box h="16px" w="16px" ml={2}>
                <AddIcon />
              </Box>
            }
            onClick={() => push('/dashboard/jobs/create')}
          >
            Create my offer
          </Button>
        </Box>
      </Flex>}
    </>
  );
};

export default CompanyTop;
