import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { BrandConfigService } from './brand-config.service';
import { AuthService } from './auth.service';

export interface WebSocketMessage {
  type: string;
  payload: any;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private brand = inject(BrandConfigService);
  private auth = inject(AuthService);
  
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
    const user = this.auth.getCurrentUser();
    if (!user) {
      console.log('WebSocket: No authenticated user, skipping connection');
      return;
    }

    const socketUrl = this.getSocketUrl();
    
    try {
      console.log('WebSocket: Attempting to connect to:', socketUrl);
      
      // Create Socket.IO connection with proper configuration
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        timeout: 20000,
        forceNew: true,
        reconnection: false, // We'll handle reconnection manually
        autoConnect: true
      });
      
      this.socket.on('connect', () => {
        console.log('Socket.IO connected successfully');
        console.log('Socket ID:', this.socket?.id);
        this.connectionStatus.next(true);
        this.reconnectAttempts = 0;
        
        // Join user room for personal notifications
        this.send('join', { room: `user:${user.id}` });
      });
      
      this.socket.on('disconnect', (reason) => {
        console.log('Socket.IO disconnected. Reason:', reason);
        this.connectionStatus.next(false);
        
        // Only attempt reconnect if it wasn't a manual disconnect
        if (reason !== 'io client disconnect') {
          this.attemptReconnect();
        }
      });
      
      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        console.log('Socket URL that failed:', socketUrl);
        this.connectionStatus.next(false);
        this.attemptReconnect();
      });

      // Listen for all message types
      this.socket.onAny((eventName, ...args) => {
        console.log('Socket.IO event received:', eventName, args);
        
        // Convert Socket.IO events to our WebSocketMessage format
        const message: WebSocketMessage = {
          type: eventName,
          payload: args.length === 1 ? args[0] : args
        };
        
        this.messageSubject.next(message);
      });
      
    } catch (error) {
      console.error('Failed to create Socket.IO connection:', error);
      console.log('Attempted Socket URL:', socketUrl);
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

  // Messaging specific methods
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
    // Convert API URL to Socket.IO URL
    // apiUrl is like "http://localhost:3001/api"
    // We want "http://localhost:3001" for Socket.IO
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