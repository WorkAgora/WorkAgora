import { Avatar, Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useCurrentCompany, useCurrentUser, useLanding } from "@workagora/front-provider";
import { useResponsive } from "@workagora/front/hooks/useResponsive";
import { UserTypeEnum } from "@workagora/utils";
import { useRouter } from "next/router";
import { FC } from "react";

interface MenuElement {
    view: string;
    label: string;
  }
  
interface DashboardMenuContentProps {
    onCloseMenu?: () => void;
}

const DashboardMenuContent: FC<DashboardMenuContentProps> = ({onCloseMenu}) => {
    const { type } = useLanding();
    const { pathname, push } = useRouter();
    const { user } = useCurrentUser();
    const { company } = useCurrentCompany();
    const {mobileDisplay, tabletDisplay, desktopDisplay} = useResponsive();

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

    if (mobileDisplay || tabletDisplay) {
        companyMenu.push({view: '/dashboard/chat', label: 'Chat'});
        freelanceMenu.push({view: '/dashboard/chat', label: 'Chat'});
    }
    
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
        if (onCloseMenu !== undefined) onCloseMenu();
      }
    };

    return    <>
    <Flex
      alignItems="center"
      cursor="pointer"
      _hover={{ bgColor: 'brand.primaryHover' }}
      bgColor={pathname === '/dashboard/profile' ? 'brand.primary' : 'none'}
      p={2}
      borderRadius="8px"
      minH={{base: "32px", lg: "48px"}}
      justifyContent={!user ? 'center' : 'start'}
      onClick={() => handleViewChange('/dashboard/profile')}
    >
      {user && type === UserTypeEnum.Freelancer && (
        <>
          <Box w="48px" h="48px" ml={{base: "auto", lg: 0}}>
            <Avatar />
          </Box>

          <Text
            ml={2}
            mr={{base: "auto", lg: 0}}
            fontSize="14px"
            fontWeight="700"
            lineHeight="120%"
            color="neutral.black"
            fontFamily="Comfortaa"
          >
            {user?.firstname} {user?.lastname}
          </Text>
        </>
      )}
      {user && type === UserTypeEnum.Company && (
        <>
          {!company && (
            <Box fontWeight={700} fontFamily="Comfortaa" textAlign="center" w="100%" >
              Create company
            </Box>
          )}
          {company && (
            <>
              <Box w="48px" h="48px" ml={{base: "auto", lg: 0}}>
                <Avatar borderRadius="16px" />
              </Box>
              <Text
                ml={2}
                mr={{base: "auto", lg: 0}}
                fontSize="14px"
                fontWeight="700"
                lineHeight="120%"
                color="neutral.black"
                fontFamily="Comfortaa"
              >
                {company?.name}
              </Text>
            </>
          )}
        </>
      )}

      {!user && <Spinner color="neutral.lightGray" size="md" />}
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
          my={{base: 2, lg: 0}}
          variant={active ? 'primary' : 'link'}
          onClick={() => handleViewChange(v.view)}
        >
          {v.label}
        </Button>
      );
    })}
  </>
};

export default DashboardMenuContent;