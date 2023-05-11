import { Button, Flex } from '@chakra-ui/react';
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
  { view: 'recruitment', label: 'Recruitment' },
  { view: 'community', label: 'Contracts' },
  { view: 'contact', label: 'My profile' }
];

const freelanceMenu: MenuElement[] = [
  { view: 'dashboard', label: 'Dashboard' },
  { view: 'technology', label: 'Offers' },
  { view: 'community', label: 'Contracts' },
  { view: 'contact', label: 'My profile' }
];

const menuVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};

const DashboardMenu: FC = () => {
  const { type } = useLanding();
  const { view } = useDashboard();

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
        {menuElement.map((v, k) => (
          <MotionButton
            key={k}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
            variant={view === v.view ? 'primary' : 'link'}
          >
            {v.label}
          </MotionButton>
        ))}
      </MotionFlex>
    </AnimatePresence>
  );
};

export default DashboardMenu;
