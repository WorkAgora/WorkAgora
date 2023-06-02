import { useChatInstance, useCurrentUser } from "@workagora/front-provider";
import { useCallback, useEffect } from "react";
import { getChatConversations } from "../services/chat";

export const useGetMyChats = () => {
    const {user} = useCurrentUser();
    const {setChats, setFetching} = useChatInstance();
    const pollingInterval = 5000; // 5000 milliseconds = 5 seconds

    const getChats = useCallback(async () => {
        const res = await getChatConversations();
        setChats(res);
        setFetching(false);
      }, [setChats])

    useEffect(() => {
        if (user) {
            setFetching(true);
            getChats();
            const intervalId = setInterval(() => {
                getChats();
            }, pollingInterval);

            // Clear interval on component unmount or user change
            return () => clearInterval(intervalId);
        }
    }, [user, getChats])
};