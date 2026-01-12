import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrgWithMembers } from '../../services/messages.service';

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

  constructor(
    public dialogRef: MatDialogRef<DirectMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  filteredMembers(org: OrgWithMembers) {
    if (!this.searchQuery.trim()) return org.members;
    
    const query = this.searchQuery.toLowerCase();
    return org.members.filter(member => 
      `${member.firstName} ${member.lastName} ${member.email}`.toLowerCase().includes(query)
    );
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

  canStart(): boolean {
    return !!this.selectedUserId && this.selectedUserId.userId;
  }

  trackByOrgId = (index: number, org: OrgWithMembers) => org.organizationId;
  trackByMemberId = (index: number, member: any) => member.id;

  onCancel() {
    this.dialogRef.close();
  }

  onStart() {
    if (this.canStart()) {
      this.dialogRef.close({
        organizationId: this.selectedUserId.orgId,
        userId: this.selectedUserId.userId
      });
    }
  }
}
