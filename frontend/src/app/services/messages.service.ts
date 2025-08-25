import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { finalize } from 'rxjs/operators';
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
  private unreadMessages = new BehaviorSubject<{[userId: string]: boolean}>({});

  getMessageState = this.messageState.asReadonly();
  getTypingUsers = () => this.typingUsers.asObservable();
  getOnlineUsers = () => this.onlineUsers.asObservable();
  getUnreadMessages = () => this.unreadMessages.asObservable();

  setUnreadMessage(userId: string, hasUnread: boolean) {
    const current = this.unreadMessages.value;
    this.unreadMessages.next({ ...current, [userId]: hasUnread });
  }

  clearUnreadMessage(userId: string) {
    const current = this.unreadMessages.value;
    const updated = { ...current };
    delete updated[userId];
    this.unreadMessages.next(updated);
  }

  getOrganizationsWithMembers(): Observable<OrgWithMembers[]> {
    this.messageState.update(s => ({ ...s, loading: true, error: null }));
    return this.http.get<OrgWithMembers[]>(`${this.api}/messages/org-members`).pipe(
      finalize(() => this.messageState.update(s => ({ ...s, loading: false })))
    );
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
    }).pipe(
      finalize(() => this.messageState.update(s => ({ ...s, sending: false })))
    );
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


  // Create group conversation
  createGroup(organizationId: string, name: string, memberIds: string[]): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.api}/messages/group/${organizationId}`, {
      name,
      memberIds,
    });
  }
}
