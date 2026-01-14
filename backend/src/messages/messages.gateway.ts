import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { NotificationsService } from '../notifications/notifications.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from '../entities/user.entity';

@Injectable()
@WebSocketGateway({
  cors: { origin: '*'
  },
  transports: ['websocket', 'polling']
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: MongoRepository<User>,
  ) { }

  async handleConnection(client: Socket) {
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
      
      // Join user room immediately
      client.join(`user:${client.data.userId}`);
      console.log(`Client ${client.id} connected with user: ${client.data.userId}`);
      
      // Update user online status
      await this.updateUserOnlineStatus(client.data.userId, true);
      
      // Get user and join organization rooms
      const user = await this.userRepo.findOne({ where: { _id: new ObjectId(client.data.userId) } });
      if (user && user.organizationIds) {
        for (const orgId of user.organizationIds) {
          client.join(`org:${orgId}`);
          // Only emit to the specific org room, not broadcast to all
          client.to(`org:${orgId}`).emit('user:online', { 
            userId: client.data.userId,
            timestamp: new Date()
          });
        }
      }
      
      // Send current unread count to user immediately upon connection
      try {
        const unreadCount = await this.messagesService.getTotalUnreadCount(client.data.userId);
        console.log(`Sending initial unread count to user ${client.data.userId}: ${unreadCount}`);
        client.emit('message:count', { count: unreadCount });
      } catch (error) {
        console.error('Failed to send initial unread count:', error);
      }
    } catch (error) {
      console.log(`Client ${client.id} provided invalid token, disconnecting`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
    
    if (client.data.userId) {
      // Update user offline status
      await this.updateUserOnlineStatus(client.data.userId, false);
      
      // Broadcast offline status to user's organizations
      const user = await this.userRepo.findOne({ where: { _id: new ObjectId(client.data.userId) } });
      if (user && user.organizationIds) {
        for (const orgId of user.organizationIds) {
          this.server.to(`org:${orgId}`).emit('user:offline', { 
            userId: client.data.userId,
            lastSeen: new Date()
          });
        }
      }
    }
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

    // Only send message:new to OTHER participants, not the sender
    client.to(`conversation:${payload.conversationId}`).emit('message:new', msg);
    if ((msg as any)?.organizationId) {
      client.to(`org:${(msg as any).organizationId}`).emit('message:org', msg);
    }

    try {
      const conversation = await this.messagesService['conversationRepo'].findOne({
        where: { _id: new ObjectId(payload.conversationId) }
      });

      if (conversation) {
        const allMemberIds = (conversation as any).memberIds;

        for (const memberId of allMemberIds) {
          const unreadMessageCount = await this.messagesService.getTotalUnreadCount(String(memberId));
          console.log(`WebSocket: Emitting message count ${unreadMessageCount} to user ${memberId}`);
          this.server.to(`user:${memberId}`).emit('message:count', { count: unreadMessageCount });
        }
      }
    } catch (error) {
      console.error('Failed to emit message count updates:', error);
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

    // Update message count for the user who read the messages
    const unreadMessageCount = await this.messagesService.getTotalUnreadCount(payload.userId);
    this.server.to(`user:${payload.userId}`).emit('message:count', { count: unreadMessageCount });
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

  private async updateUserOnlineStatus(userId: string, isOnline: boolean) {
    try {
      const user = await this.userRepo.findOne({ where: { _id: new ObjectId(userId) } });
      if (user) {
        user.isOnline = isOnline;
        user.lastSeen = new Date();
        await this.userRepo.save(user);
      }
    } catch (error) {
      console.error('Failed to update user online status:', error);
    }
  }
}