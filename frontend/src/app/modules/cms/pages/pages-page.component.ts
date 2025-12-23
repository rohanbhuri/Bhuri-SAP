import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { CmsService } from '../cms.service';
import { PageDialogComponent } from '../dialogs/page-dialog.component';

@Component({
  selector: 'app-pages-page',
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
        <h2>Pages</h2>
        <button mat-raised-button color="primary" (click)="openPageDialog()">
          <mat-icon>add</mat-icon>
          Add Page
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="pages()" class="cms-table">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let page">
              <div class="page-info">
                <mat-icon class="page-icon">article</mat-icon>
                <div>
                  <div class="page-title">{{ page.title }}</div>
                  <div class="page-slug">/{{ page.slug }}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let page">
              <mat-chip [color]="getStatusColor(page.status)">
                {{ page.status | titlecase }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="seo">
            <th mat-header-cell *matHeaderCellDef>SEO</th>
            <td mat-cell *matCellDef="let page">
              <mat-chip [color]="page.seo?.title ? 'primary' : 'warn'">
                {{ page.seo?.title ? 'Optimized' : 'Needs SEO' }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="updated">
            <th mat-header-cell *matHeaderCellDef>Last Updated</th>
            <td mat-cell *matCellDef="let page">
              {{ formatDate(page.updatedAt || page.createdAt) }}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let page">
              <button mat-icon-button [matMenuTriggerFor]="pageMenu" class="action-button">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #pageMenu="matMenu">
                <button mat-menu-item (click)="editPage(page)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="editSEO(page)">
                  <mat-icon>search</mat-icon>
                  <span>SEO Settings</span>
                </button>
                <button mat-menu-item (click)="duplicatePage(page)">
                  <mat-icon>content_copy</mat-icon>
                  <span>Duplicate</span>
                </button>
                <button mat-menu-item (click)="previewPage(page)" [disabled]="page.status === 'draft'">
                  <mat-icon>visibility</mat-icon>
                  <span>Preview</span>
                </button>
                <button mat-menu-item (click)="deletePage(page._id)" class="text-red-600">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="pageColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: pageColumns"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .page-icon {
      color: #2196F3;
    }
    .page-title {
      font-weight: 500;
      color: #333;
    }
    .page-slug {
      font-size: 0.875rem;
      color: #666;
    }
    .text-red-600 {
      color: #dc2626;
    }
  `]
})
export class PagesPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private cmsService = inject(CmsService);

  pages = signal<any[]>([]);
  pageColumns = ['title', 'status', 'seo', 'updated', 'actions'];

  ngOnInit() {
    this.loadPages();
  }

  loadPages() {
    this.cmsService.getPages().subscribe(pages => {
      this.pages.set(pages);
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

  openPageDialog() {
    const dialogRef = this.dialog.open(PageDialogComponent, {
      width: '800px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPages();
      }
    });
  }

  editPage(page: any) {
    const dialogRef = this.dialog.open(PageDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { page }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPages();
      }
    });
  }

  editSEO(page: any) {
    const dialogRef = this.dialog.open(PageDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { page, focusTab: 'seo' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPages();
      }
    });
  }

  duplicatePage(page: any) {
    const duplicatedPage = {
      ...page,
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy`,
      status: 'draft'
    };
    delete duplicatedPage._id;

    this.cmsService.createPage(duplicatedPage).subscribe(() => {
      this.loadPages();
    });
  }

  previewPage(page: any) {
    window.open(`/preview/page/${page.slug}`, '_blank');
  }

  deletePage(id: string) {
    if (confirm('Are you sure you want to delete this page?')) {
      this.cmsService.deletePage(id).subscribe(() => {
        this.loadPages();
      });
    }
  }
}