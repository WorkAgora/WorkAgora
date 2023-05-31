import { Flex, Box, Button, Text } from '@chakra-ui/react';
import { FC } from 'react';
import FileIcon from '../../icons/FileIcon';

const ChatContractProposal: FC = () => {
  return (
    <Flex flexDir="column" justifyContent="center" alignItems="center" p={4}>
      <Box>
        <Button
          variant="outline"
          py={8}
          borderRadius="16px"
          leftIcon={
            <Box mr={2} bgColor="brand.primary" py={2} px={3} borderRadius="8px">
              <FileIcon />
            </Box>
          }
        >
          Contract proposal
        </Button>
      </Box>
      <Text fontSize="12px" lineHeight="150%" fontFamily="Montserrat" fontWeight="400" mt={1}>
        Click to negotiate
      </Text>
    </Flex>
  );
};
export default ChatContractProposal;
