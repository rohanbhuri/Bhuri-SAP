import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { CmsService } from '../cms.service';
import { BlogDialogComponent } from '../dialogs/blog-dialog.component';

@Component({
  selector: 'app-blogs-page',
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
        <h2>Blog Posts</h2>
        <button mat-raised-button color="primary" (click)="openBlogDialog()">
          <mat-icon>add</mat-icon>
          Add Blog Post
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="blogs()" class="cms-table">
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
    </div>
  `,
  styles: [`
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
  blogColumns = ['title', 'status', 'tags', 'seo', 'published', 'actions'];

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.cmsService.getBlogs().subscribe(blogs => {
      this.blogs.set(blogs);
    });
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