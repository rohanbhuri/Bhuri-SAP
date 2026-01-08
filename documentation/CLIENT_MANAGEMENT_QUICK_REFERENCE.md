# Client Management - Quick Reference

## File Structure

```
frontend/src/app/modules/client-management/
├── components/
│   ├── request-login-list.component.ts          # Main request list with filters
│   ├── create-client-login-dialog.component.ts  # Two-tab creation dialog
│   ├── clients-list.component.ts                # Client management list
│   ├── client-requests.component.ts             # Legacy component
│   ├── convert-client-dialog.component.ts       # Legacy dialog
│   └── public-client-request.component.ts       # Public form
├── services/
│   └── client-management.service.ts             # API service
├── client-management.component.ts               # Main layout with tabs
├── client-management.routes.ts                  # Route configuration
└── client-management-widget.component.ts        # Dashboard widget

backend/src/client-management/
├── client-management.controller.ts              # API endpoints
├── client-management.service.ts                 # Business logic
└── client-management.module.ts                  # Module definition

backend/src/entities/
├── client-request.entity.ts                     # Request schema
└── client.entity.ts                             # Client schema
```

## Key Components

### RequestLoginListComponent
**Purpose**: Display and filter client requests

**Key Features**:
- Date range filtering
- Search by name/email/mobile
- Create login button
- Status display

**Usage**:
```typescript
<app-request-login-list></app-request-login-list>
```

### CreateClientLoginDialogComponent
**Purpose**: Two-tab form for creating client logins

**Key Features**:
- Basic info tab (required fields)
- Additional details tab (optional fields)
- Password auto-generation
- Credential display
- Form validation

**Usage**:
```typescript
this.dialog.open(CreateClientLoginDialogComponent, {
  width: '800px',
  data: requestData,
  disableClose: true
});
```

## API Quick Reference

### Create Request (Public)
```typescript
POST /api/client-management/requests
{
  "companyName": "string",
  "contactPerson": "string",
  "email": "string",
  "phone": "string",
  "website": "string",
  "industry": "string",
  "message": "string"
}
```

### Get All Requests (Admin)
```typescript
GET /api/client-management/requests
Headers: { Authorization: "Bearer <token>" }
```

### Convert to Client (Admin)
```typescript
POST /api/client-management/requests/:requestId/convert
Headers: { Authorization: "Bearer <token>" }
{
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "phone": "string",
  "password": "string",  // optional
  "website": "string",
  "industry": "string",
  "companySize": "string",
  "address": "string",
  "city": "string",
  "country": "string",
  "taxId": "string",
  "billingAddress": "string",
  "notes": "string"
}

Response:
{
  "client": { ... },
  "user": { ... },
  "organization": { ... },
  "credentials": {
    "email": "string",
    "password": "string"
  }
}
```

## Form Fields Reference

### Basic Information (Required)
| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| companyName | text | required | Company name |
| firstName | text | required | Contact first name |
| lastName | text | required | Contact last name |
| email | email | required, email format | Login email |
| phone | text | required | Contact phone |
| password | password | optional | Leave empty for auto-gen |
| confirmPassword | password | must match password | Password confirmation |
| website | url | optional | Company website |

### Additional Details (Optional)
| Field | Type | Options | Description |
|-------|------|---------|-------------|
| industry | select | Technology, Finance, Healthcare, Education, Retail, Manufacturing, Other | Business industry |
| companySize | select | 1-10, 11-50, 51-200, 201-500, 500+ | Number of employees |
| address | textarea | - | Physical address |
| city | text | - | City |
| country | text | - | Country |
| taxId | text | - | Tax identification |
| billingAddress | text | - | Billing address |
| notes | textarea | - | Additional notes |

## Service Methods

### ClientManagementService (Frontend)

```typescript
// Get all requests
getAllClientRequests(): Observable<any[]>

// Get single request
getClientRequestById(requestId: string): Observable<any>

// Convert to client
convertToClient(requestId: string, conversionData: any): Observable<any>

// Get all clients
getAllClients(): Observable<any[]>

// Update client
updateClient(clientId: string, updateData: any): Observable<any>

// Toggle status
toggleClientStatus(clientId: string, isActive: boolean): Observable<any>

// Delete client
deleteClient(clientId: string): Observable<any>
```

## Common Tasks

### 1. Add New Industry Option
```typescript
// In create-client-login-dialog.component.ts
<mat-option value="NewIndustry">New Industry</mat-option>
```

### 2. Add Custom Validation
```typescript
// In create-client-login-dialog.component.ts
this.basicForm = this.fb.group({
  email: ['', [Validators.required, Validators.email, customValidator]]
});
```

### 3. Customize Password Generation
```typescript
// In backend/src/client-management/client-management.service.ts
private generatePassword(): string {
  // Modify length and charset as needed
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  // ...
}
```

### 4. Add Email Notification
```typescript
// In backend/src/client-management/client-management.service.ts
async convertToClient(requestId: string, conversionData: any, adminUserId: string) {
  // ... existing code ...
  
  // Add email notification
  await this.emailService.sendCredentials(
    savedUser.email,
    credentials.password
  );
  
  return { ... };
}
```

## Styling Customization

### Material Theme Colors
```scss
// In component styles
::ng-deep .mat-mdc-raised-button.mat-primary {
  background-color: var(--theme-primary);
}
```

### Table Styling
```scss
::ng-deep .mat-mdc-header-cell {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
}
```

## Troubleshooting

### Issue: Credentials not displaying
**Solution**: Check browser console for errors, verify API response structure

### Issue: Form validation not working
**Solution**: Ensure all required fields have Validators.required

### Issue: Date filter not working
**Solution**: Verify date format matches backend expectations

### Issue: Password mismatch error
**Solution**: Check passwordMatchValidator implementation

### Issue: Duplicate email error
**Solution**: Email uniqueness is enforced, use different email

## Testing Commands

```bash
# Start development server
npm run dev

# Test API endpoint
curl -X POST http://localhost:3000/api/client-management/requests \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Test","contactPerson":"John Doe","email":"test@test.com","phone":"1234567890"}'

# Check logs
npm run pm2:logs

# Restart services
npm run pm2:restart
```

## Performance Tips

1. **Pagination**: Add pagination for large datasets
2. **Lazy Loading**: Implement virtual scrolling for tables
3. **Caching**: Cache frequently accessed data
4. **Debouncing**: Add debounce to search input
5. **Indexing**: Ensure database indexes on email and status fields

## Security Best Practices

1. Always validate input on both frontend and backend
2. Use HTTPS in production
3. Implement rate limiting on public endpoints
4. Store passwords with bcrypt (already implemented)
5. Sanitize user input to prevent XSS
6. Use parameterized queries to prevent SQL injection
7. Implement CSRF protection
8. Regular security audits

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] API rate limiting enabled
- [ ] CORS configured properly
- [ ] SSL certificate installed
- [ ] Error logging configured
- [ ] Backup strategy in place
- [ ] Monitoring tools setup
- [ ] Load testing completed
- [ ] Security audit passed

## Quick Links

- [Full Documentation](./CLIENT_MANAGEMENT_PRODUCTION_READY.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Database Blueprint](./DATABASE_BLUEPRINT.md)
- [Setup Guide](./SETUP_GUIDE.md)
