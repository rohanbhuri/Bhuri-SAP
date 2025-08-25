import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
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
    MatSelectModule,
    MatListModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Start Direct Message</h2>
    
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Organization</mat-label>
        <mat-select [(ngModel)]="selectedOrgId" required>
          <mat-option *ngFor="let org of data.organizations" [value]="org.organizationId">
            {{ org.organizationName }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width" *ngIf="selectedOrgId">
        <mat-label>Search members</mat-label>
        <input matInput [(ngModel)]="searchQuery" placeholder="Type to search members">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div class="members-list" *ngIf="selectedOrgId">
        <mat-selection-list [(ngModel)]="selectedUserId">
          <mat-list-option 
            *ngFor="let member of filteredMembers()" 
            [value]="member.id"
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
    
    .members-list {
      margin-top: 16px;
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
    
    mat-selection-list {
      max-height: 300px;
      overflow-y: auto;
    }
  `]
})
export class DirectMessageDialogComponent {
  selectedOrgId = '';
  selectedUserId = '';
  searchQuery = '';

  constructor(
    public dialogRef: MatDialogRef<DirectMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  getOrgMembers(orgId: string) {
    const org = this.data.organizations.find(o => o.organizationId === orgId);
    return org?.members || [];
  }

  filteredMembers() {
    const members = this.getOrgMembers(this.selectedOrgId);
    if (!this.searchQuery.trim()) return members;
    
    const query = this.searchQuery.toLowerCase();
    return members.filter(member => 
      `${member.firstName} ${member.lastName} ${member.email}`.toLowerCase().includes(query)
    );
  }

  avatarUrl(email: string) {
    const hash = encodeURIComponent(email || 'user');
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=40`;
  }

  canStart(): boolean {
    return this.selectedOrgId.length > 0 && this.selectedUserId.length > 0;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onStart() {
    if (this.canStart()) {
      this.dialogRef.close({
        organizationId: this.selectedOrgId,
        userId: this.selectedUserId
      });
    }
  }
}