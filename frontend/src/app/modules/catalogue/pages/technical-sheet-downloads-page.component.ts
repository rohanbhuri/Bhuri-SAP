import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { CatalogueService } from '../catalogue.service';
import { FormsModule } from '@angular/forms';

interface DownloadRecord {
  _id: string;
  productId: string;
  productCode: string;
  productName: string;
  email: string;
  ipAddress: string;
  userAgent?: string;
  referrer?: string;
  downloadedAt: Date;
}

@Component({
  selector: 'app-technical-sheet-downloads-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    FormsModule
  ],
  template: `
    <div class="technical-sheet-downloads-page">
      <div class="page-header">
        <div class="header-info">
          <h2>Technical Sheet Downloads</h2>
          <p class="subtitle">Track who downloaded product technical sheets</p>
        </div>
        <button mat-raised-button color="primary" (click)="refreshData()">
          <mat-icon>refresh</mat-icon>
          Refresh
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid" *ngIf="!loading()">
        <mat-card class="stat-card">
          <mat-icon class="stat-icon primary">download</mat-icon>
          <div class="stat-content">
            <div class="stat-value">{{ stats().totalDownloads }}</div>
            <div class="stat-label">Total Downloads</div>
          </div>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-icon class="stat-icon secondary">email</mat-icon>
          <div class="stat-content">
            <div class="stat-value">{{ stats().uniqueEmails }}</div>
            <div class="stat-label">Unique Users</div>
          </div>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-icon class="stat-icon tertiary">inventory_2</mat-icon>
          <div class="stat-content">
            <div class="stat-value">{{ stats().productsWithDownloads }}</div>
            <div class="stat-label">Products Downloaded</div>
          </div>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-icon class="stat-icon accent">today</mat-icon>
          <div class="stat-content">
            <div class="stat-value">{{ stats().downloadsToday }}</div>
            <div class="stat-label">Downloads Today</div>
          </div>
        </mat-card>
      </div>

      <!-- Search and Filter -->
      <div class="table-controls">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Search by product, email, or code">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading()">
        <mat-spinner></mat-spinner>
        <p>Loading download records...</p>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading() && dataSource.data.length === 0">
        <mat-icon>download_done</mat-icon>
        <h3>No Downloads Yet</h3>
        <p>Technical sheet downloads will appear here once users start downloading.</p>
      </div>

      <!-- Data Table -->
      <div class="table-container" *ngIf="!loading() && dataSource.data.length > 0">
        <table mat-table [dataSource]="dataSource" matSort class="downloads-table">
          
          <!-- Product Name Column -->
          <ng-container matColumnDef="productName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Product Name</th>
            <td mat-cell *matCellDef="let row">
              <div class="product-cell">
                <mat-icon class="product-icon">inventory_2</mat-icon>
                <span class="product-name">{{ row.productName }}</span>
              </div>
            </td>
          </ng-container>

          <!-- Product Code Column -->
          <ng-container matColumnDef="productCode">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Product Code</th>
            <td mat-cell *matCellDef="let row">
              <mat-chip class="code-chip">{{ row.productCode }}</mat-chip>
            </td>
          </ng-container>

          <!-- Downloaded By Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Downloaded By</th>
            <td mat-cell *matCellDef="let row">
              <div class="email-cell">
                <mat-icon class="email-icon">email</mat-icon>
                <span>{{ row.email }}</span>
              </div>
            </td>
          </ng-container>

          <!-- Downloaded At Column -->
          <ng-container matColumnDef="downloadedAt">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Downloaded At</th>
            <td mat-cell *matCellDef="let row">
              <div class="date-cell">
                <div class="date">{{ formatDate(row.downloadedAt) }}</div>
                <div class="time">{{ formatTime(row.downloadedAt) }}</div>
              </div>
            </td>
          </ng-container>

          <!-- IP Address Column -->
          <ng-container matColumnDef="ipAddress">
            <th mat-header-cell *matHeaderCellDef>IP Address</th>
            <td mat-cell *matCellDef="let row">
              <span class="ip-address">{{ row.ipAddress }}</span>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button [matMenuTriggerFor]="menu" (click)="$event.stopPropagation()">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="viewDetails(row)">
                  <mat-icon>info</mat-icon>
                  <span>View Details</span>
                </button>
                <button mat-menu-item (click)="viewProduct(row.productId)">
                  <mat-icon>open_in_new</mat-icon>
                  <span>View Product</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
        </table>

        <mat-paginator 
          [pageSizeOptions]="[10, 25, 50, 100]" 
          [pageSize]="25"
          showFirstLastButtons>
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .technical-sheet-downloads-page {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .header-info h2 {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 600;
    }

    .subtitle {
      margin: 0;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-radius: 12px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.primary { color: #1976d2; }
    .stat-icon.secondary { color: #7b1fa2; }
    .stat-icon.tertiary { color: #388e3c; }
    .stat-icon.accent { color: #f57c00; }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 500;
    }

    .table-controls {
      margin-bottom: 16px;
    }

    .search-field {
      width: 100%;
      max-width: 400px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      gap: 16px;
    }

    .loading-container p {
      color: rgba(0, 0, 0, 0.6);
      margin: 0;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: rgba(0, 0, 0, 0.3);
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 500;
    }

    .empty-state p {
      margin: 0;
      color: rgba(0, 0, 0, 0.6);
    }

    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .downloads-table {
      width: 100%;
    }

    .table-row {
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .table-row:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }

    .product-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .product-icon {
      color: #1976d2;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .product-name {
      font-weight: 500;
    }

    .code-chip {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      font-weight: 600;
    }

    .email-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .email-icon {
      color: #7b1fa2;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .date-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .date {
      font-weight: 500;
      font-size: 14px;
    }

    .time {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
    }

    .ip-address {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.7);
    }

    mat-paginator {
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }

    @media (max-width: 768px) {
      .technical-sheet-downloads-page {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
      }

      .page-header button {
        width: 100%;
      }
    }
  `]
})
export class TechnicalSheetDownloadsPageComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['productName', 'productCode', 'email', 'downloadedAt', 'ipAddress', 'actions'];
  dataSource = new MatTableDataSource<DownloadRecord>([]);
  loading = signal(true);
  stats = signal({
    totalDownloads: 0,
    uniqueEmails: 0,
    productsWithDownloads: 0,
    downloadsToday: 0
  });

  constructor(private catalogueService: CatalogueService) {}

  ngOnInit() {
    this.loadDownloads();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDownloads() {
    this.loading.set(true);
    this.catalogueService.getAllTechnicalSheetDownloads().subscribe({
      next: (downloads: DownloadRecord[]) => {
        this.dataSource.data = downloads;
        this.calculateStats(downloads);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load downloads:', err);
        this.loading.set(false);
      }
    });
  }

  calculateStats(downloads: DownloadRecord[]) {
    const uniqueEmails = new Set(downloads.map(d => d.email)).size;
    const uniqueProducts = new Set(downloads.map(d => d.productId)).size;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const downloadsToday = downloads.filter(d => {
      const downloadDate = new Date(d.downloadedAt);
      downloadDate.setHours(0, 0, 0, 0);
      return downloadDate.getTime() === today.getTime();
    }).length;

    this.stats.set({
      totalDownloads: downloads.length,
      uniqueEmails,
      productsWithDownloads: uniqueProducts,
      downloadsToday
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshData() {
    this.loadDownloads();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  viewDetails(row: DownloadRecord) {
    alert(`Download Details:\n\nProduct: ${row.productName}\nCode: ${row.productCode}\nEmail: ${row.email}\nIP: ${row.ipAddress}\nUser Agent: ${row.userAgent || 'N/A'}\nReferrer: ${row.referrer || 'N/A'}\nDate: ${this.formatDate(row.downloadedAt)} ${this.formatTime(row.downloadedAt)}`);
  }

  viewProduct(productId: string) {
    // Navigate to product or open product dialog
    console.log('View product:', productId);
  }
}
