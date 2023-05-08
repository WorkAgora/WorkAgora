import { Box, Button, Flex } from '@chakra-ui/react';
import { useDashboard } from '@workagora/front-provider';
import { FC } from 'react';
import ContractsIcon from '../../icons/ContractsIcon';
import DashboardIcon from '../../icons/DashboardIcon';
import SearchIcon from '../../icons/SearchIcon';
import UserIcon from '../../icons/UserIcon';
import { MenuElement } from './DashboardMenu';

const menuElement: MenuElement[] = [
  { view: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { view: 'technology', label: 'Offers', icon: SearchIcon },
  { view: 'community', label: 'Contracts', icon: ContractsIcon },
  { view: 'contact', label: 'My profile', icon: UserIcon }
];

const DashboardMenuFreelance: FC = () => {
  const { view } = useDashboard();

  return (
    <>
      {menuElement.map((v, k) => (
        <Button
          key={k}
          variant={view === v.view ? 'primary' : 'link'}
          leftIcon={
            <Box mt={-0.5} mr={2}>
              <v.icon />
            </Box>
          }
          justifyContent="start"
        >
          {v.label}
        </Button>
      ))}
    </>
  );
};

export default DashboardMenuFreelance;
