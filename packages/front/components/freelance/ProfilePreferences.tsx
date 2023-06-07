import { Badge, Box, Flex } from '@chakra-ui/react';
import { User } from '@workagora/utils';
import { FC } from 'react';

interface ProfilePreferencesProps {
  curUser: User;
}

const ProfilePreferences: FC<ProfilePreferencesProps> = ({ curUser }) => {
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
      flexBasis="60%"
    >
      <Box textStyle="h4" as="span">
        Preferences
      </Box>
      <Flex gap={2} flexWrap="wrap">
        {curUser.freelanceProfile?.workLocation && (
          <Badge
            color="neutral.black"
            bgColor="neutral.gray"
            cursor="default"
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
          >
            {curUser.freelanceProfile?.workLocation}
          </Badge>
        )}
        {curUser.freelanceProfile?.situation && (
          <Badge
            color="neutral.black"
            bgColor="neutral.gray"
            cursor="default"
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
          >
            {curUser.freelanceProfile?.situation}
          </Badge>
        )}
        {curUser.freelanceProfile?.availability && (
          <Badge
            color="neutral.black"
            bgColor="neutral.gray"
            cursor="default"
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
          >
            {curUser.freelanceProfile?.availability}
          </Badge>
        )}
        {curUser.freelanceProfile?.hoursPerWeek !== 0 && curUser.freelanceProfile?.hoursPerWeek && (
          <Badge
            color="neutral.black"
            bgColor="neutral.gray"
            cursor="default"
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
          >
            {curUser.freelanceProfile?.hoursPerWeek.toString()} hrs/week
          </Badge>
        )}
        {curUser.freelanceProfile?.yearsOfExperience && (
          <Badge
            color="neutral.black"
            bgColor="neutral.gray"
            borderWidth="1px"
            borderColor={'none'}
            cursor="default"
            variant="filter"
            mr={2}
          >
            {curUser.freelanceProfile?.yearsOfExperience}{' '}
            {curUser.freelanceProfile?.yearsOfExperience != undefined &&
            parseInt(curUser.freelanceProfile?.yearsOfExperience) > 1
              ? 'Years'
              : 'Year'}{' '}
            of Exp
          </Badge>
        )}
      </Flex>
    </Flex>
  );
};

export default ProfilePreferences;
