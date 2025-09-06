import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="messages-widget">
      <div class="header">
        <div class="icon-container">
          <mat-icon>chat</mat-icon>
        </div>
        <div class="title-section">
          <span class="subtitle">Team communication hub</span>
        </div>
      </div>
      
      <div class="chat-overview">
        <div class="unread-section">
          <div class="unread-count">{{ stats().unreadMessages }}</div>
          <div class="unread-label">Unread Messages</div>
          <div class="unread-indicator" [class.has-unread]="stats().unreadMessages > 0"></div>
        </div>
        
        <div class="activity-stats">
          <div class="activity-item">
            <mat-icon class="activity-icon">group</mat-icon>
            <span class="activity-text">{{ stats().activeChats }} Active Chats</span>
          </div>
          <div class="activity-item">
            <mat-icon class="activity-icon">schedule</mat-icon>
            <span class="activity-text">{{ stats().recentMessages }} Recent</span>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <button mat-flat-button color="primary" (click)="openMessages()">
          <mat-icon>forum</mat-icon>
          Open Messages
        </button>
      </div>
    </div>
  `,
  styles: [`
    .messages-widget {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .icon-container {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #2196F3, #42A5F5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .subtitle {
      font-size: 0.9rem;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      font-weight: 500;
    }
    
    .chat-overview {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .unread-section {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, color-mix(in srgb, #2196F3 8%, transparent), color-mix(in srgb, #2196F3 4%, transparent));
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, #2196F3 20%, transparent);
      position: relative;
    }
    
    .unread-count {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2196F3;
      line-height: 1;
    }
    
    .unread-label {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      margin-top: 4px;
    }
    
    .unread-indicator {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ccc;
      transition: all 0.3s ease;
    }
    
    .unread-indicator.has-unread {
      background: #F44336;
      animation: pulse 2s infinite;
    }
    
    .activity-stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .activity-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: color-mix(in srgb, var(--theme-surface) 95%, var(--theme-primary));
      border-radius: 8px;
    }
    
    .activity-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #2196F3;
    }
    
    .activity-text {
      font-size: 0.85rem;
      color: var(--theme-on-surface);
    }
    
    .action-section button {
      width: 100%;
      height: 40px;
      border-radius: 8px;
      font-weight: 500;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
  `]
})
export class MessagesWidgetComponent implements OnInit {
  private router = inject(Router);

  stats = signal({
    unreadMessages: 0,
    activeChats: 0,
    recentMessages: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Mock data
    this.stats.set({
      unreadMessages: 7,
      activeChats: 12,
      recentMessages: 24
    });
  }

  openMessages() {
    this.router.navigate(['/messages']);
  }
}