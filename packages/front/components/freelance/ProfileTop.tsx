import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react';
import { User } from '@workagora/utils';
import { FC } from 'react';
import DollarIcon from '../icons/DollarIcon';
import StarIcon from '../icons/StarIcon';
import SendMsgIcon from '../icons/SendMsgIcon';
import { useRouter } from 'next/router';

interface ProfileTopProps {
  curUser: User;
}

const ProfileTop: FC<ProfileTopProps> = ({ curUser }) => {
  const { push } = useRouter();

  return (
    <Flex alignItems={'center'} p={6} flexDir={{base: 'column', lg: ' row'}}>
      <Avatar w={{base: '64px', lg: "128px"}} h={{base: '64px', lg: "128px"}} borderRadius="100%" />
      <Flex flexDir="column" ml={{base: 0, lg: 8}} mt={{base: 4, lg: 0}} justifyContent="center">
        <Box textStyle="h3">
          {curUser.firstname} {curUser.lastname}
        </Box>
        <Flex alignItems="center">
          <Box textStyle="h4" color="neutral.dsGray">
            {curUser.description} |
          </Box>
          <Box ml={2} mt={0.5} lineHeight="100%" textStyle="h6" color="neutral.dsDarkGray">
            {curUser.location}
          </Box>
        </Flex>
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
          <Box ml={2}>
          <Button variant="icon" onClick={() => push({pathname: '/dashboard/chat', query: {freelance: curUser.wallet}})}>
            <SendMsgIcon />
          </Button>
        </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProfileTop;
