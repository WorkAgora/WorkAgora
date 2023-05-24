import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { User } from '@workagora/utils';
import { FC } from 'react';
import DollarIcon from '../icons/DollarIcon';
import StarIcon from '../icons/StarIcon';

interface ProfileTopProps {
  curUser: User;
}

const ProfileTop: FC<ProfileTopProps> = ({ curUser }) => {
  return (
    <Flex alignItems={'center'} p={6}>
      <Avatar w="128px" h="128px" borderRadius="100%" />
      <Flex flexDir="column" ml={8} justifyContent="center">
        <Box textStyle="h3">
          {curUser.firstname} {curUser.lastname}
        </Box>
        <Box textStyle="h4" color="neutral.dsGray">
          {curUser.description}
        </Box>
        <Flex mt={2}>
          <Flex
            alignItems="center"
            borderRadius="8px"
            borderWidth="2px"
            borderColor="brand.primary"
            py={1}
            px={2}
          >
            <Box color="brand.primary" mr={1}>
              <StarIcon />
            </Box>
            <Text
              fontFamily="Montserrat"
              fontWeight="700"
              fontSize="16px"
              lineHeight="120%"
              color="neutral.black"
            >
              4,9
            </Text>
            <Text
              fontFamily="Montserrat"
              fontWeight="500"
              fontSize="16px"
              lineHeight="120%"
              color="neutral.black"
              ml={1}
            >
              /5
            </Text>
          </Flex>
          <Flex
            ml={4}
            alignItems="center"
            borderRadius="8px"
            borderWidth="2px"
            borderColor="brand.green"
            py={1}
            px={2}
          >
            <Box color="brand.green" mr={1}>
              <DollarIcon />
            </Box>
            <Text
              fontFamily="Montserrat"
              fontWeight="700"
              fontSize="16px"
              lineHeight="120%"
              color="neutral.black"
            >
              {curUser.freelanceProfile?.remuneration}
            </Text>
            <Text
              fontFamily="Montserrat"
              fontWeight="500"
              fontSize="16px"
              lineHeight="120%"
              color="neutral.black"
              ml={1}
            >
              /day
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProfileTop;
