import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CmsService } from '../cms.service';
import { NewsMediaDialogComponent } from '../dialogs/news-media-dialog.component';

@Component({
  selector: 'app-news-media-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule
  ],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>News & Media</h2>
        <button mat-raised-button color="primary" (click)="openNewsMediaDialog()">
          <mat-icon>add</mat-icon>
          Add News Item
        </button>
      </div>

      <div class="filters-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search news</mat-label>
          <input matInput [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Search by title...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilters()">
            <mat-option value="all">All</mat-option>
            <mat-option value="published">Published</mat-option>
            <mat-option value="draft">Draft</mat-option>
            <mat-option value="archived">Archived</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-icon-button (click)="clearFilters()" matTooltip="Clear filters">
          <mat-icon>clear</mat-icon>
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="paginatedNewsMedia()" class="cms-table">
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef>Image</th>
            <td mat-cell *matCellDef="let item">
              <div class="news-image">
                <img [src]="item.featuredImage || 'assets/placeholder.png'" [alt]="item.title">
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let item">
              <div class="news-info">
                <mat-icon class="news-icon">newspaper</mat-icon>
                <div>
                  <div class="news-title">{{ item.title }}</div>
                  <div class="news-excerpt">{{ item.excerpt || 'No excerpt' }}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let item">
              <mat-chip [color]="getStatusColor(item.status)">
                {{ item.status | titlecase }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="media">
            <th mat-header-cell *matHeaderCellDef>Media Files</th>
            <td mat-cell *matCellDef="let item">
              <div class="media-count">
                <mat-icon>perm_media</mat-icon>
                {{ item.mediaFiles?.length || 0 }} files
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="tags">
            <th mat-header-cell *matHeaderCellDef>Tags</th>
            <td mat-cell *matCellDef="let item">
              <div class="tags-container">
                <mat-chip *ngFor="let tag of item.tags?.slice(0, 2)" class="tag-chip">
                  {{ tag }}
                </mat-chip>
                <span *ngIf="item.tags?.length > 2" class="more-tags">
                  +{{ item.tags.length - 2 }} more
                </span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="published">
            <th mat-header-cell *matHeaderCellDef>Published</th>
            <td mat-cell *matCellDef="let item">
              {{ item.publishedAt ? formatDate(item.publishedAt) : '-' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let item">
              <button mat-icon-button [matMenuTriggerFor]="newsMenu" class="action-button">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #newsMenu="matMenu">
                <button mat-menu-item (click)="editNewsMedia(item)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="duplicateNewsMedia(item)">
                  <mat-icon>content_copy</mat-icon>
                  <span>Duplicate</span>
                </button>
                <button mat-menu-item (click)="deleteNewsMedia(item._id)" class="text-red-600">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="newsColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: newsColumns"></tr>
        </table>
      </div>

      <mat-paginator
        [length]="filteredNewsMedia().length"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25, 50]"
        (page)="onPageChange($event)"
        showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
  styles: [`
    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem 2rem 1.5rem 2rem;
      background: white;
      margin: 0;
    }
    .tab-header h2 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 600;
    }
    .filters-section {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      padding: 2rem;
      background: white;
      border-bottom: 1px solid #e8e8e8;
    }
    .search-field {
      flex: 1;
      max-width: 500px;
    }
    .filter-field {
      min-width: 200px;
    }
    .table-container {
      background: white;
    }
    .news-image {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .news-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .news-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .news-icon {
      color: #2196F3;
    }
    .news-title {
      font-weight: 500;
      color: #333;
    }
    .news-excerpt {
      font-size: 0.875rem;
      color: #666;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .media-count {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
    }
    .tags-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .tag-chip {
      font-size: 0.75rem;
      height: 24px;
    }
    .more-tags {
      font-size: 0.75rem;
      color: #666;
    }
    .text-red-600 {
      color: #dc2626;
    }
  `]
})
export class NewsMediaPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private cmsService = inject(CmsService);

  newsMediaItems = signal<any[]>([]);
  filteredNewsMedia = signal<any[]>([]);
  paginatedNewsMedia = signal<any[]>([]);
  newsColumns = ['image', 'title', 'status', 'media', 'tags', 'published', 'actions'];
  
  searchTerm = '';
  statusFilter = 'all';
  pageSize = 10;
  pageIndex = 0;

  ngOnInit() {
    this.loadNewsMedia();
  }

  loadNewsMedia() {
    this.cmsService.getNewsMedia().subscribe(items => {
      this.newsMediaItems.set(items);
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = this.newsMediaItems();

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(term) ||
        item.excerpt?.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === this.statusFilter);
    }

    this.filteredNewsMedia.set(filtered);
    this.pageIndex = 0;
    this.updatePagination();
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePagination();
  }

  updatePagination() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedNewsMedia.set(this.filteredNewsMedia().slice(start, end));
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'published': return 'primary';
      case 'draft': return 'accent';
      case 'archived': return 'warn';
      default: return '';
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  openNewsMediaDialog() {
    const dialogRef = this.dialog.open(NewsMediaDialogComponent, {
      width: '800px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadNewsMedia();
      }
    });
  }

  editNewsMedia(item: any) {
    const dialogRef = this.dialog.open(NewsMediaDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { newsMedia: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadNewsMedia();
      }
    });
  }

  duplicateNewsMedia(item: any) {
    const duplicated = {
      ...item,
      title: `${item.title} (Copy)`,
      slug: `${item.slug}-copy`,
      status: 'draft'
    };
    delete duplicated._id;

    this.cmsService.createNewsMedia(duplicated).subscribe(() => {
      this.loadNewsMedia();
    });
  }

  deleteNewsMedia(id: string) {
    if (confirm('Are you sure you want to delete this news item?')) {
      this.cmsService.deleteNewsMedia(id).subscribe(() => {
        this.loadNewsMedia();
      });
    }
  }
}
