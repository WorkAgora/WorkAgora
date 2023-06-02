import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useContext } from 'react';
import { ChatInstance } from '@workagora/utils';

type ChatInstanceContextInterface = {
  chats: ChatInstance[] | null;
  setChats: (chats: ChatInstance[] | null) => void;
  fetching: boolean;
  setFetching: (fetching: boolean) => void;
};

export const ChatInstanceContext = createContext<ChatInstanceContextInterface>({
  chats: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setChats: () => {},
  fetching: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFetching: () => {}
});

export const ChatInstanceProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<ChatInstance[] | null>(null);
  const [fetching, setFetching] = useState(false);


  return (
    <ChatInstanceContext.Provider value={{ chats, setChats, fetching, setFetching }}>
      {children}
    </ChatInstanceContext.Provider>
  );
};

export function useChatInstance() {
  const { chats, setChats, fetching, setFetching } = useContext(ChatInstanceContext);
  
  const addNewChat = (chat: ChatInstance) => {
    if (chats) {
    setChats([...chats, chat])
    } else {
      setChats([chat]);
    }
    return chats?.length ? chats?.length : 0;
  }

  return { chats, setChats, addNewChat, fetching, setFetching };
}
