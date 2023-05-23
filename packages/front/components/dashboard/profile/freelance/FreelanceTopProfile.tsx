import { Avatar, Box, Text, Flex, Button, Input } from '@chakra-ui/react';
import { useCurrentUser } from '@workagora/front-provider';
import StarIcon from '../../../icons/StarIcon';
import { FC, useEffect, useState } from 'react';
import PencilIcon from '@workagora/front/components/icons/PencilIcon';
import { User } from '@workagora/utils';
import DollarIcon from '@workagora/front/components/icons/DollarIcon';

const FreelanceTopProfile: FC = () => {
  const { user } = useCurrentUser();
  const [editDescription, setEditDescription] = useState(false);
  const [newUser, setNewUser] = useState<User>();

  useEffect(() => {
    if (user) {
      setNewUser(user);
    }
  }, [user]);

  return (
    <>
      {user && newUser && (
        <Flex alignItems="center">
          <Avatar w="128px" h="128px" borderRadius="100%" />
          <Flex flexDir="column" ml={8} justifyContent="center">
            <Box textStyle="h3">
              {user.firstname} {user.lastname}
            </Box>
            <Box textStyle="h4" color="neutral.dsGray">
              {user.description}
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
                  fontSize="20px"
                  lineHeight="150%"
                  color="neutral.black"
                >
                  4,9
                </Text>
                <Text
                  fontFamily="Montserrat"
                  fontWeight="500"
                  fontSize="20px"
                  lineHeight="150%"
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
                  fontSize="20px"
                  lineHeight="150%"
                  color="neutral.black"
                >
                  {user.freelanceProfile?.remuneration}
                </Text>
                <Text
                  fontFamily="Montserrat"
                  fontWeight="500"
                  fontSize="20px"
                  lineHeight="150%"
                  color="neutral.black"
                  ml={1}
                >
                  /day
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Box
            color="neutral.dsGray"
            p={2}
            ml="auto"
            cursor="pointer"
            borderRadius="8px"
            _hover={{ bgColor: 'neutral.lightGray', color: 'neutral.black' }}
            mt={-8}
          >
            <PencilIcon />
          </Box>
        </Flex>
      )}
    </>
  );
};

export default FreelanceTopProfile;
