import { Box, Button, Flex, SimpleGrid, SimpleGridProps, Spinner } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC, useEffect, useState } from 'react';
import FreelanceCard from '../../card/FreelanceCard';
import { UserTypeEnum } from '@workagora/utils';
import { useRecentFreelancer } from '@workagora/front/hooks/useRecentFreelancer';

const Gallery: FC<SimpleGridProps> = ({ ...props }: SimpleGridProps) => {
  const { type, setSignupModalOpen } = useLanding();
  const [caption, setCaption] = useState<string>('');
  const { freelancers, loading } = useRecentFreelancer({ limit: 8 });

  useEffect(() => {
    if (type === UserTypeEnum.Freelancer) {
      setCaption('Join us and find your perfect offer');
    }
    if (type === UserTypeEnum.Company) {
      setCaption('Join us and find your perfect freelancer');
    }
  }, [type]);

  return (
    <Flex w="100%" flexDir="column" position="relative" pb={6}>
      {loading && (
        <Flex
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          my={16}
          w="100%"
          position="relative"
        >
          <Spinner color="brand.primary" size="xl" mx="auto" />
          <Box textStyle="h6" as="span" color="brand.secondary" mt={8}>
            Loading Offers
          </Box>
        </Flex>
      )}
      {!loading && (
        <SimpleGrid
          columns={2}
          spacing={8}
          w="100%"
          position="relative"
          zIndex="1"
          pb={16}
          {...props}
        >
          {type == UserTypeEnum.Company &&
            freelancers.map((v, k) => <FreelanceCard key={k} user={v} blurred={k >= 6} />)}
        </SimpleGrid>
      )}
      <Flex
        flexDir="column"
        justifyContent="end"
        pb={4}
        alignItems="center"
        w="100%"
        position="absolute"
        zIndex="2"
        bottom={loading ? '-50' : '0'}
      >
        <Box textStyle="h3" as="h3" w="100%" textAlign="center" cursor="default">
          {caption}
        </Box>
        <Box mt={4}>
          <Button variant="primary" size="md" onClick={() => setSignupModalOpen(true)}>
            Sign up
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Gallery;
