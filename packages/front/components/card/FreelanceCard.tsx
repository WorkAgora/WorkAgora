import { Avatar, Badge, Box, Button, Flex, Text } from '@chakra-ui/react';
import { User } from '@workagora/utils';
import { useRouter } from 'next/router';
import { FC } from 'react';
import DollarIcon from '../icons/DollarIcon';
import StarIcon from '../icons/StarIcon';
import { SearchBarFilter } from '../landing/product/SearchBar';

interface FreelanceCardProps {
  user: User;
  blurred?: boolean;
  onClick?: (id: number) => void;
}

const skills = ['Remote work', 'Full time', '3 months'];

const FreelanceCard: FC<FreelanceCardProps> = ({
  user,
  blurred = false,
  onClick
}: FreelanceCardProps) => {
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
        {/*Array.from({ length: 3 }).map((_, k) => (
          <Badge
            key={k}
            color="neutral.black"
            bgColor="neutral.gray"
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
            mr={2}
          >
            {skills[k]}
          </Badge>
        ))*/}
      </Flex>
      <Flex mt={4} px={1}>
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
        {/*Array.from({ length: 4 }).map((_, k) => (
          <Badge
            mr={2}
            key={k}
            color={badges[k].color}
            bgColor={badges[k].bgColor}
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
          >
            {badges[k].label}
          </Badge>
        ))*/}
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
          onClick={() => onClick?.(Math.floor(Math.random() * 2000))}
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
