import { Box, Flex, FlexProps } from '@chakra-ui/react';
import { FC } from 'react';
import Link from 'next/link';

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
  activeMenu?: string;
}

const HeaderMenu: FC<HeaderMenuProps> = ({ activeMenu }: HeaderMenuProps) => {
  return (
    <Flex justifyContent="center" alignItems="center" columnGap={16}>
      {menuElement.map((v, k) => (
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
                content: `""`,
                position: 'absolute',
                display: 'block',
                height: '2px',
                width: '100%',
                bgColor: 'brand.primary'
              }
            }}
          >
            {v.label}
          </Box>
        </Link>
      ))}
    </Flex>
  );
};

export default HeaderMenu;
