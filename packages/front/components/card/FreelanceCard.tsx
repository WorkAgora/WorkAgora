import { Avatar, Badge, Box, Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';
import DollarIcon from '../icons/DollarIcon';
import StarIcon from '../icons/StarIcon';
import { SearchBarFilter } from '../landing/product/SearchBar';

interface FreelanceCardProps {
  badges: SearchBarFilter[];
  blurred?: boolean;
}

const FreelanceCard: FC<FreelanceCardProps> = ({ badges, blurred = false }: FreelanceCardProps) => {
  return (
    <Box
      px={6}
      py={8}
      borderColor="brand.primary"
      borderWidth="3px"
      borderRadius="32px"
      cursor="pointer"
      position="relative"
    >
      <Flex>
        <Avatar w="56px" h="56px" />
        <Flex flexDir="column" ml={4} justifyContent="center">
          <Text
            fontFamily="Comfortaa"
            fontWeight="700"
            fontSize="20px"
            lineHeight="120%"
            color="neutral.black"
          >
            John Doe
          </Text>
          <Text
            fontFamily="Comfortaa"
            fontWeight="700"
            fontSize="16px"
            lineHeight="120%"
            color="neutral.dsGray"
          >
            Freelance UI/UX Designer
          </Text>
        </Flex>
      </Flex>
      <Flex justifyContent="space-between" mt={4}>
        {Array.from({ length: 4 }).map((_, k) => (
          <Badge
            key={k}
            color={badges[k].color}
            bgColor={badges[k].bgColor}
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
          >
            {badges[k].label}
          </Badge>
        ))}
      </Flex>
      <Flex mt={4} px={1} justifyContent="space-between">
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
          >
            40/hr
          </Text>
        </Flex>
      </Flex>
      <Flex mt={4} px={1}>
        <Text
          as="span"
          fontFamily="Montserrat"
          fontWeight="500"
          fontSize="14px"
          lineHeight="150%"
          color="neutral.black"
        >
          I specialize in creating visually appealing and user-friendly interfaces. With extensive
          experience designing mobile app UI/UX, I can provide valuable insights and deliver
          exceptional results. My portfolio showcases a range of successful projects, and my hourly
          rate is competitive.
        </Text>
      </Flex>
      {blurred && (
        <Box
          position="absolute"
          background="linear-gradient(180deg, rgba(217, 217, 217, 0) 30%, #EDF2F7 100%)"
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
