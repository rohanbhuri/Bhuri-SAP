import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import {
  MessagesApiService,
  OrgWithMembers,
} from '../../services/messages.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    NavbarComponent,
    BottomNavbarComponent,

    DatePipe,
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="layout">
      <!-- Left Sidebar: Organizations & Members -->
      <div class="sidebar">
        <div class="sidebar-header">
          <div class="title">
            Messages <span class="badge">{{ totalMembers() }}</span>
          </div>
          <button mat-raised-button color="primary" class="compose">
            <mat-icon>add</mat-icon>
            Compose
          </button>
        </div>
        <mat-form-field appearance="outline" class="search-box">
          <mat-label>Search</mat-label>
          <input
            matInput
            [(ngModel)]="query"
            placeholder="Search people or groups"
          />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-accordion class="org-accordion" multi>
          <mat-expansion-panel *ngFor="let org of orgs()">
            <mat-expansion-panel-header>
              <mat-panel-title class="org-header">
                <div class="org-avatar">
                  {{ getOrgInitials(org.organizationName) }}
                </div>
                <span class="org-name">{{ org.organizationName }}</span>
              </mat-panel-title>
            </mat-expansion-panel-header>

            <div class="member" *ngFor="let m of filteredMembers(org)">
              <img class="avatar" [src]="avatarUrl(m.email)" alt="avatar" />
              <div class="meta" (click)="openDM(org.organizationId, m.id)">
                <div class="name">{{ m.firstName }} {{ m.lastName }}</div>
                <div class="preview">Tap to chat</div>
              </div>
              <div class="dot" aria-hidden="true"></div>
            </div>
          </mat-expansion-panel>
        </mat-accordion>
      </div>

      <!-- Right Chat Pane -->
      <div class="chat-pane">
        <mat-card class="chat-card" *ngIf="activeConversationId(); else empty">
          <mat-card-header>
            <div class="chat-header">
              <div class="chat-title">{{ activeTitle() }}</div>
              <div class="chat-actions">
                <button mat-icon-button><mat-icon>more_vert</mat-icon></button>
              </div>
            </div>
          </mat-card-header>
          <mat-card-content>
            <div class="message-list">
              <!-- Date divider example -->
              <div class="date-divider" *ngIf="messages().length">
                <span>{{ messages()[0]?.createdAt | date : 'fullDate' }}</span>
              </div>

              <div
                *ngFor="let msg of messages()"
                class="message"
                [class.self]="isSelf(msg.senderId)"
              >
                <div class="bubble">
                  <div class="sender" *ngIf="!isSelf(msg.senderId)">
                    {{ msg.senderName || 'User' }}
                  </div>
                  <div class="content">{{ msg.content }}</div>
                  <div class="time">
                    {{ msg.createdAt | date : 'shortTime' }}
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
          <div class="composer">
            <button mat-icon-button color="primary" class="plus" title="Add">
              <mat-icon>add</mat-icon>
            </button>
            <mat-form-field appearance="outline" class="input">
              <mat-label>Message</mat-label>
              <input matInput [(ngModel)]="draft" (keyup.enter)="send()" />
            </mat-form-field>
            <button
              mat-icon-button
              color="primary"
              (click)="send()"
              title="Send"
            >
              <mat-icon>send</mat-icon>
            </button>
            <button mat-icon-button title="Voice">
              <mat-icon>mic</mat-icon>
            </button>
          </div>
        </mat-card>
        <ng-template #empty>
          <div class="empty-state">
            <mat-icon>chat</mat-icon>
            <div>Select a conversation to start chatting</div>
          </div>
        </ng-template>
      </div>
    </div>

    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [
    `
      .layout {
        display: grid;
        grid-template-columns: 340px 1fr;
        height: calc(100vh - 120px);
        gap: 16px;
        padding: 16px;
      }
      @media (max-width: 900px) {
        .layout {
          grid-template-columns: 1fr;
        }
        .sidebar {
          order: 2;
        }
        .chat-pane {
          order: 1;
        }
      }

      .sidebar {
        background: #fff;
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        overflow: auto;
      }
      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 4px 16px;
      }
      .title {
        font-weight: 600;
        font-size: 18px;
      }
      .badge {
        background: #eef2ff;
        color: #4338ca;
        border-radius: 999px;
        padding: 2px 8px;
        font-size: 12px;
        margin-left: 6px;
      }
      .compose {
        height: 36px;
        border-radius: 8px;
      }
      .search-box {
        width: 100%;
      }
      .org-accordion {
        margin-top: 8px;
      }
      .org-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .org-avatar {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 12px;
      }
      .org-name {
        font-weight: 600;
        font-size: 14px;
      }

      .member {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 8px;
        border-radius: 8px;
        cursor: pointer;
      }
      .member:hover {
        background: #f9fafb;
      }
      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
      }
      .meta {
        flex: 1;
      }
      .name {
        font-weight: 600;
        font-size: 14px;
      }
      .preview {
        color: #6b7280;
        font-size: 12px;
      }
      .dot {
        width: 8px;
        height: 8px;
        background: #7c3aed;
        border-radius: 50%;
      }

      .chat-pane {
        min-height: 0;
      }
      .chat-card {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .chat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
      .chat-title {
        font-weight: 600;
        font-size: 16px;
      }

      .message-list {
        flex: 1;
        overflow: auto;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .date-divider {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        font-size: 12px;
        position: relative;
        margin: 8px 0;
      }
      .date-divider::before,
      .date-divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #e5e7eb;
        margin: 0 8px;
      }

      .message {
        display: flex;
      }
      .message.self {
        justify-content: flex-end;
      }
      .bubble {
        max-width: 70%;
        background: #f3f4f6;
        border-radius: 12px;
        padding: 8px 12px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      }
      .message.self .bubble {
        background: #e0e7ff;
      }
      .sender {
        font-weight: 600;
        font-size: 12px;
        color: #374151;
        margin-bottom: 2px;
      }
      .content {
        font-size: 14px;
      }
      .time {
        font-size: 11px;
        color: #6b7280;
        margin-top: 2px;
        text-align: right;
      }

      .composer {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        border-top: 1px solid #e5e7eb;
      }
      .input {
        flex: 1;
      }
      .empty-state {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #6b7280;
      }
    `,
  ],
})
export class MessagesComponent {
  private api = inject(MessagesApiService);
  private auth = inject(AuthService);

