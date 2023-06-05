import { useCallback } from "react";
import { sendChatMessage } from "../services/chat";

export const useSendMessage = () => {
   const sendMessage = useCallback( async (content: string, senderWallet: string, receiverWallet: string, user1Type: string) => {
    const res = await sendChatMessage({senderWallet, receiverWallet, user1Type, content});
    return res;
   }, [])

   return {sendMessage}
};