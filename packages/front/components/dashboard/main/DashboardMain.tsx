import { Box, Flex } from '@chakra-ui/react';
import { useCurrentUser, useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CompanyOpportunities from './company/CompanyOpportunities';
import FreelanceInformations from './freelance/FreelanceInformations';
import FreelanceOffers from './freelance/FreelanceOffers';
import FreelanceOpportunities from './freelance/FreelanceOpportunities';
import { UserTypeEnum } from '@workagora/utils';
import CompanyInformations from './company/CompanyInformations';
import CompanyOffers from './company/CompanyOffers';
import { SearchJobProvider } from '@workagora/front/hooks/useSearchJob';

const MotionBox = motion(Box);

const DashboardMain: FC = () => {
  const { type } = useLanding();
  const { user } = useCurrentUser();

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <Flex px={{base: 0, lg: 6}}  flexDir="column" w="100%" h="100%" minH="calc( 100vh - 80px )">
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
                  Dashboard
                </Box>
                <Flex flexDir="column" gap={6}>
                  <SearchJobProvider>
                    <FreelanceOpportunities />
                    <FreelanceInformations />
                    <FreelanceOffers />
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
                  Dashboard
                </Box>
                <Flex flexDir="column" gap={6}>
                  <CompanyOpportunities />
                  <CompanyInformations />
                  <CompanyOffers />
                </Flex>
              </Flex>
            </MotionBox>
          )}
        </AnimatePresence>
      </Flex>
    </Flex>
  );
};

export default DashboardMain;
