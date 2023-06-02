import { privateApi } from "@workagora/front-provider";
import { ChatInstance, ChatMessage } from "@workagora/utils";

export interface SendChatMessageProps {
    senderWallet: string;
    receiverWallet: string;
    content: string;
    partnerType: string;
}

export type SendChatMessage = (props: SendChatMessageProps) => Promise<ChatMessage>

export type GetChatConversations = () => Promise<ChatInstance[]>

export type GetMessagesInChat = (id: string) => Promise<ChatMessage[]>

export const sendChatMessage: SendChatMessage = async ({senderWallet, receiverWallet, content, partnerType}) => {
    const res = await privateApi.post('/chat/create', {senderWallet, receiverWallet, content, partnerType});
    return res.data;
}

export const getChatConversations: GetChatConversations = async() => {
 const res = await privateApi.get('/chat/conversations');
 return res.data;
}

export const getMessagesInChat: GetMessagesInChat = async (id) => {
    const instanceId = id.replace('#', '%23');
    const res = await privateApi.get(`/chat/messages?instanceId=${instanceId}&limit=1000&page=1`);
    return res.data.messages;
}

