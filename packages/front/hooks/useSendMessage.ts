import { useCallback } from "react";
import { sendChatMessage } from "../services/chat";

export const useSendMessage = () => {
   const sendMessage = useCallback( async (content: string, senderWallet: string, receiverWallet: string, partnerType: string) => {
    const res = await sendChatMessage({senderWallet, receiverWallet, partnerType, content});
    return res;
   }, [])

   return {sendMessage}
};