import { Box, Flex } from '@chakra-ui/react';
import { User } from '@workagora/utils';
import { FC } from 'react';

interface ProfileResumeProps {
  curUser: User;
}

const ProfileResume: FC<ProfileResumeProps> = ({ curUser }) => {
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
    >
      <Box textStyle="h4" as="span">
        Resume
      </Box>
      <Box textStyle="body2" color="neutral.dsDarkGray" pl={4} pr={{base: 0, lg: 16}}>
        {curUser.freelanceProfile?.longDesc}
      </Box>
    </Flex>
  );
};

export default ProfileResume;
