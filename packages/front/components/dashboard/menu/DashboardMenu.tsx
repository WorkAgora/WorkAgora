import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react';
import { useDashboard, useLanding } from '@workagora/front-provider';
import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';
import {UserTypeEnum} from "@workagora/utils";

interface MenuElement {
  view: string;
  label: string;
}

const MotionFlex = motion(Flex);
const MotionButton = motion(Button);

const companyMenu: MenuElement[] = [
  { view: 'dashboard', label: 'Dashboard' },
  { view: 'offers', label: 'Find profiles' },
  { view: 'jobs', label: 'Contracts' },
  { view: 'profile', label: 'My profile' }
];

const freelanceMenu: MenuElement[] = [
  { view: 'dashboard', label: 'Dashboard' },
  { view: 'offers', label: 'Find work' },
  { view: 'jobs', label: 'Contracts' },
  { view: 'profile', label: 'My profile' }
];

const menuVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};

const DashboardMenu: FC = () => {
  const { type } = useLanding();
  const { view, setView } = useDashboard();

  let menuElement: MenuElement[] = [];
  if (type === UserTypeEnum.Freelancer) {
    menuElement = freelanceMenu;
  }
  if (type === UserTypeEnum.Company) {
    menuElement = companyMenu;
  }

  return (
    <AnimatePresence mode="wait">
      <MotionFlex flexDir="column" w="245px" h="100%" py={10} px={8} rowGap={6} position="fixed">
        <Flex alignItems='center'>
          <Box w='48px' h='48px'>
            <Avatar />
          </Box>
          <Text ml={2} fontSize='14px' fontWeight='700' lineHeight='120%' color='neutral.black' fontFamily='Comfortaa'>
            John Doe
          </Text>
        </Flex>
        {menuElement.map((v, k) => (
          <MotionButton
            key={k}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
            variant={view === v.view ? 'primary' : 'link'}
            onClick={() => setView(v.view)}
          >
            {v.label}
          </MotionButton>
        ))}
      </MotionFlex>
    </AnimatePresence>
  );
};

export default DashboardMenu;
