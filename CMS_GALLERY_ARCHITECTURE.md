# CMS Gallery Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Angular)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  Blog Dialog     │         │  News Dialog     │         │
│  │  Component       │         │  Component       │         │
│  ├──────────────────┤         ├──────────────────┤         │
│  │ • Content Tab    │         │ • Content Tab    │         │
│  │ • Gallery Tab ✨ │         │ • Gallery Tab ✨ │         │
│  │ • SEO Tab        │         │ • SEO Tab        │         │
│  └────────┬─────────┘         └────────┬─────────┘         │
│           │                            │                    │
└───────────┼────────────────────────────┼────────────────────┘
            │                            │
            │ HTTP POST                  │ HTTP POST
            │                            │
┌───────────▼────────────────────────────▼────────────────────┐
│                    Backend (NestJS)                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Media Controller                            │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │  Blog Endpoints:                                      │  │
│  │  • POST /media/upload/blog/featured                   │  │
│  │  • POST /media/upload/blog/gallery                    │  │
│  │  • GET  /media/blogs/:filename                        │  │
│  │                                                       │  │
│  │  News Endpoints:                                      │  │
│  │  • POST /media/upload/news/featured                   │  │
│  │  • POST /media/upload/news/gallery                    │  │
│  │  • GET  /media/news/:filename                         │  │
│  │                                                       │  │
│  └───────────────────────┬──────────────────────────────┘  │
│                          │                                  │
│                          │ Save Files                       │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    File System                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  backend/uploads/                                            │
│  ├── blogs/                                                  │
│  │   ├── featured-1234567890.jpg                            │
│  │   ├── gallery-1234567891.jpg                             │
│  │   └── gallery-1234567892.jpg                             │
│  │                                                           │
│  ├── news/                                                   │
│  │   ├── featured-2234567890.jpg                            │
│  │   ├── gallery-2234567891.jpg                             │
│  │   └── gallery-2234567892.jpg                             │
│  │                                                           │
│  └── [legacy files]                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Store Metadata
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (MongoDB)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  blog_posts Collection:                                      │
│  {                                                           │
│    _id: ObjectId,                                            │
│    title: "Blog Title",                                      │
│    featuredImage: "/uploads/blogs/featured-123.jpg",        │
│    gallery: [                                                │
│      {                                                       │
│        url: "/uploads/blogs/gallery-456.jpg",               │
│        caption: "Image caption",                             │
│        order: 0                                              │
│      }                                                       │
│    ]                                                         │
│  }                                                           │
│                                                              │
│  news_media Collection:                                      │
│  {                                                           │
│    _id: ObjectId,                                            │
│    title: "News Title",                                      │
│    featuredImage: "/uploads/news/featured-789.jpg",         │
│    gallery: [                                                │
│      {                                                       │
│        url: "/uploads/news/gallery-012.jpg",                │
│        caption: "Image caption",                             │
│        order: 0                                              │
│      }                                                       │
│    ]                                                         │
│  }                                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Upload Flow

### Featured Image Upload

```
User Action                    Frontend                    Backend                    File System
    │                             │                          │                             │
    │ Select Image                │                          │                             │
    ├──────────────────────────>  │                          │                             │
    │                             │                          │                             │
    │                             │ POST /media/upload/      │                             │
    │                             │      blog/featured       │                             │
    │                             ├─────────────────────────>│                             │
    │                             │                          │                             │
    │                             │                          │ Validate File               │
    │                             │                          │ (type, size)                │
    │                             │                          │                             │
    │                             │                          │ Generate Filename           │
    │                             │                          │ featured-{timestamp}.jpg    │
    │                             │                          │                             │
    │                             │                          │ Save File                   │
    │                             │                          ├────────────────────────────>│
    │                             │                          │                             │
    │                             │                          │                             │ Write to
    │                             │                          │                             │ uploads/blogs/
    │                             │                          │                             │
    │                             │ Response:                │                             │
    │                             │ { url, filename, size }  │                             │
    │                             │<─────────────────────────┤                             │
    │                             │                          │                             │
    │ Display Preview             │                          │                             │
    │<────────────────────────────┤                          │                             │
    │                             │                          │                             │
```

### Gallery Upload (Multiple Images)

