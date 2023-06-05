import { ChatMessage } from "@workagora/utils";
import { useCallback, useEffect, useState } from "react";
import { getMessagesInChat } from "../services/chat";

export const useGetChatMessages = (id: string) => {
    const [curMessages, setCurMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const pollingInterval = 5000; // 5000 milliseconds = 5 seconds

    const getMessages = useCallback(async () => {
        const res = await getMessagesInChat(id);
        setCurMessages(res);
        setLoading(false);
    }, [id])

    useEffect(() => {
        if (id && id !== '') {
            setLoading(true);
            getMessages();
            const intervalId = setInterval(() => {
                getMessages();
            }, pollingInterval);

            // Clear interval on component unmount or chat id change
            return () => clearInterval(intervalId);
        }
    }, [id, getMessages])

    return { curMessages, loading, setCurMessages }
}