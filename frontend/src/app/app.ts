import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { BrandConfigService } from './services/brand-config.service';
import { PwaService } from './services/pwa.service';
import { PwaUpdateAlertComponent } from './components/pwa-update-alert.component';
import { WebSocketService } from './services/websocket.service';
import { MessagesApiService } from './services/messages.service';
import { NotificationSoundService } from './services/notification-sound.service';
import { XrmTrainerPanelComponent } from './components/xrm-trainer-panel.component';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, XrmTrainerPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private brandConfigService = inject(BrandConfigService);
  private pwaService = inject(PwaService);
  private wsService = inject(WebSocketService);
  private messagesService = inject(MessagesApiService);
  private notificationSoundService = inject(NotificationSoundService); // Initialize global sound service
  private snackBar = inject(MatSnackBar);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    // Apply brand colors to CSS variables (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const colors = this.brandConfigService.getColors();
      document.documentElement.style.setProperty('--primary-color', colors.primary);
      document.documentElement.style.setProperty('--accent-color', colors.accent);
      document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    }

    // Subscribe to user changes and apply theme accordingly
    this.authService.currentUser$.pipe(delay(100)).subscribe((user) => {
      if (user && this.authService.getToken()) {
        console.log('User changed:', user);
        this.themeService.loadAndApplyUserTheme();
        
        // Initialize WebSocket connection when user is authenticated
        if (isPlatformBrowser(this.platformId)) {
          this.wsService.connectWithAuth(user, this.authService.getToken());
          
          // Set up global event tracking
          this.wsService.getMessages().subscribe(msg => {
            console.log('App component received WebSocket message:', msg);
            
            // Handle MESSAGE events (for message badge)
            if (msg?.type === 'message:count' && msg?.payload?.count !== undefined) {
              console.log('Backend sent message count:', msg.payload.count, '- ignoring and fetching correct count');
              // Backend count is wrong, fetch correct count
              this.messagesService.getUnreadCount().subscribe({
                next: (counts) => {
                  const totalUnread = Object.values(counts).reduce((sum, count) => sum + (count as number), 0);
                  console.log('Fetched correct unread count:', totalUnread);
                  this.messagesService.setMessageCount(totalUnread);
                },
                error: (err) => console.error('Failed to fetch correct message count:', err)
              });
            }
            
            // Handle NOTIFICATION events (for notification badge)
            else if (msg?.type === 'notification:new') {
              console.log('Received notification, updating notification badge');
              // Notification badge is handled by NotificationsService automatically
            }
            else if (msg?.type === 'notification:count' && msg?.payload?.count !== undefined) {
              console.log('Received notification count:', msg.payload.count);
              // Notification count is handled by NotificationsService automatically
            }
            
            // TEMPORARY: Use notification:new for message count until backend is fixed
            else if (msg?.type === 'notification:new' && msg?.payload?.notification?.type === 'message') {
              console.log('Received message notification, fetching updated count');
              // Fetch updated count from backend
              this.messagesService.getUnreadCount().subscribe({
                next: (counts) => {
                  const totalUnread = Object.values(counts).reduce((sum, count) => sum + (count as number), 0);
                  this.messagesService.setMessageCount(totalUnread);
                },
                error: (err) => console.error('Failed to fetch updated message count:', err)
              });
            }
          });
          
          // Fetch initial message count after a short delay to ensure socket is connected
          setTimeout(() => {
            this.messagesService.getUnreadCount().subscribe({
              next: (counts) => {
                const totalUnread = Object.values(counts).reduce((sum, count) => sum + (count as number), 0);
                this.messagesService.setMessageCount(totalUnread);
              },
              error: (err) => console.error('Failed to fetch initial message count:', err)
            });
          }, 500);
        }
      } else {
        this.themeService.applyTheme();
        // Disconnect WebSocket when user logs out
        if (isPlatformBrowser(this.platformId)) {
          this.wsService.disconnect();
          this.messagesService.setMessageCount(0);
        }
      }
    });

    // Handle PWA updates
    if (isPlatformBrowser(this.platformId)) {
      this.pwaService.updateAvailable$.subscribe((updateAvailable) => {
        if (updateAvailable) {
          this.showUpdateAlert();
        }
      });
    }
  }

  private showUpdateAlert() {
    this.snackBar.openFromComponent(PwaUpdateAlertComponent, {
      duration: 0,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['pwa-update-snackbar']
    });
  }
}
