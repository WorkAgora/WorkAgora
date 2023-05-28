import { Box, Flex } from '@chakra-ui/react';
import { useCurrentCompany, useCurrentUser, useLanding } from '@workagora/front-provider';
import { FC, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserTypeEnum } from '@workagora/utils';
import FreelanceTopProfile from './freelance/FreelanceTopProfile';
import FreelanceResume from './freelance/FreelanceResume';
import FreelanceSkills from './freelance/FreelanceSkills';
import FreelancePreferences from './freelance/FreelancePreferences';
import FreelanceLinks from './freelance/FreelanceLinks';
import ProfileCompletedJobs from '../../freelance/ProfileCompletedJob';
import FreelanceExperiences from './freelance/FreelanceExperiences';
import CompanyForm from './company/CompanyForm';
import CompanyWithEdit from './company/CompanyWithEdit';

const MotionBox = motion(Box);

const DashboardProfile: FC = () => {
  const { type } = useLanding();
  const { company } = useCurrentCompany();

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <Flex px={6} flexDir="column" w="100%" h="100%" minH="calc( 100vh - 80px )" gap={6} pb={6}>
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
                <Flex columnGap={6} alignItems="start">
                  <FreelancePreferences />
                  <FreelanceLinks />
                </Flex>
                <FreelanceExperiences />
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
                {!company && <CompanyForm />}
                {company && <CompanyWithEdit />}
              </Flex>
            </MotionBox>
          )}
        </AnimatePresence>
      </Flex>
      {type === UserTypeEnum.Freelancer && <ProfileCompletedJobs />}
    </Flex>
  );
};

export default DashboardProfile;
