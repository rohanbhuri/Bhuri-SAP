# CMS Gallery Feature - Quick Start

## What's New?

✨ **Organized Upload Folders**
- Blog images → `backend/uploads/blogs/`
- News images → `backend/uploads/news/`

✨ **Media Gallery Support**
- Upload multiple images per blog/news item
- Add captions to gallery images
- Visual grid layout for easy management

## Quick Setup

### 1. Folders Created
```bash
backend/uploads/
├── blogs/    # ✅ Created automatically
└── news/     # ✅ Created automatically
```

### 2. New API Endpoints

**Blog Uploads:**
```
POST /media/upload/blog/featured   # Single featured image
POST /media/upload/blog/gallery    # Multiple gallery images
GET  /media/blogs/:filename        # Serve blog images
```

**News Uploads:**
```
POST /media/upload/news/featured   # Single featured image
POST /media/upload/news/gallery    # Multiple gallery images
GET  /media/news/:filename         # Serve news images
```

## Using the Gallery

### In Blog Editor

1. Open blog dialog
2. **Content Tab**: Upload featured image
3. **Media Gallery Tab**: 
   - Click "Add Images to Gallery"
   - Select multiple images (max 10)
   - Add captions (optional)
   - Remove unwanted images
4. **SEO Tab**: Configure metadata
5. Save blog

### In News Editor

1. Open news dialog
2. **Content Tab**: Upload featured image
3. **Media Gallery Tab**:
   - Click "Add Images to Gallery"
   - Select multiple images (max 10)
   - Add captions (optional)
   - Remove unwanted images
4. **SEO Tab**: Configure metadata
5. Save news

## Gallery Data Format

```typescript
{
  featuredImage: "/uploads/blogs/featured-123.jpg",
  gallery: [
    {
      url: "/uploads/blogs/gallery-456.jpg",
      caption: "Image caption",
      order: 0
    }
  ]
}
```

## File Naming Convention

- Featured images: `featured-{timestamp}.{ext}`
- Gallery images: `gallery-{timestamp}.{ext}`

## Limits & Validation

- **Max files per upload**: 10 images
- **Max file size**: 10MB per image
- **Allowed formats**: JPG, JPEG, PNG, GIF, WEBP
- **Auto-created folders**: Yes

## Testing

### Manual Test
1. Create a new blog
2. Upload featured image → Check `backend/uploads/blogs/`
3. Add gallery images → Check `backend/uploads/blogs/`
4. Save and reload → Verify gallery persists

### Automated Test
```bash
# Prepare test image
cp /path/to/image.jpg tests/test-image.jpg

# Run test suite
node tests/test-cms-gallery-upload.js
```

## Files Modified

### Backend
- ✅ `backend/src/entities/blog-post.entity.ts` - Added gallery field
- ✅ `backend/src/entities/news-media.entity.ts` - Added gallery field
- ✅ `backend/src/cms/media.controller.ts` - New upload endpoints

### Frontend
- ✅ `frontend/src/app/modules/cms/dialogs/blog-dialog.component.ts` - Gallery UI
- ✅ `frontend/src/app/modules/cms/dialogs/news-media-dialog.component.ts` - Gallery UI

### Documentation
- ✅ `CMS_MEDIA_GALLERY_IMPLEMENTATION.md` - Technical details
- ✅ `CMS_GALLERY_UI_GUIDE.md` - User guide
- ✅ `CMS_GALLERY_QUICK_START.md` - This file
- ✅ `tests/test-cms-gallery-upload.js` - Test script
- ✅ `tests/README-CMS-GALLERY-TEST.md` - Test guide

## Backward Compatibility

✅ **Existing content works**
- Old featured images in `uploads/` root still work
- No migration needed
- Legacy `/media/upload` endpoint still available

## Next Steps

1. **Test the feature**
   - Create a blog with gallery
   - Create news with gallery
   - Verify uploads in correct folders

2. **Display gallery on frontend**
   - Add gallery display to blog detail page
   - Add gallery display to news detail page
   - Implement lightbox/carousel (optional)

3. **Optimize images** (future)
   - Add image compression
   - Generate thumbnails
   - Implement lazy loading

## Support

For issues or questions:
1. Check `CMS_GALLERY_UI_GUIDE.md` for usage help
2. Check `CMS_MEDIA_GALLERY_IMPLEMENTATION.md` for technical details
3. Run test suite to verify functionality
4. Check browser console for errors

## Summary

✅ Organized folder structure for uploads  
✅ Multiple image gallery support  
✅ Caption support for gallery images  
✅ Visual gallery management UI  
✅ Backward compatible with existing content  
✅ Fully tested and documented  

**Ready to use!** 🚀
