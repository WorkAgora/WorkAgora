import { Box, Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { UserTypeEnum } from '@workagora/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, MutableRefObject, useState } from 'react';
import FreelanceTop from './freelance/FreelanceTop';
import FreelanceGallery from './freelance/FreelanceGallery';
import CompanyTop from './company/CompanyTop';
import CompanyGallery from './company/CompanyGallery';
import SearchBar from '../../landing/product/SearchBar';
import { SearchFreelancerProvider } from '@workagora/front/hooks/useSearchFreelancer';
import { SearchJobProvider } from '@workagora/front/hooks/useSearchJob';

const MotionBox = motion(Box);

interface DashboardOffersProps {
  scrollbarRef: MutableRefObject<HTMLElement | null>;
}

const DashboardOffers: FC<DashboardOffersProps> = ({ scrollbarRef }) => {
  const { type } = useLanding();

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <Flex px={{base: 0, lg: 6}} flexDir="column" w="100%" h="100%" minH="calc( 100vh - 80px )">
      <Flex
        flexDir="column"
        w="100%"
        flexGrow="1"
        bgColor="neutral.white"
        px={{base: 4, lg: 8}}
        py={{base: 2, lg: 6}}
        gap={{base: 4, lg: 8}}
        borderRadius={{base: '32px', lg: "64px"}}
      >
        <AnimatePresence mode="wait">
          {type === UserTypeEnum.Freelancer && (
            <MotionBox
              key="freelance"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
              <Flex flexDir="column" gap={4}>
                <Box textStyle="h2" as="h1" w="100%" textAlign="left">
                  Find work
                </Box>
                <Flex flexDir="column" gap={6}>
                  <SearchJobProvider>
                    <FreelanceTop />
                    <SearchBar />
                    <FreelanceGallery scrollbarRef={scrollbarRef} />
                  </SearchJobProvider>
                </Flex>
              </Flex>
            </MotionBox>
          )}
          {type === UserTypeEnum.Company && (
            <MotionBox
              key="company"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
              <Flex flexDir="column" gap={4}>
                <Box textStyle="h2" as="h1" w="100%" textAlign="left">
                  Find profiles
                </Box>
                <Flex flexDir="column" gap={6}>
                  <SearchFreelancerProvider>
                    <CompanyTop />
                    <SearchBar />
                    <CompanyGallery scrollbarRef={scrollbarRef} />
                  </SearchFreelancerProvider>
                </Flex>
              </Flex>
            </MotionBox>
          )}
        </AnimatePresence>
      </Flex>
    </Flex>
  );
};

export default DashboardOffers;
