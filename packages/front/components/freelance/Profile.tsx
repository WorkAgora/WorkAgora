import { Avatar, Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useGetUserProfile } from '@workagora/front/hooks/useGetUserProfile';
import { FC, useEffect } from 'react';
import DollarIcon from '../icons/DollarIcon';
import StarIcon from '../icons/StarIcon';

interface ProfileProps {
  wallet: string;
}

const Profile: FC<ProfileProps> = ({ wallet }) => {
  const { loading, curUser, getProfile } = useGetUserProfile();

  useEffect(() => {
    if (wallet) {
      getProfile(wallet);
    }
  }, [getProfile, wallet]);

  return (
    <Flex px={6} flexDir="column" w="100%" h="100%" minH="calc( 100vh - 80px )">
      <Flex
        flexDir="column"
        w="100%"
        flexGrow="1"
        bgColor="neutral.white"
        px={8}
        py={6}
        gap={8}
        borderRadius="64px"
      >
        {curUser && (
          <>
            <Flex alignItems={'center'} p={6}>
              <Avatar w="128px" h="128px" borderRadius="100%" />
              <Flex flexDir="column" ml={8} justifyContent="center">
                <Box textStyle="h3">
                  {curUser.firstname} {curUser.lastname}
                </Box>
                <Box textStyle="h4" color="neutral.dsGray">
                  {curUser.description}
                </Box>
                <Flex mt={2}>
                  <Flex
                    alignItems="center"
                    borderRadius="8px"
                    borderWidth="2px"
                    borderColor="brand.primary"
                    py={1}
                    px={2}
                  >
                    <Box color="brand.primary" mr={1}>
                      <StarIcon />
                    </Box>
                    <Text
                      fontFamily="Montserrat"
                      fontWeight="700"
                      fontSize="16px"
                      lineHeight="120%"
                      color="neutral.black"
                    >
                      4,9
                    </Text>
                    <Text
                      fontFamily="Montserrat"
                      fontWeight="500"
                      fontSize="16px"
                      lineHeight="120%"
                      color="neutral.black"
                      ml={1}
                    >
                      /5
                    </Text>
                  </Flex>
                  <Flex
                    ml={4}
                    alignItems="center"
                    borderRadius="8px"
                    borderWidth="2px"
                    borderColor="brand.green"
                    py={1}
                    px={2}
                  >
                    <Box color="brand.green" mr={1}>
                      <DollarIcon />
                    </Box>
                    <Text
                      fontFamily="Montserrat"
                      fontWeight="700"
                      fontSize="16px"
                      lineHeight="120%"
                      color="neutral.black"
                    >
                      {curUser.freelanceProfile?.remuneration}
                    </Text>
                    <Text
                      fontFamily="Montserrat"
                      fontWeight="500"
                      fontSize="16px"
                      lineHeight="120%"
                      color="neutral.black"
                      ml={1}
                    >
                      /day
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              flexDir="column"
              justifyContent="center"
              p={6}
              borderRadius="32px"
              borderWidth="1px"
              borderColor="neutral.gray"
              w="100%"
              gap={4}
            >
              <Box textStyle="h4" as="span">
                Resume
              </Box>
              <Box textStyle="body2" color="neutral.dsDarkGray" pl={4} pr={16}>
                {curUser.freelanceProfile?.longDesc}
              </Box>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Profile;
