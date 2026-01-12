import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { NotificationsService } from '../notifications/notifications.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200', 'http://localhost:4201'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
    
    if (!token) {
      console.log(`Client ${client.id} attempted connection without token, disconnecting`);
      client.disconnect();
      return;
    }

    try {
      const decoded = this.jwtService.verify(token);
      client.data.userId = decoded.sub || decoded.userId;
      client.data.user = decoded;
      console.log(`Client ${client.id} connected with user: ${client.data.userId}`);
    } catch (error) {
      console.log(`Client ${client.id} provided invalid token, disconnecting`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  // Generic join for rooms
  // Rooms can be: conversation:<id>, user:<id>, org:<id>
  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string }) {
    if (payload?.room) {
      client.join(payload.room);
      console.log(`Client ${client.id} joined room: ${payload.room}`);
    }
  }

  @SubscribeMessage('leave')
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string }) {
    if (payload?.room) {
      client.leave(payload.room);
      console.log(`Client ${client.id} left room: ${payload.room}`);
    }
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

    // Get recent notifications for recipients to emit real-time updates
    try {
      const notifications = await this.notificationsService.getUserNotifications(payload.senderId, 1);
      if (notifications.length > 0) {
        const latestNotification = notifications[0];
        
        // Emit notification to recipient's room
        if (latestNotification.data?.conversationId) {
          // Get conversation to find all participants
          const conversation = await this.messagesService['conversationRepo'].findOne({
            where: { _id: latestNotification.data.conversationId }
          });
          
          if (conversation) {
            const recipientIds = (conversation as any).memberIds.filter(
              (memberId: any) => String(memberId) !== String(payload.senderId)
            );
            
            // Emit to each recipient
            for (const recipientId of recipientIds) {
              this.server.to(`user:${recipientId}`).emit('notification:new', {
                notification: latestNotification,
                type: 'message'
              });
              
              // Also emit updated notification count
              const unreadCount = await this.notificationsService.getUnreadCount(recipientId);
              this.server.to(`user:${recipientId}`).emit('notification:count', { count: unreadCount });
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to emit notification updates:', error);
    }
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; userId: string; userName: string }
  ) {
    client.to(`conversation:${payload.conversationId}`).emit('typing:update', {
      conversationId: payload.conversationId,
      userId: payload.userId,
      userName: payload.userName,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; userId: string }
  ) {
    client.to(`conversation:${payload.conversationId}`).emit('typing:update', {
      conversationId: payload.conversationId,
      userId: payload.userId,
      isTyping: false,
    });
  }

  @SubscribeMessage('message:read')
  async handleMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; userId: string }
  ) {
    await this.messagesService.markAsRead(payload.conversationId, payload.userId);
    client.to(`conversation:${payload.conversationId}`).emit('messages:read', {
      conversationId: payload.conversationId,
      userId: payload.userId,
    });
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