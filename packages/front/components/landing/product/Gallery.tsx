import { Box, Button, Flex, SimpleGrid, SimpleGridProps } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC, useEffect, useState } from 'react';
import FreelanceCard from '../../card/FreelanceCard';
import { SearchBarFilter } from './SearchBar';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const Gallery: FC<SimpleGridProps> = ({ ...props }: SimpleGridProps) => {
  const { type, possibleType, setSignupModalOpen } = useLanding();
  const [caption, setCaption] = useState<string>('');

  useEffect(() => {
    if (type === possibleType[0]) {
      setCaption('Join us and find your perfect offer');
    }
    if (type === possibleType[1]) {
      setCaption('Join us and find your perfect freelancer');
    }
  }, [type, possibleType]);

  const badges: SearchBarFilter[] = [
    {
      label: 'Product',
      bgColor: 'badge.yellow',
      color: 'neutral.black'
    },
    {
      label: 'Design',
      bgColor: 'badge.blue',
      color: 'neutral.white'
    },
    {
      label: 'UI/UX',
      bgColor: 'badge.red',
      color: 'neutral.white'
    },
    {
      label: 'Figma',
      bgColor: 'badge.purple',
      color: 'neutral.white'
    }
  ];

  return (
    <Flex w="100%" flexDir="column" position="relative" pb={6}>
      <SimpleGrid
        columns={3}
        spacing={8}
        w="100%"
        position="relative"
        zIndex="1"
        pb={16}
        {...props}
      >
        {cards.map((v, k) => {
          if (type == possibleType[0]) {
            return <FreelanceCard key={k} badges={badges} blurred={k >= 9 ? true : false} />;
          }
          if (type == possibleType[1]) {
            return <FreelanceCard key={k} badges={badges} blurred={k >= 9 ? true : false} />;
          }
        })}
      </SimpleGrid>
      <Flex
        flexDir="column"
        justifyContent="end"
        pb={4}
        alignItems="center"
        w="100%"
        position="absolute"
        zIndex="2"
        bottom="0"
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
