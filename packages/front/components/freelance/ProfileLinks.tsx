import { Box, Flex } from '@chakra-ui/react';
import { useIconForLink } from '@workagora/front/hooks/useIconForLink';
import { User } from '@workagora/utils';
import { FC } from 'react';

interface ProfileLinksProps {
  curUser: User;
}

const ProfileLinks: FC<ProfileLinksProps> = ({ curUser }) => {
  const { getIcon } = useIconForLink();

  const openInTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Flex
      flexDir="column"
      justifyContent="center"
      p={6}
      borderRadius="32px"
      borderWidth="1px"
      borderColor="neutral.gray"
      w="100%"
      gap={4}
      flexBasis="40%"
    >
      <Box textStyle="h4" as="span">
        Links
      </Box>
      <Flex gap={4}>
        {curUser.links &&
          curUser.links.map((v, k) => {
            const Icon = getIcon(v);
            return (
              <Box
                key={k}
                w="30px"
                h="30px"
                color="brand.secondary"
                _hover={{
                  color: 'brand.secondaryHover'
                }}
                overflow="hidden"
                transition="all ease-in-out 250ms"
                cursor="pointer"
                display="flex"
                flexDir="column"
                sx={{
                  svg: {
                    width: '100%',
                    height: '100%'
                  }
                }}
                onClick={() => openInTab(v)}
              >
                <Icon />
              </Box>
            );
          })}
      </Flex>
    </Flex>
  );
};

export default ProfileLinks;
