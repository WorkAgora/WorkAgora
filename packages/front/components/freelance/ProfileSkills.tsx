import { Badge, Box, Flex } from '@chakra-ui/react';
import { useColoredBadges } from '@workagora/front/hooks/useColoredBadges';
import { User } from '@workagora/utils';
import { FC } from 'react';

interface ProfileSkillsProps {
  curUser: User;
}

const ProfileSkills: FC<ProfileSkillsProps> = ({ curUser }) => {
  const { getCategoryColorForSkill } = useColoredBadges();

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
        Skills & Expertise
      </Box>
      <Flex flexWrap="wrap" gap={2}>
        {curUser.freelanceProfile &&
          curUser.freelanceProfile.skills &&
          curUser.freelanceProfile.skills.map((v, k) => {
            const colors = getCategoryColorForSkill(v);
            return (
              <Badge
                key={k}
                color={colors.color}
                bgColor={colors.bgColor}
                borderWidth="1px"
                borderColor={'none'}
                variant="filter"
                cursor="default"
              >
                {v}
              </Badge>
            );
          })}
      </Flex>
    </Flex>
  );
};

export default ProfileSkills;
