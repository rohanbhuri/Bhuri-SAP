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

@Component({
  selector: 'app-collections-page',
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
        <h2>Collections</h2>
        <button mat-raised-button color="primary" (click)="openCollectionDialog()">
          <mat-icon>add</mat-icon>
          Add Collection
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="collections()" class="catalogue-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let collection">
              <div class="collection-info">
                <mat-icon class="collection-icon">collections</mat-icon>
                <div>
                  <div class="collection-name">{{ collection.name }}</div>
                  <div class="collection-slug">{{ collection.slug }}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let collection">{{ collection.description || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="products">
            <th mat-header-cell *matHeaderCellDef>Products</th>
            <td mat-cell *matCellDef="let collection">{{ getProductCount(collection._id) }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let collection">
              <mat-chip [color]="collection.isActive ? 'primary' : 'warn'">
                {{ collection.isActive ? 'Active' : 'Inactive' }}
              </mat-chip>
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
                <button mat-menu-item (click)="manageProducts(collection)">
                  <mat-icon>inventory</mat-icon>
                  <span>Manage Products</span>
                </button>
                <button mat-menu-item (click)="toggleActive(collection)">
                  <mat-icon>{{ collection.isActive ? 'visibility_off' : 'visibility' }}</mat-icon>
                  <span>{{ collection.isActive ? 'Deactivate' : 'Activate' }}</span>
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
    .collection-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .collection-icon {
      color: #FF9800;
    }
    .collection-name {
      font-weight: 500;
      color: #333;
    }
    .collection-slug {
      font-size: 0.875rem;
      color: #666;
    }
  `]
})
export class CollectionsPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private catalogueService = inject(CatalogueService);

  collections = signal<any[]>([]);
  products = signal<any[]>([]);
  collectionColumns = ['name', 'description', 'products', 'status', 'actions'];

  ngOnInit() {
    this.loadCollections();
    this.loadProducts();
  }

  loadCollections() {
    this.catalogueService.getCollections().subscribe(collections => {
      this.collections.set(collections);
    });
  }

  loadProducts() {
    this.catalogueService.getProducts().subscribe(products => {
      this.products.set(products);
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
}