import { privateApi } from "@workagora/front-provider";
import { ChatInstance, ChatMessage } from "@workagora/utils";

export type SendChatMessage = () => Promise<ChatMessage>

export type GetChatConversations = () => Promise<ChatInstance[]>

export const sendChatMessage = async () => {
    const res = await privateApi.post('/chat/create', {})
    return res.data
}

export const getChatConversations = async() => {
 const res = await privateApi.get('/chat/conversations');
 return res.data;
}