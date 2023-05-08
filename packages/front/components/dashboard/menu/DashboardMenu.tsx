import { Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import DashboardMenuFreelance from './DashboardMenuFreelance';

export interface MenuElement {
  view: string;
  label: string;
  icon: FC;
}

const DashboardMenu: FC = () => {
  const { type, possibleType } = useLanding();

  let content = <></>;
  if (type === possibleType[0]) {
    content = <DashboardMenuFreelance />;
  }
  if (type === possibleType[1]) {
    content = <></>;
  }

  return (
    <Flex flexDir="column" w="245px" h="100%" py={10} px={8} rowGap={6}>
      {content}
    </Flex>
  );
};

export default DashboardMenu;
