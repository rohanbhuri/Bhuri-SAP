import { Component, signal, computed, inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { ThemeService } from '../../services/theme.service';
import {
  MessagesApiService,
  OrgWithMembers,
  Message,
  MessageState,
  Conversation,
} from '../../services/messages.service';
import { AuthService } from '../../services/auth.service';
import { WebSocketService } from '../../services/websocket.service';
import { NotificationsService } from '../../services/notifications.service';
import { Subject, debounceTime, takeUntil, finalize, filter } from 'rxjs';
import { CreateGroupDialogComponent } from './create-group-dialog.component';
import { DirectMessageDialogComponent } from './direct-message-dialog.component';
import { MessageCountService } from '../../services/message-count.service';

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
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatListModule,
    MatDividerModule,
    TextFieldModule,
    NavbarComponent,
    BottomNavbarComponent,
    DatePipe,
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="layout">
      <!-- Left Sidebar: Organizations & Members -->
      <div class="sidebar" [class.hidden]="isMobileView() && !showSidebar()">
        <div class="sidebar-header">
          <div class="title">
            <h1>Messages</h1>
          </div>
          <button 
            mat-icon-button 
            [matMenuTriggerFor]="messagesMenu"
            [disabled]="messageState().loading"
            aria-label="Messages menu">
            <mat-icon>more_vert</mat-icon>
          </button>
        </div>

        <mat-form-field appearance="outline" class="search-box">
          <mat-label>Search people or groups</mat-label>
          <input
            matInput
            [(ngModel)]="query"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Type to search..."
            aria-label="Search conversations"
          />
          <mat-icon matSuffix>search</mat-icon>
          <mat-spinner matSuffix diameter="20" *ngIf="searchLoading()"></mat-spinner>
        </mat-form-field>

        <!-- Loading State -->
        <div class="loading-state" *ngIf="messageState().loading">
          <mat-spinner diameter="32"></mat-spinner>
          <span>Loading conversations...</span>
        </div>

        <!-- Error State -->
        <div class="error-state" *ngIf="messageState().error" role="alert">
          <mat-icon color="warn">error</mat-icon>
          <span>{{ messageState().error }}</span>
          <button mat-button color="primary" (click)="loadOrganizations()">Retry</button>
        </div>

        <!-- Organizations List -->
        <mat-accordion class="org-accordion" multi *ngIf="!messageState().loading && !messageState().error">
          <mat-expansion-panel *ngFor="let org of orgs(); trackBy: trackByOrgId">
            <mat-expansion-panel-header>
              <mat-panel-title class="org-header">
                <div class="org-avatar" [style.background]="getOrgGradient(org.organizationName)">
                  {{ getOrgInitials(org.organizationName) }}
                </div>
                <div class="org-info">
                  <span class="org-name">{{ org.organizationName }}</span>
                  <span class="member-count">{{ org.members.length }} members</span>
                </div>
                <div class="unread-indicator" *ngIf="org.unreadCount" 
                     [matBadge]="org.unreadCount" 
                     matBadgeColor="accent"
                     matBadgeSize="small">
                </div>
              </mat-panel-title>
            </mat-expansion-panel-header>

            <div class="members-list">
              <div class="member" 
                   *ngFor="let m of filteredMembers(org); trackBy: trackByMemberId"
                   (click)="openDM(org.organizationId, m.id)"
                   [class.active]="isActiveMember(m.id)"
                   [class.has-unread]="getUnreadMessages(m.id)"
                   role="button"
                   tabindex="0"
                   (keydown.enter)="openDM(org.organizationId, m.id)"
                   [attr.aria-label]="'Chat with ' + m.firstName + ' ' + m.lastName">
                <div class="avatar-container">
                  <img class="avatar" [src]="avatarUrl(m.email)" [alt]="m.firstName + ' avatar'" />
                  <div class="online-indicator" 
                       *ngIf="m.isOnline" 
                       matTooltip="Online"
                       aria-label="User is online">
                  </div>
                </div>
                <div class="meta">
                  <div class="name">{{ m.firstName }} {{ m.lastName }}</div>
                  <div class="preview">
                    <span *ngIf="m.isOnline; else offline">Online</span>
                    <ng-template #offline>
                      <span *ngIf="m.lastSeen">Last seen {{ m.lastSeen | date:'short' }}</span>
                      <span *ngIf="!m.lastSeen">Tap to chat</span>
                    </ng-template>
                  </div>
                </div>
                <div class="message-actions">
                  <div class="unread-dot" *ngIf="getUnreadMessages(m.id)" aria-hidden="true"></div>
                  <button mat-icon-button 
                          class="more-options"
                          [matMenuTriggerFor]="memberMenu"
                          (click)="$event.stopPropagation()"
                          aria-label="More options">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </mat-expansion-panel>
        </mat-accordion>

        <!-- Messages Menu -->
        <mat-menu #messagesMenu="matMenu">
          <button mat-menu-item (click)="openCreateGroupDialog()">
            <mat-icon>group_add</mat-icon>
            Create Group
          </button>
          <button mat-menu-item (click)="openDirectMessageDialog()">
            <mat-icon>person_add</mat-icon>
            Start Direct Message
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="openGlobalSearch()">
            <mat-icon>search</mat-icon>
            Search All Messages
          </button>
        </mat-menu>

        <!-- Member Menu -->
        <mat-menu #memberMenu="matMenu">
          <button mat-menu-item>
            <mat-icon>info</mat-icon>
            View Profile
          </button>
          <button mat-menu-item>
            <mat-icon>block</mat-icon>
            Block User
          </button>
        </mat-menu>
      </div>

      <!-- Right Chat Pane -->
      <div class="chat-pane" [class.hidden]="isMobileView() && showSidebar()">
        <mat-card class="chat-card" *ngIf="activeConversationId(); else empty">
          <mat-card-header class="chat-header">
            <button mat-icon-button 
                    class="back-button" 
                    *ngIf="isMobileView()"
                    (click)="goBackToSidebar()"
                    matTooltip="Back to conversations">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div class="chat-title-section">
              <h2 class="chat-title">{{ activeTitle() }}</h2>
              <div class="typing-indicator" *ngIf="isTyping()">
                <span>{{ typingText() }}</span>
                <div class="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
            <div class="chat-actions">
              <button mat-icon-button matTooltip="Search in conversation">
                <mat-icon>search</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Call">
                <mat-icon>call</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Video call">
                <mat-icon>videocam</mat-icon>
              </button>
              <button mat-icon-button [matMenuTriggerFor]="chatMenu" matTooltip="More options">
                <mat-icon>more_vert</mat-icon>
              </button>
            </div>
          </mat-card-header>

          <mat-card-content class="message-container">
            <div class="message-list" #messageList (scroll)="onMessageListScroll($event)">
              <!-- Loading older messages -->
              <div class="load-more" *ngIf="loadingMore()">
                <mat-spinner diameter="24"></mat-spinner>
                <span>Loading older messages...</span>
              </div>

              <!-- Date dividers and messages -->
              <ng-container *ngFor="let group of groupedMessages(); trackBy: trackByMessageGroup">
                <div class="date-divider">
                  <span>{{ group.date | date : 'fullDate' }}</span>
                </div>

                <div *ngFor="let msg of group.messages; trackBy: trackByMessageId"
                     class="message"
                     [class.self]="isSelf(msg.senderId)"
                     [class.consecutive]="isConsecutive(msg, group.messages)"
                     [attr.data-message-id]="msg.id">
                  
                  <div class="message-avatar" *ngIf="!isSelf(msg.senderId) && !isConsecutive(msg, group.messages)">
                    <img [src]="avatarUrl(getSenderEmail(msg.senderId))" [alt]="msg.senderName + ' avatar'" />
                  </div>

                  <div class="bubble-container">
                    <div class="bubble" 
                         [class.has-reactions]="msg.reactions?.length"
                         (contextmenu)="onMessageContextMenu($event, msg)">
                      
                      <div class="sender" *ngIf="!isSelf(msg.senderId) && !isConsecutive(msg, group.messages)">
                        {{ msg.senderName || 'User' }}
                      </div>

                      <div class="reply-context" *ngIf="msg.replyTo">
                        <div class="reply-line"></div>
                        <div class="reply-content">Replying to message...</div>
                      </div>

                      <div class="content">{{ msg.content }}</div>

                      <div class="attachments" *ngIf="msg.attachments?.length">
                        <div class="attachment" *ngFor="let att of msg.attachments">
                          <mat-icon>{{ getAttachmentIcon(att.type) }}</mat-icon>
                          <span>{{ att.name }}</span>
                        </div>
                      </div>

                      <div class="message-footer">
                        <div class="time">
                          {{ msg.createdAt | date : 'shortTime' }}
                          <mat-icon class="status-icon" *ngIf="isSelf(msg.senderId)">
                            {{ getStatusIcon(msg.status) }}
                          </mat-icon>
                        </div>
                      </div>
                    </div>

                    <!-- Message Reactions -->
                    <div class="reactions" *ngIf="msg.reactions?.length">
                      <button class="reaction" 
                              *ngFor="let reaction of msg.reactions"
                              (click)="toggleReaction(msg.id, reaction.emoji)"
                              [class.own-reaction]="isOwnReaction(reaction)"
                              matTooltip="{{ getReactionTooltip(reaction) }}">
                        {{ reaction.emoji }} {{ getReactionCount(msg.reactions, reaction.emoji) }}
                      </button>
                      <button class="add-reaction" 
                              (click)="showEmojiPicker(msg.id)"
                              matTooltip="Add reaction">
                        <mat-icon>add</mat-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </ng-container>

              <!-- Scroll anchor -->
              <div #scrollAnchor></div>
            </div>
          </mat-card-content>

          <!-- Message Composer -->
          <div class="composer">
            <button mat-icon-button 
                    color="primary" 
                    class="attachment-btn" 
                    matTooltip="Add attachment"
                    (click)="fileInput.click()">
              <mat-icon>attach_file</mat-icon>
            </button>
            
            <input #fileInput 
                   type="file" 
                   hidden 
                   multiple 
                   (change)="onFileSelected($event)"
                   accept="image/*,application/pdf,.doc,.docx">

            <mat-form-field appearance="outline" class="message-input">
              <mat-label>Type a message...</mat-label>
              <textarea matInput 
                        [(ngModel)]="draft"
                        (keydown)="onKeyDown($event)"
                        (input)="onTyping()"
                        [disabled]="messageState().sending"
                        placeholder="Type your message here..."
                        rows="1"
                        cdkTextareaAutosize
                        cdkAutosizeMinRows="1"
                        cdkAutosizeMaxRows="5"
                        #messageTextarea></textarea>
            </mat-form-field>

            <button mat-icon-button 
                    color="primary"
                    (click)="send()"
                    [disabled]="!canSend()"
                    matTooltip="Send message"
                    aria-label="Send message">
              <mat-spinner diameter="20" *ngIf="messageState().sending"></mat-spinner>
              <mat-icon *ngIf="!messageState().sending">send</mat-icon>
            </button>

            <button mat-icon-button 
                    matTooltip="Voice message"
                    aria-label="Record voice message">
              <mat-icon>mic</mat-icon>
            </button>
          </div>
        </mat-card>

        <!-- Empty State -->
        <ng-template #empty>
          <div class="empty-state">
            <div class="empty-icon">
              <mat-icon>chat_bubble_outline</mat-icon>
            </div>
            <h3>Select a conversation</h3>
            <p>Choose a person from the sidebar to start chatting</p>
            <button mat-raised-button color="primary" class="start-chat-btn" (click)="openDirectMessageDialog()">
              <mat-icon>add</mat-icon>
              Start New Chat
            </button>
          </div>
        </ng-template>

        <!-- Chat Menu -->
        <mat-menu #chatMenu="matMenu">
          <button mat-menu-item>
            <mat-icon>info</mat-icon>
            Conversation Info
          </button>
          <button mat-menu-item>
            <mat-icon>search</mat-icon>
            Search Messages
          </button>
          <button mat-menu-item>
            <mat-icon>notifications_off</mat-icon>
            Mute Notifications
          </button>
          <button mat-menu-item color="warn">
            <mat-icon>delete</mat-icon>
            Delete Conversation
          </button>
        </mat-menu>
      </div>
    </div>

    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  private api = inject(MessagesApiService);
  private auth = inject(AuthService);
  private themeService = inject(ThemeService);
  private snackBar = inject(MatSnackBar);
  private wsService = inject(WebSocketService);
  private notificationsService = inject(NotificationsService);
  private dialog = inject(MatDialog);
  private messageCountService = inject(MessageCountService);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private typingTimeout?: number;
  private isLoadingOlder = false;
  private hasMore = true;
  private oldestMessageId: string | null = null;

  @ViewChild('messageList') messageList!: ElementRef;
  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;
  @ViewChild('messageTextarea') messageTextarea!: ElementRef;

  // Signals
  orgs = signal<OrgWithMembers[]>([]);
  activeConversationId = signal<string | null>(null);
  messages = signal<Message[]>([]);
  activeTitle = signal<string>('');
  messageState = this.api.getMessageState;
  searchLoading = signal(false);
  loadingMore = signal(false);
  isTyping = signal(false);
  typingText = signal('');
  isMobileView = signal(false);
  showSidebar = signal(true);

  // Form data
  draft = '';
  query = '';
  meId: string | null = null;
  unreadMessages = signal<{[userId: string]: boolean}>({});
  messageNotificationCount = signal<number>(0);

  ngOnInit() {
    this.themeService.applyModuleTheme('messages');
    const user = this.auth.getCurrentUser();
    this.meId = user?.id || null;
    console.log('Messages component initialized with meId:', this.meId, 'user:', user);
    
    this.checkMobileView();
    window.addEventListener('resize', () => this.checkMobileView());
    
    this.loadOrganizations();
    this.setupSearch();
    this.setupRealTimeUpdates();
    this.setupUnreadTracking();
    this.setupNotificationIntegration();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    window.removeEventListener('resize', () => this.checkMobileView());
  }

  ngAfterViewInit() {
    // Update message count in service whenever orgs change
    this.messageCountService.setMessageCount(this.totalMembers());
  }

  // Computed properties
  totalMembers = computed(() =>
    this.orgs().reduce((acc, o) => acc + o.members.length, 0)
  );

  groupedMessages = computed(() => {
    const msgs = this.messages();
    const groups: { date: Date; messages: Message[] }[] = [];
    
    msgs.forEach(msg => {
      const msgDate = new Date(msg.createdAt);
      const dateKey = msgDate.toDateString();
      
      let group = groups.find(g => g.date.toDateString() === dateKey);
      if (!group) {
        group = { date: msgDate, messages: [] };
        groups.push(group);
      }
      group.messages.push(msg);
    });
    
    return groups.sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  canSend = computed(() => 
    this.draft.trim().length > 0 && 
    !this.messageState().sending && 
    this.activeConversationId()
  );

  // Track by functions
  trackByOrgId = (index: number, org: OrgWithMembers) => org.organizationId;
  trackByMemberId = (index: number, member: any) => member.id;
  trackByMessageId = (index: number, message: Message) => message.id;
  trackByMessageGroup = (index: number, group: any) => group.date.toDateString();

  // Data loading
  loadOrganizations() {
    this.api.getOrganizationsWithMembers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          const user = this.auth.getCurrentUser();
          this.meId = user?.id || null;
          console.log('Organizations loaded, meId set to:', this.meId);
          this.orgs.set(data);
        },
        error: (error) => {
          console.error('Failed to load organizations:', error);
          this.snackBar.open('Failed to load conversations', 'Retry', {
            duration: 5000
          }).onAction().subscribe(() => this.loadOrganizations());
        }
      });
  }

  setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.searchLoading.set(false);
    });
  }

  setupRealTimeUpdates() {
    // Listen for real-time message updates
    this.wsService.getMessages().pipe(takeUntil(this.destroy$)).subscribe(message => {
      if (message?.type === 'message:new') {
        this.handleNewMessage(message.payload);
      } else if (message?.type === 'typing:update') {
        this.handleTypingUpdate(message.payload);
      } else if (message?.type === 'messages:read') {
        this.handleMessagesRead(message.payload);
      }
    });
  }

  setupNotificationIntegration() {
    // Subscribe to message notification count
    this.notificationsService.unreadCount$.pipe(takeUntil(this.destroy$)).subscribe(count => {
      const messageNotifications = this.notificationsService.getUnreadMessageCount();
      this.messageNotificationCount.set(messageNotifications);
    });

    // Join user room for notifications (only if WebSocket is connected)
    const user = this.auth.getCurrentUser();
    if (user) {
      this.wsService.getConnectionStatus().pipe(takeUntil(this.destroy$)).subscribe(connected => {
        if (connected) {
          this.wsService.joinRoom(`user:${user.id}`);
        }
      });
    }
  }

  setupUnreadTracking() {
    this.api.getUnreadCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(unreadCounts => {
        const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + (count as number), 0);
        this.messageCountService.setMessageCount(totalUnread);
      });
  }

  private handleNewMessage(message: any) {
    try {
      const senderId = String(message.senderId?._id || message.senderId);
      const transformedMsg = {
        ...message,
        id: message._id || message.id,
        senderId,
        status: 'delivered' as const,
        senderName: this.getSenderName(senderId),
      };
      
      // Only add if it's for the current conversation
      if (String(message.conversationId) === String(this.activeConversationId())) {
        this.messages.update(msgs => {
          // Prevent duplicate messages
          const exists = msgs.some(m => m.id === transformedMsg.id);
          if (exists) return msgs;
          return [...msgs, transformedMsg];
        });
        this.scrollToBottom();
        
        // Mark as read if not from current user
        if (!this.isSelf(senderId)) {
          setTimeout(() => this.markAsRead(), 1000);
        }
      }
    } catch (error) {
      console.error('Error handling new message:', error);
    }
  }

  private handleTypingUpdate(data: any) {
    if (String(data.conversationId) === String(this.activeConversationId())) {
      if (data.isTyping && !this.isSelf(data.userId)) {
        this.isTyping.set(true);
        this.typingText.set(`${data.userName} is typing...`);
        
        // Clear typing indicator after 3 seconds
        setTimeout(() => {
          this.isTyping.set(false);
          this.typingText.set('');
        }, 3000);
      } else {
        this.isTyping.set(false);
        this.typingText.set('');
      }
    }
  }

  private handleMessagesRead(data: any) {
    if (String(data.conversationId) === String(this.activeConversationId())) {
      // Update message read status in UI
      this.messages.update(msgs => 
        msgs.map(msg => {
          if (this.isSelf(msg.senderId)) {
            return { ...msg, status: 'read' as const };
          }
          return msg;
        })
      );
    }
  }

  // Search and filtering
  onSearchChange(query: string) {
    this.searchLoading.set(false);
  }

  filteredMembers(org: OrgWithMembers) {
    const q = (this.query || '').toLowerCase().trim();
    if (!q) return org.members;
    return org.members.filter((m) =>
      `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(q)
    );
  }

  // Utility functions
  isSelf(senderId: string | undefined): boolean {
    if (!senderId || !this.meId) {
      console.warn('isSelf: Missing senderId or meId', { senderId, meId: this.meId });
      return false;
    }
    
    // Handle both string and ObjectId formats
    const senderIdStr = typeof senderId === 'object' ? (senderId as any)._id || (senderId as any).toString() : String(senderId);
    const meIdStr = String(this.meId);
    
    const result = senderIdStr === meIdStr;
    console.log('isSelf:', { senderId: senderIdStr, meId: meIdStr, match: result });
    return result;
  }

  avatarUrl(email: string) {
    const hash = encodeURIComponent(email || 'user');
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=40`;
  }

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

  // Message handling
  openDM(orgId: string, otherUserId: string) {
    if (!this.auth.isAuthenticated()) {
      this.snackBar.open('Please log in to access messages', 'Close', { duration: 3000 });
      return;
    }

    // Clear unread message for this user
    this.api.clearUnreadMessage(otherUserId);
    
    const member = this.orgs()
      .flatMap((o) => o.members)
      .find((m) => String(m.id) === String(otherUserId));
    
    console.log('Opening DM with:', member);
    
    this.api.getOrCreateDM(orgId, otherUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (conv: Conversation) => {
          // Clear unread message for this user
          this.api.clearUnreadMessage(otherUserId);
          
          const conversationId = (conv as any)._id || conv.id;
          this.activeConversationId.set(conversationId);
          const member = this.orgs()
            .flatMap((o) => o.members)
            .find((m) => String(m.id) === String(otherUserId));
          this.activeTitle.set(
            member ? `${member.firstName} ${member.lastName}` : 'Direct Message'
          );
          
          console.log('Active conversation set to:', conversationId);
          
          // Hide sidebar on mobile when opening chat
          if (this.isMobileView()) {
            this.showSidebar.set(false);
          }
          
          this.loadMessages();
          this.markAsRead();
          
          // Mark conversation notifications as read
          this.markConversationNotificationsAsRead(conversationId);
          
          // Join conversation room for real-time updates
          this.wsService.joinRoom(`conversation:${conversationId}`);
        },
        error: (error) => {
          console.error('Failed to open conversation:', error);
          this.snackBar.open('Failed to open conversation', 'Close', { duration: 3000 });
        }
      });
  }

  loadMessages() {
    const id = this.activeConversationId();
    if (!id) return;
    
    // Reset pagination state
    this.hasMore = true;
    this.oldestMessageId = null;
    
    this.api.listMessages(id, 30)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (msgs) => {
          const transformedMsgs = msgs.reverse().map(msg => {
            const senderId = String((msg as any).senderId?._id || (msg as any).senderId || msg.senderId);
            return {
              ...msg,
              id: (msg as any)._id || msg.id,
              senderId,
              status: 'delivered' as const,
              senderName: this.getSenderName(senderId),
            };
          });
          
          this.messages.set(transformedMsgs);
          
          // Set oldest message ID for pagination
          if (transformedMsgs.length > 0) {
            this.oldestMessageId = transformedMsgs[0].id;
          }
          
          // Check if there are more messages
          this.hasMore = msgs.length === 30;
          
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Failed to load messages:', error);
          this.snackBar.open('Failed to load messages', 'Retry', { duration: 3000 });
        }
      });
  }

  getSenderName(senderId: string): string {
    const member = this.orgs()
      .flatMap(org => org.members)
      .find(m => String(m.id) === String(senderId));
    return member ? `${member.firstName} ${member.lastName}` : 'User';
  }

  send() {
    const id = this.activeConversationId();
    if (!id || !this.draft.trim() || !this.auth.isAuthenticated()) return;
    
    const content = this.draft.trim();
    this.draft = '';
    
    // Send via HTTP API only (backend will handle WebSocket broadcast)
    this.api.sendMessage(id, content)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (msg) => {
          // Message will be added via WebSocket handleNewMessage
          // No need to add it here to avoid duplicates
        },
        error: (error) => {
          console.error('Failed to send message:', error);
          this.snackBar.open('Failed to send message', 'Retry', {
            duration: 3000
          }).onAction().subscribe(() => {
            this.draft = content; // Restore draft for retry
          });
        }
      });
  }

  // Additional methods for enhanced features
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  onTyping() {
    // Skip typing indicators for now
  }

  markAsRead() {
    const conversationId = this.activeConversationId();
    if (!conversationId || !this.meId) return;
    
    this.api.markAsRead(conversationId).subscribe();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.scrollAnchor) {
        this.scrollAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // Enhanced methods for full functionality
  isActiveMember(memberId: string): boolean {
    const activeConvId = this.activeConversationId();
    if (!activeConvId) return false;
    
    // Check if this member is part of the active conversation
    return this.orgs().some(org => 
      org.members.some(m => String(m.id) === String(memberId))
    );
  }

  getUnreadMessages(memberId: string): boolean {
    return this.unreadMessages()[memberId] || false;
  }

  hasMoreMessages(): boolean {
    return this.hasMore && !this.isLoadingOlder;
  }

  loadMoreMessages() {
    const id = this.activeConversationId();
    if (!id || this.isLoadingOlder || !this.hasMore || !this.oldestMessageId) return;
    
    this.isLoadingOlder = true;
    this.loadingMore.set(true);
    
    // Save current scroll position
    const messageListEl = this.messageList?.nativeElement;
    const scrollHeightBefore = messageListEl?.scrollHeight || 0;
    
    this.api.listMessages(id, 30, this.oldestMessageId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoadingOlder = false;
          this.loadingMore.set(false);
        })
      )
      .subscribe({
        next: (msgs) => {
          if (msgs.length === 0) {
            this.hasMore = false;
            return;
          }
          
          const transformedMsgs = msgs.reverse().map(msg => {
            const senderId = String((msg as any).senderId?._id || (msg as any).senderId || msg.senderId);
            return {
              ...msg,
              id: (msg as any)._id || msg.id,
              senderId,
              status: 'delivered' as const,
              senderName: this.getSenderName(senderId),
            };
          });
          
          // Prepend older messages
          this.messages.update(existing => [...transformedMsgs, ...existing]);
          
          // Update oldest message ID
          if (transformedMsgs.length > 0) {
            this.oldestMessageId = transformedMsgs[0].id;
          }
          
          // Check if there are more messages
          this.hasMore = msgs.length === 30;
          
          // Restore scroll position
          setTimeout(() => {
            if (messageListEl) {
              const scrollHeightAfter = messageListEl.scrollHeight;
              messageListEl.scrollTop = scrollHeightAfter - scrollHeightBefore;
            }
          }, 0);
        },
        error: (error) => {
          console.error('Failed to load more messages:', error);
          this.snackBar.open('Failed to load more messages', 'Close', { duration: 3000 });
        }
      });
  }

  isConsecutive(msg: Message, messages: Message[]): boolean {
    const msgIndex = messages.findIndex(m => m.id === msg.id);
    if (msgIndex === 0) return false;
    
    const prevMsg = messages[msgIndex - 1];
    const timeDiff = new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime();
    
    return prevMsg.senderId === msg.senderId && timeDiff < 5 * 60 * 1000; // 5 minutes
  }

  getSenderEmail(senderId: string): string {
    const member = this.orgs()
      .flatMap(org => org.members)
      .find(m => String(m.id) === String(senderId));
    return member?.email || 'user@example.com';
  }

  onMessageContextMenu(event: MouseEvent, msg: Message) {
    event.preventDefault();
    // In a real implementation, show context menu with options like reply, copy, delete
    console.log('Message context menu for:', msg.id);
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

  toggleReaction(messageId: string, emoji: string) {
    const message = this.messages().find(m => m.id === messageId);
    if (!message) return;
    
    const hasReaction = message.reactions?.some(r => 
      r.userId === this.meId && r.emoji === emoji
    );
    
    if (hasReaction) {
      this.api.removeReaction(messageId, emoji)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedMsg) => {
            this.messages.update(msgs => 
              msgs.map(m => m.id === messageId ? updatedMsg : m)
            );
          },
          error: (error) => console.error('Failed to remove reaction:', error)
        });
    } else {
      this.api.addReaction(messageId, emoji)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedMsg) => {
            this.messages.update(msgs => 
              msgs.map(m => m.id === messageId ? updatedMsg : m)
            );
          },
          error: (error) => console.error('Failed to add reaction:', error)
        });
    }
  }

  isOwnReaction(reaction: any): boolean {
    return String(reaction.userId) === String(this.meId);
  }

  getReactionTooltip(reaction: any): string {
    const member = this.orgs()
      .flatMap(org => org.members)
      .find(m => String(m.id) === String(reaction.userId));
    return member ? `${member.firstName} ${member.lastName}` : 'Someone';
  }

  getReactionCount(reactions: any[] | undefined, emoji: string): number {
    return reactions?.filter(r => r.emoji === emoji).length || 0;
  }

  showEmojiPicker(messageId: string) {
    // In a real implementation, show emoji picker
    const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];
    const randomEmoji = commonEmojis[Math.floor(Math.random() * commonEmojis.length)];
    this.toggleReaction(messageId, randomEmoji);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // In a real implementation, upload files and send as attachments
    for (const file of files) {
      console.log('Selected file:', file.name, file.type, file.size);
      // this.api.uploadAttachment(file).subscribe(...);
    }
    
    // Reset file input
    event.target.value = '';
  }

  openCreateGroupDialog() {
    const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
      width: '500px',
      data: { organizations: this.orgs() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createGroup(result.organizationId, result.name, result.memberIds);
      }
    });
  }

  openDirectMessageDialog() {
    const dialogRef = this.dialog.open(DirectMessageDialogComponent, {
      width: '400px',
      data: { organizations: this.orgs() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openDM(result.organizationId, result.userId);
      }
    });
  }

  openGlobalSearch() {
    this.snackBar.open('Global search functionality coming soon', 'Close', {
      duration: 3000
    });
  }

  createGroup(organizationId: string, name: string, memberIds: string[]) {
    if (!this.auth.isAuthenticated()) {
      this.snackBar.open('Please log in to create groups', 'Close', { duration: 3000 });
      return;
    }

    this.api.createGroup(organizationId, name, memberIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (group) => {
          const conversationId = (group as any)._id || group.id;
          this.activeConversationId.set(conversationId);
          this.activeTitle.set(name);
          this.loadMessages();
          
          // Join group room for real-time updates
          this.wsService.joinRoom(`conversation:${conversationId}`);
          
          this.snackBar.open(`Group "${name}" created successfully!`, 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Failed to create group:', error);
          this.snackBar.open('Failed to create group', 'Close', { duration: 3000 });
        }
      });
  }

  private markConversationNotificationsAsRead(conversationId: string) {
    this.notificationsService.markConversationAsRead(conversationId).subscribe({
      next: () => {
        console.log('Marked conversation notifications as read:', conversationId);
      },
      error: (error) => {
        console.error('Failed to mark conversation notifications as read:', error);
      }
    });
  }

  checkMobileView() {
    this.isMobileView.set(window.innerWidth <= 768);
    if (!this.isMobileView()) {
      this.showSidebar.set(true);
    }
  }

  goBackToSidebar() {
    this.showSidebar.set(true);
    this.activeConversationId.set(null);
  }

  onMessageListScroll(event: Event) {
    const element = event.target as HTMLElement;
    const scrollTop = element.scrollTop;
    
    // Load more when scrolled near top (within 100px)
    if (scrollTop < 100 && this.hasMoreMessages()) {
      this.loadMoreMessages();
    }
  }

  // Enhanced message count display
  getTotalUnreadMessages(): number {
    return Object.values(this.unreadMessages()).filter(Boolean).length;
  }

  getConversationUnreadCount(conversationId: string): number {
    // This would be enhanced to show actual unread count per conversation
    return 0;
  }
}