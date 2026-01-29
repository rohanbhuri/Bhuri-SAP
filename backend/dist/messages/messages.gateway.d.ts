import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { NotificationsService } from '../notifications/notifications.service';
import { JwtService } from '@nestjs/jwt';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly messagesService;
    private readonly notificationsService;
    private readonly jwtService;
    private readonly userRepo;
    server: Server;
    constructor(messagesService: MessagesService, notificationsService: NotificationsService, jwtService: JwtService, userRepo: MongoRepository<User>);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoin(client: Socket, payload: {
        room: string;
    }): void;
    handleLeave(client: Socket, payload: {
        room: string;
    }): void;
    handleSend(client: Socket, payload: {
        conversationId: string;
        senderId: string;
        content: string;
    }): Promise<void>;
    handleTypingStart(client: Socket, payload: {
        conversationId: string;
        userId: string;
        userName: string;
    }): void;
    handleTypingStop(client: Socket, payload: {
        conversationId: string;
        userId: string;
    }): void;
    handleMessageRead(client: Socket, payload: {
        conversationId: string;
        userId: string;
    }): Promise<void>;
    emitNotification(target: {
        userId?: string;
        orgId?: string;
    }, payload: any): void;
    emitRequest(target: {
        userId?: string;
        orgId?: string;
    }, payload: any): void;
    private updateUserOnlineStatus;
}
