import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-media-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule
  ],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Media Library</h2>
        <button mat-raised-button color="primary" (click)="uploadMedia()">
          <mat-icon>cloud_upload</mat-icon>
          Upload Media
        </button>
      </div>
      
      <div class="media-grid">
        <mat-card *ngFor="let media of mediaFiles()" class="media-card">
          <div class="media-preview">
            <img *ngIf="media.type === 'image'" [src]="media.url" [alt]="media.name">
            <mat-icon *ngIf="media.type === 'document'" class="file-icon">description</mat-icon>
            <mat-icon *ngIf="media.type === 'video'" class="file-icon">videocam</mat-icon>
          </div>
          <mat-card-content>
            <div class="media-name">{{ media.name }}</div>
            <div class="media-info">{{ media.size }} • {{ media.type }}</div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-icon-button (click)="copyUrl(media.url)">
              <mat-icon>link</mat-icon>
            </button>
            <button mat-icon-button (click)="deleteMedia(media.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    .media-card {
      cursor: pointer;
    }
    .media-preview {
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }
    .media-preview img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
    }
    .file-icon {
      font-size: 3rem;
      color: #666;
    }
    .media-name {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    .media-info {
      font-size: 0.875rem;
      color: #666;
    }
  `]
})
export class MediaPageComponent implements OnInit {
  mediaFiles = signal<any[]>([
    { id: 1, name: 'hero-image.jpg', url: '/assets/hero.jpg', type: 'image', size: '2.5 MB' },
    { id: 2, name: 'company-logo.png', url: '/assets/logo.png', type: 'image', size: '150 KB' },
    { id: 3, name: 'product-catalog.pdf', url: '/assets/catalog.pdf', type: 'document', size: '5.2 MB' }
  ]);

  ngOnInit() {
    // Load media files from service
  }

  uploadMedia() {
    // Implement file upload
    console.log('Upload media');
  }

  copyUrl(url: string) {
    navigator.clipboard.writeText(url);
  }

  deleteMedia(id: number) {
    if (confirm('Are you sure you want to delete this media file?')) {
      const files = this.mediaFiles().filter(f => f.id !== id);
      this.mediaFiles.set(files);
    }
  }
}

