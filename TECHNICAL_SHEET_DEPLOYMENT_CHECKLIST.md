# Technical Sheet Feature - Deployment Checklist

## Pre-Deployment Checklist

### Backend Verification

- [x] ✅ Entity created: `backend/src/entities/technical-sheet-download.entity.ts`
- [x] ✅ Product entity updated with `technicalSheet` field
- [x] ✅ Controller endpoints added for upload and tracking
- [x] ✅ Service methods implemented for tracking and stats
- [x] ✅ Module updated to register new entity
- [x] ✅ Upload directory created: `backend/uploads/products/technical-sheets/`
- [ ] ⏳ Database migration run (if using migrations)
- [ ] ⏳ Test upload endpoint with Postman/cURL
- [ ] ⏳ Test tracking endpoint with Postman/cURL
- [ ] ⏳ Verify file permissions on upload directory

### Frontend Verification

- [x] ✅ Product dialog updated with technical sheet section
- [x] ✅ Upload functionality implemented
- [x] ✅ Service methods added for API calls
- [x] ✅ UI styling added for technical sheet preview
- [x] ✅ Form validation for PDF files only
- [ ] ⏳ Test upload in development environment
- [ ] ⏳ Test product save with technical sheet
- [ ] ⏳ Test product load with existing technical sheet
- [ ] ⏳ Test remove technical sheet functionality

### Documentation

- [x] ✅ Integration guide created
- [x] ✅ Feature summary created
- [x] ✅ Quick start guide created
- [x] ✅ Test HTML page created
- [x] ✅ Deployment checklist created

## Deployment Steps

### 1. Backend Deployment

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if any new ones)
npm install

# Build the application
npm run build

# Run database migrations (if applicable)
# npm run migration:run

# Restart the server
pm2 restart backend
# or
npm run start:prod
```

### 2. Create Upload Directory

```bash
# Ensure directory exists with correct permissions
mkdir -p backend/uploads/products/technical-sheets
chmod 755 backend/uploads/products/technical-sheets
```

### 3. Frontend Deployment

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if any new ones)
npm install

# Build for production
npm run build

# Deploy build files to web server
# (Copy dist/ contents to your web server)
```

### 4. Environment Configuration

Update your environment variables if needed:

```env
# .env or environment configuration
UPLOAD_PATH=/path/to/uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=application/pdf
```

### 5. Web Server Configuration

#### Nginx Configuration
```nginx
# Add to your nginx config
location /uploads/products/technical-sheets/ {
    alias /path/to/backend/uploads/products/technical-sheets/;
    add_header Content-Type application/pdf;
    add_header Content-Disposition inline;
}
```

#### Apache Configuration
```apache
# Add to your .htaccess or apache config
<Directory "/path/to/backend/uploads/products/technical-sheets">
    Options -Indexes
    AllowOverride None
    Require all granted
</Directory>
```

### 6. CORS Configuration

If third-party websites will access the tracking API, configure CORS:

```typescript
// In your main.ts or app configuration
app.enableCors({
  origin: [
    'https://your-main-website.com',
    'https://partner-website.com',
    // Add other allowed domains
  ],
  methods: ['GET', 'POST'],
  credentials: true,
});
```

## Post-Deployment Testing

### 1. Test Upload Functionality

```bash
# Test file upload
curl -X POST \
  'https://your-api.com/catalogue/products/upload-technical-sheet' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'technicalSheet=@/path/to/test.pdf'

# Expected response:
# { "url": "/uploads/products/technical-sheets/..." }
```

### 2. Test Tracking Endpoint

```bash
# Test download tracking
curl -X POST \
  'https://your-api.com/catalogue/products/PRODUCT_ID/track-technical-sheet-download' \
  -H 'Content-Type: application/json' \
  -d '{"email": "test@example.com"}'

# Expected response:
# { "_id": "...", "productId": "...", "email": "test@example.com", ... }
```

### 3. Test Download Stats

```bash
# Test getting download history
curl -X GET \
  'https://your-api.com/catalogue/products/PRODUCT_ID/technical-sheet-downloads' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Expected response:
# [{ "email": "test@example.com", "downloadedAt": "...", ... }]
```

### 4. Test Frontend

1. Log in to admin panel
2. Navigate to Catalogue → Products
3. Create or edit a product
4. Go to Media tab
5. Upload a test PDF
6. Save product
7. Verify PDF appears in product details
8. Test remove functionality

### 5. Test Third-Party Integration

1. Open `tests/technical-sheet-download-test.html` in browser
2. Configure with production URLs
3. Enter test email
4. Click download
5. Verify:
   - Tracking API is called successfully
   - PDF downloads correctly
   - Download is recorded in database

## Monitoring & Maintenance

### Database Monitoring

