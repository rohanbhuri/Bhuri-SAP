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
import { BlogDialogComponent } from '../dialogs/blog-dialog.component';

@Component({
  selector: 'app-blogs-page',
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
        <h2>Blog Posts</h2>
        <button mat-raised-button color="primary" (click)="openBlogDialog()">
          <mat-icon>add</mat-icon>
          Add Blog Post
        </button>
      </div>

      <div class="filters-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search blogs</mat-label>
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
        <table mat-table [dataSource]="paginatedBlogs()" class="cms-table">
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef>Image</th>
            <td mat-cell *matCellDef="let blog">
              <div class="blog-image">
                <img [src]="blog.featuredImage || 'assets/placeholder.png'" [alt]="blog.title">
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let blog">
              <div class="blog-info">
                <mat-icon class="blog-icon">article</mat-icon>
                <div>
                  <div class="blog-title">{{ blog.title }}</div>
                  <div class="blog-excerpt">{{ blog.excerpt || 'No excerpt' }}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let blog">
              <mat-chip [color]="getStatusColor(blog.status)">
                {{ blog.status | titlecase }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="tags">
            <th mat-header-cell *matHeaderCellDef>Tags</th>
            <td mat-cell *matCellDef="let blog">
              <div class="tags-container">
                <mat-chip *ngFor="let tag of blog.tags?.slice(0, 2)" class="tag-chip">
                  {{ tag }}
                </mat-chip>
                <span *ngIf="blog.tags?.length > 2" class="more-tags">
                  +{{ blog.tags.length - 2 }} more
                </span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="seo">
            <th mat-header-cell *matHeaderCellDef>SEO</th>
            <td mat-cell *matCellDef="let blog">
              <mat-chip [color]="blog.seo?.title ? 'primary' : 'warn'">
                {{ blog.seo?.title ? 'Optimized' : 'Needs SEO' }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="published">
            <th mat-header-cell *matHeaderCellDef>Published</th>
            <td mat-cell *matCellDef="let blog">
              {{ blog.publishedAt ? formatDate(blog.publishedAt) : '-' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let blog">
              <button mat-icon-button [matMenuTriggerFor]="blogMenu" class="action-button">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #blogMenu="matMenu">
                <button mat-menu-item (click)="editBlog(blog)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="editSEO(blog)">
                  <mat-icon>search</mat-icon>
                  <span>SEO Settings</span>
                </button>
                <button mat-menu-item (click)="duplicateBlog(blog)">
                  <mat-icon>content_copy</mat-icon>
                  <span>Duplicate</span>
                </button>
                <button mat-menu-item (click)="previewBlog(blog)" [disabled]="blog.status === 'draft'">
                  <mat-icon>visibility</mat-icon>
                  <span>Preview</span>
                </button>
                <button mat-menu-item (click)="deleteBlog(blog._id)" class="text-red-600">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="blogColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: blogColumns"></tr>
        </table>
      </div>

      <mat-paginator
        [length]="filteredBlogs().length"
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
    .blog-image {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .blog-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .blog-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .blog-icon {
      color: #FF9800;
    }
    .blog-title {
      font-weight: 500;
      color: #333;
    }
    .blog-excerpt {
      font-size: 0.875rem;
      color: #666;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
export class BlogsPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private cmsService = inject(CmsService);

  blogs = signal<any[]>([]);
  filteredBlogs = signal<any[]>([]);
  paginatedBlogs = signal<any[]>([]);
  blogColumns = ['image', 'title', 'status', 'tags', 'seo', 'published', 'actions'];
  
  searchTerm = '';
  statusFilter = 'all';
  pageSize = 10;
  pageIndex = 0;

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.cmsService.getBlogs().subscribe(blogs => {
      this.blogs.set(blogs);
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = this.blogs();

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(blog => 
        blog.title?.toLowerCase().includes(term) ||
        blog.excerpt?.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(blog => blog.status === this.statusFilter);
    }

    this.filteredBlogs.set(filtered);
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
    this.paginatedBlogs.set(this.filteredBlogs().slice(start, end));
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

  openBlogDialog() {
    const dialogRef = this.dialog.open(BlogDialogComponent, {
      width: '800px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBlogs();
      }
    });
  }

  editBlog(blog: any) {
    const dialogRef = this.dialog.open(BlogDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { blog }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBlogs();
      }
    });
  }

  editSEO(blog: any) {
    const dialogRef = this.dialog.open(BlogDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { blog, focusTab: 'seo' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBlogs();
      }
    });
  }

  duplicateBlog(blog: any) {
    const duplicatedBlog = {
      ...blog,
      title: `${blog.title} (Copy)`,
      slug: `${blog.slug}-copy`,
      status: 'draft'
    };
    delete duplicatedBlog._id;

    this.cmsService.createBlog(duplicatedBlog).subscribe(() => {
      this.loadBlogs();
    });
  }

  previewBlog(blog: any) {
    window.open(`/preview/blog/${blog.slug}`, '_blank');
  }

  deleteBlog(id: string) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.cmsService.deleteBlog(id).subscribe(() => {
        this.loadBlogs();
      });
    }
  }
}