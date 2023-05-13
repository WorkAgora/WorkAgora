import { Box, Flex } from "@chakra-ui/react";
import { useLanding } from "@workagora/front-provider";
import { UserTypeEnum } from "@workagora/utils";
import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";

const MotionBox = motion(Box);


const DashboardOffers: FC = () => {
 const { type } = useLanding();
 

 const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <Flex px={6} flexDir="column" w="100%" h="100%" minH='calc( 100vh - 80px )'>
      <Flex
        flexDir="column"
        w="100%"
        flexGrow='1'
        bgColor="neutral.white"
        px={8}
        py={6}
        gap={8}
        borderRadius="64px"
      >
        <AnimatePresence mode="wait">
          {type === UserTypeEnum.Freelancer && (
            <MotionBox
              key="freelance"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
              <Flex flexDir="column" gap={4}>
                <Box textStyle="h2" as="h1" w="100%" textAlign="left">
                  Find work
                </Box>
                <Flex flexDir="column" gap={6}>
             
                </Flex>
              </Flex>
            </MotionBox>
          )}
          {type === UserTypeEnum.Company && (
            <MotionBox
              key="company"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
              <Flex flexDir="column" gap={4}>
                <Box textStyle="h2" as="h1" w="100%" textAlign="left">
                  Find freelancer
                </Box>
                <Flex flexDir="column" gap={6}>

                </Flex>
              </Flex>
            </MotionBox>
          )}
        </AnimatePresence>
      </Flex>
    </Flex>)
};

export default DashboardOffers;