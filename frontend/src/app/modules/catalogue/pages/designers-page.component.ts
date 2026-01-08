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
  `]
})
export class DesignersPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private catalogueService = inject(CatalogueService);

  designers = signal<any[]>([]);
  designerColumns = ['image', 'name', 'bio', 'portfolio', 'status', 'actions'];

  ngOnInit() {
    this.loadDesigners();
  }

  loadDesigners() {
    this.catalogueService.getDesigners().subscribe(designers => {
      this.designers.set(designers);
    });
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
