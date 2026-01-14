import { Injectable, inject, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { BrandConfigService } from './brand-config.service';

export interface WebSocketMessage {
  type: string;
  payload: any;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private brand = inject(BrandConfigService);
  private injector = inject(Injector);
  
  private socket?: Socket;
  private messageSubject = new BehaviorSubject<WebSocketMessage | null>(null);
  private connectionStatus = new BehaviorSubject<boolean>(false);
  
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;

  getMessages(): Observable<WebSocketMessage | null> {
    return this.messageSubject.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  connect(): void {
    try {
      const authService = this.injector.get(require('./auth.service').AuthService) as any;
      const user = authService.getCurrentUser();
      const token = authService.getToken();
      this.connectWithAuth(user, token);
    } catch (error) {
      console.error('Failed to initialize WebSocket connection:', error);
    }
  }

  connectWithAuth(user: any, token: string | null): void {
    console.log('connectWithAuth called - user:', user?.id || user?._id, 'token:', !!token);
    const userId = user?.id || user?._id;
    if (!user || !userId || !token) {
      console.log('WebSocket: No authenticated user or token, skipping connection');
      return;
    }

    // Disconnect existing connection if any
    if (this.socket?.connected) {
      console.log('WebSocket: Disconnecting existing connection before reconnecting');
      this.socket.disconnect();
    }

    try {
      const socketUrl = this.getSocketUrl();
      console.log('WebSocket: Attempting to connect to:', socketUrl);
      
      this.socket = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        timeout: 20000,
        forceNew: true,
        reconnection: false,
        autoConnect: true
      });
      
      this.socket.on('connect', () => {
        console.log('Socket.IO connected successfully');
        this.connectionStatus.next(true);
        this.reconnectAttempts = 0;
        const userId = user.id || user._id;
        this.send('join', { room: `user:${userId}` });
      });
      
      this.socket.on('disconnect', (reason) => {
        console.log('Socket.IO disconnected. Reason:', reason);
        this.connectionStatus.next(false);
        if (reason !== 'io client disconnect') {
          this.attemptReconnect();
        }
      });
      
      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        this.connectionStatus.next(false);
        this.attemptReconnect();
      });

      this.socket.onAny((eventName, ...args) => {
        const message: WebSocketMessage = {
          type: eventName,
          payload: args.length === 1 ? args[0] : args
        };
        this.messageSubject.next(message);
      });
    } catch (error) {
      console.error('Failed to create Socket.IO connection:', error);
      this.attemptReconnect();
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
    }
    this.connectionStatus.next(false);
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  send(type: string, payload: any): void {
    if (this.socket && this.socket.connected) {
      console.log('Sending Socket.IO event:', type, payload);
      this.socket.emit(type, payload);
    } else {
      console.warn('Socket.IO not connected, cannot send message:', { type, payload });
    }
  }

  joinRoom(room: string): void {
    this.send('join', { room });
  }

  leaveRoom(room: string): void {
    this.send('leave', { room });
  }

  sendMessage(conversationId: string, senderId: string, content: string): void {
    this.send('message:send', { conversationId, senderId, content });
  }

  startTyping(conversationId: string, userId: string, userName: string): void {
    this.send('typing:start', { conversationId, userId, userName });
  }

  stopTyping(conversationId: string, userId: string): void {
    this.send('typing:stop', { conversationId, userId });
  }

  markAsRead(conversationId: string, userId: string): void {
    this.send('message:read', { conversationId, userId });
  }

  private getSocketUrl(): string {
    const apiUrl = this.brand.getApiUrl();
    const socketUrl = apiUrl.replace(/\/api$/, '');
    console.log('API URL:', apiUrl);
    console.log('Socket.IO URL:', socketUrl);
    return socketUrl;
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Socket.IO: Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.warn('Socket.IO: Max reconnection attempts reached. Real-time features will be disabled.');
    }
  }
}
