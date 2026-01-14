import { Component, Inject, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrgWithMembers, MessagesApiService } from '../../services/messages.service';
// MessagesUtilsService removed
import { AuthService } from '../../services/auth.service';

interface DialogData {
  organizations: OrgWithMembers[];
}

@Component({
  selector: 'app-direct-message-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule
  ],
  template: `
    <h2 mat-dialog-title>Start Direct Message</h2>
    
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Search users</mat-label>
        <input matInput [(ngModel)]="searchQuery" placeholder="Type name or email...">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <mat-accordion class="org-accordion" multi>
        <mat-expansion-panel *ngFor="let org of data.organizations; trackBy: trackByOrgId">
          <mat-expansion-panel-header>
            <mat-panel-title class="org-header">
              <div class="org-avatar" [style.background]="getOrgGradient(org.organizationName)">
                {{ getOrgInitials(org.organizationName) }}
              </div>
              <div class="org-info">
                <span class="org-name">{{ org.organizationName }}</span>
                <span class="member-count">{{ filteredMembers(org).length }} members</span>
              </div>
            </mat-panel-title>
          </mat-expansion-panel-header>

          <div class="members-list">
            <mat-selection-list [(ngModel)]="selectedUserId">
              <mat-list-option 
                *ngFor="let member of filteredMembers(org); trackBy: trackByMemberId" 
                [value]="{ userId: member.id, orgId: org.organizationId }"
                class="member-option">
                <div class="member-info">
                  <img class="avatar" [src]="avatarUrl(member.email)" [alt]="member.firstName + ' avatar'" />
                  <div class="details">
                    <div class="name">{{ member.firstName }} {{ member.lastName }}</div>
                    <div class="email">{{ member.email }}</div>
                  </div>
                </div>
              </mat-list-option>
            </mat-selection-list>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onStart()" [disabled]="!canStart()">
        Start Chat
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .org-accordion {
      margin-top: 16px;
    }
    
    .org-header {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }
    
    .org-avatar {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 12px;
      flex-shrink: 0;
    }
    
    .org-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .org-name {
      font-weight: 500;
      font-size: 14px;
    }
    
    .member-count {
      font-size: 12px;
      color: var(--theme-on-surface-variant);
    }
    
    .members-list {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .member-option {
      border-radius: 8px;
      margin-bottom: 4px;
    }
    
    .member-info {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }
    
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }
    
    .details {
      flex: 1;
    }
    
    .name {
      font-weight: 500;
      font-size: 14px;
    }
    
    .email {
      font-size: 12px;
      color: var(--theme-on-surface-variant);
    }
  `]
})
export class DirectMessageDialogComponent {
  searchQuery = '';
  selectedUserId: any = '';
  private api = inject(MessagesApiService);
  private auth = inject(AuthService);

  constructor(
    public dialogRef: MatDialogRef<DirectMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  filteredMembers(org: OrgWithMembers) {
    if (!this.searchQuery.trim()) return org.members;
    const q = this.searchQuery.toLowerCase();
    return org.members.filter(m =>
      `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(q)
    );
  }

  avatarUrl(email: string) {
    return this.api.avatarUrl(email);
  }

  getOrgInitials(orgName: string): string {
    return this.api.getOrgInitials(orgName);
  }

  getOrgGradient(orgName: string): string {
    return this.api.getOrgGradient(orgName);
  }

  canStart(): boolean {
    return !!this.selectedUserId && this.selectedUserId.userId;
  }

  trackByOrgId = (index: number, org: OrgWithMembers) => org.organizationId;
  trackByMemberId = (index: number, member: any) => member.id;

  onCancel() {
    this.dialogRef.close();
  }

  onStart() {
    if (this.canStart() && this.selectedUserId.userId !== this.auth.getCurrentUser()?.id) {
      this.dialogRef.close({
        organizationId: this.selectedUserId.orgId,
        userId: this.selectedUserId.userId
      });
    }
  }
}
