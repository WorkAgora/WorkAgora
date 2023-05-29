import { Avatar, Badge, Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { useCurrentUser } from '@workagora/front-provider';
import { useColoredBadges } from '@workagora/front/hooks/useColoredBadges';
import { useGetJobById } from '@workagora/front/hooks/useGetJobById';
import { availabilityOptions, formatDate, workLocationOptions } from '@workagora/utils';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import FreelanceCard from '../card/FreelanceCard';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import StarIcon from '../icons/StarIcon';
import WebsiteIcon from '../icons/WebsiteIcon';


interface OfferDetailProps {
  id: string;
}

const OfferDetail: FC<OfferDetailProps> = ({id}) => {
  const {loading, curJob, getJobById} = useGetJobById();
  const { user } = useCurrentUser();
  const { push } = useRouter();
  const { getCategoryColorForSkill } = useColoredBadges();

  useEffect(() => {
    if (user && id) {
      getJobById(id);
    }
  }, [id])

  return (
    <Flex px={6} flexDir="column" w="100%" h="100%" minH='calc( 100vh - 80px )'>
      <Flex
        flexDir="column"
        w="100%"
        flexGrow='1'
        bgColor="neutral.white"
        px={8}
        py={6}
        gap={6}
        borderRadius="64px"
      >
          <Flex textStyle="h2" as="h1" color="neutral.dsGray">
          <Box color="neutral.dsGray" cursor="pointer" transition="all ease-in-out 250ms" _hover={{color: "neutral.dsDarkGray"}}onClick={() => push('/dashboard/offers')}>Find work ></Box> <Box ml={2} color="neutral.black">Job details</Box>
          </Flex>
          {loading && (
            <Flex flexDir="column" justifyContent="center" alignItems="center" my={16}>
              <Spinner color="brand.primary" size="xl" mx="auto" />
              <Box textStyle="h6" as="span" color="brand.secondary" mt={8}>
                Loading Offer
              </Box>
            </Flex>
          )}
          {!loading && <>
          <Flex>
            <Flex flexDir="column" justifyContent="center">
              <Box textStyle="h3">{curJob?.title}</Box>
              <Flex mt={4} alignItems="center">
                {curJob?.location && (
                  <Badge
                    color="neutral.black"
                    bgColor="neutral.gray"
                    borderWidth="1px"
                    borderColor={'none'}
                    variant="filter"
                    mr={2}
                  >
                    {workLocationOptions[curJob.location]}
                  </Badge>
                )}
                {curJob?.availability && (
                  <Badge
                    color="neutral.black"
                    bgColor="neutral.gray"
                    borderWidth="1px"
                    borderColor={'none'}
                    variant="filter"
                    mr={2}
                  >
                    {availabilityOptions[curJob.availability]}
                  </Badge>
                )}
                {curJob?.duration && (
                  <Badge
                    color="neutral.black"
                    bgColor="neutral.gray"
                    borderWidth="1px"
                    borderColor={'none'}
                    variant="filter"
                    mr={2}
                  >
                    {curJob?.duration.years !== 0 && (
                      <>
                        {curJob?.duration.years} {curJob?.duration?.years > 1 ? 'years' : 'year'}
                      </>
                    )}
                    {curJob?.duration.months !== 0 && (
                      <>
                        {curJob?.duration.months} {curJob?.duration?.months > 1 ? 'months' : 'month'}
                      </>
                    )}
                    {curJob?.duration.days !== 0 && (
                      <>
                        {curJob?.duration.days} {curJob?.duration?.days > 1 ? 'days' : 'day'}
                      </>
                    )}
                    {curJob?.duration.hours !== 0 && (
                      <>
                        {curJob?.duration.hours} {curJob?.duration?.hours > 1 ? 'hours' : 'hour'}
                      </>
                    )}
                  </Badge>
                )}
                <Box textStyle="h6" ml={2} mt={0.5} color="neutral.dsGray">{curJob?.company?.location}</Box>
              </Flex>
              <Flex mt={4}>
              {curJob?.tags && curJob?.tags.map((skill, k) => {
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
                })}
              </Flex>
            </Flex>
            <Button variant="secondary" ml="auto" minW="340px" rightIcon={<ArrowRightIcon/>}>Apply to this job</Button>
          </Flex>
          <Flex flexDir="column">
            <Flex alignItems="center">
              <Box textStyle="body2" fontWeight="700" color="neutral.black">Created</Box>
              <Box textStyle="body2" color="neutral.dsGray" ml={2}>{curJob?.createdAt && <>
                  {formatDate(new Date(curJob.createdAt))}
                </>}
              </Box>
            </Flex>
          </Flex>
          <Flex columnGap={6}>
            <Flex flexDir="column" borderWidth="1px" borderColor="neutral.dsGray" borderRadius="32px" py={6} px={8} gap={4} flexBasis="75%">
                <Box textStyle="h4" color="neutral.black">Mission</Box>
                <Box textStyle="body2" color="neutral.dsGray" whiteSpace="pre-wrap">
                  {curJob?.jobMission}
                </Box>
                <Box textStyle="h6" color="neutral.black">Responsibilities</Box>
                <Box textStyle="body2" color="neutral.dsGray" whiteSpace="pre-wrap">
                  {curJob?.responsibilities}
                </Box>
                <Box textStyle="h6" color="neutral.black">Requirements</Box>
                <Box textStyle="body2" color="neutral.dsGray" whiteSpace="pre-wrap">
                  {curJob?.requirements}
                </Box>
            </Flex>
            <Flex flexDir="column" borderWidth="1px" bgColor="neutral.lightGray" borderColor="neutral.lightGray" borderRadius="32px" py={6} px={8} gap={4} alignSelf="flex-start" flexBasis="45%">
              <Flex alignItems="center">
                <Avatar w="96px" h="96px" borderRadius="16px"/>
                <Flex flexDir="column" ml={6}>
                  <Box textStyle="h4" color="neutral.black">{curJob?.company?.name}</Box>
                  <Box textStyle="h6" color="neutral.dsGray">{curJob?.company?.title}</Box>
                  <Flex alignItems="center">
                    <Text
                      fontFamily="Montserrat"
                      fontWeight="700"
                      fontSize="20px"
                      lineHeight="150%"
                      color="neutral.black"
                    >
                      4,9
                    </Text>
                    <Box color="brand.primary" ml={1}>
                      <StarIcon />
                    </Box>
                  </Flex>
                </Flex>
              </Flex>
              <Box textStyle="body2" color="neutral.dsGray" whiteSpace="pre-wrap">
                {curJob?.company?.description}
              </Box>
              {curJob?.company?.websiteUrl && <Button
                variant="outline"
                width="100%"
                color="brand.secondary"
                borderColor="brand.secondary"
                _hover={{
                  color: 'brand.secondaryHover',
                  borderColor: 'brand.secondaryHover'
                }}
                onClick={() => {
                  window.open(curJob?.company?.websiteUrl, '_blank');
                }}
                rightIcon={
                  <Box ml={2}>
                    <WebsiteIcon />
                  </Box>
                }
              >
                Visit our website
              </Button>}
            </Flex>
          </Flex></>}
      </Flex>

      <Flex mt={6}
        flexDir="column"
        w="100%"
        flexGrow='1'
        bgColor="neutral.white"
        px={8}
        py={6}
        gap={4}
        borderRadius="64px"
      >
        <Box textStyle="h4" color="neutral.black">Other jobs that match your interests</Box>
        <Flex columnGap={4}>
 
        </Flex>
      </Flex>
    </Flex>
  );
};

export default OfferDetail;
