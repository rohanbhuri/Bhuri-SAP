import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BrandConfigService } from './brand-config.service';
import { WebSocketService } from './websocket.service';

export interface Notification {
  _id: string;
  type: 'module_request' | 'module_approved' | 'module_rejected' | 'system' | 'message';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: {
    messageId?: string;
    conversationId?: string;
    senderId?: string;
    senderName?: string;
    organizationId?: string;
    requestId?: string;
    moduleId?: string;
    [key: string]: any;
  };
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  private wsService = inject(WebSocketService);
  
  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  // Reactive state
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  
  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();
  
  // Signals for reactive UI
  unreadCount = signal<number>(0);
  hasUnread = signal<boolean>(false);

  constructor() {
    this.setupWebSocketListeners();
    this.loadInitialData();
  }

  private setupWebSocketListeners() {
    this.wsService.getMessages().subscribe(message => {
      if (message?.type === 'notification:new') {
        this.handleNewNotification(message.payload);
      } else if (message?.type === 'notification:count') {
        this.updateUnreadCount(message.payload.count);
      }
    });
  }

  private loadInitialData() {
    this.getUnreadCount().subscribe();
    this.getNotifications().subscribe();
  }

  private handleNewNotification(payload: any) {
    if (payload?.notification) {
      // Add new notification to the list
      const currentNotifications = this.notificationsSubject.value;
      const updatedNotifications = [payload.notification, ...currentNotifications];
      this.notificationsSubject.next(updatedNotifications);
      
      // Update unread count
      this.getUnreadCount().subscribe();
      
      // Show browser notification if supported
      this.showBrowserNotification(payload.notification);
    }
  }

  private updateUnreadCount(count: number) {
    this.unreadCountSubject.next(count);
    this.unreadCount.set(count);
    this.hasUnread.set(count > 0);
  }

  private showBrowserNotification(notification: Notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const options: NotificationOptions = {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification._id,
        requireInteraction: false,
        silent: false
      };

      const browserNotification = new Notification(notification.title, options);
      
      // Auto close after 5 seconds
      setTimeout(() => browserNotification.close(), 5000);
      
      // Handle click to navigate to relevant page
      browserNotification.onclick = () => {
        window.focus();
        if (notification.type === 'message') {
          // Navigate to messages page
          window.location.href = '/messages';
        }
        browserNotification.close();
      };
    }
  }

  requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return Notification.requestPermission();
    }
    return Promise.resolve('denied');
  }

  getNotifications(limit = 50, skip = 0, unreadOnly = false): Observable<Notification[]> {
    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('skip', skip.toString());
    if (unreadOnly) params.set('unreadOnly', 'true');

    return this.http
      .get<Notification[]>(`${this.apiUrl}/notifications?${params.toString()}`)
      .pipe(
        tap(notifications => this.notificationsSubject.next(notifications)),
        catchError(() => of([]))
      );
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http
      .get<{ count: number }>(`${this.apiUrl}/notifications/count`)
      .pipe(
        tap(response => this.updateUnreadCount(response.count)),
        catchError(() => of({ count: 0 }))
      );
  }

  getMessageNotifications(conversationId?: string): Observable<Notification[]> {
    const params = conversationId ? `?conversationId=${conversationId}` : '';
    return this.http
      .get<Notification[]>(`${this.apiUrl}/notifications/messages${params}`)
      .pipe(catchError(() => of([])));
  }

  markAsRead(id: string): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/notifications/${id}/read`, {})
      .pipe(
        tap(() => {
          // Update local state
          const notifications = this.notificationsSubject.value.map(n =>
            n._id === id ? { ...n, isRead: true } : n
          );
          this.notificationsSubject.next(notifications);
          
          // Refresh unread count
          this.getUnreadCount().subscribe();
        }),
        catchError(() => of({ success: true }))
      );
  }

  markAllAsRead(): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/notifications/read-all`, {})
      .pipe(
        tap(() => {
          // Update local state
          const notifications = this.notificationsSubject.value.map(n => ({ ...n, isRead: true }));
          this.notificationsSubject.next(notifications);
          this.updateUnreadCount(0);
        }),
        catchError(() => of({ success: true }))
      );
  }

  markConversationAsRead(conversationId: string): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/notifications/conversation/${conversationId}/read`, {})
      .pipe(
        tap(() => {
          // Update local state for message notifications from this conversation
          const notifications = this.notificationsSubject.value.map(n =>
            n.type === 'message' && n.data?.conversationId === conversationId
              ? { ...n, isRead: true }
              : n
          );
          this.notificationsSubject.next(notifications);
          
          // Refresh unread count
          this.getUnreadCount().subscribe();
        }),
        catchError(() => of({ success: true }))
      );
  }

  deleteNotification(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/notifications/${id}`)
      .pipe(
        tap(() => {
          // Remove from local state
          const notifications = this.notificationsSubject.value.filter(n => n._id !== id);
          this.notificationsSubject.next(notifications);
          
          // Refresh unread count
          this.getUnreadCount().subscribe();
        }),
        catchError(() => of({ success: true }))
      );
  }

  // Utility methods
  getUnreadMessageCount(): number {
    return this.notificationsSubject.value.filter(n =>
      n.type === 'message' && !n.isRead
    ).length;
  }

  getUnreadNotificationsByType(type: Notification['type']): Notification[] {
    return this.notificationsSubject.value.filter(n =>
      n.type === type && !n.isRead
    );
  }
}