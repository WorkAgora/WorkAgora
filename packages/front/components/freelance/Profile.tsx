import { Box, Button, Flex } from '@chakra-ui/react';
import { useGetUserProfile } from '@workagora/front/hooks/useGetUserProfile';
import { shortHash } from '@workagora/utils';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import ProfileCompletedJobs from './ProfileCompletedJob';
import ProfileExperiences from './ProfileExperiences';
import ProfileLinks from './ProfileLinks';
import ProfilePreferences from './ProfilePreferences';
import ProfileResume from './ProfileResume';
import ProfileSkills from './ProfileSkills';
import ProfileTop from './ProfileTop';

interface ProfileProps {
  wallet: string;
}

const Profile: FC<ProfileProps> = ({ wallet }) => {
  const { loading, curUser, getProfile } = useGetUserProfile();
  const { push, back } = useRouter();

  useEffect(() => {
    if (wallet) {
      getProfile(wallet);
    }
  }, [getProfile, wallet]);

  return (
    <Flex px={{base: 0, lg: 6}} flexDir="column" w="100%" h="100%" minH="calc( 100vh - 80px )" gap={6} pb={6}>
      <Flex
        flexDir="column"
        w="100%"
        flexGrow="1"
        bgColor="neutral.white"
        px={{base: 4, lg: 8}}
        py={{base: 2, lg: 6}}
        gap={{base: 4, lg: 8}}
        borderRadius={{base: '32px', lg: "64px"}}
      >
        <Flex textStyle="h4" as="h1" color="neutral.dsGray" ml={{base:0, lg: 4}} flexDir={{base: 'column', lg: 'row'}}>
          <Flex>
            <Box
              color="neutral.dsGray"
              cursor="pointer"
              _hover={{ color: 'neutral.dsDarkGray', transition: 'all ease-in-out 250ms' }}
              onClick={() => push('/dashboard/offers')}
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
          <Button
            variant="outline"
            ml="auto"
            mr={{base: "auto", lg: 0}}
            mt={{base: 4, lg: 0}}
            color="brand.secondary"
            borderColor="brand.secondary"
            _hover={{
              color: 'brand.secondaryHover',
              borderColor: 'brand.secondaryHover'
            }}
            onClick={() => {
              back();
            }}
            leftIcon={
              <Box transform="rotate(180deg)">
                <ArrowRightIcon />
              </Box>
            }
          >
            Back
          </Button>
        </Flex>
        {curUser && (
          <>
            <ProfileTop curUser={curUser} />
            <ProfileSkills curUser={curUser} />
            <ProfileResume curUser={curUser} />
            <Flex gap={6} flexDir={{base: 'column', lg: 'row'}}>
              <ProfilePreferences curUser={curUser} />
              <ProfileLinks curUser={curUser} />
            </Flex>
            <ProfileExperiences curUser={curUser} />
          </>
        )}
      </Flex>
      <ProfileCompletedJobs />
    </Flex>
  );
};

export default Profile;
