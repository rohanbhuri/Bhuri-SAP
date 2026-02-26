# CMS Media Gallery Implementation

## Overview
Enhanced the CMS Blog and News Media modules with organized folder structure for uploads and media gallery support for multiple images.

## Changes Made

### 1. Backend - Entity Updates

#### Blog Post Entity (`backend/src/entities/blog-post.entity.ts`)
- Added `gallery` field to support multiple images
- Gallery structure: `{ url: string, caption?: string, order?: number }[]`

#### News Media Entity (`backend/src/entities/news-media.entity.ts`)
- Added `gallery` field to support multiple images
- Same gallery structure as blog posts

### 2. Backend - Media Controller (`backend/src/cms/media.controller.ts`)

#### New Organized Upload Endpoints

**Blog Uploads:**
- `POST /media/upload/blog/featured` - Upload blog featured image to `uploads/blogs/`
- `POST /media/upload/blog/gallery` - Upload multiple blog gallery images to `uploads/blogs/`
- `GET /media/blogs/:filename` - Serve blog images

**News Uploads:**
- `POST /media/upload/news/featured` - Upload news featured image to `uploads/news/`
- `POST /media/upload/news/gallery` - Upload multiple news gallery images to `uploads/news/`
- `GET /media/news/:filename` - Serve news images

#### Features:
- Automatic directory creation if folders don't exist
- Support for multiple file uploads (up to 10 images per request)
- Image validation (jpg, jpeg, png, gif, webp)
- 10MB file size limit per image
- Unique filename generation with timestamps
- Organized naming: `featured-{timestamp}.ext` and `gallery-{timestamp}.ext`

### 3. Frontend - Blog Dialog (`frontend/src/app/modules/cms/dialogs/blog-dialog.component.ts`)

#### New Features:
- Added "Media Gallery" tab
- Gallery management with upload, preview, and delete
- Caption support for each gallery image
- Visual grid layout for gallery images
- Progress indicators for uploads
- Empty state when no gallery images

#### API Integration:
- Uses `/media/upload/blog/featured` for featured images
- Uses `/media/upload/blog/gallery` for gallery images
- Saves gallery data with blog post

### 4. Frontend - News Media Dialog (`frontend/src/app/modules/cms/dialogs/news-media-dialog.component.ts`)

#### New Features:
- Added "Media Gallery" tab
- Same gallery management features as blog dialog
- Caption support for each gallery image
- Visual grid layout for gallery images
- Progress indicators for uploads
- Empty state when no gallery images

#### API Integration:
- Uses `/media/upload/news/featured` for featured images
- Uses `/media/upload/news/gallery` for gallery images
- Saves gallery data with news item

### 5. Folder Structure

```
backend/uploads/
├── blogs/              # Blog images (featured + gallery)
│   ├── featured-*.jpg
│   └── gallery-*.jpg
├── news/               # News images (featured + gallery)
│   ├── featured-*.jpg
│   └── gallery-*.jpg
└── [other files]       # Legacy uploads (still supported)
```

## Usage

### Creating a Blog with Gallery

1. Open Blog dialog
2. Go to "Content" tab - upload featured image
3. Go to "Media Gallery" tab
4. Click "Add Images to Gallery"
5. Select multiple images (up to 10)
6. Add captions to images (optional)
7. Save blog post

### Creating News with Gallery

1. Open News Media dialog
2. Go to "Content" tab - upload featured image
3. Go to "Media Gallery" tab
4. Click "Add Images to Gallery"
5. Select multiple images (up to 10)
6. Add captions to images (optional)
7. Save news item

## Gallery Data Structure

```typescript
gallery: [
  {
    url: "http://api.example.com/uploads/blogs/gallery-1234567890.jpg",
    caption: "Optional image caption",
    order: 0
  },
  {
    url: "http://api.example.com/uploads/blogs/gallery-1234567891.jpg",
    caption: "Another caption",
    order: 1
  }
]
```

## Benefits

1. **Organized Storage**: Images are now stored in dedicated folders by content type
2. **Multiple Images**: Support for image galleries in both blogs and news
3. **Better UX**: Visual gallery management with drag-and-drop support
4. **Captions**: Add descriptive captions to gallery images
5. **Scalability**: Easy to add more content types with their own folders
6. **Backward Compatible**: Legacy `/media/upload` endpoint still works

## Migration Notes

- Existing blogs and news items will continue to work
- Featured images uploaded before this update remain in `uploads/` root
- New uploads will use the organized folder structure
- No data migration required

## Future Enhancements

- Drag-and-drop reordering of gallery images
- Bulk image operations (delete multiple, reorder)
- Image cropping and editing
- CDN integration for better performance
- Image optimization and compression
