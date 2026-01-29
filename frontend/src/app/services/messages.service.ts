import { Injectable, inject, signal, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BrandConfigService } from './brand-config.service';
import { WebSocketService } from './websocket.service';
import { AuthService } from './auth.service';

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
  memberIds: string[];
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
  public initialLoadHandled = false;

  private http = inject(HttpClient);
  private brand = inject(BrandConfigService);
  private injector = inject(Injector);
  private get api() {
    return this.brand.getApiUrl();
  }

  // Merged from MessageCountService
  private wsService = inject(WebSocketService);
  messageCount = signal<number>(0);
  private onlineUsers = signal<Set<string>>(new Set());

  constructor() {
    this.setupSocketListeners();
    this.listenToAuthChanges();
  }

  private listenToAuthChanges() {
    try {
      const authService = this.injector.get(AuthService);
      authService.currentUser$.subscribe(user => {
        if (user) {
          this.fetchInitialUnreadCount();
        } else {
          this.setMessageCount(0);
        }
      });
    } catch (e) {
      console.warn('AuthService not available for subscription');
    }
  }

  private setupSocketListeners() {
    this.wsService.getMessages().subscribe(message => {
      if (message?.type === 'message:count') {
        this.setMessageCount(message.payload.count);
      } else if (message?.type === 'user:online') {
        this.onlineUsers.update(users => {
          const newSet = new Set(users);
          newSet.add(message.payload.userId);
          return newSet;
        });
      } else if (message?.type === 'user:offline') {
        this.onlineUsers.update(users => {
          const newSet = new Set(users);
          newSet.delete(message.payload.userId);
          return newSet;
        });
      }
    });

    // Fetch count when socket connects
    this.wsService.getConnectionStatus().subscribe(connected => {
      if (connected) {
        this.fetchInitialUnreadCount();
      }
    });
  }

  private fetchInitialUnreadCount() {
    let authService: AuthService;
    try {
      authService = this.injector.get(AuthService);
    } catch (e) {
      console.warn('AuthService not available yet');
      return;
    }

    if (!authService.isAuthenticated()) {
      return;
    }

    this.getUnreadCount().subscribe({
      next: (counts) => {
        const totalUnread = Object.values(counts).reduce((sum, count) => sum + (count as number), 0);
        this.setMessageCount(totalUnread);
      },
      error: (err) => {
        if (err.status !== 401) {
          console.error('Failed to fetch initial unread count:', err);
        }
      }
    });
  }

  setMessageCount(count: number) {
    this.messageCount.set(count);
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers().has(userId);
  }

  // Merged from MessagesUtilsService
  getOrgInitials(orgName: string): string {
    if (!orgName) return 'ORG';
    return orgName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  getOrgGradient(orgName: string): string {
    const colors = ['#667eea,#764ba2', '#f093fb,#f5576c', '#4facfe,#00f2fe', '#43e97b,#38f9d7'];
    const index = orgName.length % colors.length;
    return `linear-gradient(135deg, ${colors[index]})`;
  }

  avatarUrl(email: string): string {
    const hash = encodeURIComponent(email || 'user');
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=40`;
  }

  filterMembers(members: any[], query: string) {
    if (!query.trim()) return members;
    const q = query.toLowerCase();
    return members.filter(m =>
      `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(q)
    );
  }

  getAttachmentIcon(type: string): string {
    if (type.startsWith('image/')) return 'image';
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('document') || type.includes('word')) return 'description';
    return 'attach_file';
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'sending': return 'schedule';
      case 'sent': return 'check';
      case 'delivered': return 'done_all';
      case 'read': return 'done_all';
      default: return 'check';
    }
  }

  // State management
  private messageState = signal<MessageState>({ loading: false, error: null, sending: false });
  private typingUsers = new BehaviorSubject<{ [conversationId: string]: string[] }>({});
  private unreadMessages = new BehaviorSubject<{ [userId: string]: boolean }>({});

  getMessageState = this.messageState.asReadonly();
  getTypingUsers = () => this.typingUsers.asObservable();
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
    return this.http.post<void>(`${this.api}/messages/chat/${conversationId}/read`, {}).pipe(
      finalize(() => {
        // Fetch updated unread count after marking as read
        this.getUnreadCount().subscribe(counts => {
          const totalUnread = Object.values(counts).reduce((sum, count) => sum + (count as number), 0);
          this.setMessageCount(totalUnread);
        });
      })
    );
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

  getUnreadCount(): Observable<{ [conversationId: string]: number }> {
    return this.http.get<{ [conversationId: string]: number }>(`${this.api}/messages/unread-count`);
  }
}
