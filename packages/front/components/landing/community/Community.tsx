import { Flex, Box, Button } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import { InView } from 'react-intersection-observer';
import ArrowRightIcon from '../../icons/ArrowRightIcon';
import Image from 'next/image';
import { UserTypeEnum } from '@workagora/utils';

const Community: FC = () => {
  const { handleViewChange, type } = useLanding();

  let JoinCommunity = <></>

   if (type === UserTypeEnum.Freelancer) {
    JoinCommunity = <>
                      <Button variant="link" pl={0} >Join our Twitter</Button>
                      <Button variant="primary" rightIcon={<ArrowRightIcon />}>
                        Join our linkedin
                      </Button>
                    </>
   }

   if (type === UserTypeEnum.Company) {
    JoinCommunity = <>
                      <Button variant="link" pl={0} >Join our Github</Button>
                      <Button variant="primary" rightIcon={<ArrowRightIcon />}>
                        Join our linkedin
                      </Button>
                    </>
   }


  return (
    <InView
      as="div"
      id="community"
      onChange={handleViewChange}
      threshold={[0.5, 0.6, 0.7, 0.8, 0.9, 1]}
    >
      <Flex flexDir="column" py={16}>
        <Flex mx="auto" width="80%" maxW="1280px" flexDir="column">
          <Flex w="100%" justifyContent="space-between">
            <Box maxW="500px" maxH="500px" w="500px" h="500px" position='relative' borderRadius='64px' overflow="hidden">
              <Image
                src="/images/landing/community.png"
                alt="Community for all"
                fill
              />
            </Box>
            <Flex flexDir="column" justifyContent="center" alignItems="start" maxW="630px">
              <Box textStyle="h2" as="h2">
                Join our community
              </Box>
              <Box
                as="p"
                mt={4}
                textAlign="left"
                whiteSpace="pre-wrap"
                fontSize="18px"
                fontWeight="400"
                fontFamily="Montserrat"
                lineHeight="150%"
              >
                {`Be part of our journey and join our Discord community to expand your network, access exclusive job opportunities, develop your skills, get support and advice, and have fun with like-minded professionals. It's free and easy to join, so don't miss out on the benefits of being part of our freelance community.`}
              </Box>
              <Flex mt={4} alignItems="center" columnGap={4}>
                {JoinCommunity}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </InView>
  );
};

export default Community;
