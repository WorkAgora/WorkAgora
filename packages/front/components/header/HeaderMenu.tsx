import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import Link from 'next/link';
import { useLanding } from '@workagora/front-provider';

interface MenuElement {
  id: string;
  label: string;
}

const menuElement: MenuElement[] = [
  { id: 'product', label: 'Product' },
  { id: 'technology', label: 'Technology' },
  { id: 'community', label: 'Community' },
  { id: 'contact', label: 'Contact' }
];

interface HeaderMenuProps {
  noActive?: boolean;
}

const HeaderMenu: FC<HeaderMenuProps> = ({ noActive = false }: HeaderMenuProps) => {
  const { currentView } = useLanding();

  return (
    <Flex justifyContent="center" alignItems="center" columnGap={16}>
      {menuElement.map((v, k) => {
        const active = !noActive && currentView === v.id;
        return (
          <Link key={k} href={`#${v.id}`} passHref>
            <Box
              fontFamily="Comfortaa"
              fontSize="md"
              fontWeight="700"
              color="neutral.dsDarkGray"
              position="relative"
              _hover={{
                color: 'brand.secondary',
                _after: {
                  opacity: '1',
                  visibility: 'visible'
                }
              }}
              _after={{
                transition: 'all ease-in-out 250ms',
                content: `""`,
                position: 'absolute',
                display: 'block',
                height: '2px',
                width: '100%',
                bgColor: 'brand.primary',
                opacity: active ? '1' : '0',
                visibility: active ? 'visible' : 'hidden'
              }}
            >
              {v.label}
            </Box>
          </Link>
        );
      })}
    </Flex>
  );
};

export default HeaderMenu;
