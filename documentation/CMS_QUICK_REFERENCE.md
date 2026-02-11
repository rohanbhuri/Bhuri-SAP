# CMS Module - Quick Reference

## What's New

### ✅ Removed Tabs
- ❌ Pages
- ❌ Menus  
- ❌ Media (old)

### ✅ Current Tabs
1. **Blogs & Articles** - Enhanced with WYSIWYG editor and image upload
2. **News & Media** - New tab for news items with media file support
3. **Analytics** - Existing analytics dashboard

## Blog & Articles Features

### 🖼️ Image Upload
- **Featured Image**: Upload directly or use URL
- **Content Images**: Insert images anywhere in content via editor
- **Preview**: See images before saving
- **API**: `/media/upload` endpoint

### ✍️ WYSIWYG Editor (Quill)
- Bold, Italic, Underline, Strikethrough
- Headings (H1-H6)
- Lists (ordered/unordered)
- Text alignment
- Hyperlinks
- Image insertion
- **Note**: Font family is fixed to brand fonts

### 🎯 SEO Tools
- SEO Title & Meta Description
- Keywords
- Open Graph Image
- Live search preview
- SEO score (0-100)

## News & Media Features

### 📰 News Management
- Title, slug, excerpt, content
- Featured image
- Media files array (images, videos, documents)
- Status: draft/published/archived
- Tags and SEO support

### 📁 Media Files
- Multiple media attachments per news item
- Type: image, video, document
- Caption support

## Installation

```bash
# No additional packages required!
# Custom rich text editor is built-in
```

## API Endpoints

### Blogs
```
GET    /cms/blogs
POST   /cms/blogs
PUT    /cms/blogs/:id
DELETE /cms/blogs/:id
```

### News & Media
```
GET    /cms/news-media
POST   /cms/news-media
PUT    /cms/news-media/:id
DELETE /cms/news-media/:id
```

### Media Upload
```
POST   /media/upload
GET    /media/:filename
```

## Quick Start

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Create Blog Post**
   - Go to CMS → Blogs & Articles
   - Click "Add Blog Post"
   - Upload featured image
   - Write content with WYSIWYG editor
   - Add SEO details
   - Save

## File Changes

### Backend
- ✅ `entities/news-media.entity.ts` - New entity
- ✅ `cms/cms.service.ts` - Added News & Media methods
- ✅ `cms/cms.controller.ts` - Added News & Media endpoints
- ✅ `cms/cms.module.ts` - Added NewsMedia entity
- ✅ `cms/media.controller.ts` - Added API key guard

### Frontend
- ✅ `cms/cms.component.ts` - Updated tabs
- ✅ `cms/cms.routes.ts` - Added news-media route
- ✅ `cms/cms.service.ts` - Added News & Media API methods
- ✅ `cms/dialogs/blog-dialog.component.ts` - Enhanced with upload & custom WYSIWYG
- ✅ `cms/dialogs/news-media-dialog.component.ts` - New dialog
- ✅ `cms/pages/news-media-page.component.ts` - New page
- ✅ `components/rich-text-editor.component.ts` - Custom WYSIWYG editor
- ✅ `styles.scss` - Editor styles

## Security

- All endpoints protected with API key guard
- File type validation
- File size limits (50MB)
- Secure file storage

## Next Steps

1. Restart development server
2. Test blog creation with image upload
3. Test WYSIWYG editor features
4. Create news items in News & Media tab

## Documentation

- Full Guide: `documentation/CMS_BLOG_EDITOR_GUIDE.md`
- API Docs: `documentation/CMS_API_DOCUMENTATION.md`
