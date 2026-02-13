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
  selector: 'app-news-media-dialog',
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
      <h2 mat-dialog-title>{{ isEdit ? 'Edit News Item' : 'Create New News Item' }}</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <mat-tab-group [selectedIndex]="selectedTabIndex()">
        <mat-tab label="Content">
          <div class="tab-content">
            <form [formGroup]="newsForm" class="news-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>News Title</mat-label>
                <input matInput formControlName="title" placeholder="Enter news title">
                <mat-error *ngIf="newsForm.get('title')?.hasError('required')">
                  Title is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>URL Slug</mat-label>
                <input matInput formControlName="slug" placeholder="news-url-slug">
                <mat-hint>This will be the news URL: /news/{{ newsForm.get('slug')?.value || 'news-url' }}</mat-hint>
                <mat-error *ngIf="newsForm.get('slug')?.hasError('required')">
                  Slug is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Excerpt</mat-label>
                <textarea matInput formControlName="excerpt" rows="2" 
                         placeholder="Brief summary of the news"></textarea>
                <mat-hint>{{ (newsForm.get('excerpt')?.value || '').length }}/160 characters</mat-hint>
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
                <div *ngIf="newsForm.get('featuredImage')?.value" class="image-preview">
                  <img [src]="newsForm.get('featuredImage')?.value" alt="Featured image preview">
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
                    <span>Featured News</span>
                  </div>
                </mat-slide-toggle>
                <p class="toggle-hint">Featured news will be highlighted on the homepage and news listing</p>
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

        <mat-tab label="Media Gallery">
          <div class="tab-content">
            <div class="gallery-section">
              <h3>Image Gallery</h3>
              <p class="gallery-hint">Upload multiple images to create a gallery for this news item</p>
              
              <div class="gallery-upload">
                <input type="file" #galleryInput (change)="onGalleryFilesSelected($event)" 
                       accept="image/*" multiple style="display: none">
                <button mat-raised-button color="accent" type="button" 
                        (click)="galleryInput.click()" [disabled]="uploadingGallery()">
                  <mat-icon>add_photo_alternate</mat-icon>
                  Add Images to Gallery
                </button>
                <span class="upload-hint">Select multiple images (max 10)</span>
              </div>

              <mat-progress-bar *ngIf="uploadingGallery()" mode="indeterminate"></mat-progress-bar>

              <div class="gallery-grid" *ngIf="gallery().length > 0">
                <div class="gallery-item" *ngFor="let image of gallery(); let i = index">
                  <div class="gallery-image">
                    <img [src]="image.url" [alt]="image.caption || 'Gallery image'">
                    <button mat-icon-button class="remove-gallery-btn" 
                            (click)="removeGalleryImage(i)" type="button">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  <mat-form-field appearance="outline" class="caption-field">
                    <mat-label>Caption</mat-label>
                    <input matInput [value]="image.caption || ''" 
                           (blur)="updateGalleryCaption(i, $any($event.target).value)"
                           placeholder="Add image caption">
                  </mat-form-field>
                </div>
              </div>

              <div class="empty-gallery" *ngIf="gallery().length === 0">
                <mat-icon>photo_library</mat-icon>
                <p>No images in gallery yet</p>
                <p class="hint">Click "Add Images to Gallery" to upload images</p>
              </div>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="SEO Settings">
          <div class="tab-content">
            <form [formGroup]="seoForm" class="seo-form">
              <div class="seo-preview">
                <h3>Search Engine Preview</h3>
                <div class="preview-card">
                  <div class="preview-title">{{ seoForm.get('title')?.value || newsForm.get('title')?.value || 'News Title' }}</div>
                  <div class="preview-url">{{ getPreviewUrl() }}</div>
                  <div class="preview-description">{{ seoForm.get('description')?.value || newsForm.get('excerpt')?.value || 'No description available' }}</div>
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
                  <div class="score-item" [class.complete]="newsForm.get('featuredImage')?.value">
                    <mat-icon>{{ newsForm.get('featuredImage')?.value ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
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
      <button mat-raised-button color="primary" (click)="saveNews()" [disabled]="!newsForm.valid">
        {{ isEdit ? 'Update' : 'Create' }} News Item
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
    
    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
      position: relative;
    }

    .tab-content {
      padding: 1.5rem 0;
    }
    
    .news-form, .seo-form {
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
      position: relative;
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
      display: flex;
      flex-direction: column;
    }
    ::ng-deep .ql-toolbar {
      position: sticky;
      top: -24px;
      z-index: 100;
      background: white;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
    }
    ::ng-deep .ql-container {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      min-height: 300px;
      flex: 1;
    }
    ::ng-deep .ql-editor {
      min-height: 300px;
    }

    .gallery-section {
      padding: 1rem 0;
    }

    .gallery-section h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .gallery-hint {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.875rem;
      margin: 0 0 1.5rem 0;
    }

    .gallery-upload {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .gallery-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .gallery-image {
      position: relative;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      aspect-ratio: 16/9;
    }

    .gallery-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-gallery-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(244, 67, 54, 0.9);
      color: white;
    }

    .remove-gallery-btn:hover {
      background: rgba(244, 67, 54, 1);
    }

    .caption-field {
      width: 100%;
      margin: 0;
    }

    .empty-gallery {
      text-align: center;
      padding: 3rem 1rem;
      color: rgba(0, 0, 0, 0.4);
    }

    .empty-gallery mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 1rem;
    }

    .empty-gallery p {
      margin: 0.5rem 0;
    }

    .empty-gallery .hint {
      font-size: 0.875rem;
    }
  `]
})
export class NewsMediaDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('contentEditor') contentEditorElement!: ElementRef;
  private http = inject(HttpClient);
  newsForm: FormGroup;
  seoForm: FormGroup;
  isEdit = false;
  selectedTabIndex = signal(0);
  tags = signal<string[]>([]);
  uploading = signal(false);
  uploadingGallery = signal(false);
  gallery = signal<Array<{ url: string; caption?: string; order?: number }>>([]);
  quillEditor: any;

  constructor(
    private fb: FormBuilder,
    private cmsService: CmsService,
    private dialogRef: MatDialogRef<NewsMediaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.newsForm = this.fb.group({
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
    if (this.data?.newsMedia) {
      this.isEdit = true;
      this.newsForm.patchValue(this.data.newsMedia);
      if (this.data.newsMedia.seo) {
        this.seoForm.patchValue(this.data.newsMedia.seo);
      }
      if (this.data.newsMedia.tags) {
        this.tags.set(this.data.newsMedia.tags);
        this.newsForm.patchValue({ tagsInput: this.data.newsMedia.tags.join(', ') });
      }
      if (this.data.newsMedia.gallery) {
        this.gallery.set(this.data.newsMedia.gallery);
      }
    }

    // Auto-generate slug from title
    this.newsForm.get('title')?.valueChanges.subscribe(title => {
      if (title && !this.isEdit) {
        const slug = title.toLowerCase()
          .replace(/[^a-z0-9\\s-]/g, '-')
          .replace(/\\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        this.newsForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  getPreviewUrl(): string {
    const slug = this.newsForm.get('slug')?.value || 'news-url';
    return `https://yoursite.com/news/${slug}`;
  }

  getSeoScore(): number {
    let score = 0;
    if (this.seoForm.get('title')?.value) score += 25;
    if (this.seoForm.get('description')?.value) score += 25;
    if (this.seoForm.get('keywords')?.value) score += 20;
    if (this.newsForm.get('featuredImage')?.value) score += 15;
    if (this.tags().length > 0) score += 15;
    return score;
  }

  updateTags() {
    const tagsInput = this.newsForm.get('tagsInput')?.value || '';
    const newTags = tagsInput.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
    this.tags.set(newTags);
  }

  removeTag(tagToRemove: string) {
    const currentTags = this.tags().filter(tag => tag !== tagToRemove);
    this.tags.set(currentTags);
    this.newsForm.patchValue({ tagsInput: currentTags.join(', ') });
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

    this.http.post<any>(`${getBrandConfig().app.apiUrl}/media/upload/news/featured`, formData)
      .subscribe({
        next: (response) => {
          const baseUrl = getBrandConfig().app.apiUrl.replace('/api', '');
          const imageUrl = `${baseUrl}${response.url}`;
          this.newsForm.patchValue({ featuredImage: imageUrl });
          this.uploading.set(false);
        },
        error: () => {
          this.uploading.set(false);
          alert('Failed to upload image');
        }
      });
  }

  removeFeaturedImage() {
    this.newsForm.patchValue({ featuredImage: '' });
  }

  onGalleryFilesSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    if (files.length > 0) {
      this.uploadGalleryImages(files);
    }
  }

  uploadGalleryImages(files: File[]) {
    this.uploadingGallery.set(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    this.http.post<any>(`${getBrandConfig().app.apiUrl}/media/upload/news/gallery`, formData)
      .subscribe({
        next: (response) => {
          const baseUrl = getBrandConfig().app.apiUrl.replace('/api', '');
          const newImages = response.files.map((file: any) => ({
            url: `${baseUrl}${file.url}`,
            caption: '',
            order: this.gallery().length + file.order
          }));
          this.gallery.set([...this.gallery(), ...newImages]);
          this.uploadingGallery.set(false);
        },
        error: () => {
          this.uploadingGallery.set(false);
          alert('Failed to upload gallery images');
        }
      });
  }

  removeGalleryImage(index: number) {
    const currentGallery = [...this.gallery()];
    currentGallery.splice(index, 1);
    this.gallery.set(currentGallery);
  }

  updateGalleryCaption(index: number, caption: string) {
    const currentGallery = [...this.gallery()];
    currentGallery[index].caption = caption;
    this.gallery.set(currentGallery);
  }

  ngAfterViewInit() {
    this.quillEditor = new Quill(this.contentEditorElement.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
          ],
          handlers: {
            image: () => this.imageHandler()
          }
        }
      }
    });

    // Disable Grammarly on Quill editor
    this.quillEditor.root.setAttribute('data-gramm', 'false');
    this.quillEditor.root.setAttribute('data-gramm_editor', 'false');
    this.quillEditor.root.setAttribute('data-enable-grammarly', 'false');

    if (this.data?.newsMedia?.content) {
      this.quillEditor.root.innerHTML = this.data.newsMedia.content;
    }

    this.quillEditor.on('text-change', () => {
      this.newsForm.patchValue({ content: this.quillEditor.root.innerHTML });
    });
  }

  imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        this.http.post<any>(`${getBrandConfig().app.apiUrl}/media/upload/news/gallery`, formData)
          .subscribe({
            next: (response) => {
              const baseUrl = getBrandConfig().app.apiUrl.replace('/api', '');
              const imageUrl = `${baseUrl}${response.files[0].url}`;
              
              const range = this.quillEditor.getSelection(true);
              this.quillEditor.insertEmbed(range.index, 'image', imageUrl);
              this.quillEditor.setSelection(range.index + 1);
            },
            error: (err) => {
              console.error('Failed to upload image:', err);
              alert('Failed to upload image to editor');
            }
          });
      }
    };
  }

  saveNews() {
    if (this.newsForm.valid) {
      const newsData = {
        ...this.newsForm.value,
        tags: this.tags(),
        gallery: this.gallery(),
        seo: {
          ...this.seoForm.value,
          ogImage: this.seoForm.value.ogImage || this.newsForm.value.featuredImage
        },
        mediaFiles: this.data?.newsMedia?.mediaFiles || []
      };
      delete newsData.tagsInput;

      const request = this.isEdit 
        ? this.cmsService.updateNewsMedia(this.data.newsMedia._id, newsData)
        : this.cmsService.createNewsMedia(newsData);

      request.subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
