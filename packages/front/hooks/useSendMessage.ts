import { useCallback } from "react";
import { sendChatMessage } from "../services/chat";

export const useSendMessage = (senderWallet: string, receiverWallet: string, partnerType: string) => {
   const sendMessage = useCallback( async (content: string) => {
    const res = await sendChatMessage({senderWallet, receiverWallet, partnerType, content});
    return res;
   }, [partnerType, receiverWallet, senderWallet])

   return {sendMessage}
};