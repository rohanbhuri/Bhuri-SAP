# Technical Sheet Feature - Quick Start Guide

## For Admins

### Adding a Technical Sheet to a Product

1. **Navigate to Catalogue Management**
   - Go to the Catalogue module in your admin panel
   - Click on "Products"

2. **Open Product Dialog**
   - Click "Add Product" for a new product, or
   - Click the edit icon on an existing product

3. **Go to Media Tab**
   - Click on the "Media" tab in the product dialog

4. **Upload Technical Sheet**
   - Scroll to the "Technical Sheet (PDF)" section
   - Click "Upload Technical Sheet" button
   - Select a PDF file from your computer
   - Wait for upload confirmation
   - Alternatively, paste a PDF URL in the text field

5. **Save Product**
   - Click "Create" or "Update" button
   - Your technical sheet is now associated with the product

### Viewing Download Statistics

1. **Access Analytics** (Coming Soon)
   - Navigate to Catalogue → Analytics
   - View download statistics per product
   - See who downloaded technical sheets and when

2. **Via API** (Current Method)
   ```bash
   # Get downloads for a specific product
   curl -X GET \
     'http://localhost:3000/catalogue/products/{productId}/technical-sheet-downloads' \
     -H 'Authorization: Bearer YOUR_JWT_TOKEN'
   ```

## For Third-Party Website Developers

### Quick Integration (5 minutes)

1. **Get Product Information**
   - Product ID (from your admin panel)
   - Technical Sheet URL (from the product details)

2. **Add HTML Form**
   ```html
   <form id="downloadForm">
       <input type="email" id="email" placeholder="Enter your email" required>
       <button type="submit">Download Technical Sheet</button>
   </form>
   <div id="message"></div>
   ```

3. **Add JavaScript**
   ```javascript
   const API_URL = 'https://your-api-domain.com/catalogue';
   const PRODUCT_ID = 'your-product-id';
   const PDF_URL = 'https://your-domain.com/path/to/sheet.pdf';

   document.getElementById('downloadForm').addEventListener('submit', async (e) => {
       e.preventDefault();
       const email = document.getElementById('email').value;
       
       try {
           const response = await fetch(
               `${API_URL}/products/${PRODUCT_ID}/track-technical-sheet-download`,
               {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ email })
               }
           );
           
           if (response.ok) {
               window.open(PDF_URL, '_blank');
               document.getElementById('message').textContent = 'Download started!';
           }
       } catch (error) {
           document.getElementById('message').textContent = 'Error: ' + error.message;
       }
   });
   ```

4. **Test It**
   - Open the test page: `tests/technical-sheet-download-test.html`
   - Enter your configuration
   - Test the download flow

## Testing the Feature

### Using the Test Page

1. **Open Test Page**
   ```bash
   # Open in browser
   open tests/technical-sheet-download-test.html
   ```

2. **Configure Settings**
   - API Base URL: `http://localhost:3000/catalogue`
   - Product ID: Get from admin panel
   - Technical Sheet URL: Get from product details

3. **Test Download**
   - Enter an email address
   - Click "Download Technical Sheet"
   - Check console for tracking response
   - Verify PDF downloads

### Using cURL

```bash
# Track a download
curl -X POST \
  'http://localhost:3000/catalogue/products/{productId}/track-technical-sheet-download' \
  -H 'Content-Type: application/json' \
  -d '{"email": "test@example.com"}'

# View download history (requires auth)
curl -X GET \
  'http://localhost:3000/catalogue/products/{productId}/technical-sheet-downloads' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

## Common Issues & Solutions

### Issue: "Only PDF files are allowed"
**Solution**: Ensure you're uploading a file with `.pdf` extension and `application/pdf` MIME type.

### Issue: "Failed to track download"
**Solution**: 
- Check that the API URL is correct
- Verify the product ID exists
- Check browser console for CORS errors
- Ensure backend server is running

### Issue: "Product not found"
**Solution**: 
- Verify the product ID is correct
- Check that the product exists in the database
- Ensure you're using the MongoDB ObjectId format

### Issue: Download tracked but PDF doesn't download
**Solution**:
- Verify the technical sheet URL is correct
- Check that the file exists on the server
- Ensure the file is accessible (check permissions)
- Try opening the URL directly in browser

## API Reference

### Track Download (Public)
```
POST /catalogue/products/:productId/track-technical-sheet-download
Content-Type: application/json

Request Body:
{
  "email": "user@example.com"
}

Response:
{
  "_id": "...",
  "productId": "...",
  "productCode": "PRD-001",
  "productName": "Product Name",
  "email": "user@example.com",
  "ipAddress": "192.168.1.1",
  "downloadedAt": "2026-03-10T10:30:00Z"
}
```

### Upload Technical Sheet (Admin)
```
POST /catalogue/products/upload-technical-sheet
Authorization: Bearer <token>
Content-Type: multipart/form-data

Request Body:
{
  "technicalSheet": <PDF file>
}

Response:
{
  "url": "/uploads/products/technical-sheets/1234567890-123456789.pdf"
}
```

### Get Download History (Admin)
```
GET /catalogue/products/:productId/technical-sheet-downloads
Authorization: Bearer <token>

Response:
[
  {
    "_id": "...",
    "productId": "...",
    "email": "user@example.com",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "downloadedAt": "2026-03-10T10:30:00Z"
  }
]
```

## Next Steps

1. **Upload Technical Sheets**: Add PDFs to your products
2. **Test Integration**: Use the test page to verify functionality
3. **Integrate on Website**: Add the download form to your public website
4. **Monitor Downloads**: Check analytics to see who's downloading
5. **Optimize**: Based on usage, consider adding features like:
   - Email verification
   - Download limits
   - Expiring links
   - Custom branding

## Support

For more detailed information:
- Full Integration Guide: `TECHNICAL_SHEET_INTEGRATION_GUIDE.md`
- Feature Summary: `TECHNICAL_SHEET_FEATURE_SUMMARY.md`
- Test Page: `tests/technical-sheet-download-test.html`

## Security Notes

- The tracking endpoint is public (no authentication required)
- Upload endpoint requires admin authentication
- Email addresses are stored for tracking purposes
- IP addresses are logged for abuse prevention
- Consider implementing rate limiting in production
