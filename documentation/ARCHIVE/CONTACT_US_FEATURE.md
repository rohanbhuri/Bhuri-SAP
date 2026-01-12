# Contact Us Feature - Implementation Summary

## Overview
Added a new "Contact Us" tab to the Client Management module that stores messages from external websites. The feature includes both backend API and frontend UI components.

## Files Created

### Backend

1. **Entity** - `backend/src/entities/contact-us.entity.ts`
   - Stores contact messages with fields: name, email, subject, message
   - Tracks read status and creation timestamp
   - Optional organization association

2. **Service** - `backend/src/contact-us/contact-us.service.ts`
   - `createMessage()` - Create new contact message
   - `getAllMessages()` - Retrieve all messages (with optional org filter)
   - `getMessageById()` - Get specific message
   - `markAsRead()` - Mark message as read
   - `deleteMessage()` - Delete message
   - `getUnreadCount()` - Get unread message count

3. **Controller** - `backend/src/contact-us/contact-us.controller.ts`
   - POST `/contact-us` - Create message (public, no auth required)
   - GET `/contact-us` - Get all messages (admin only)
   - GET `/contact-us/unread-count` - Get unread count (admin only)
   - GET `/contact-us/:messageId` - Get single message (admin only)
   - PUT `/contact-us/:messageId/read` - Mark as read (admin only)
   - DELETE `/contact-us/:messageId` - Delete message (admin only)

4. **Module** - `backend/src/contact-us/contact-us.module.ts`
   - Registers service and controller

### Frontend

1. **Component** - `frontend/src/app/modules/client-management/pages/contact-us.component.ts`
   - Displays contact messages in a table
   - Search functionality by name, email, or subject
   - View, mark as read, and delete actions
   - Unread message badge
   - Real-time unread count

2. **Updated Component** - `frontend/src/app/modules/client-management/client-management.component.ts`
   - Added "Contact Us" tab
   - Integrated ContactUsComponent

### Documentation

1. **API Documentation** - `documentation/CONTACT_US_API_DOCUMENTATION.md`
   - Complete API reference with examples
   - cURL examples for all endpoints
   - JavaScript and Python integration examples
   - Error response documentation

## API Endpoints

### Public Endpoint (No Authentication)
- **POST** `/contact-us` - Submit contact message

### Protected Endpoints (Admin/Super-Admin Only)
- **GET** `/contact-us` - Get all messages
- **GET** `/contact-us/unread-count` - Get unread count
- **GET** `/contact-us/:messageId` - Get single message
- **PUT** `/contact-us/:messageId/read` - Mark as read
- **DELETE** `/contact-us/:messageId` - Delete message

## Integration Steps

### 1. Update App Module
The `ContactUsModule` has been added to `app.module.ts` imports.

### 2. Database
The `ContactUs` entity will be automatically created in MongoDB with the following collection:
```
Database: bhuri-sap
Collection: contact_us
```

### 3. External Website Integration
External websites can submit contact forms using:
```javascript
fetch('http://localhost:3000/api/contact-us', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Inquiry',
    message: 'Your message here'
  })
})
```

## Features

✅ **Public Submission** - External websites can submit messages without authentication
✅ **Admin Dashboard** - View all contact messages in a dedicated tab
✅ **Search** - Filter messages by name, email, or subject
✅ **Read Status** - Track which messages have been read
✅ **Unread Count** - Display badge with unread message count
✅ **Message Management** - View, mark as read, and delete messages
✅ **Organization Filtering** - Optional organization association
✅ **Timestamps** - Track when messages were received
✅ **API Documentation** - Complete API reference with examples

## Usage

### For External Websites
Submit contact form data to the public endpoint without authentication.

### For Admin Users
1. Navigate to Client Management module
2. Click on "Contact Us" tab
3. View all submitted messages
4. Search for specific messages
5. Mark messages as read
6. Delete messages as needed

## Security Notes

- Public endpoint allows message submission without authentication
- All admin endpoints require JWT authentication and admin/super-admin role
- Messages are stored with timestamps for audit purposes
- Read status helps track message processing
