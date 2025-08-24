import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { BrandConfigService } from './brand-config.service';

export interface OrgMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface OrgWithMembers {
  organizationId: string;
  organizationName: string;
  organizationCode: string;
  members: OrgMember[];
  unreadCount?: number;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  conversationId: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  createdAt: Date;
  updatedAt?: Date;
  replyTo?: string;
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Conversation {
  id: string;
  organizationId: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isTyping?: boolean;
  typingUsers?: string[];
}

export interface MessageState {
  loading: boolean;
  error: string | null;
  sending: boolean;
}

@Injectable({ providedIn: 'root' })
export class MessagesApiService {
  private http = inject(HttpClient);
  private brand = inject(BrandConfigService);
  private get api() {
    return this.brand.getApiUrl();
  }

  // State management
  private messageState = signal<MessageState>({ loading: false, error: null, sending: false });
  private typingUsers = new BehaviorSubject<{[conversationId: string]: string[]}>({});
  private onlineUsers = new BehaviorSubject<string[]>([]);

  getMessageState = this.messageState.asReadonly();
  getTypingUsers = () => this.typingUsers.asObservable();
  getOnlineUsers = () => this.onlineUsers.asObservable();

  getOrganizationsWithMembers(): Observable<OrgWithMembers[]> {
    this.messageState.update(s => ({ ...s, loading: true, error: null }));
    return this.http.get<OrgWithMembers[]>(`${this.api}/messages/org-members`);
  }

  getOrCreateDM(organizationId: string, otherUserId: string): Observable<Conversation> {
    return this.http.post<Conversation>(
      `${this.api}/messages/dm/${organizationId}/${otherUserId}`,
      {}
    );
  }

  listConversations(organizationId: string): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(
      `${this.api}/messages/conversations/${organizationId}`
    );
  }

  listMessages(
    conversationId: string,
    limit = 50,
    before?: string
  ): Observable<Message[]> {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    if (before) params.set('before', before);
    return this.http.get<Message[]>(
      `${this.api}/messages/chat/${conversationId}?${params.toString()}`
    );
  }

  sendMessage(conversationId: string, content: string): Observable<Message> {
    this.messageState.update(s => ({ ...s, sending: true }));
    return this.http.post<Message>(`${this.api}/messages/chat/${conversationId}`, {
      content,
    });
  }

  // Enhanced messaging features
  addReaction(messageId: string, emoji: string): Observable<Message> {
    return this.http.post<Message>(`${this.api}/messages/${messageId}/reactions`, { emoji });
  }

  removeReaction(messageId: string, emoji: string): Observable<Message> {
    return this.http.delete<Message>(`${this.api}/messages/${messageId}/reactions/${emoji}`);
  }

  markAsRead(conversationId: string): Observable<void> {
    return this.http.post<void>(`${this.api}/messages/chat/${conversationId}/read`, {});
  }

  setTyping(conversationId: string, isTyping: boolean): Observable<void> {
    return this.http.post<void>(`${this.api}/messages/chat/${conversationId}/typing`, { isTyping });
  }

  uploadAttachment(file: File): Observable<MessageAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MessageAttachment>(`${this.api}/messages/attachments`, formData);
  }

  searchMessages(query: string, conversationId?: string): Observable<Message[]> {
    const params = new URLSearchParams();
    params.set('q', query);
    if (conversationId) params.set('conversationId', conversationId);
    return this.http.get<Message[]>(`${this.api}/messages/search?${params.toString()}`);
  }

  // Real-time simulation (replace with WebSocket in production)
  simulateRealTimeUpdates() {
    interval(5000).subscribe(() => {
      // Simulate typing indicators
      const currentTyping = this.typingUsers.value;
      // Update typing status randomly for demo
    });
  }
}

// WebSocket service for real-time messaging (future implementation)
@Injectable({ providedIn: 'root' })
export class MessageWebSocketService {
  private socket?: WebSocket;
  private messageSubject = new BehaviorSubject<Message | null>(null);
  private typingSubject = new BehaviorSubject<{conversationId: string, users: string[]} | null>(null);

  connect(token: string) {
    // WebSocket connection implementation
    // this.socket = new WebSocket(`ws://localhost:3000/messages?token=${token}`);
  }

  disconnect() {
    this.socket?.close();
  }

  getMessages() {
    return this.messageSubject.asObservable();
  }

  getTypingUpdates() {
    return this.typingSubject.asObservable();
  }
}