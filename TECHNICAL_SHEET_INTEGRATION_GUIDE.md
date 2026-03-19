# Technical Sheet Download Integration Guide

## Overview
This guide explains how to integrate PDF technical sheet downloads with email tracking for products in the catalogue management system.

## Backend Implementation

### 1. Database Entity
A new `TechnicalSheetDownload` entity tracks all downloads:
- Product information (ID, code, name)
- User email
- IP address, user agent, referrer
- Download timestamp

### 2. API Endpoints

#### Upload Technical Sheet (Admin)
```
POST /catalogue/products/upload-technical-sheet
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: { technicalSheet: <PDF file> }
Response: { url: "/uploads/products/technical-sheets/..." }
```

#### Track Download (Public)
```
POST /catalogue/products/:productId/track-technical-sheet-download
Content-Type: application/json

Body: { email: "user@example.com" }
Response: { _id, productId, email, downloadedAt, ... }
```

#### Get Download Stats (Admin)
```
GET /catalogue/products/:productId/technical-sheet-downloads
Authorization: Bearer <token>

Response: [{ email, downloadedAt, ipAddress, ... }]
```

### 3. Product Entity Update
Products now include an optional `technicalSheet` field storing the PDF URL.

## Frontend Implementation

### Admin Interface
The product dialog now includes a "Technical Sheet (PDF)" section in the Media tab:
- Upload PDF files (validated to accept only PDFs)
- Display uploaded sheet with remove option
- Alternative: paste external PDF URL

## Third-Party Website Integration

### HTML Example
```html
<!DOCTYPE html>
<html>
<head>
    <title>Product Technical Sheet Download</title>
    <style>
        .download-form {
            max-width: 400px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="email"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        button {
            width: 100%;
            padding: 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: #0056b3;
        }
        .error {
            color: red;
            font-size: 14px;
        }
        .success {
            color: green;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="download-form">
        <h2>Download Technical Sheet</h2>
        <p>Enter your email to download the product technical sheet</p>
        
        <form id="downloadForm">
            <div class="form-group">
                <label for="email">Email Address:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <button type="submit">Download PDF</button>
        </form>
        
        <div id="message"></div>
    </div>

    <script>
        // Configuration
        const API_BASE_URL = 'https://your-api-domain.com/catalogue';
        const PRODUCT_ID = 'YOUR_PRODUCT_ID'; // Replace with actual product ID
        const TECHNICAL_SHEET_URL = 'YOUR_TECHNICAL_SHEET_URL'; // Replace with actual PDF URL

        document.getElementById('downloadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const messageDiv = document.getElementById('message');
            
            try {
                // Track the download
                const response = await fetch(
                    `${API_BASE_URL}/products/${PRODUCT_ID}/track-technical-sheet-download`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email })
                    }
                );

                if (response.ok) {
                    messageDiv.innerHTML = '<p class="success">Download starting...</p>';
                    
                    // Trigger download
                    const link = document.createElement('a');
                    link.href = TECHNICAL_SHEET_URL;
                    link.download = 'technical-sheet.pdf';
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Reset form
                    document.getElementById('downloadForm').reset();
                } else {
                    messageDiv.innerHTML = '<p class="error">Failed to process request. Please try again.</p>';
                }
            } catch (error) {
                console.error('Error:', error);
                messageDiv.innerHTML = '<p class="error">An error occurred. Please try again.</p>';
            }
        });
    </script>
</body>
</html>
```

### JavaScript Integration (for existing websites)
```javascript
async function downloadTechnicalSheet(productId, technicalSheetUrl, email) {
    const API_BASE_URL = 'https://your-api-domain.com/catalogue';
    
    try {
        // Track the download
        const response = await fetch(
            `${API_BASE_URL}/products/${productId}/track-technical-sheet-download`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            }
        );

        if (response.ok) {
            // Trigger download
            window.open(technicalSheetUrl, '_blank');
            return true;
        } else {
            console.error('Failed to track download');
            return false;
        }
    } catch (error) {
        console.error('Error tracking download:', error);
        return false;
    }
}

// Usage example
const downloadButton = document.getElementById('download-btn');
downloadButton.addEventListener('click', async () => {
    const email = prompt('Enter your email address:');
    if (email) {
        const success = await downloadTechnicalSheet(
            'PRODUCT_ID',
            'https://your-domain.com/uploads/products/technical-sheets/sheet.pdf',
            email
        );
        if (success) {
            alert('Download started!');
        } else {
            alert('Failed to start download. Please try again.');
        }
    }
});
```

### React Component Example
```jsx
import React, { useState } from 'react';

const TechnicalSheetDownload = ({ productId, technicalSheetUrl }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDownload = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(
                `https://your-api-domain.com/catalogue/products/${productId}/track-technical-sheet-download`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                }
            );

            if (response.ok) {
                setMessage('Download starting...');
                window.open(technicalSheetUrl, '_blank');
                setEmail('');
            } else {
                setMessage('Failed to process request. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="technical-sheet-download">
            <h3>Download Technical Sheet</h3>
            <form onSubmit={handleDownload}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Download PDF'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default TechnicalSheetDownload;
```

## Security Considerations

1. **Rate Limiting**: Consider implementing rate limiting on the tracking endpoint to prevent abuse
2. **Email Validation**: The backend should validate email format
3. **CORS**: Configure CORS to allow requests from authorized third-party domains
4. **API Key**: For production, consider requiring an API key for third-party integrations

## Analytics & Reporting

Admins can view download statistics:
- Total downloads per product
- Unique email addresses
- Download trends over time
- Geographic distribution (via IP address)

## Testing

Test the integration:
1. Upload a technical sheet in the admin panel
2. Get the product ID and technical sheet URL
3. Create a test HTML page with the integration code
4. Submit an email and verify the download is tracked
5. Check the admin panel for download records
