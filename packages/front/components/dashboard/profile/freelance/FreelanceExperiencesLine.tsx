import { Avatar, Box, Flex } from '@chakra-ui/react';
import PencilIcon from '@workagora/front/components/icons/PencilIcon';
import { Experience } from '@workagora/utils';
import { FC } from 'react';

interface FreelanceExperiencesLineProps {
  experience: Experience;
  onEditExperience: (id: string) => void;
}

const FreelanceExperiencesLine: FC<FreelanceExperiencesLineProps> = ({
  experience,
  onEditExperience
}) => {
  const getDateDiff = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let years, months;

    months = end.getMonth() - start.getMonth();
    years = end.getFullYear() - start.getFullYear();

    if (months < 0) {
      years--;
      months += 12;
    }

    let text = '';
    if (years) {
      if (years > 1) {
        text += `${years} years`;
      }
      if (years === 1) {
        text += `${years} year`;
      }
    }
    if (text !== '') text += ' & ';
    if (months) {
      if (months > 1) {
        text += `${months} months`;
      }
      if (months === 1) {
        text += `${months} month`;
      }
    }
    return text;
  };

  return (
    <Flex p={4} alignItems="start">
      <Avatar w="48px" h="48px" borderRadius="16px" my="auto" />
      <Flex flexDir="column" ml={4}>
        <Flex alignItems="center" columnGap={4}>
          <Box textStyle="body2">
            {experience.role} at {experience.company}
          </Box>
          <Box textStyle="body2" fontSize="14px" color="neutral.dsGray" mt={0.5}>
            {getDateDiff(experience.startDate, experience.endDate)}
          </Box>
        </Flex>
        <Box textStyle="body2" fontSize="14px" color="neutral.dsGray" mt={1} pr={4}>
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
