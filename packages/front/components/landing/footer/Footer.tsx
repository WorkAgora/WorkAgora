import { Box, Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';
import DiscordIcon from '../../icons/social/DiscordIcon';
import GithubIcon from '../../icons/social/GithubIcon';
import InstagramIcon from '../../icons/social/InstagramIcon';
import LinkedinIcon from '../../icons/social/LinkedinIcon';
import TelegramIcon from '../../icons/social/TelegramIcon';
import TwitterIcon from '../../icons/social/TwitterIcon';

const Footer: FC = () => {
  const socialIcons = [
    { icon: DiscordIcon, href: '#' },
    { icon: TwitterIcon, href: '#' },
    { icon: TelegramIcon, href: '#' },
    { icon: LinkedinIcon, href: '#' },
    { icon: InstagramIcon, href: '#' },
    { icon: GithubIcon, href: '#' }
  ];
  return (
    <Flex w="100%" flexDir="column">
      <Flex
        height={{base: 'auto', md: "100px"}}
        mx="auto"
        width="80%"
        maxW="1340px"
        justifyContent="space-between"
        alignItems="center"
        flexDir={{base: 'column', md: 'row'}}
      >
        <Text
          fontFamily="Montserrat"
          fontSize="14px"
          lineHeight="150%"
          fontWeight="400"
          color="neutral.dsGray"
        >
          @WorkAgora 2023, All rights reserved
        </Text>
        <Flex columnGap={12} flexWrap="wrap" justifyContent={{base: 'center', md: 'initial'}} rowGap={4} pb={{base: 4, md: 0}} mt={{base: 4, md: 0}}>
          {socialIcons.map((v, k) => (
            <Box
              key={k}
              cursor="pointer"
              h="40px"
              w="40px"
              display="flex"
              flexDir="column"
              alignItems="center"
              justifyContent="center"
              bgColor="neutral.black"
              color="neutral.white"
              borderRadius="100%"
              transition="all ease-in-out 250ms"
              _hover={{
                color: 'brand.primaryHover'
              }}
            >
              <v.icon />
            </Box>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Footer;
