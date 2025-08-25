import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { OrgWithMembers } from '../../services/messages.service';

interface DialogData {
  organizations: OrgWithMembers[];
}

@Component({
  selector: 'app-create-group-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <h2 mat-dialog-title>Create Group</h2>
    
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Group Name</mat-label>
        <input matInput [(ngModel)]="groupName" placeholder="Enter group name" required>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Organization</mat-label>
        <mat-select [(ngModel)]="selectedOrgId" required>
          <mat-option *ngFor="let org of data.organizations" [value]="org.organizationId">
            {{ org.organizationName }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <div class="members-section" *ngIf="selectedOrgId">
        <h3>Select Members</h3>
        <mat-selection-list [(ngModel)]="selectedMembers" multiple>
          <mat-list-option 
            *ngFor="let member of getOrgMembers(selectedOrgId)" 
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
      <button mat-raised-button color="primary" (click)="onCreate()" [disabled]="!canCreate()">
        Create Group
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .members-section {
      margin-top: 16px;
    }
    
    .members-section h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 500;
      color: var(--theme-on-surface-variant);
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
      width: 32px;
      height: 32px;
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
      max-height: 200px;
      overflow-y: auto;
    }
  `]
})
export class CreateGroupDialogComponent {
  groupName = '';
  selectedOrgId = '';
  selectedMembers: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  getOrgMembers(orgId: string) {
    const org = this.data.organizations.find(o => o.organizationId === orgId);
    return org?.members || [];
  }

  avatarUrl(email: string) {
    const hash = encodeURIComponent(email || 'user');
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=32`;
  }

  canCreate(): boolean {
    return this.groupName.trim().length > 0 && 
           this.selectedOrgId.length > 0 && 
           this.selectedMembers.length > 0;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onCreate() {
    if (this.canCreate()) {
      this.dialogRef.close({
        name: this.groupName.trim(),
        organizationId: this.selectedOrgId,
        memberIds: this.selectedMembers
      });
    }
  }
}