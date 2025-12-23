import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { CmsService } from '../cms.service';
import { MenuDialogComponent } from '../dialogs/menu-dialog.component';

@Component({
  selector: 'app-menus-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule
  ],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Navigation Menus</h2>
        <button mat-raised-button color="primary" (click)="openMenuDialog()">
          <mat-icon>add</mat-icon>
          Add Menu
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="menus()" class="cms-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let menu">
              <div class="menu-info">
                <mat-icon class="menu-icon">menu</mat-icon>
                <div>
                  <div class="menu-name">{{ menu.name }}</div>
                  <div class="menu-location">{{ menu.location }}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="items">
            <th mat-header-cell *matHeaderCellDef>Items</th>
            <td mat-cell *matCellDef="let menu">{{ menu.items?.length || 0 }} items</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let menu">
              <mat-chip [color]="menu.isActive ? 'primary' : 'warn'">
                {{ menu.isActive ? 'Active' : 'Inactive' }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="updated">
            <th mat-header-cell *matHeaderCellDef>Last Updated</th>
            <td mat-cell *matCellDef="let menu">
              {{ formatDate(menu.updatedAt || menu.createdAt) }}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let menu">
              <button mat-icon-button [matMenuTriggerFor]="menuActions" class="action-button">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menuActions="matMenu">
                <button mat-menu-item (click)="editMenu(menu)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="toggleActive(menu)">
                  <mat-icon>{{ menu.isActive ? 'visibility_off' : 'visibility' }}</mat-icon>
                  <span>{{ menu.isActive ? 'Deactivate' : 'Activate' }}</span>
                </button>
                <button mat-menu-item (click)="deleteMenu(menu._id)" class="text-red-600">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="menuColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: menuColumns"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .menu-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .menu-icon {
      color: #9C27B0;
    }
    .menu-name {
      font-weight: 500;
      color: #333;
    }
    .menu-location {
      font-size: 0.875rem;
      color: #666;
    }
    .text-red-600 {
      color: #dc2626;
    }
  `]
})
export class MenusPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private cmsService = inject(CmsService);

  menus = signal<any[]>([]);
  menuColumns = ['name', 'items', 'status', 'updated', 'actions'];

  ngOnInit() {
    this.loadMenus();
  }

  loadMenus() {
    this.cmsService.getMenus().subscribe(menus => {
      this.menus.set(menus);
    });
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  openMenuDialog() {
    const dialogRef = this.dialog.open(MenuDialogComponent, {
      width: '700px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMenus();
      }
    });
  }

  editMenu(menu: any) {
    const dialogRef = this.dialog.open(MenuDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { menu }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMenus();
      }
    });
  }

  toggleActive(menu: any) {
    this.cmsService.updateMenu(menu._id, { 
      isActive: !menu.isActive 
    }).subscribe(() => {
      this.loadMenus();
    });
  }

  deleteMenu(id: string) {
    if (confirm('Are you sure you want to delete this menu?')) {
      this.cmsService.deleteMenu(id).subscribe(() => {
        this.loadMenus();
      });
    }
  }
}