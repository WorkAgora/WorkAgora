import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

console.log('ChatGateway');

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {
    console.log('ChatGateway constructor');
  }

  @SubscribeMessage('chat')
  async onChat(client: Socket, message: { senderId: string; receiverId: string; content: string }) {
    console.log('Received chat message', message);
    const newMessage = await this.chatService.sendMessage(
      message.senderId,
      message.receiverId,
      message.content
    );

    // Emit the new message to the receiver
    client.to(message.receiverId).emit('chat', newMessage);
  }

  handleConnection(client: Socket, ...args: any[]): any {
    console.log('Client connected');
  }

  handleDisconnect(client: Socket): any {
    console.log('Client disconnected');
  }
}



// NOT USED FOR THE MOMENT