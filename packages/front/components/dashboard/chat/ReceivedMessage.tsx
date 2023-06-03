import { Avatar, Flex, Text, Box } from '@chakra-ui/react';
import { formatDateMessage } from '@workagora/utils';
import { FC } from 'react';

interface ReceivedMessageProps {
  avatar?: string;
  name?: string;
  userType: 'User' | 'Company';
  date: Date;
  message: string;
}

const ReceivedMessage: FC<ReceivedMessageProps> = ({ avatar, name, userType, date, message }) => {
  return (
    <Flex flexDir="column" p={4} mr={8}>
      <Flex alignItems="center">
        <Avatar w="24px" h="24px" borderRadius={userType === 'User' ?  '50%' : '8px'} iconLabel="" />
        <Text
          fontFamily="Montserrat"
          fontSize="14px"
          lineHeight="150%"
          fontWeight="400"
          ml={2}
          color="neutral.dsDarkGray"
        >
          {name !== undefined && name !== '' && <>{name}</>}
        </Text>
        <Text
          fontFamily="Montserrat"
          fontSize="12px"
          lineHeight="150%"
          fontWeight="400"
          mt={0.25}
          ml={2}
          color="neutral.dsGray"
        >
          {formatDateMessage(date)}
        </Text>
      </Flex>
      <Box
        as="span"
        mt={2}
        whiteSpace="pre-wrap"
        fontFamily="Montserrat"
        fontSize="16px"
        lineHeight="150%"
        fontWeight="400"
        color="neutral.black"
      >
        {message}
      </Box>
    </Flex>
  );
};

export default ReceivedMessage;
