import { Avatar, Badge, Box, Button, Flex, Text } from '@chakra-ui/react';
import { useColoredBadges } from '../../hooks/useColoredBadges';
import { FC } from 'react';
import DollarIcon from '../icons/DollarIcon';
import SendMsgIcon from '../icons/SendMsgIcon';
import StarIcon from '../icons/StarIcon';
import { User } from '@workagora/utils';

interface FreelanceInlineCardProps {
  user: User;
}

const FreelanceInlineCard: FC<FreelanceInlineCardProps> = ({ user }: FreelanceInlineCardProps) => {
  const { getCategoryColorForSkill } = useColoredBadges();
  let skillsLength = 0;

  return (
    <Flex
      w="100%"
      bgColor="neutral.lightGray"
      borderRadius="32px"
      px={6}
      py={3}
      alignItems="center"
    >
      <Avatar w="56px" h="56px" />
      <Flex flexDir="column" ml={4} justifyContent="center" flexBasis="50%">
        <Text
          fontFamily="Comfortaa"
          fontWeight="700"
          fontSize="20px"
          lineHeight="120%"
          color="neutral.black"
        >
          {user.firstname} {user.lastname}
        </Text>
        <Text
          fontFamily="Comfortaa"
          fontWeight="700"
          fontSize="16px"
          lineHeight="120%"
          color="neutral.dsGray"
        >
          {user.description}
        </Text>
      </Flex>
      <Flex ml="auto" justifyContent="space-between" flexBasis="80%">
        <Flex columnGap={2} alignItems="center" flexBasis="60%">
          {Array.from({ length: 6 }).map((_, k) => {
            if (user.freelanceProfile?.skills && user.freelanceProfile?.skills[k]) {
              const skill = user.freelanceProfile?.skills[k];
              skillsLength += skill.length;
              if (skillsLength <= 45) {
                const colors = getCategoryColorForSkill(skill);
                return (
                  <Badge
                    mr={2}
                    key={k}
                    color={colors.color}
                    bgColor={colors.bgColor}
                    borderWidth="1px"
                    borderColor={'none'}
                    variant="filter"
                  >
                    {skill}
                  </Badge>
                );
              }
            }
          })}
        </Flex>
        <Flex alignItems="center">
          <Flex w="20px" color="#38A169" justifyContent="center">
            <DollarIcon />
          </Flex>
          <Text
            ml={1}
            fontFamily="Montserrat"
            fontWeight="700"
            fontSize="14px"
            lineHeight="120%"
            color="neutral.black"
            display="flex"
            flexDir="row"
            minW="55px"
            maxW="55px"
            alignItems="center"
          >
            <Flex flexBasis="60%" ml="auto" justifyContent="center">
              {user.freelanceProfile?.remuneration}
            </Flex>
            <Flex flexBasis="10%">/</Flex>
            <Flex flexBasis="30%" ml={1}>
              hr
            </Flex>
          </Text>
        </Flex>
        <Flex alignItems="center">
          <Text
            fontFamily="Montserrat"
            fontWeight="700"
            fontSize="14px"
            lineHeight="120%"
            color="neutral.black"
          >
            4,9/5
          </Text>
          <Box color="brand.primary" ml={1}>
            <StarIcon />
          </Box>
        </Flex>
        <Box>
          <Button variant="icon">
            <SendMsgIcon />
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default FreelanceInlineCard;
