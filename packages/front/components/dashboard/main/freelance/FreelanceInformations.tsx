import { Box, Button, Flex } from '@chakra-ui/react';
import DashboardCard from '../../../card/DashbordCard';
import { FC } from 'react';
import ArrowRightIcon from '@workagora/front/components/icons/ArrowRightIcon';

/**
 * 
 * @returns  title: string;
  subtitle?: string;
  button?: ReactNode;
  numberData?: number;
  theme: 'secondary' | 'primary' | 'outlined';
 */

const FreelanceInformations: FC = () => {
  return (
    <Flex flexDir="column" gap={4}>
      <Box textStyle="h4" as="h3" color="neutral.black">
        Informations
      </Box>
      <Flex w="100%" columnGap={6}>
        <DashboardCard
          title="Complete your profile"
          subtitle="You'll be more attractive !"
          theme="secondary"
          button={
            <Button
              variant="link"
              color="brand.primary"
              _hover={{ color: 'brand.primaryHover' }}
              rightIcon={
                <Box ml={2}>
                  <ArrowRightIcon />
                </Box>
              }
            >
              Access profile
            </Button>
          }
        />
        <DashboardCard
          title="Contract realized"
          theme="outlined"
          numberData={0}
          button={
            <Button
              variant="link"
              color="brand.secondary"
              _hover={{ color: 'brand.secondaryHover' }}
              leftIcon={
                <Box mr={2} transform="rotate(180deg)">
                  <ArrowRightIcon />
                </Box>
              }
            >
              See contracts
            </Button>
          }
        />
        <DashboardCard
          title="Company that checked your profile !"
          theme="outlined"
          numberData={0}
        />
      </Flex>
    </Flex>
  );
};

export default FreelanceInformations;
