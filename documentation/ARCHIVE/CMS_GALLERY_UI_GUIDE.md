# CMS Gallery UI Guide

## Overview
This guide shows how to use the new Media Gallery feature in the CMS Blog and News modules.

## Blog Post Gallery

### Creating a Blog with Gallery

1. **Navigate to Blogs**
   - Go to CMS → Blogs & Articles
   - Click "Create New Blog" button

2. **Content Tab**
   - Fill in blog title, slug, excerpt
   - Upload featured image (stored in `uploads/blogs/`)
   - Write blog content using rich text editor

3. **Media Gallery Tab** (NEW!)
   - Click on "Media Gallery" tab
   - Click "Add Images to Gallery" button
   - Select multiple images (up to 10 at once)
   - Images will upload and appear in a grid layout
   - Add captions to each image (optional)
   - Remove images by clicking the delete button on each image

4. **SEO Settings Tab**
   - Configure SEO metadata
   - Set meta title, description, keywords
   - Set Open Graph image (defaults to featured image)

5. **Save**
   - Click "Create Blog Post" or "Update Blog Post"
   - Gallery data is saved with the blog

### Gallery Features

- **Multiple Upload**: Select and upload up to 10 images at once
- **Visual Grid**: Images displayed in responsive grid layout
- **Captions**: Add descriptive captions to each gallery image
- **Easy Removal**: Delete individual images with one click
- **Progress Indicator**: Visual feedback during upload
- **Empty State**: Helpful message when gallery is empty

### Gallery UI Elements

```
┌─────────────────────────────────────────────────┐
│ Media Gallery Tab                               │
├─────────────────────────────────────────────────┤
│                                                 │
│ Image Gallery                                   │
│ Upload multiple images to create a gallery      │
│                                                 │
│ [📷 Add Images to Gallery] Select multiple...  │
│                                                 │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │  Image 1 │ │  Image 2 │ │  Image 3 │        │
│ │    [X]   │ │    [X]   │ │    [X]   │        │
│ └──────────┘ └──────────┘ └──────────┘        │
│ [Caption 1 ] [Caption 2 ] [Caption 3 ]        │
│                                                 │
└─────────────────────────────────────────────────┘
```

## News Media Gallery

### Creating News with Gallery

1. **Navigate to News & Media**
   - Go to CMS → News & Media
   - Click "Create New News" button

2. **Content Tab**
   - Fill in news title, slug, excerpt
   - Upload featured image (stored in `uploads/news/`)
   - Write news content using rich text editor

3. **Media Gallery Tab** (NEW!)
   - Click on "Media Gallery" tab
   - Click "Add Images to Gallery" button
   - Select multiple images (up to 10 at once)
   - Images will upload and appear in a grid layout
   - Add captions to each image (optional)
   - Remove images by clicking the delete button on each image

4. **SEO Settings Tab**
   - Configure SEO metadata
   - Set meta title, description, keywords
   - Set Open Graph image (defaults to featured image)

5. **Save**
   - Click "Create News Item" or "Update News Item"
   - Gallery data is saved with the news

## Gallery Data Structure

When you save a blog or news item with gallery images, the data is stored as:

```json
{
  "title": "My Blog Post",
  "featuredImage": "http://api.example.com/uploads/blogs/featured-1234567890.jpg",
  "gallery": [
    {
      "url": "http://api.example.com/uploads/blogs/gallery-1234567891.jpg",
      "caption": "First gallery image",
      "order": 0
    },
    {
      "url": "http://api.example.com/uploads/blogs/gallery-1234567892.jpg",
      "caption": "Second gallery image",
      "order": 1
    }
  ]
}
```

## Tips & Best Practices

### Image Selection
- Use high-quality images (recommended: 1920x1080 or higher)
- Keep file sizes reasonable (under 2MB per image)
- Use consistent aspect ratios for better gallery appearance
- Supported formats: JPG, JPEG, PNG, GIF, WEBP

### Captions
- Keep captions concise and descriptive
- Use captions to provide context or attribution
- Captions are optional but recommended for accessibility

### Organization
- Featured image: Main image representing the content
- Gallery: Additional supporting images
- Use gallery for photo essays, product showcases, event coverage

### Performance
- Upload images in batches (up to 10 at once)
- Wait for upload to complete before adding more
- Remove unused images to keep storage clean

## Keyboard Shortcuts

- **Tab**: Navigate between caption fields
- **Enter**: Save caption and move to next
- **Escape**: Close dialog without saving

## Mobile Responsiveness

The gallery grid automatically adjusts for different screen sizes:
- Desktop: 3-4 images per row
- Tablet: 2-3 images per row
- Mobile: 1-2 images per row

## Accessibility

- All images should have captions for screen readers
- Gallery images have proper alt text
- Keyboard navigation supported
- Focus indicators visible

## Common Use Cases

### Blog Post Gallery
- Tutorial step-by-step images
- Before/after comparisons
- Product showcase
- Event photo gallery
- Portfolio pieces

### News Media Gallery
- Event coverage photos
- Press release images
- Photo journalism
- Infographics series
- Behind-the-scenes content

## Troubleshooting

### Upload Failed
- Check file format (must be image)
- Check file size (max 10MB per image)
- Check internet connection
- Try uploading fewer images at once

### Images Not Displaying
- Verify image URLs are correct
- Check browser console for errors
- Ensure backend server is running
- Check file permissions on uploads folder

### Gallery Not Saving
- Ensure you click Save button
- Check for validation errors
- Verify all required fields are filled
- Check browser console for errors

## Future Enhancements

Planned features for future releases:
- Drag-and-drop image reordering
- Bulk image operations
- Image cropping and editing
- Lightbox/modal view for gallery
- Image optimization on upload
- CDN integration
