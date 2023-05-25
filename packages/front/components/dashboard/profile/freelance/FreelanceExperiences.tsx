import { Box, Button, Flex } from '@chakra-ui/react';
import AddIcon from '@workagora/front/components/icons/AddIcon';
import { FC, useState } from 'react';
import FreelanceExperienceForm from './FreelanceExperienceForm';

const FreelanceExperiences: FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Flex
      flexDir="column"
      justifyContent="center"
      p={6}
      borderRadius="32px"
      borderWidth="1px"
      borderColor="neutral.gray"
      w="100%"
      gap={4}
      flexBasis="40%"
    >
      <Flex alignItems="center">
        <Box textStyle="h4" as="span">
          Experiences
        </Box>
        <Box ml="auto">
          <Button
            variant="outline"
            leftIcon={
              <Box w="16px" h="16px" mr={2}>
                <AddIcon />
              </Box>
            }
            onClick={() => {
              setShowForm(true);
            }}
          >
            Add experience
          </Button>
        </Box>
      </Flex>
      {showForm && <FreelanceExperienceForm onClose={() => setShowForm(false)} />}
    </Flex>
  );
};

export default FreelanceExperiences;
