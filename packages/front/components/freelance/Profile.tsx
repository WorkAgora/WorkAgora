import { Avatar, Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useGetUserProfile } from '@workagora/front/hooks/useGetUserProfile';
import { shortHash } from '@workagora/utils';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import DollarIcon from '../icons/DollarIcon';
import StarIcon from '../icons/StarIcon';
import ProfileResume from './ProfileResume';
import ProfileSkills from './ProfileSkills';
import ProfileTop from './ProfileTop';

interface ProfileProps {
  wallet: string;
}

const Profile: FC<ProfileProps> = ({ wallet }) => {
  const { loading, curUser, getProfile } = useGetUserProfile();
  const { push } = useRouter();

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
        gap={4}
        borderRadius="64px"
      >
        <Flex textStyle="h4" as="h1" color="neutral.dsGray" ml={4}>
          <Box
            color="neutral.dsGray"
            cursor="pointer"
            _hover={{ color: 'neutral.dsDarkGray', transition: 'all ease-in-out 250ms' }}
            onClick={() => push('/dashboard')}
          >
            Find Profiles{' '}
          </Box>{' '}
          <Box ml={2}>{'>'}</Box>{' '}
          {curUser && (
            <Box ml={2} color="neutral.black">
              {shortHash(curUser.wallet, { padLeft: 6, padRight: 6, separator: '...' })}
            </Box>
          )}
        </Flex>
        {curUser && (
          <>
            <ProfileTop curUser={curUser} />
            <ProfileSkills curUser={curUser} />
            <ProfileResume curUser={curUser} />
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Profile;
