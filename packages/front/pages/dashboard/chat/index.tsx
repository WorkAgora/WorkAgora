import { NextPage } from 'next';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Flex } from '@chakra-ui/react';
import DashboardChat from '@workagora/front/components/dashboard/chat/DashboardChat';
import { ChatInstanceProvider } from '@workagora/front-provider';

const DashboardChatPage: NextPage = () => {

  return (
    <DashboardLayout>
      <Flex w={{base: "100vw", lg: "calc(100vw - 245px)"}} ml="auto">
        <ChatInstanceProvider>
          <DashboardChat />
        </ChatInstanceProvider>
      </Flex>
    </DashboardLayout>
  );
};

export default DashboardChatPage;
