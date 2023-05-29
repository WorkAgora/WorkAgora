import { Avatar, Badge, Box, Button, Flex, Text } from '@chakra-ui/react';
import { useColoredBadges } from '@workagora/front/hooks/useColoredBadges';
import { useGetCompanyById } from '@workagora/front/hooks/useGetCompanyById';
import { CreateJob, getDateDiffWithDays, getDateDiffWithDaysAndHours } from '@workagora/utils';
import { FC, useEffect } from 'react';
import DollarIcon from '../icons/DollarIcon';
import StarIcon from '../icons/StarIcon';

interface JobCardProps {
  job: CreateJob;
  blurred?: boolean;
  onClick?: (id: string) => void;
}

const workLocationOptions: { [key: string]: string } = {
  fullRemote: 'Full-remote',
  partialRemote: 'Partial-remote',
  onSite: 'On site'
};

const availabilityOptions: { [key: string]: string } = {
  fullTime: 'Full-time',
  partTime: 'Part-time',
  contract: 'Contract',
  internship: 'Internship'
};

const JobCard: FC<JobCardProps> = ({ job, blurred = false, onClick }: JobCardProps) => {
  const { getCategoryColorForSkill } = useColoredBadges();
  const { loading, getCompanyById, curCompany } = useGetCompanyById();
  let skillsLength = 0;

  useEffect(() => {
    getCompanyById(job.companyUuid);
  }, []);

  return (
    <Box
      p={6}
      borderColor="neutral.gray"
      borderWidth="1px"
      borderRadius="32px"
      bgColor="white"
      cursor="pointer"
      position="relative"
    >
      <Flex>
        <Avatar w="48px" h="48px" borderRadius="16px" />
        <Flex flexDir="column" ml={4} justifyContent="center">
          <Text
            fontFamily="Comfortaa"
            fontWeight="700"
            fontSize="20px"
            lineHeight="120%"
            color="neutral.black"
          >
            {curCompany?.name}
          </Text>
          <Text
            fontFamily="Comfortaa"
            fontWeight="700"
            fontSize="16px"
            lineHeight="120%"
            color="neutral.dsGray"
          >
            {curCompany?.title}
          </Text>
        </Flex>
        <Flex flexDir="column" ml="auto">
          <Box textStyle="h5" as="span" color="neutral.dsGray">
            {job?.createdAt && (
              <>{getDateDiffWithDaysAndHours(job?.createdAt, new Date().toISOString()) + ' ago'}</>
            )}
          </Box>
        </Flex>
      </Flex>
      <Flex flexDir="column" mt={4}>
        <Text
          fontFamily="Comfortaa"
          fontWeight="700"
          fontSize="16px"
          lineHeight="120%"
          color="neutral.black"
        >
          {job.title}
        </Text>
        <Text
          fontFamily="Comfortaa"
          fontWeight="700"
          fontSize="14px"
          lineHeight="120%"
          color="neutral.dsGray"
        >
          Location
        </Text>
      </Flex>
      <Flex mt={2}>
        {job.location && (
          <Badge
            color="neutral.black"
            bgColor="neutral.gray"
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
            mr={2}
          >
            {workLocationOptions[job.location]}
          </Badge>
        )}
        {job?.availability && (
          <Badge
            color="neutral.black"
            bgColor="neutral.gray"
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
            mr={2}
          >
            {availabilityOptions[job.availability]}
          </Badge>
        )}
        {job.duration && (
          <Badge
            color="neutral.black"
            bgColor="neutral.gray"
            borderWidth="1px"
            borderColor={'none'}
            variant="filter"
            mr={2}
          >
            {job.duration.years !== 0 && (
              <>
                {job.duration.years} {job.duration.years > 1 ? 'years' : 'year'}
              </>
            )}
            {job.duration.months !== 0 && (
              <>
                {job.duration.months} {job.duration.months > 1 ? 'months' : 'month'}
              </>
            )}
            {job.duration.days !== 0 && (
              <>
                {job.duration.days} {job.duration.days > 1 ? 'days' : 'day'}
              </>
            )}
            {job.duration.hours !== 0 && (
              <>
                {job.duration.hours} {job.duration.hours > 1 ? 'hours' : 'hour'}
              </>
            )}
          </Badge>
        )}
      </Flex>
      <Flex mt={4} px={1} minHeight="110px">
        <Text
          as="span"
          fontFamily="Montserrat"
          fontWeight="500"
          fontSize="14px"
          lineHeight="150%"
          color="neutral.dsGray"
        >
          {job.jobMission.slice(0, 380)} {job.jobMission.length > 380 && '...'}
        </Text>
      </Flex>
      <Flex mt={4}>
        {Array.from({ length: 6 }).map((_, k) => {
          if (job.tags && job.tags[k]) {
            const skill = job.tags[k];
            skillsLength += skill.length;
            if (skillsLength <= 45) {
              const colors = getCategoryColorForSkill(skill);

              return (
                <Badge
                  mr={2}
                  key={k}
                  color={colors.color}
                  bgColor={colors.bgColor}
                  borderWidth="1px"
                  borderColor={'none'}
                  variant="filter"
                >
                  {skill}
                </Badge>
              );
            }
          }
        })}
        <Button
          ml="auto"
          variant="outline"
          px="12px !important"
          py="2px !important"
          bgColor="white"
          borderColor="neutral.gray"
          fontSize="14px"
          fontWeight="400"
          lineHeight="100%"
          maxH="26px"
          onClick={() => onClick?.(job.uuid)}
        >
          See more
        </Button>
      </Flex>
      {blurred && (
        <Box
          position="absolute"
          background="linear-gradient(180deg, rgba(217, 217, 217, 0) 10%, #EDF2F7 100%)"
          w="102%"
          h="102%"
          top="-1%"
          left="-1%"
        ></Box>
      )}
    </Box>
  );
};

export default JobCard;