```
User Action                    Frontend                    Backend                    File System
    │                             │                          │                             │
    │ Select Multiple Images      │                          │                             │
    ├──────────────────────────>  │                          │                             │
    │                             │                          │                             │
    │                             │ POST /media/upload/      │                             │
    │                             │      blog/gallery        │                             │
    │                             │ (files: [img1, img2])    │                             │
    │                             ├─────────────────────────>│                             │
    │                             │                          │                             │
    │                             │                          │ Validate Each File          │
    │                             │                          │                             │
    │                             │                          │ For each file:              │
    │                             │                          │   Generate Filename         │
    │                             │                          │   gallery-{timestamp}.jpg   │
    │                             │                          │                             │
    │                             │                          │   Save File                 │
    │                             │                          ├────────────────────────────>│
    │                             │                          │                             │
    │                             │                          │                             │ Write to
    │                             │                          │                             │ uploads/blogs/
    │                             │                          │                             │
    │                             │ Response:                │                             │
    │                             │ { files: [...], count }  │                             │
    │                             │<─────────────────────────┤                             │
    │                             │                          │                             │
    │ Display Gallery Grid        │                          │                             │
    │<────────────────────────────┤                          │                             │
    │                             │                          │                             │
```

## Data Flow

### Creating Blog with Gallery

```
1. User fills blog form
   ├── Title, slug, excerpt
   ├── Upload featured image → /media/upload/blog/featured
   └── Upload gallery images → /media/upload/blog/gallery

2. Frontend collects data
   {
     title: "...",
     featuredImage: "/uploads/blogs/featured-123.jpg",
     gallery: [
       { url: "/uploads/blogs/gallery-456.jpg", caption: "...", order: 0 },
       { url: "/uploads/blogs/gallery-789.jpg", caption: "...", order: 1 }
     ]
   }

3. POST /cms/blogs
   └── CMS Service saves to database

4. Database stores complete blog document
   └── Including gallery array with URLs and captions
```

## Component Structure

### Blog Dialog Component

```typescript
BlogDialogComponent
├── Properties
│   ├── blogForm: FormGroup
│   ├── seoForm: FormGroup
│   ├── gallery: Signal<GalleryImage[]>
│   ├── uploading: Signal<boolean>
│   └── uploadingGallery: Signal<boolean>
│
├── Methods
│   ├── uploadImage(file) → Featured image upload
│   ├── uploadGalleryImages(files) → Gallery upload
│   ├── removeGalleryImage(index) → Remove from gallery
│   ├── updateGalleryCaption(index, caption) → Update caption
│   └── saveBlog() → Save with gallery data
│
└── Template
    ├── Content Tab
    │   ├── Featured image upload
    │   └── Rich text editor
    ├── Gallery Tab ✨
    │   ├── Upload button
    │   ├── Gallery grid
    │   └── Caption inputs
    └── SEO Tab
        └── SEO metadata
```

## API Endpoints

### Blog Endpoints

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| POST | `/media/upload/blog/featured` | Upload featured image | FormData with 'file' | `{ url, filename, size }` |
| POST | `/media/upload/blog/gallery` | Upload gallery images | FormData with 'files[]' | `{ files: [...], count }` |
| GET | `/media/blogs/:filename` | Serve blog image | - | Image file |

### News Endpoints

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| POST | `/media/upload/news/featured` | Upload featured image | FormData with 'file' | `{ url, filename, size }` |
| POST | `/media/upload/news/gallery` | Upload gallery images | FormData with 'files[]' | `{ files: [...], count }` |
| GET | `/media/news/:filename` | Serve news image | - | Image file |

## Security & Validation

### File Validation
```typescript
✅ File type: jpg, jpeg, png, gif, webp
✅ File size: Max 10MB per image
✅ File count: Max 10 images per request
✅ Filename sanitization: Timestamp-based unique names
```

### Access Control
```typescript
✅ API Key required for uploads
✅ JWT Auth for blog/news creation
✅ Public access for serving images
```

## Performance Considerations

### Upload Optimization
- Chunked uploads for large files
- Progress indicators for user feedback
- Parallel processing of multiple files
- Automatic directory creation

### Storage Optimization
- Organized folder structure
- Unique filename generation
- No duplicate file handling (yet)
- Future: Image compression, thumbnails

## Error Handling

```typescript
Upload Errors:
├── Invalid file type → "Only image files are allowed"
├── File too large → "File size exceeds 10MB limit"
├── Too many files → "Maximum 10 files per upload"
├── Network error → "Failed to upload image"
└── Server error → "Upload failed, please try again"
```

## Future Enhancements

1. **Image Processing**
   - Automatic compression
   - Thumbnail generation
   - Multiple size variants
   - WebP conversion

2. **Gallery Features**
   - Drag-and-drop reordering
   - Bulk operations
   - Image cropping
   - Lightbox viewer

3. **Storage**
   - CDN integration
   - Cloud storage (S3, etc.)
   - Image optimization service
   - Lazy loading

4. **Management**
   - Media library
   - Image search
   - Usage tracking
   - Duplicate detection
