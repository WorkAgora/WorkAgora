import { Box, Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import { InView } from 'react-intersection-observer';
import TechnologyCard, { TechnologyCardProps } from '../../card/TechnologyCard';
import BalanceIcon from '../../icons/BalanceIcon';
import LightningIcon from '../../icons/LightningIcon';
import SecurityIcon from '../../icons/SecurityIcon';

const Technology: FC = () => {
  const { handleViewChange } = useLanding();
  const cards: TechnologyCardProps[] = [
    {
      Icon: LightningIcon,
      title: 'Opportunities',
      desc: 'By joining WorkAgora, you increase your visibility and reach more potential clients, which can help you get more work, more security and serenity.'
    },
    {
      Icon: SecurityIcon,
      title: 'Guarantees',
      desc: 'WorkAgora has simplified the payment processes, you will be guaranteed to be paid, the payment process will be faster and more efficient. '
    },
    {
      Icon: BalanceIcon,
      title: 'Justice',
      desc: 'WorkAgora supports freelancers who may encounter problems or disputes with the company they work with thanks to its autonomous decentralized organization that fairly resolves problems.'
    }
  ];

  return (
    <InView
      as="div"
      id="technology"
      onChange={handleViewChange}
      threshold={[0.5, 0.6, 0.7, 0.8, 0.9, 1]}
    >
      <Flex flexDir="column" py={16}>
        <Flex mx="auto" width="80%" maxW="1280px" flexDir="column">
          <Box textStyle="h2" textAlign="center" whiteSpace="pre-wrap" cursor="default">
            {`Here is why you need\nWorkAgora`}
          </Box>
          <Flex columnGap={8} mt={12}>
            {cards.map((v, k) => (
              <TechnologyCard key={k} {...v} />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </InView>
  );
};

export default Technology;
