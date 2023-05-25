import { Box, Flex } from '@chakra-ui/react';
import { useCurrentUser, useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserTypeEnum } from '@workagora/utils';
import FreelanceTopProfile from './freelance/FreelanceTopProfile';
import FreelanceResume from './freelance/FreelanceResume';
import FreelanceSkills from './freelance/FreelanceSkills';
import FreelancePreferences from './freelance/FreelancePreferences';
import FreelanceLinks from './freelance/FreelanceLinks';

const MotionBox = motion(Box);

const DashboardProfile: FC = () => {
  const { type } = useLanding();
  const { user } = useCurrentUser();

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <Flex px={6} flexDir="column" w="100%" h="100%" minH="calc( 100vh - 80px )">
      <Flex
        flexDir="column"
        w="100%"
        flexGrow="1"
        bgColor="neutral.white"
        px={8}
        py={6}
        gap={8}
        borderRadius="64px"
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
              <Flex flexDir="column" gap={6}>
                <FreelanceTopProfile />
                <FreelanceSkills />
                <FreelanceResume />
                <Flex columnGap={6}>
                  <FreelancePreferences />
                  <FreelanceLinks />
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
              <Flex flexDir="column" gap={4}></Flex>
            </MotionBox>
          )}
        </AnimatePresence>
      </Flex>
    </Flex>
  );
};

export default DashboardProfile;
