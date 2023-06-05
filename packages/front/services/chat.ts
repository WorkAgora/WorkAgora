import { privateApi } from "@workagora/front-provider";
import { ChatInstance, ChatMessage } from "@workagora/utils";

export interface SendChatMessageProps {
    senderWallet: string;
    receiverWallet: string;
    content: string;
    user1Type: string;
}

export interface UpdateRelatedJobProps {
    jobRelated: string;
    instanceId: string;
}

export type SendChatMessage = (props: SendChatMessageProps) => Promise<ChatMessage>

export type GetChatConversations = () => Promise<ChatInstance[]>

export type GetMessagesInChat = (id: string) => Promise<ChatMessage[]>

export type UpdateRelatedJob = (args: UpdateRelatedJobProps) => Promise<ChatInstance>

export const sendChatMessage: SendChatMessage = async ({senderWallet, receiverWallet, content, user1Type}) => {
    const res = await privateApi.post('/chat/create', {senderWallet, receiverWallet, content, user1Type});
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

export const updateRelatedJob: UpdateRelatedJob = async ({jobRelated, instanceId}) => {
    const res = await privateApi.post('/chat/update-job-related', {jobRelated, instanceId});
    return res.data;
}

