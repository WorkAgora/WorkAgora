import { SimpleGrid, SimpleGridProps } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import FreelanceCard from '../../card/FreelanceCard';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

const Gallery: FC<SimpleGridProps> = ({ ...props }: SimpleGridProps) => {
  const { type, possibleType } = useLanding();

  return (
    <SimpleGrid columns={4} spacing={8} {...props}>
      {cards.map((v, k) => {
        if (type == possibleType[0]) {
          return <FreelanceCard key={k}></FreelanceCard>;
        }
        if (type == possibleType[1]) {
          return <FreelanceCard key={k}></FreelanceCard>;
        }
      })}
    </SimpleGrid>
  );
};

export default Gallery;
