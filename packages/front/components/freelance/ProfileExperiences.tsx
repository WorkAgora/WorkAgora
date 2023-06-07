import { Avatar, Box, Flex } from '@chakra-ui/react';
import { getDateDiff, User } from '@workagora/utils';
import { FC } from 'react';

interface ProfileExperienceProps {
  curUser: User;
}

const ProfileExperiences: FC<ProfileExperienceProps> = ({ curUser }) => {
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
      <Flex alignItems="center">
        <Box textStyle="h4" as="span">
          Experiences
        </Box>
      </Flex>
      <Flex flexDir="column">
        {curUser?.freelanceProfile?.experiences &&
          curUser.freelanceProfile?.experiences.length > 0 &&
          curUser.freelanceProfile.experiences.map((v, k) => (
            <Flex key={k} p={4} alignItems="start">
          <Avatar w="48px" h="48px" borderRadius="16px" my="auto" />
          <Flex flexDir="column" ml={4}>
            <Flex alignItems={{base: 'initial', lg: "center"}} columnGap={4} flexDir={{base: 'column', lg: 'row'}}>
              <Box textStyle="body2">
                {v.role} at {v.company}
              </Box>
              <Box textStyle="body2" fontSize="14px" color="neutral.dsGray" mt={0.5}>
                {getDateDiff(v.startDate, v.endDate)}
              </Box>
            </Flex>
            <Box textStyle="body2" fontSize="14px" color="neutral.dsGray" mt={1} pr={4} maxW="100%" whiteSpace="pre-wrap" overflow="hidden" overflowWrap="break-word" wordBreak="break-all">
              {v.description}
            </Box>
          </Flex>
            </Flex>
          ))}
      </Flex>
    </Flex>
  );
};

export default ProfileExperiences;
