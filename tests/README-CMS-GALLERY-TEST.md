# CMS Gallery Upload Test Guide

## Overview
This test suite verifies the new CMS gallery upload functionality for both Blog and News Media modules.

## Prerequisites

1. Backend server running on `http://localhost:3000` (or set `API_URL` environment variable)
2. Valid API key (set `API_KEY` environment variable)
3. Test image file at `tests/test-image.jpg`

## Setup

### 1. Install Dependencies
```bash
npm install axios form-data
```

### 2. Prepare Test Image
```bash
# Copy any image to use as test image
cp /path/to/your/image.jpg tests/test-image.jpg
```

### 3. Set Environment Variables (Optional)
```bash
export API_URL=http://localhost:3000
export API_KEY=your-api-key-here
```

## Running Tests

### Run All Tests
```bash
node tests/test-cms-gallery-upload.js
```

### Expected Output
```
🧪 CMS Gallery Upload Test Suite

API URL: http://localhost:3000
API Key: ✓ Set

Starting tests...

📝 Test 1: Upload Blog Featured Image
✅ Success!
   URL: /uploads/blogs/featured-1234567890.jpg
   Filename: featured-1234567890.jpg
   Size: 123456 bytes

📝 Test 2: Upload Blog Gallery Images (Multiple)
✅ Success!
   Files uploaded: 2
   [1] /uploads/blogs/gallery-1234567891.jpg
   [2] /uploads/blogs/gallery-1234567892.jpg

📝 Test 3: Upload News Featured Image
✅ Success!
   URL: /uploads/news/featured-1234567893.jpg
   Filename: featured-1234567893.jpg
   Size: 123456 bytes

📝 Test 4: Upload News Gallery Images (Multiple)
✅ Success!
   Files uploaded: 2
   [1] /uploads/news/gallery-1234567894.jpg
   [2] /uploads/news/gallery-1234567895.jpg

📝 Test 5: Verify Folder Structure
   blogs/ directory: ✅ Exists
   news/ directory: ✅ Exists
   blogs/ contains 3 file(s)
   news/ contains 3 file(s)

✨ Test suite completed!

📁 Check the following directories for uploaded files:
   - backend/uploads/blogs/
   - backend/uploads/news/
```

## What Gets Tested

1. **Blog Featured Image Upload**
   - Endpoint: `POST /media/upload/blog/featured`
   - Verifies single image upload to `uploads/blogs/`
   - Checks response format and file naming

2. **Blog Gallery Upload**
   - Endpoint: `POST /media/upload/blog/gallery`
   - Verifies multiple image upload to `uploads/blogs/`
   - Checks batch upload response

3. **News Featured Image Upload**
   - Endpoint: `POST /media/upload/news/featured`
   - Verifies single image upload to `uploads/news/`
   - Checks response format and file naming

4. **News Gallery Upload**
   - Endpoint: `POST /media/upload/news/gallery`
   - Verifies multiple image upload to `uploads/news/`
   - Checks batch upload response

5. **Folder Structure**
   - Verifies `uploads/blogs/` directory exists
   - Verifies `uploads/news/` directory exists
   - Counts uploaded files in each directory

## Manual Testing in Frontend

### Test Blog Gallery

1. Navigate to CMS → Blogs
2. Click "Create New Blog" or edit existing blog
3. Go to "Content" tab
4. Upload a featured image - verify it uploads to `/uploads/blogs/`
5. Go to "Media Gallery" tab
6. Click "Add Images to Gallery"
7. Select multiple images (2-5 images)
8. Verify images appear in gallery grid
9. Add captions to some images
10. Save the blog
11. Reload and verify gallery persists

### Test News Gallery

1. Navigate to CMS → News & Media
2. Click "Create New News" or edit existing news
3. Go to "Content" tab
4. Upload a featured image - verify it uploads to `/uploads/news/`
5. Go to "Media Gallery" tab
6. Click "Add Images to Gallery"
7. Select multiple images (2-5 images)
8. Verify images appear in gallery grid
9. Add captions to some images
10. Save the news item
11. Reload and verify gallery persists

## Troubleshooting

### Test Image Not Found
```
⚠️  Test image not found. Please provide a test image at:
   /path/to/tests/test-image.jpg
```
**Solution**: Copy an image file to `tests/test-image.jpg`

### API Key Error
```
❌ Failed: Unauthorized
```
**Solution**: Set the `API_KEY` environment variable or update it in the script

### Connection Refused
```
❌ Failed: connect ECONNREFUSED
```
**Solution**: Make sure the backend server is running

### Upload Failed
```
❌ Failed: Only image files are allowed
```
**Solution**: Ensure test image is a valid image format (jpg, jpeg, png, gif, webp)

## Cleanup

To remove test uploads:
```bash
rm -rf backend/uploads/blogs/*
rm -rf backend/uploads/news/*
```

## Notes

- The test uses the same image multiple times for gallery uploads
- Uploaded files are not automatically cleaned up
- File naming follows pattern: `featured-{timestamp}.ext` or `gallery-{timestamp}.ext`
- Maximum 10 images per gallery upload request
- Maximum 10MB per image file
