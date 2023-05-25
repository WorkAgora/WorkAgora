import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react';
import { useCurrentUser, useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import { UserTypeEnum } from '@workagora/utils';
import { useRouter } from 'next/router';

interface MenuElement {
  view: string;
  label: string;
}

const companyMenu: MenuElement[] = [
  { view: '/dashboard', label: 'Dashboard' },
  { view: '/dashboard/offers', label: 'Find profiles' },
  { view: '/dashboard/jobs', label: 'My jobs' },
  { view: '/dashboard/contracts', label: 'My Contracts' }
];

const freelanceMenu: MenuElement[] = [
  { view: '/dashboard', label: 'Dashboard' },
  { view: '/dashboard/offers', label: 'Find work' },
  { view: '/dashboard/jobs', label: 'My Jobs' },
  { view: '/dashboard/contracts', label: 'My Contracts' }
];

const DashboardMenu: FC = () => {
  const { type } = useLanding();
  const { pathname, push } = useRouter();
  const { user } = useCurrentUser();

  let menuElement: MenuElement[] = [];
  if (type === UserTypeEnum.Freelancer) {
    menuElement = freelanceMenu;
  }
  if (type === UserTypeEnum.Company) {
    menuElement = companyMenu;
  }

  const handleViewChange = (view: string) => {
    if (pathname !== view) {
      push(view);
    }
  };

  return (
    <Flex
      flexDir="column"
      w="245px"
      h="100%"
      py={10}
      px={8}
      rowGap={6}
      position="fixed"
      zIndex="999"
    >
      {user && (
        <>
          <Flex
            alignItems="center"
            cursor="pointer"
            _hover={{ bgColor: 'brand.primaryHover' }}
            bgColor={pathname === '/dashboard/profile' ? 'brand.primary' : 'none'}
            p={2}
            borderRadius="8px"
            onClick={() => handleViewChange('/dashboard/profile')}
          >
            <Box w="48px" h="48px">
              <Avatar />
            </Box>
            <Text
              ml={2}
              fontSize="14px"
              fontWeight="700"
              lineHeight="120%"
              color="neutral.black"
              fontFamily="Comfortaa"
            >
              {user?.firstname} {user?.lastname}
            </Text>
          </Flex>
          {menuElement.map((v, k) => {
            let active = false;
            if (v.view === '/dashboard') {
              if (pathname === '/dashboard') {
                active = true;
              }
            } else {
              if (pathname.includes(v.view)) {
                active = true;
              }
            }
            return (
              <Button
                key={k}
                variant={active ? 'primary' : 'link'}
                onClick={() => handleViewChange(v.view)}
              >
                {v.label}
              </Button>
            );
          })}
        </>
      )}
    </Flex>
  );
};

export default DashboardMenu;