  orgs = signal<OrgWithMembers[]>([]);
  activeConversationId = signal<string | null>(null);
  messages = signal<any[]>([]);
  activeTitle = signal<string>('');
  draft = '';
  query = '';
  meId: string | null = null;

  ngOnInit() {
    // Load me
    this.meId = this.auth.getCurrentUser()?.id || null;

    // Load orgs and members
    this.api
      .getOrganizationsWithMembers()
      .subscribe((data) => this.orgs.set(data));
  }

  totalMembers = computed(() =>
    this.orgs().reduce((acc, o) => acc + o.members.length, 0)
  );

  filteredMembers(org: OrgWithMembers) {
    const q = (this.query || '').toLowerCase().trim();
    if (!q) return org.members;
    return org.members.filter((m) =>
      `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(q)
    );
  }

  isSelf(senderId: string) {
    return !!this.meId && String(senderId) === String(this.meId);
  }

  avatarUrl(email: string) {
    const hash = encodeURIComponent(email || 'user');
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  }

  getOrgInitials(orgName: string): string {
    if (!orgName) return 'ORG';
    return orgName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  openDM(orgId: string, otherUserId: string) {
    this.api.getOrCreateDM(orgId, otherUserId).subscribe((conv: any) => {
      this.activeConversationId.set(String((conv as any)._id));
      const member = this.orgs()
        .flatMap((o) => o.members)
        .find((m) => String(m.id) === String(otherUserId));
      this.activeTitle.set(
        member ? `${member.firstName} ${member.lastName}` : 'Direct Message'
      );
      this.loadMessages();
    });
  }

  loadMessages() {
    const id = this.activeConversationId();
    if (!id) return;
    this.api
      .listMessages(id, 50)
      .subscribe((msgs) => this.messages.set(msgs.reverse()));
  }

  send() {
    const id = this.activeConversationId();
    if (!id || !this.draft.trim()) return;
    const content = this.draft;
    this.draft = '';
    this.api.sendMessage(id, content).subscribe((msg) => {
      this.messages.update((m) => [...m, msg]);
    });
  }
}
