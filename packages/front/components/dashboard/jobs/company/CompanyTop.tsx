import { Box, Button, Flex } from '@chakra-ui/react';
import FileIcon from '../../../icons/FileIcon';
import { FC } from 'react';

interface CompanyTopProps {
  onCreate: () => void;
}
const CompanyTop: FC<CompanyTopProps> = ({ onCreate }) => {
  return (
    <Flex>
      <Box ml="auto">
        <Button variant="primary" leftIcon={<FileIcon />} onClick={onCreate}>
          Create new job
        </Button>
      </Box>
    </Flex>
  );
};

export default CompanyTop;
