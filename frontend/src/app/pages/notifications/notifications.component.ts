import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { NotificationsService, Notification } from '../../services/notifications.service';
import { ModulesService } from '../../services/modules.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatBadgeModule, MatDividerModule, NavbarComponent, BottomNavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Pages</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">Notifications</span>
        </nav>
        <h1>Notifications</h1>
        <p class="subtitle">Stay updated with your latest activities</p>
      </div>

      <div class="notifications-container">
        @for (notification of notifications(); track notification._id) {
          <div class="notification-card" [class.unread]="!notification.isRead" (click)="handleNotificationClick(notification)">
            <div class="notification-icon">
              <mat-icon [class]="getNotificationIconClass(notification.type)">{{ getNotificationIcon(notification.type) }}</mat-icon>
            </div>
            <div class="notification-content">
              <div class="notification-header">
                <h3 class="notification-title">{{ notification.title }}</h3>
                <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
              </div>
              <p class="notification-message">{{ notification.message }}</p>
              @if (notification.type === 'module_request') {
                <div class="notification-actions">
                  <button mat-raised-button color="primary" (click)="approveRequest(notification, $event)">
                    <mat-icon>check</mat-icon>
                    Approve
                  </button>
                  <button mat-stroked-button color="warn" (click)="rejectRequest(notification, $event)">
                    <mat-icon>close</mat-icon>
                    Reject
                  </button>
                </div>
              }
            </div>
            @if (!notification.isRead) {
              <div class="unread-indicator"></div>
            }
          </div>
        }
        @if (notifications().length === 0) {
          <div class="empty-state">
            <mat-icon class="empty-icon">notifications_none</mat-icon>
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        }
      </div>
    </div>
    
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .page { padding: 24px; max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .breadcrumb { display: inline-flex; align-items: center; gap: 6px; color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent); font-size: 0.9rem; margin-bottom: 8px; }
    .breadcrumb .current { color: var(--theme-on-surface); }
    h1 { margin: 0 0 6px; font-weight: 600; }
    .subtitle { color: color-mix(in srgb, var(--theme-on-surface) 65%, transparent); margin: 0; }
    .notifications-container { display: flex; flex-direction: column; gap: 12px; }
    .notification-card { display: flex; align-items: flex-start; gap: 16px; padding: 16px; background: var(--theme-surface); border: 1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent); border-radius: 12px; cursor: pointer; transition: all 0.2s ease; position: relative; }
    .notification-card:hover { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); transform: translateY(-1px); }
    .notification-card.unread { border-left: 4px solid var(--theme-primary); background: color-mix(in srgb, var(--theme-primary) 3%, var(--theme-surface)); }
    .notification-icon { flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .notification-icon mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .icon-approved { background: color-mix(in srgb, #4caf50 15%, transparent); color: #2e7d32; }
    .icon-rejected { background: color-mix(in srgb, #f44336 15%, transparent); color: #c62828; }
    .icon-request { background: color-mix(in srgb, #ff9800 15%, transparent); color: #ef6c00; }
    .icon-system { background: color-mix(in srgb, #2196f3 15%, transparent); color: #1565c0; }
    .icon-message { background: color-mix(in srgb, #9c27b0 15%, transparent); color: #7b1fa2; }
    .notification-content { flex: 1; min-width: 0; }
    .notification-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
    .notification-title { margin: 0; font-size: 1rem; font-weight: 600; color: var(--theme-on-surface); }
    .notification-time { font-size: 0.8rem; color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent); white-space: nowrap; }
    .notification-message { margin: 0 0 12px; color: color-mix(in srgb, var(--theme-on-surface) 80%, transparent); line-height: 1.4; }
    .notification-actions { display: flex; gap: 8px; }
    .notification-actions button { font-size: 0.8rem; height: 32px; }
    .unread-indicator { position: absolute; top: 16px; right: 16px; width: 8px; height: 8px; background: var(--theme-primary); border-radius: 50%; }
    .empty-state { text-align: center; padding: 48px 24px; color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent); }
    .empty-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5; }
    .empty-state h3 { margin: 0 0 8px; color: var(--theme-on-surface); }
    .empty-state p { margin: 0; }
  `]
})
export class NotificationsComponent {
  private notificationsService = inject(NotificationsService);
  private modulesService = inject(ModulesService);
  private router = inject(Router);
  
  notifications = signal<Notification[]>([]);

  ngOnInit() {
    this.loadNotifications();
    this.subscribeToRealTimeUpdates();
  }

  loadNotifications() {
    this.notificationsService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications.set(notifications);
      },
      error: (error) => {
        console.error('Failed to load notifications:', error);
      }
    });
  }

  subscribeToRealTimeUpdates() {
    // Subscribe to real-time notification updates
    this.notificationsService.notifications$.subscribe(notifications => {
      this.notifications.set(notifications);
    });
  }

  handleNotificationClick(notification: Notification) {
    if (!notification.isRead) {
      this.markAsRead(notification);
    }
    
    if (notification.type === 'message') {
      // Navigate to messages page and optionally open specific conversation
      if (notification.data?.conversationId) {
        this.router.navigate(['/messages'], {
          queryParams: { conversation: notification.data.conversationId }
        });
      } else {
        this.router.navigate(['/messages']);
      }
    }
  }

  markAsRead(notification: Notification) {
    this.notificationsService.markAsRead(notification._id).subscribe(() => {
      const updated = this.notifications().map(n => 
        n._id === notification._id ? { ...n, isRead: true } : n
      );
      this.notifications.set(updated);
    });
  }

  approveRequest(notification: Notification, event: Event) {
    event.stopPropagation();
    if (notification.data?.requestId) {
      this.modulesService.approveRequest(notification.data.requestId).subscribe(() => {
        this.removeNotification(notification._id);
      });
    }
  }

  rejectRequest(notification: Notification, event: Event) {
    event.stopPropagation();
    if (notification.data?.requestId) {
      this.modulesService.rejectRequest(notification.data.requestId).subscribe(() => {
        this.removeNotification(notification._id);
      });
    }
  }

  removeNotification(id: string) {
    const updated = this.notifications().filter(n => n._id !== id);
    this.notifications.set(updated);
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'module_approved': 'check_circle',
      'module_rejected': 'cancel',
      'module_request': 'request_page',
      'system': 'info',
      'message': 'message'
    };
    return icons[type] || 'notifications';
  }

  getNotificationIconClass(type: string): string {
    const classes: { [key: string]: string } = {
      'module_approved': 'icon-approved',
      'module_rejected': 'icon-rejected',
      'module_request': 'icon-request',
      'system': 'icon-system',
      'message': 'icon-message'
    };
    return classes[type] || 'icon-system';
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  }
}