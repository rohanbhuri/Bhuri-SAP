import { Component, Inject, OnInit, signal, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';
import { CmsService } from '../cms.service';
import { getBrandConfig } from '../../../brand.config';
import Quill from 'quill';

@Component({
  selector: 'app-blog-dialog',
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
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>{{ isEdit ? 'Edit Blog Post' : 'Create New Blog Post' }}</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <mat-tab-group [selectedIndex]="selectedTabIndex()">
        <mat-tab label="Content">
          <div class="tab-content">
            <form [formGroup]="blogForm" class="blog-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Blog Title</mat-label>
                <input matInput formControlName="title" placeholder="Enter blog title">
                <mat-error *ngIf="blogForm.get('title')?.hasError('required')">
                  Title is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>URL Slug</mat-label>
                <input matInput formControlName="slug" placeholder="blog-url-slug">
                <mat-hint>This will be the blog URL: /blog/{{ blogForm.get('slug')?.value || 'blog-url' }}</mat-hint>
                <mat-error *ngIf="blogForm.get('slug')?.hasError('required')">
                  Slug is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Excerpt</mat-label>
                <textarea matInput formControlName="excerpt" rows="2" 
                         placeholder="Brief summary of the blog post"></textarea>
                <mat-hint>{{ (blogForm.get('excerpt')?.value || '').length }}/160 characters</mat-hint>
              </mat-form-field>

              <div class="image-upload-section">
                <label class="upload-label">Featured Image</label>
                <div class="upload-container">
                  <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none">
                  <button mat-stroked-button type="button" (click)="fileInput.click()" [disabled]="uploading()">
                    <mat-icon>upload</mat-icon>
                    Upload Image
                  </button>
                  <span class="upload-hint">or enter URL below</span>
                </div>
                <mat-progress-bar *ngIf="uploading()" mode="indeterminate"></mat-progress-bar>
                <div *ngIf="blogForm.get('featuredImage')?.value" class="image-preview">
                  <img [src]="blogForm.get('featuredImage')?.value" alt="Featured image preview">
                  <button mat-icon-button type="button" (click)="removeFeaturedImage()" class="remove-btn">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Featured Image URL</mat-label>
                <input matInput formControlName="featuredImage" placeholder="https://example.com/image.jpg">
              </mat-form-field>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Status</mat-label>
                  <mat-select formControlName="status">
                    <mat-option value="draft">Draft</mat-option>
                    <mat-option value="published">Published</mat-option>
                    <mat-option value="archived">Archived</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Publish Date</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="publishedAt">
                  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>
              </div>

              <div class="featured-toggle">
                <mat-slide-toggle formControlName="isFeatured" color="primary">
                  <div class="toggle-content">
                    <mat-icon>star</mat-icon>
                    <span>Featured Post</span>
                  </div>
                </mat-slide-toggle>
                <p class="toggle-hint">Featured posts will be highlighted on the homepage and blog listing</p>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Tags</mat-label>
                <input matInput formControlName="tagsInput" placeholder="tag1, tag2, tag3" 
                       (blur)="updateTags()">
                <mat-hint>Separate tags with commas</mat-hint>
              </mat-form-field>

              <div class="tags-display" *ngIf="tags().length > 0">
                <mat-chip-set>
                  <mat-chip *ngFor="let tag of tags()" (removed)="removeTag(tag)">
                    {{ tag }}
                    <mat-icon matChipRemove>cancel</mat-icon>
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="editor-field">
                <label>Content (Rich Text)</label>
                <div #contentEditor class="quill-editor"></div>
              </div>
            </form>
          </div>
        </mat-tab>

        <mat-tab label="SEO Settings">
          <div class="tab-content">
            <form [formGroup]="seoForm" class="seo-form">
              <div class="seo-preview">
                <h3>Search Engine Preview</h3>
                <div class="preview-card">
                  <div class="preview-title">{{ seoForm.get('title')?.value || blogForm.get('title')?.value || 'Blog Title' }}</div>
                  <div class="preview-url">{{ getPreviewUrl() }}</div>
                  <div class="preview-description">{{ seoForm.get('description')?.value || blogForm.get('excerpt')?.value || 'No description available' }}</div>
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
                <mat-hint>Image for social media sharing (defaults to featured image)</mat-hint>
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
                  <div class="score-item" [class.complete]="blogForm.get('featuredImage')?.value">
                    <mat-icon>{{ blogForm.get('featuredImage')?.value ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    Featured Image
                  </div>
                  <div class="score-item" [class.complete]="tags().length > 0">
                    <mat-icon>{{ tags().length > 0 ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    Tags ({{ tags().length }})
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
      <button mat-raised-button color="primary" (click)="saveBlog()" [disabled]="!blogForm.valid">
        {{ isEdit ? 'Update' : 'Create' }} Blog Post
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
    
    .blog-form, .seo-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .full-width {
      width: 100%;
    }
    
    .form-row {
      display: flex;
      gap: 1rem;
    }
    
    .half-width {
      flex: 1;
    }
    
    .tags-display {
      margin-top: -0.5rem;
      margin-bottom: 0.5rem;
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

    .image-upload-section {
      margin-bottom: 1rem;
    }

    .upload-label, .editor-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 0.5rem;
    }

    .upload-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .upload-hint {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.875rem;
    }

    .image-preview {
      position: relative;
      margin-top: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      max-width: 400px;
    }

    .image-preview img {
      width: 100%;
      height: auto;
      display: block;
    }

    .remove-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
    }

    .remove-btn:hover {
      background: rgba(0, 0, 0, 0.8);
    }

    .featured-toggle {
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
      margin: 0.5rem 0;
    }

    .toggle-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .toggle-content mat-icon {
      color: #ffa502;
    }

    .toggle-hint {
      margin: 0.5rem 0 0 0;
      font-size: 0.75rem;
      color: rgba(0, 0, 0, 0.6);
    }

    .editor-field {
      margin: 1rem 0;
    }
    .editor-field label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #666;
    }
    .quill-editor {
      min-height: 300px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    ::ng-deep .ql-toolbar {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    ::ng-deep .ql-container {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  `]
})
export class BlogDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('contentEditor') contentEditorElement!: ElementRef;
  private http = inject(HttpClient);
  blogForm: FormGroup;
  seoForm: FormGroup;
  isEdit = false;
  selectedTabIndex = signal(0);
  tags = signal<string[]>([]);
  uploading = signal(false);
  quillEditor: any;

  constructor(
    private fb: FormBuilder,
    private cmsService: CmsService,
    private dialogRef: MatDialogRef<BlogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      excerpt: [''],
      content: [''],
      featuredImage: [''],
      status: ['draft'],
      isFeatured: [false],
      publishedAt: [null],
      tagsInput: ['']
    });

    this.seoForm = this.fb.group({
      title: [''],
      description: [''],
      keywords: [''],
      ogImage: ['']
    });
  }

  ngOnInit() {
    if (this.data?.blog) {
      this.isEdit = true;
      this.blogForm.patchValue(this.data.blog);
      if (this.data.blog.seo) {
        this.seoForm.patchValue(this.data.blog.seo);
      }
      if (this.data.blog.tags) {
        this.tags.set(this.data.blog.tags);
        this.blogForm.patchValue({ tagsInput: this.data.blog.tags.join(', ') });
      }
    }

    if (this.data?.focusTab === 'seo') {
      this.selectedTabIndex.set(1);
    }

    // Auto-generate slug from title
    this.blogForm.get('title')?.valueChanges.subscribe(title => {
      if (title && !this.isEdit) {
        const slug = title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        this.blogForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  getPreviewUrl(): string {
    const slug = this.blogForm.get('slug')?.value || 'blog-url';
    return `https://yoursite.com/blog/${slug}`;
  }

  getSeoScore(): number {
    let score = 0;
    if (this.seoForm.get('title')?.value) score += 25;
    if (this.seoForm.get('description')?.value) score += 25;
    if (this.seoForm.get('keywords')?.value) score += 20;
    if (this.blogForm.get('featuredImage')?.value) score += 15;
    if (this.tags().length > 0) score += 15;
    return score;
  }

  updateTags() {
    const tagsInput = this.blogForm.get('tagsInput')?.value || '';
    const newTags = tagsInput.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
    this.tags.set(newTags);
  }

  removeTag(tagToRemove: string) {
    const currentTags = this.tags().filter(tag => tag !== tagToRemove);
    this.tags.set(currentTags);
    this.blogForm.patchValue({ tagsInput: currentTags.join(', ') });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadImage(file);
    }
  }

  uploadImage(file: File) {
    this.uploading.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>(`${getBrandConfig().app.apiUrl}/media/upload`, formData)
      .subscribe({
        next: (response) => {
          const imageUrl = `${getBrandConfig().app.apiUrl}${response.url}`;
          this.blogForm.patchValue({ featuredImage: imageUrl });
          this.uploading.set(false);
        },
        error: () => {
          this.uploading.set(false);
          alert('Failed to upload image');
        }
      });
  }

  removeFeaturedImage() {
    this.blogForm.patchValue({ featuredImage: '' });
  }

  ngAfterViewInit() {
    this.quillEditor = new Quill(this.contentEditorElement.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image'],
          ['clean']
        ]
      }
    });

    // Disable Grammarly on Quill editor
    this.quillEditor.root.setAttribute('data-gramm', 'false');
    this.quillEditor.root.setAttribute('data-gramm_editor', 'false');
    this.quillEditor.root.setAttribute('data-enable-grammarly', 'false');

    if (this.data?.blog?.content) {
      this.quillEditor.root.innerHTML = this.data.blog.content;
    }

    this.quillEditor.on('text-change', () => {
      this.blogForm.patchValue({ content: this.quillEditor.root.innerHTML });
    });
  }

  saveBlog() {
    if (this.blogForm.valid) {
      const blogData = {
        ...this.blogForm.value,
        tags: this.tags(),
        seo: {
          ...this.seoForm.value,
          ogImage: this.seoForm.value.ogImage || this.blogForm.value.featuredImage
        }
      };
      delete blogData.tagsInput;

      const request = this.isEdit 
        ? this.cmsService.updateBlog(this.data.blog._id, blogData)
        : this.cmsService.createBlog(blogData);

      request.subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}