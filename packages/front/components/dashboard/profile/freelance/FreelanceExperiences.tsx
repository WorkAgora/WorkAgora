import { Box, Button, Flex } from '@chakra-ui/react';
import { useCurrentUser } from '@workagora/front-provider';
import AddIcon from '@workagora/front/components/icons/AddIcon';
import { FC, useState } from 'react';
import FreelanceExperienceForm from './FreelanceExperienceForm';
import FreelanceExperiencesLine from './FreelanceExperiencesLine';

const FreelanceExperiences: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { user } = useCurrentUser();

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
      {user &&
        user.freelanceProfile?.experiences &&
        user.freelanceProfile?.experiences?.length > 0 && (
          <Flex flexDir="column">
            {user.freelanceProfile.experiences.map((v, k) => (
              <FreelanceExperiencesLine key={k} experience={v} />
            ))}
          </Flex>
        )}
    </Flex>
  );
};

export default FreelanceExperiences;
