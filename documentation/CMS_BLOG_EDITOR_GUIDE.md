# CMS Blog & Articles Manager - Enhanced Features

## Overview
The Blog & Articles manager now includes:
1. **Image Upload** - Upload featured images directly from your computer
2. **WYSIWYG Editor** - Rich text editor with formatting, headings, links, and inline images
3. **SEO Optimization** - Built-in SEO tools with live preview

## Installation

### Frontend Setup
No additional packages required! The WYSIWYG editor is built-in using native browser contentEditable API.

### Backend Setup
The media upload endpoint is already configured at `/media/upload` with:
- Support for images (jpg, jpeg, png, gif, webp)
- 50MB file size limit
- Secure API key authentication
- Files stored in `backend/uploads/` directory

## Features

### 1. Featured Image Upload
- Click "Upload Image" button to select an image from your computer
- Alternatively, paste an image URL in the text field
- Preview the image before saving
- Remove and replace images easily

### 2. WYSIWYG Content Editor
The editor supports:
- **Text Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H1 through H6
- **Lists**: Ordered and unordered lists
- **Alignment**: Left, center, right, justify
- **Links**: Add clickable hyperlinks
- **Images**: Upload images directly into content
- **Clean**: Remove all formatting

#### Image Upload in Content
1. Click the image icon in the editor toolbar
2. Select an image from your computer
3. Image is automatically uploaded and inserted at cursor position

### 3. SEO Tools
- SEO Title (60 characters recommended)
- Meta Description (160 characters recommended)
- Keywords (comma-separated)
- Open Graph Image for social sharing
- Live search engine preview
- SEO score calculator (0-100)

### 4. Blog Management
- Draft, Published, and Archived status
- Tags for categorization
- URL slug auto-generation
- Publish date scheduling
- Duplicate blog posts
- Full CRUD operations

## API Endpoints

### Blog Endpoints
```
GET    /cms/blogs           - Get all blogs
GET    /cms/blogs/:id       - Get single blog
GET    /cms/blog/slug/:slug - Get blog by slug
POST   /cms/blogs           - Create blog
PUT    /cms/blogs/:id       - Update blog
DELETE /cms/blogs/:id       - Delete blog
```

### Media Upload Endpoint
```
POST   /media/upload        - Upload image/media file
GET    /media/:filename     - Serve uploaded file
```

**Upload Request:**
```javascript
const formData = new FormData();
formData.append('file', file);

fetch('/media/upload', {
  method: 'POST',
  headers: {
    'x-api-key': 'your-api-key'
  },
  body: formData
})
```

**Upload Response:**
```json
{
  "url": "/uploads/file-1234567890-123456789.jpg",
  "filename": "file-1234567890-123456789.jpg",
  "mimetype": "image/jpeg",
  "size": 245678
}
```

## Usage Guide

### Creating a Blog Post
1. Navigate to CMS Module → Blogs & Articles tab
2. Click "Add Blog Post" button
3. Fill in the required fields:
   - Title (auto-generates slug)
   - Slug (URL-friendly identifier)
   - Excerpt (brief summary)
   - Featured Image (upload or URL)
   - Content (use WYSIWYG editor)
   - Status (draft/published/archived)
   - Tags (comma-separated)
4. Switch to "SEO Settings" tab for optimization
5. Click "Create Blog Post"

### Editing Content
- Use the toolbar for text formatting
- Click image icon to insert images
- Add links by selecting text and clicking link icon
- Use headings for better structure
- Brand fonts are automatically applied

### SEO Optimization
1. Switch to "SEO Settings" tab
2. Fill in SEO title and meta description
3. Add relevant keywords
4. Check the SEO score (aim for 80+)
5. Preview how it appears in search results

## File Structure

```
frontend/src/app/modules/cms/
├── cms.component.ts              # Main CMS component with tabs
├── cms.service.ts                # API service
├── cms.routes.ts                 # Routing configuration
├── dialogs/
│   ├── blog-dialog.component.ts  # Enhanced blog editor
│   └── news-media-dialog.component.ts
└── pages/
    ├── blogs-page.component.ts   # Blog list view
    ├── news-media-page.component.ts
    └── analytics-page.component.ts

backend/src/
├── cms/
│   ├── cms.controller.ts         # Blog API endpoints
│   ├── cms.service.ts            # Blog business logic
│   ├── cms.module.ts             # Module configuration
│   └── media.controller.ts       # Media upload handler
└── entities/
    ├── blog-post.entity.ts       # Blog entity
    └── news-media.entity.ts      # News entity
```

## Security

### API Key Authentication
All CMS and media endpoints require API key authentication:
```typescript
headers: {
  'x-api-key': 'your-api-key'
}
```

### File Upload Security
- File type validation (images only)
- File size limits (50MB max)
- Unique filename generation
- Secure file storage

## Troubleshooting

### Editor Not Loading
```bash
# Reinstall dependencies
cd frontend
npm install
```

### Images Not Uploading
1. Check API key is configured
2. Verify `backend/uploads/` directory exists
3. Check file size (max 50MB)
4. Ensure file is an image format

### Styles Not Applied
```bash
# Rebuild the application
npm run build
```

## Best Practices

1. **Content Structure**
   - Use H1 for main title (auto-added)
   - Use H2-H3 for section headings
   - Keep paragraphs concise
   - Add images to break up text

2. **SEO Optimization**
   - Write unique titles (50-60 chars)
   - Create compelling descriptions (150-160 chars)
   - Use relevant keywords naturally
   - Add alt text to images (future feature)

3. **Image Guidelines**
   - Featured image: 1200x630px recommended
   - Content images: Max 1920px width
   - Compress images before upload
   - Use descriptive filenames

4. **Performance**
   - Save drafts frequently
   - Optimize images before upload
   - Use external CDN for large media (optional)

## Future Enhancements

- [ ] Image alt text editor
- [ ] Video embed support
- [ ] Code block syntax highlighting
- [ ] Table support
- [ ] Custom font size controls
- [ ] Image gallery management
- [ ] Bulk operations
- [ ] Version history
- [ ] Collaborative editing
- [ ] Auto-save drafts

## Support

For issues or questions:
1. Check the documentation
2. Review API logs in backend
3. Check browser console for errors
4. Contact development team
