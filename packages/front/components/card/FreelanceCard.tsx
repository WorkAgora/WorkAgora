import { Avatar, Badge, Box, Button, Flex, Text } from '@chakra-ui/react';
import { useColoredBadges } from '@workagora/front/hooks/useColoredBadges';
import { User } from '@workagora/utils';
import { FC } from 'react';
import DollarIcon from '../icons/DollarIcon';
import StarIcon from '../icons/StarIcon';

interface FreelanceCardProps {
  user: User;
  blurred?: boolean;
  onClick?: (id: string) => void;
}

const FreelanceCard: FC<FreelanceCardProps> = ({
  user,
  blurred = false,
  onClick
}: FreelanceCardProps) => {
  const { getCategoryColorForSkill } = useColoredBadges();
  let skillsLength = 0;
  return (
    <Box
      p={6}
      borderColor="neutral.gray"
      borderWidth="1px"
      borderRadius="32px"
      bgColor="white"
      cursor="pointer"
      position="relative"
    >
      <Flex>
        <Avatar w="48px" h="48px" borderRadius="16px" />
        <Flex flexDir="column" ml={4} justifyContent="center">
          <Text
            fontFamily="Comfortaa"
            fontWeight="700"
            fontSize="20px"
            lineHeight="120%"
            color="neutral.black"
          >
            {user.firstname} {user.lastname}
          </Text>
          <Flex alignItems="center">
            <Text
              fontFamily="Montserrat"
              fontWeight="400"
              fontSize="14px"
              lineHeight="150%"
              color="neutral.black"
            >
              4,9/5
            </Text>
            <Box color="brand.primary" ml={1}>
              <StarIcon />
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDir="column" mt={4}>
        <Text
          fontFamily="Comfortaa"
          fontWeight="700"
          fontSize="16px"
          lineHeight="120%"
          color="neutral.black"
        >
          {user.description}
        </Text>
        <Text
          fontFamily="Comfortaa"
          fontWeight="700"
          fontSize="14px"
          lineHeight="120%"
          color="neutral.dsGray"
        >
          {user.location}
        </Text>
      </Flex>
      <Flex mt={2}>
        {user.freelanceProfile?.situation && (
          <Badge
            color="neutral.black"
            bgColor="neutral.gray"
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
            mr={2}
          >
            {user.freelanceProfile?.situation}
          </Badge>
        )}
        {user.freelanceProfile?.availability && (
          <Badge
            color="neutral.black"
            bgColor="neutral.gray"
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
            mr={2}
          >
            {user.freelanceProfile?.availability}
          </Badge>
        )}
        {user.freelanceProfile?.workLocation && (
          <Badge
            color="neutral.black"
            bgColor="neutral.gray"
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
            mr={2}
          >
            {user.freelanceProfile?.workLocation}
          </Badge>
        )}
        {user.freelanceProfile?.hoursPerWeek !== 0 && user.freelanceProfile?.hoursPerWeek && (
          <Badge
            color="neutral.black"
            bgColor="neutral.gray"
            cursor="default"
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
            mr={2}
          >
            {user.freelanceProfile?.hoursPerWeek.toString()} hrs/week
          </Badge>
        )}
        {user.freelanceProfile?.yearsOfExperience && (
          <Badge
            color="neutral.black"
            bgColor="neutral.gray"
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
            mr={2}
          >
            {user.freelanceProfile?.yearsOfExperience}{' '}
            {user.freelanceProfile?.yearsOfExperience != undefined &&
            parseInt(user.freelanceProfile?.yearsOfExperience) > 1
              ? 'Years'
              : 'Year'}{' '}
            of Exp
          </Badge>
        )}
      </Flex>
      <Flex mt={4} px={1} minHeight="110px">
        <Text
          as="span"
          fontFamily="Montserrat"
          fontWeight="500"
          fontSize="14px"
          lineHeight="150%"
          color="neutral.dsGray"
        >
          {user.freelanceProfile?.longDesc}
        </Text>
      </Flex>
      <Flex mt={4}>
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
        <Button
          ml="auto"
          variant="outline"
          px="12px !important"
          py="2px !important"
          bgColor="white"
          borderColor="neutral.gray"
          fontSize="14px"
          fontWeight="400"
          lineHeight="100%"
          maxH="26px"
          onClick={() => onClick?.(user.wallet)}
        >
          See more
        </Button>
      </Flex>
      {blurred && (
        <Box
          position="absolute"
          background="linear-gradient(180deg, rgba(217, 217, 217, 0) 10%, #EDF2F7 100%)"
          w="102%"
          h="102%"
          top="-1%"
          left="-1%"
        ></Box>
      )}
    </Box>
  );
};

export default FreelanceCard;
