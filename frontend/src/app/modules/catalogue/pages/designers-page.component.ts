import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { CatalogueService } from '../catalogue.service';
import { DesignerDialogComponent } from '../dialogs/designer-dialog.component';
import { UploadUrlPipe } from '../../../pipes/upload-url.pipe';
import { UserManagementService } from '../../user-management/user-management.service';

@Component({
  selector: 'app-designers-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    UploadUrlPipe
  ],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Product Designers</h2>
        <button mat-raised-button color="primary" (click)="openDesignerDialog()">
          <mat-icon>add</mat-icon>
          Add Designer
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="designers()" class="catalogue-table">
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef>Profile</th>
            <td mat-cell *matCellDef="let designer">
              <div class="designer-image-cell">
                <img *ngIf="designer.profileImage" [src]="designer.profileImage | uploadUrl" [alt]="designer.name">
                <mat-icon *ngIf="!designer.profileImage">person</mat-icon>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let designer">
              <div class="designer-info">
                <div class="designer-name">{{ designer.name }}</div>
                <div class="designer-contact" *ngIf="designer.email">{{ designer.email }}</div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="bio">
            <th mat-header-cell *matHeaderCellDef>Bio</th>
            <td mat-cell *matCellDef="let designer">
              <div class="designer-bio">{{ designer.bio || '-' }}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="portfolio">
            <th mat-header-cell *matHeaderCellDef>Portfolio</th>
            <td mat-cell *matCellDef="let designer">
              {{ designer.portfolioImages?.length || 0 }} image(s)
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let designer">
              <mat-chip [color]="designer.isActive ? 'primary' : 'warn'">
                {{ designer.isActive ? 'Active' : 'Inactive' }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="tracking">
            <th mat-header-cell *matHeaderCellDef>History</th>
            <td mat-cell *matCellDef="let designer">
              <div class="tracking-info" [matMenuTriggerFor]="historyMenu" style="cursor: pointer;">
                <div class="tracking-item" title="Created At: {{ designer.createdAt | date:'medium' }}">
                  <mat-icon class="tracking-icon">add_circle_outline</mat-icon>
                  <span>{{ getUserName(designer.createdBy) || 'System' }}</span>
                  <small>{{ designer.createdAt | date:'shortDate' }}</small>
                </div>
                <div class="tracking-item" *ngIf="designer.changeLog?.length > 1" title="Total Changes: {{ designer.changeLog.length }}">
                  <mat-icon class="tracking-icon">history</mat-icon>
                  <span>{{ designer.changeLog.length }} edits</span>
                  <small>{{ designer.updatedAt | date:'shortDate' }}</small>
                </div>
                <div class="tracking-item" *ngIf="!designer.changeLog?.length && designer.updatedAt" title="Updated At: {{ designer.updatedAt | date:'medium' }}">
                  <mat-icon class="tracking-icon">edit_note</mat-icon>
                  <span>{{ getUserName(designer.updatedBy) || 'System' }}</span>
                  <small>{{ designer.updatedAt | date:'shortDate' }}</small>
                </div>
              </div>
              <mat-menu #historyMenu="matMenu">
                <div class="history-menu-container" (click)="$event.stopPropagation()">
                  <div class="history-header">
                    <mat-icon>history</mat-icon>
                    <span>Change History</span>
                  </div>
                  <div class="history-list">
                    <div *ngIf="!designer.changeLog?.length" class="no-history">No detailed history available</div>
                    <div *ngFor="let log of designer.changeLog" class="history-item-detail">
                      <div class="history-marker"></div>
                      <div class="history-content">
                        <div class="history-user">{{ getUserName(log.userId) || 'System' }}</div>
                        <div class="history-meta">
                          <span class="history-action">{{ log.action }}</span>
                          <span class="history-time">{{ log.timestamp | date:'medium' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </mat-menu>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let designer">
              <button mat-icon-button [matMenuTriggerFor]="designerMenu" class="action-button">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #designerMenu="matMenu">
                <button mat-menu-item (click)="editDesigner(designer)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="toggleActive(designer)">
                  <mat-icon>{{ designer.isActive ? 'visibility_off' : 'visibility' }}</mat-icon>
                  <span>{{ designer.isActive ? 'Deactivate' : 'Activate' }}</span>
                </button>
                <button mat-menu-item (click)="deleteDesigner(designer._id)" class="text-red-600">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="designerColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: designerColumns"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .tab-content {
      padding: 1.5rem;
    }
    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .tab-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }
    .designer-image-cell {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
      background: #f5f5f5;
    }
    .designer-image-cell img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .designer-image-cell mat-icon {
      color: #999;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .designer-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .designer-name {
      font-weight: 500;
      color: #333;
    }
    .designer-contact {
      font-size: 0.875rem;
      color: #666;
    }
    .designer-bio {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #666;
    }
    .tracking-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.75rem;
      color: #757575;
    }
    .tracking-item {
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }
    .tracking-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #9e9e9e;
    }
    .tracking-item span {
      font-weight: 500;
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tracking-item small {
      color: #bdbdbd;
    }
    .history-menu-container {
      padding: 1rem;
      min-width: 300px;
      max-height: 400px;
      overflow-y: auto;
    }
    .history-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    .history-header mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .history-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .history-item-detail {
      display: flex;
      gap: 1rem;
      position: relative;
    }
    .history-marker {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #e0e0e0;
      margin-top: 4px;
      flex-shrink: 0;
      border: 2px solid #fff;
      box-shadow: 0 0 0 1px #e0e0e0;
    }
    .history-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .history-user {
      font-weight: 500;
      font-size: 0.9rem;
      color: #333;
    }
    .history-meta {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      font-size: 0.75rem;
      color: #757575;
    }
    .history-action {
      text-transform: capitalize;
      padding: 2px 6px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .no-history {
      padding: 1rem;
      text-align: center;
      color: #999;
      font-style: italic;
    }
  `]
})
export class DesignersPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private catalogueService = inject(CatalogueService);
  private userService = inject(UserManagementService);

  designers = signal<any[]>([]);
  users = signal<any[]>([]);
  designerColumns = ['image', 'name', 'bio', 'portfolio', 'status', 'tracking', 'actions'];

  ngOnInit() {
    this.loadDesigners();
    this.loadUsers();
  }

  loadDesigners() {
    this.catalogueService.getDesigners().subscribe(designers => {
      this.designers.set(designers);
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users.set(users);
    });
  }

  getUserName(userId: string): string {
    if (!userId) return '';
    const user = this.users().find(u => u._id === userId || u.id === userId);
    if (!user) return 'Unknown User';
    return `${user.firstName} ${user.lastName}`;
  }

  openDesignerDialog() {
    const dialogRef = this.dialog.open(DesignerDialogComponent, {
      width: '800px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDesigners();
      }
    });
  }

  editDesigner(designer: any) {
    const dialogRef = this.dialog.open(DesignerDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { designer }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDesigners();
      }
    });
  }

  toggleActive(designer: any) {
    this.catalogueService.updateDesigner(designer._id, { 
      isActive: !designer.isActive 
    }).subscribe(() => {
      this.loadDesigners();
    });
  }

  deleteDesigner(id: string) {
    if (confirm('Are you sure you want to delete this designer?')) {
      this.catalogueService.deleteDesigner(id).subscribe(() => {
        this.loadDesigners();
      });
    }
  }
}
