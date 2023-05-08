import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import LoginButton from '../../button/LoginButton';
import HeaderMenu from '../../header/HeaderMenu';
import DiscordIcon from '../../icons/social/DiscordIcon';
import GithubIcon from '../../icons/social/GithubIcon';
import InstagramIcon from '../../icons/social/InstagramIcon';
import LinkedinIcon from '../../icons/social/LinkedinIcon';
import TelegramIcon from '../../icons/social/TelegramIcon';
import TwitterIcon from '../../icons/social/TwitterIcon';
import BrandLogo from '../../logo/BrandLogo';
import UserTypeSwitch from '../../switch/UserTypeSwitch';

const Footer: FC = () => {
  const { signupModalOpen, setSignupModalOpen } = useLanding();
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
        height="100px"
        mx="auto"
        width="80%"
        maxW="1340px"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          fontFamily="Montserrat"
          fontSize="14px"
          lineHeight="150%"
          fontWeight="400"
          color="neutral.dsGray"
        >
          @AuroraWork 2023, All rights reserved
        </Text>
        <Flex columnGap={12}>
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
