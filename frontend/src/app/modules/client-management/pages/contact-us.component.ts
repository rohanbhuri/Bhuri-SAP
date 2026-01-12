import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BrandConfigService } from '../../../services/brand-config.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
    FormsModule,
  ],
  template: `
    <div class="contact-us-container">
      <div class="contact-us-header">
        <mat-form-field appearance="outline" class="search-bar">
          <mat-label>Search messages</mat-label>
          <input
            matInput
            [(ngModel)]="searchTerm"
            (input)="filterMessages()"
            placeholder="Search by name or email"
          />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <div class="unread-badge" *ngIf="unreadCount() > 0">
          {{ unreadCount() }} unread
        </div>
      </div>

      <table mat-table [dataSource]="filteredMessages()" class="message-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let msg">{{ msg.name }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let msg">{{ msg.email }}</td>
        </ng-container>

        <ng-container matColumnDef="subject">
          <th mat-header-cell *matHeaderCellDef>Subject</th>
          <td mat-cell *matCellDef="let msg">{{ msg.subject }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let msg">
            <mat-chip [color]="msg.isRead ? 'accent' : 'primary'">
              {{ msg.isRead ? 'Read' : 'Unread' }}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let msg">{{ msg.createdAt | date: 'short' }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let msg">
            <button mat-icon-button [matMenuTriggerFor]="menu" [matMenuTriggerData]="{ msg }">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <ng-template matMenuContent let-msg="msg">
                <button mat-menu-item (click)="viewMessage(msg)">
                  <mat-icon>visibility</mat-icon>
                  <span>View</span>
                </button>
                <button mat-menu-item (click)="markAsRead(msg)" *ngIf="!msg.isRead">
                  <mat-icon>done</mat-icon>
                  <span>Mark as Read</span>
                </button>
                <button mat-menu-item (click)="deleteMessage(msg)">
                  <mat-icon color="warn">delete</mat-icon>
                  <span>Delete</span>
                </button>
              </ng-template>
            </mat-menu>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <div class="empty-state" *ngIf="filteredMessages().length === 0">
        <mat-icon class="empty-icon">mail</mat-icon>
        <h3>No messages</h3>
        <p>No contact messages found.</p>
      </div>
    </div>
  `,
  styles: [`
    .contact-us-container {
      padding: 24px;
    }

    .contact-us-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .search-bar {
      flex: 1;
      max-width: 400px;
    }

    .unread-badge {
      background: var(--theme-primary);
      color: var(--theme-on-primary);
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .message-table {
      width: 100%;
      border-collapse: collapse;
    }

    .message-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      padding: 12px;
      text-align: left;
    }

    .message-table td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }

    mat-chip {
      font-size: 0.75rem;
      height: 24px;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
    }

    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0 0 8px;
    }

    .empty-state p {
      margin: 0;
    }
  `]
})
export class ContactUsComponent implements OnInit {
  private http = inject(HttpClient);
  private brandConfig = inject(BrandConfigService);
  private snackBar = inject(MatSnackBar);

  messages = signal<any[]>([]);
  filteredMessages = signal<any[]>([]);
  unreadCount = signal(0);
  searchTerm = '';
  displayedColumns = ['name', 'email', 'subject', 'status', 'date', 'actions'];

  private get apiUrl() {
    return this.brandConfig.getApiUrl();
  }

  ngOnInit() {
    this.loadMessages();
    this.loadUnreadCount();
  }

  loadMessages() {
    this.http.get<any[]>(`${this.apiUrl}/client-management/contact-us`).subscribe({
      next: (messages) => {
        this.messages.set(messages);
        this.filteredMessages.set(messages);
      },
      error: (error) => {
        console.error('Failed to load messages:', error);
        this.snackBar.open('Failed to load messages', 'Close', { duration: 3000 });
      }
    });
  }

  loadUnreadCount() {
    this.http.get<{ count: number }>(`${this.apiUrl}/client-management/contact-us/unread-count`).subscribe({
      next: (result) => this.unreadCount.set(result.count),
      error: (error) => console.error('Failed to load unread count:', error)
    });
  }

  filterMessages() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.messages().filter(
      (msg) =>
        msg.name.toLowerCase().includes(term) ||
        msg.email.toLowerCase().includes(term) ||
        msg.subject.toLowerCase().includes(term)
    );
    this.filteredMessages.set(filtered);
  }

  viewMessage(message: any) {
    if (!message.isRead) {
      this.markAsRead(message);
    }
    alert(`From: ${message.name} (${message.email})\n\nSubject: ${message.subject}\n\nMessage:\n${message.message}`);
  }

  markAsRead(message: any) {
    this.http.put(`${this.apiUrl}/client-management/contact-us/${message._id}/read`, {}).subscribe({
      next: () => {
        message.isRead = true;
        this.loadUnreadCount();
        this.snackBar.open('Marked as read', 'Close', { duration: 2000 });
      },
      error: (error) => {
        console.error('Failed to mark as read:', error);
        this.snackBar.open('Failed to mark as read', 'Close', { duration: 3000 });
      }
    });
  }

  deleteMessage(message: any) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.http.delete(`${this.apiUrl}/client-management/contact-us/${message._id}`).subscribe({
        next: () => {
          this.loadMessages();
          this.loadUnreadCount();
          this.snackBar.open('Message deleted', 'Close', { duration: 2000 });
        },
        error: (error) => {
          console.error('Failed to delete message:', error);
          this.snackBar.open('Failed to delete message', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