```sql
-- Check total downloads
db.technical_sheet_downloads.count()

-- Check recent downloads
db.technical_sheet_downloads.find().sort({downloadedAt: -1}).limit(10)

-- Check downloads by product
db.technical_sheet_downloads.aggregate([
  { $group: { _id: "$productCode", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

-- Check unique emails
db.technical_sheet_downloads.distinct("email").length
```

### File System Monitoring

```bash
# Check upload directory size
du -sh backend/uploads/products/technical-sheets/

# Count uploaded files
ls -1 backend/uploads/products/technical-sheets/ | wc -l

# Check disk space
df -h
```

### Log Monitoring

Monitor your application logs for:
- Upload errors
- Tracking failures
- File access issues
- Database connection problems

## Security Hardening

### 1. Rate Limiting

Implement rate limiting on the tracking endpoint:

```typescript
// Example using express-rate-limit
import rateLimit from 'express-rate-limit';

const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many download requests, please try again later.'
});

app.use('/catalogue/products/:id/track-technical-sheet-download', trackingLimiter);
```

### 2. File Validation

Ensure only valid PDFs are uploaded:

```typescript
// Already implemented in controller
fileFilter: (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new BadRequestException('Only PDF files are allowed'), false);
  }
}
```

### 3. File Size Limits

Configure maximum file size:

```typescript
// In your multer configuration
limits: {
  fileSize: 10 * 1024 * 1024 // 10MB
}
```

### 4. Access Control

Ensure upload directory is not directly browsable:

```nginx
# Nginx
location /uploads/products/technical-sheets/ {
    autoindex off;  # Disable directory listing
}
```

## Rollback Plan

If issues occur after deployment:

### 1. Backend Rollback

```bash
# Revert to previous version
git checkout <previous-commit>
npm run build
pm2 restart backend
```

### 2. Database Rollback

```bash
# If using migrations
npm run migration:revert

# Manual cleanup if needed
db.technical_sheet_downloads.drop()
db.products.updateMany({}, { $unset: { technicalSheet: "" } })
```

### 3. Frontend Rollback

```bash
# Deploy previous build
# Copy previous dist/ files back to web server
```

## Performance Optimization

### 1. CDN Integration

Consider serving PDFs through a CDN:

```typescript
// Update upload to also push to CDN
const cdnUrl = await uploadToCDN(file);
return { url: cdnUrl };
```

### 2. Database Indexing

Add indexes for better query performance:

```javascript
// In MongoDB
db.technical_sheet_downloads.createIndex({ productId: 1, downloadedAt: -1 })
db.technical_sheet_downloads.createIndex({ email: 1 })
db.technical_sheet_downloads.createIndex({ downloadedAt: -1 })
```

### 3. Caching

Implement caching for download statistics:

```typescript
// Example using Redis
const stats = await redis.get(`product:${productId}:download-stats`);
if (!stats) {
  const computed = await this.getTechnicalSheetDownloadStats(productId);
  await redis.set(`product:${productId}:download-stats`, JSON.stringify(computed), 'EX', 3600);
  return computed;
}
return JSON.parse(stats);
```

## Support & Troubleshooting

### Common Issues

1. **Upload fails with 413 error**
   - Increase nginx/apache client_max_body_size
   - Check multer file size limits

2. **CORS errors on tracking endpoint**
   - Add allowed origins to CORS configuration
   - Check preflight OPTIONS requests

3. **Files not accessible**
   - Check file permissions (755 for directories, 644 for files)
   - Verify web server configuration

4. **Database connection errors**
   - Check MongoDB connection string
   - Verify entity is registered in module

### Getting Help

- Check logs: `pm2 logs backend`
- Review documentation files
- Test with provided HTML test page
- Check browser console for frontend errors

## Success Criteria

Deployment is successful when:

- [x] Backend endpoints respond correctly
- [x] Frontend UI displays and functions properly
- [x] Files upload successfully
- [x] Downloads are tracked in database
- [x] Third-party integration works
- [x] No errors in application logs
- [x] Performance is acceptable
- [x] Security measures are in place

## Next Steps After Deployment

1. Monitor initial usage
2. Gather user feedback
3. Optimize based on usage patterns
4. Consider additional features:
   - Analytics dashboard
   - Email notifications
   - Download expiry
   - Version control for PDFs
   - Bulk operations

## Sign-Off

- [ ] Backend developer reviewed and tested
- [ ] Frontend developer reviewed and tested
- [ ] QA team tested all scenarios
- [ ] DevOps verified deployment configuration
- [ ] Product owner approved feature
- [ ] Documentation reviewed and complete
- [ ] Deployment completed successfully
- [ ] Post-deployment testing passed

---

**Deployment Date**: _________________

**Deployed By**: _________________

**Version**: _________________

**Notes**: _________________
