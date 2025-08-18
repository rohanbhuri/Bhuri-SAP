import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

// Single gateway with multiple channels (message, notification, request)
@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  // Generic join for rooms
  // Rooms can be: conversation:<id>, user:<id>, org:<id>
  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string }) {
    if (payload?.room) client.join(payload.room);
  }

  // Messaging channel
  @SubscribeMessage('message:send')
  async handleSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; senderId: string; content: string }
  ) {
    const msg = await this.messagesService.sendMessage(payload.conversationId, payload.senderId, payload.content);

    // Emit to conversation room and org room
    this.server.to(`conversation:${payload.conversationId}`).emit('message:new', msg);
    if ((msg as any)?.organizationId) {
      this.server.to(`org:${(msg as any).organizationId}`).emit('message:org', msg);
    }
  }

  // Helpers to emit notifications/requests from services
  emitNotification(target: { userId?: string; orgId?: string }, payload: any) {
    if (target.userId) this.server.to(`user:${target.userId}`).emit('notification:new', payload);
    if (target.orgId) this.server.to(`org:${target.orgId}`).emit('notification:new', payload);
  }

  emitRequest(target: { userId?: string; orgId?: string }, payload: any) {
    if (target.userId) this.server.to(`user:${target.userId}`).emit('request:new', payload);
    if (target.orgId) this.server.to(`org:${target.orgId}`).emit('request:new', payload);
  }
}