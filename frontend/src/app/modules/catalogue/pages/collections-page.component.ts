import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { CatalogueService } from '../catalogue.service';
import { CollectionDialogComponent } from '../dialogs/collection-dialog.component';
import { UploadUrlPipe } from '../../../pipes/upload-url.pipe';
import { UserManagementService } from '../../user-management/user-management.service';

@Component({
  selector: 'app-collections-page',
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
        <h2>Collections</h2>
        <button mat-raised-button color="primary" (click)="openCollectionDialog()">
          <mat-icon>add</mat-icon>
          Add Collection
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="collections()" class="catalogue-table">
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef>Image</th>
            <td mat-cell *matCellDef="let collection">
              <div class="collection-image-cell">
                <img *ngIf="collection.image && !collection.imageError" 
                     [src]="collection.image | uploadUrl" 
                     [alt]="collection.name"
                     (error)="onImageError(collection)">
                <mat-icon *ngIf="!collection.image || collection.imageError">collections</mat-icon>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let collection">
              <div class="collection-info">
                <div class="collection-name">{{ collection.name }}</div>
                <div class="collection-slug">{{ collection.slug }}</div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="products">
            <th mat-header-cell *matHeaderCellDef>Products</th>
            <td mat-cell *matCellDef="let collection">{{ getProductCount(collection._id) }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let collection">
              <div class="status-chips">
                <mat-chip [color]="collection.isActive ? 'primary' : 'warn'">
                  {{ collection.isActive ? 'Active' : 'Inactive' }}
                </mat-chip>
                <mat-chip *ngIf="collection.isExclusive" class="exclusive-chip">
                  Exclusive
                </mat-chip>
                <mat-chip *ngIf="collection.isAppointmentRequired" class="appointment-chip">
                  Appt Req
                </mat-chip>
                <mat-chip *ngIf="collection.isFeatured" class="featured-chip">
                  Featured
                </mat-chip>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="tracking">
            <th mat-header-cell *matHeaderCellDef>History</th>
            <td mat-cell *matCellDef="let collection">
              <div class="tracking-info" [matMenuTriggerFor]="historyMenu" style="cursor: pointer;">
                <div class="tracking-item" title="Created At: {{ collection.createdAt | date:'medium' }}">
                  <mat-icon class="tracking-icon">add_circle_outline</mat-icon>
                  <span>{{ getUserName(collection.createdBy) || 'System' }}</span>
                  <small>{{ collection.createdAt | date:'shortDate' }}</small>
                </div>
                <div class="tracking-item" *ngIf="collection.changeLog?.length > 1" title="Total Changes: {{ collection.changeLog.length }}">
                  <mat-icon class="tracking-icon">history</mat-icon>
                  <span>{{ collection.changeLog.length }} edits</span>
                  <small>{{ collection.updatedAt | date:'shortDate' }}</small>
                </div>
                <div class="tracking-item" *ngIf="!collection.changeLog?.length && collection.updatedAt" title="Updated At: {{ collection.updatedAt | date:'medium' }}">
                  <mat-icon class="tracking-icon">edit_note</mat-icon>
                  <span>{{ getUserName(collection.updatedBy) || 'System' }}</span>
                  <small>{{ collection.updatedAt | date:'shortDate' }}</small>
                </div>
              </div>
              <mat-menu #historyMenu="matMenu">
                <div class="history-menu-container" (click)="$event.stopPropagation()">
                  <div class="history-header">
                    <mat-icon>history</mat-icon>
                    <span>Change History</span>
                  </div>
                  <div class="history-list">
                    <div *ngIf="!collection.changeLog?.length" class="no-history">No detailed history available</div>
                    <div *ngFor="let log of collection.changeLog" class="history-item-detail">
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
            <td mat-cell *matCellDef="let collection">
              <button mat-icon-button [matMenuTriggerFor]="collectionMenu" class="action-button">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #collectionMenu="matMenu">
                <button mat-menu-item (click)="editCollection(collection)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="toggleActive(collection)">
                  <mat-icon>{{ collection.isActive ? 'visibility_off' : 'visibility' }}</mat-icon>
                  <span>{{ collection.isActive ? 'Deactivate' : 'Activate' }}</span>
                </button>
                <button mat-menu-item (click)="toggleExclusive(collection)">
                  <mat-icon>{{ collection.isExclusive ? 'star_outline' : 'star' }}</mat-icon>
                  <span>{{ collection.isExclusive ? 'Remove Exclusive' : 'Make Exclusive' }}</span>
                </button>
                <button mat-menu-item (click)="toggleAppointment(collection)">
                  <mat-icon>{{ collection.isAppointmentRequired ? 'event_busy' : 'event_available' }}</mat-icon>
                  <span>{{ collection.isAppointmentRequired ? 'No Appointment' : 'Need Appointment' }}</span>
                </button>
                <button mat-menu-item (click)="toggleFeatured(collection)">
                  <mat-icon>{{ collection.isFeatured ? 'auto_awesome_motion' : 'auto_awesome' }}</mat-icon>
                  <span>{{ collection.isFeatured ? 'Unfeature' : 'Feature' }}</span>
                </button>
                <button mat-menu-item (click)="deleteCollection(collection._id)" class="text-red-600">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="collectionColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: collectionColumns"></tr>
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
    .table-container {
      overflow-x: auto;
    }
    .collection-image-cell {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      overflow: hidden;
      background: #f5f5f5;
    }
    .collection-image-cell img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .collection-image-cell mat-icon {
      color: #999;
    }
    .collection-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .collection-name {
      font-weight: 500;
      color: #333;
    }
    .collection-slug {
      font-size: 0.875rem;
      color: #666;
    }
    .status-chips {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .exclusive-chip {
      background-color: #ffd700 !important;
      color: #000 !important;
    }
    .appointment-chip {
      background-color: #e91e63 !important;
      color: #fff !important;
    }
    .featured-chip {
      background-color: #9c27b0 !important;
      color: #fff !important;
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
export class CollectionsPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private catalogueService = inject(CatalogueService);
  private userService = inject(UserManagementService);

  collections = signal<any[]>([]);
  products = signal<any[]>([]);
  users = signal<any[]>([]);
  collectionColumns = ['image', 'name', 'products', 'status', 'tracking', 'actions'];

  ngOnInit() {
    this.loadCollections();
    this.loadProducts();
    this.loadUsers();
  }

  loadCollections() {
    this.catalogueService.getCollections().subscribe(collections => {
      // Reset image error flags when loading collections
      collections.forEach(collection => {
        collection.imageError = false;
      });
      this.collections.set(collections);
    });
  }

  loadProducts() {
    this.catalogueService.getProducts({ limit: 1000 }).subscribe(result => {
      this.products.set(result.items);
    });
  }

  getProductCount(collectionId: string): number {
    return this.products().filter(p => p.collectionId === collectionId).length;
  }

  openCollectionDialog() {
    const dialogRef = this.dialog.open(CollectionDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCollections();
      }
    });
  }

  editCollection(collection: any) {
    const dialogRef = this.dialog.open(CollectionDialogComponent, {
      width: '600px',
      data: { collection }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCollections();
      }
    });
  }

  manageProducts(collection: any) {
    // TODO: Implement product management dialog
    console.log('Manage products for collection:', collection);
  }

  toggleActive(collection: any) {
    this.catalogueService.updateCollection(collection._id, { 
      isActive: !collection.isActive 
    }).subscribe(() => {
      this.loadCollections();
    });
  }

  toggleExclusive(collection: any) {
    this.catalogueService.updateCollection(collection._id, { 
      isExclusive: !collection.isExclusive 
    }).subscribe(() => {
      this.loadCollections();
    });
  }

  toggleAppointment(collection: any) {
    this.catalogueService.updateCollection(collection._id, { 
      isAppointmentRequired: !collection.isAppointmentRequired 
    }).subscribe(() => {
      this.loadCollections();
    });
  }

  toggleFeatured(collection: any) {
    this.catalogueService.updateCollection(collection._id, { 
      isFeatured: !collection.isFeatured 
    }).subscribe(() => {
      this.loadCollections();
    });
  }

  deleteCollection(id: string) {
    const productCount = this.getProductCount(id);
    if (productCount > 0) {
      alert(`Cannot delete collection. It contains ${productCount} products.`);
      return;
    }

    if (confirm('Are you sure you want to delete this collection?')) {
      this.catalogueService.deleteCollection(id).subscribe(() => {
        this.loadCollections();
      });
    }
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

  onImageError(collection: any) {
    collection.imageError = true;
  }
}