import { Avatar, Box, Flex } from '@chakra-ui/react';
import PencilIcon from '@workagora/front/components/icons/PencilIcon';
import { Experience, getDateDiff } from '@workagora/utils';
import { FC } from 'react';

interface FreelanceExperiencesLineProps {
  experience: Experience;
  onEditExperience: (id: string) => void;
}

const FreelanceExperiencesLine: FC<FreelanceExperiencesLineProps> = ({
  experience,
  onEditExperience
}) => {
  return (
    <Flex p={{base: 2, lg: 4}} alignItems="start">
      <Avatar w="48px" h="48px" borderRadius="16px" my="auto" />
      <Flex flexDir="column" ml={4}>
        <Flex alignItems={{base: 'initial', lg: "center"}} columnGap={4} flexDir={{base: 'column', lg: 'row'}}>
          <Box textStyle="body2">
            {experience.role} at {experience.company}
          </Box>
          <Box textStyle="body2" fontSize="14px" color="neutral.dsGray" mt={0.5}>
            {getDateDiff(experience.startDate, experience.endDate)}
          </Box>
        </Flex>
        <Box textStyle="body2" fontSize="14px" color="neutral.dsGray" mt={1} pr={4} maxW="100%" whiteSpace="pre-wrap" overflow="hidden" overflowWrap="break-word" wordBreak="break-all">
          {experience.description}
        </Box>
      </Flex>
      <Box
        color="neutral.dsGray"
        p={2}
        ml="auto"
        cursor="pointer"
        borderRadius="8px"
        _hover={{ bgColor: 'neutral.lightGray', color: 'neutral.black' }}
        onClick={() => {
          onEditExperience(experience.id);
        }}
      >
        <PencilIcon />
      </Box>
    </Flex>
  );
};

export default FreelanceExperiencesLine;
