import { Avatar, Badge, Box, Button, Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';
import DollarIcon from '../icons/DollarIcon';
import SendMsgIcon from '../icons/SendMsgIcon';
import StarIcon from '../icons/StarIcon';
import { SearchBarFilter } from '../landing/product/SearchBar';

interface FreelanceInlineCardProps {
  badges: SearchBarFilter[];
}

const FreelanceInlineCard: FC<FreelanceInlineCardProps> = ({
  badges
}: FreelanceInlineCardProps) => {
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
      <Flex ml="auto" justifyContent="space-between" flexBasis="50%">
        <Flex columnGap={2} alignItems="center">
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
