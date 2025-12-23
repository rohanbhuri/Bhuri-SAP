import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CmsService } from '../cms.service';

@Component({
  selector: 'app-page-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>{{ isEdit ? 'Edit Page' : 'Create New Page' }}</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <mat-tab-group [selectedIndex]="selectedTabIndex()">
        <mat-tab label="Content">
          <div class="tab-content">
            <form [formGroup]="pageForm" class="page-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Page Title</mat-label>
                <input matInput formControlName="title" placeholder="Enter page title">
                <mat-error *ngIf="pageForm.get('title')?.hasError('required')">
                  Title is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>URL Slug</mat-label>
                <input matInput formControlName="slug" placeholder="page-url-slug">
                <mat-hint>This will be the page URL: /{{ pageForm.get('slug')?.value || 'page-url' }}</mat-hint>
                <mat-error *ngIf="pageForm.get('slug')?.hasError('required')">
                  Slug is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="draft">Draft</mat-option>
                  <mat-option value="published">Published</mat-option>
                  <mat-option value="archived">Archived</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Content</mat-label>
                <textarea matInput formControlName="content" rows="10" 
                         placeholder="Enter page content (HTML supported)"></textarea>
              </mat-form-field>
            </form>
          </div>
        </mat-tab>

        <mat-tab label="SEO Settings">
          <div class="tab-content">
            <form [formGroup]="seoForm" class="seo-form">
              <div class="seo-preview">
                <h3>Search Engine Preview</h3>
                <div class="preview-card">
                  <div class="preview-title">{{ seoForm.get('title')?.value || pageForm.get('title')?.value || 'Page Title' }}</div>
                  <div class="preview-url">{{ getPreviewUrl() }}</div>
                  <div class="preview-description">{{ seoForm.get('description')?.value || 'No description available' }}</div>
                </div>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>SEO Title</mat-label>
                <input matInput formControlName="title" placeholder="SEO optimized title">
                <mat-hint>{{ (seoForm.get('title')?.value || '').length }}/60 characters</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Meta Description</mat-label>
                <textarea matInput formControlName="description" rows="3" 
                         placeholder="Brief description for search engines"></textarea>
                <mat-hint>{{ (seoForm.get('description')?.value || '').length }}/160 characters</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Keywords</mat-label>
                <input matInput formControlName="keywords" placeholder="keyword1, keyword2, keyword3">
                <mat-hint>Separate keywords with commas</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Open Graph Image URL</mat-label>
                <input matInput formControlName="ogImage" placeholder="https://example.com/image.jpg">
                <mat-hint>Image for social media sharing</mat-hint>
              </mat-form-field>

              <div class="seo-score">
                <h4>SEO Score: {{ getSeoScore() }}/100</h4>
                <div class="score-items">
                  <div class="score-item" [class.complete]="seoForm.get('title')?.value">
                    <mat-icon>{{ seoForm.get('title')?.value ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    SEO Title ({{ (seoForm.get('title')?.value || '').length }}/60 chars)
                  </div>
                  <div class="score-item" [class.complete]="seoForm.get('description')?.value">
                    <mat-icon>{{ seoForm.get('description')?.value ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    Meta Description ({{ (seoForm.get('description')?.value || '').length }}/160 chars)
                  </div>
                  <div class="score-item" [class.complete]="seoForm.get('keywords')?.value">
                    <mat-icon>{{ seoForm.get('keywords')?.value ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    Keywords
                  </div>
                  <div class="score-item" [class.complete]="pageForm.get('slug')?.value">
                    <mat-icon>{{ pageForm.get('slug')?.value ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    URL Slug
                  </div>
                </div>
              </div>
            </form>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="savePage()" [disabled]="!pageForm.valid">
        {{ isEdit ? 'Update' : 'Create' }} Page
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .dialog-header h2 {
      margin: 0;
    }
    
    .tab-content {
      padding: 1.5rem 0;
    }
    
    .page-form, .seo-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .full-width {
      width: 100%;
    }
    
    .seo-preview {
      margin-bottom: 2rem;
    }
    
    .seo-preview h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }
    
    .preview-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      background: #f9f9f9;
    }
    
    .preview-title {
      color: #1a0dab;
      font-size: 1.125rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    
    .preview-url {
      color: #006621;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    
    .preview-description {
      color: #545454;
      font-size: 0.875rem;
      line-height: 1.4;
    }
    
    .seo-score {
      margin-top: 2rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
    }
    
    .seo-score h4 {
      margin: 0 0 1rem 0;
      color: #333;
    }
    
    .score-items {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .score-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
    }
    
    .score-item.complete {
      color: #4CAF50;
    }
    
    .score-item mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }
  `]
})
export class PageDialogComponent implements OnInit {
  pageForm: FormGroup;
  seoForm: FormGroup;
  isEdit = false;
  selectedTabIndex = signal(0);

  constructor(
    private fb: FormBuilder,
    private cmsService: CmsService,
    private dialogRef: MatDialogRef<PageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.pageForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      content: [''],
      status: ['draft']
    });

    this.seoForm = this.fb.group({
      title: [''],
      description: [''],
      keywords: [''],
      ogImage: ['']
    });
  }

  ngOnInit() {
    if (this.data?.page) {
      this.isEdit = true;
      this.pageForm.patchValue(this.data.page);
      if (this.data.page.seo) {
        this.seoForm.patchValue(this.data.page.seo);
      }
    }

    if (this.data?.focusTab === 'seo') {
      this.selectedTabIndex.set(1);
    }

    // Auto-generate slug from title
    this.pageForm.get('title')?.valueChanges.subscribe(title => {
      if (title && !this.isEdit) {
        const slug = title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        this.pageForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  getPreviewUrl(): string {
    const slug = this.pageForm.get('slug')?.value || 'page-url';
    return `https://yoursite.com/${slug}`;
  }

  getSeoScore(): number {
    let score = 0;
    if (this.seoForm.get('title')?.value) score += 30;
    if (this.seoForm.get('description')?.value) score += 30;
    if (this.seoForm.get('keywords')?.value) score += 20;
    if (this.pageForm.get('slug')?.value) score += 20;
    return score;
  }

  savePage() {
    if (this.pageForm.valid) {
      const pageData = {
        ...this.pageForm.value,
        seo: this.seoForm.value
      };

      const request = this.isEdit 
        ? this.cmsService.updatePage(this.data.page._id, pageData)
        : this.cmsService.createPage(pageData);

      request.subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}