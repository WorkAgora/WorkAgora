import { Box, Button, Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import ArrowRightIcon from '../../../icons/ArrowRightIcon';
import Image from 'next/image';
import DarkBrandLogo from '../../../logo/DarkBrandLogo';
import { useResponsive } from '@workagora/front/hooks/useResponsive';

const ProductCompany: FC = () => {
  const { setSignupModalOpen } = useLanding();
  const {mobileDisplay, desktopDisplay} = useResponsive();

  return (
    <Flex
      w="100%"
      justifyContent="space-between"
      minH="500px"
      maxH="500px"
      position="relative"
      my={16}
    >
      {desktopDisplay && <>
      <Box
        position="absolute"
        w="calc(100% - 3.4rem)"
        h="100%"
        right="0"
        zIndex="0"
        borderRadius="64px"
        overflow="hidden"
        filter="drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.25))"
      >
        <Image src="/images/landing/company-top.png" alt="Kingdom of talents" fill />
      </Box>
      <Box
        position="absolute"
        w="57%"
        background="linear-gradient(180deg, #EDF2F7 0%, rgba(237, 242, 247, 0.3) 100%)"
        h="100%"
        zIndex="1"
        left="0"
      />
      </>}
      <Flex flexDir="column" alignItems="start" zIndex="2" position="relative">
        <Flex flexDir={{base: 'column', lg: 'row'}} alignItems="center" mt={{base: 6, lg: '20%'}}>
          <Box maxW="162px" maxH="162px" w="100%" h="100%">
            <DarkBrandLogo />
          </Box>
          <Box
            ml={{base: 0, lg:6}}
            mb={{base: 4, lg: 0}}
            color="brand.secondary"
            textStyle="h1"
            as="h1"
            display="inline"
            whiteSpace="pre-wrap"
            textAlign={{base: 'center', lg: 'left'}}
            cursor="default"
            textShadow="0px 4px 8px rgba(0, 0, 0, 0.25)"
          >
            {`Welcome to the\nkingdom of talents`}
          </Box>
        </Flex>
        <Box mt={12} ml="auto" mr={{base: 'auto', lg: 0}}>
          <Button
            variant="primary"
            rightIcon={<ArrowRightIcon />}
            onClick={() => setSignupModalOpen(true)}
          >
            Try for free
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ProductCompany;
