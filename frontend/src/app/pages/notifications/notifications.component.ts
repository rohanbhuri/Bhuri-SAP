import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { ThemeService } from '../../services/theme.service';
import { NotificationsService, Notification } from '../../services/notifications.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    MatSnackBarModule,
    NavbarComponent,
    BottomNavbarComponent,
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="notifications-container">
      <div class="header">
        <div class="title-section">
          <h1>Notifications</h1>
          <span class="total-count" *ngIf="notifications().length > 0">({{ notifications().length }})</span>
        </div>
        <div class="actions">
          <span class="unread-count" *ngIf="unreadCount() > 0">{{ unreadCount() }} unread</span>
          <button mat-icon-button matTooltip="Mark all as read" [disabled]="unreadCount() === 0" (click)="markAllAsRead()">
            <mat-icon>done_all</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Refresh" (click)="refreshNotifications()">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </div>

      <div class="notifications-list">
        <div *ngIf="loading()" class="loading">
          <mat-spinner diameter="32"></mat-spinner>
        </div>

        <div *ngIf="!loading() && notifications().length === 0" class="empty">
          <mat-icon>notifications_none</mat-icon>
          <p>No notifications</p>
        </div>

        <div *ngFor="let n of notifications(); trackBy: trackByNotificationId"
             class="notification"
             [class.unread]="!n.isRead"
             (click)="handleNotificationClick(n)">
          
          <mat-icon class="icon" [class]="'icon-' + n.type">{{ getNotificationIcon(n.type) }}</mat-icon>
          
          <div class="content">
            <div class="title">{{ n.title }}</div>
            <div class="message">{{ n.message }}</div>
            <div class="meta">
              <span class="type">{{ getTypeLabel(n.type) }}</span>
              <span class="time">{{ getRelativeTime(n.createdAt) }}</span>
            </div>
          </div>

          <button mat-icon-button [matMenuTriggerFor]="menu" (click)="$event.stopPropagation()" class="menu-btn">
            <mat-icon>more_vert</mat-icon>
          </button>

          <mat-menu #menu="matMenu">
            <button mat-menu-item *ngIf="!n.isRead" (click)="markAsRead(n)">
              <mat-icon>done</mat-icon>
              Mark as read
            </button>
            <button mat-menu-item *ngIf="n.type === 'message'" (click)="openMessage(n)">
              <mat-icon>chat</mat-icon>
              Open message
            </button>
            <button mat-menu-item (click)="deleteNotification(n)">
              <mat-icon>delete</mat-icon>
              Delete
            </button>
          </mat-menu>
        </div>
      </div>
    </div>

    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private notificationsService = inject(NotificationsService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  // Signals
  notifications = signal<Notification[]>([]);
  loading = signal(false);
  unreadCount = this.notificationsService.unreadCount;



  ngOnInit() {
    this.themeService.applyModuleTheme('notifications');
    this.loadNotifications();
    this.setupRealtimeUpdates();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadNotifications() {
    this.loading.set(true);
    this.notificationsService.getNotifications(1000, 0, false)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notifications) => {
          this.notifications.set(notifications);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Failed to load notifications:', error);
          this.loading.set(false);
          this.snackBar.open('Failed to load notifications', 'Retry', { duration: 3000 })
            .onAction().subscribe(() => this.loadNotifications());
        }
      });
  }

  setupRealtimeUpdates() {
    this.notificationsService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications.set(notifications);
      });
  }

  handleNotificationClick(notification: Notification) {
    if (notification.type === 'message') {
      this.openMessage(notification);
    } else {
      this.markAsRead(notification);
    }
  }

  markAsRead(notification: Notification) {
    if (!notification.isRead) {
      this.notificationsService.markAsRead(notification._id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (error) => {
            console.error('Failed to mark notification as read:', error);
          }
        });
    }
  }

  markAllAsRead() {
    this.notificationsService.markAllAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.snackBar.open('All marked as read', 'Close', { duration: 2000 }),
        error: () => this.snackBar.open('Failed to mark all as read', 'Close', { duration: 3000 })
      });
  }

  deleteNotification(notification: Notification) {
    this.notificationsService.deleteNotification(notification._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.snackBar.open('Deleted', 'Close', { duration: 2000 }),
        error: () => this.snackBar.open('Failed to delete', 'Close', { duration: 3000 })
      });
  }

  openMessage(notification: Notification) {
    if (notification.type === 'message' && notification.data?.conversationId) {
      this.markAsRead(notification);
      this.router.navigate(['/messages'], {
        queryParams: { conversation: notification.data.conversationId }
      });
    }
  }

  refreshNotifications() {
    this.loadNotifications();
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'message': return 'chat';
      case 'module_request': return 'extension';
      case 'module_approved': return 'check_circle';
      case 'module_rejected': return 'cancel';
      case 'system': return 'info';
      default: return 'notifications';
    }
  }



  getTypeLabel(type: string): string {
    switch (type) {
      case 'message': return 'Message';
      case 'module_request': return 'Module Request';
      case 'module_approved': return 'Approved';
      case 'module_rejected': return 'Rejected';
      case 'system': return 'System';
      default: return 'Notification';
    }
  }

  getRelativeTime(date: string): string {
    const now = new Date().getTime();
    const then = new Date(date).getTime();
    const diff = now - then;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  trackByNotificationId = (index: number, notification: Notification) => notification._id;
}