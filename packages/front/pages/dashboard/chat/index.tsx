import { NextPage } from 'next';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Flex } from '@chakra-ui/react';
import DashboardChat from '@workagora/front/components/dashboard/chat/DashboardChat';
import { useRouter } from 'next/router';

const DashboardChatPage: NextPage = () => {
  const { query } = useRouter();

  if (query) {
    console.log(query);
  }

  return (
    <DashboardLayout>
      <Flex w="calc(100vw - 245px)" ml="auto">
        <DashboardChat />
      </Flex>
    </DashboardLayout>
  );
};

export default DashboardChatPage;
