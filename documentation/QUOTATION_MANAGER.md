# Quotation Manager - Complete Implementation Guide

## Overview

The Quotation Manager is a comprehensive module that handles the complete workflow from client enquiries to quotation generation, approval, and delivery. It's tightly integrated with Client Manager and Catalogue Manager modules.

## User Flow

### 1. Client Login & Product Browsing
- Client credentials are created from **Client Manager**
- Client logs into the website using their credentials
- Client browses products from **Catalogue Manager**
- Client adds products to cart with quantities and specifications

### 2. Enquiry Submission
- Client submits cart as an enquiry request
- Enquiry is saved in **Quotations → Enquiries** tab
- Each enquiry contains:
  - Client information (from Client Manager)
  - Selected products (from Catalogue Manager)
  - Quantities and specifications
  - Enquiry status: `new`, `processing`, `quoted`, `converted`, `closed`

### 3. Quotation Generation
- Admin reviews enquiries in the Quotations module
- Admin clicks "Generate Quotation" for an enquiry
- System automatically creates quotation with:
  - Client details
  - Product list with pricing
  - Subtotal, tax, and grand total
  - Valid until date (30 days default)
  - Status: `draft`

### 4. Quotation Approval Workflow
- **Draft**: Initial state after generation
- **Pending Approval**: Admin submits quotation for approval
- **Approved**: Manager/authorized user approves the quotation
- **Sent**: Quotation is sent to client via email or WhatsApp
- **Accepted/Declined**: Client response
- **Expired**: Past valid until date

### 5. Quotation Delivery
- Only **approved** quotations can be sent
- Delivery options:
  - Email (default)
  - WhatsApp (based on global settings)
- System tracks when and how quotation was sent

## Database Schema

### Enquiry Entity
```typescript
{
  _id: ObjectId
  enquiryNumber: string          // Auto-generated: ENQ-{timestamp}
  clientId: string               // Reference to Client
  customerName: string
  customerEmail: string
  customerPhone?: string
  company?: string
  items: EnquiryItem[]          // Products from cart
  source: 'website' | 'email' | 'phone' | 'walk_in' | 'referral'
  status: 'new' | 'processing' | 'quoted' | 'converted' | 'closed'
  message?: string
  quotationId?: string          // Linked quotation
  organizationId: string
  createdAt: Date
  updatedAt?: Date
}

interface EnquiryItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  specifications?: string
}
```

### Quotation Entity
```typescript
{
  _id: ObjectId
  quotationNumber: string        // Auto-generated: Q-{timestamp}
  clientId: string              // Reference to Client
  enquiryId?: string            // Reference to Enquiry
  clientName?: string
  clientEmail?: string
  items: QuotationItem[]
  subtotal: number
  taxTotal: number
  discountTotal: number
  grandTotal: number
  currency: string
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'accepted' | 'declined' | 'expired'
  approvedBy?: string
  approvedAt?: Date
  sentAt?: Date
  sentVia?: 'email' | 'whatsapp'
  notes?: string
  terms?: string
  validUntil: Date
  organizationId: string
  createdBy: string
  createdAt: Date
  updatedAt?: Date
}

interface QuotationItem {
  productId?: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
  description?: string
}
```

## Backend API Endpoints

### Quotations
- `GET /quotations` - Get all quotations for organization
- `GET /quotations/:id` - Get single quotation
- `GET /quotations/client/:clientId` - Get quotations by client
- `POST /quotations` - Create new quotation
- `POST /quotations/from-enquiry/:enquiryId` - Generate quotation from enquiry
- `PUT /quotations/:id` - Update quotation
- `POST /quotations/:id/submit-approval` - Submit for approval
- `POST /quotations/:id/approve` - Approve quotation
- `POST /quotations/:id/send` - Send quotation (body: { via: 'email' | 'whatsapp' })
- `DELETE /quotations/:id` - Delete quotation

### Enquiries
- `GET /quotations/enquiries/all` - Get all enquiries
- `GET /quotations/enquiries/:id` - Get single enquiry
- `POST /quotations/enquiries` - Create enquiry
- `PUT /quotations/enquiries/:id` - Update enquiry
- `DELETE /quotations/enquiries/:id` - Delete enquiry

## Frontend Components

### Admin Portal

#### 1. Quotations Component (`quotations.component.ts`)
Main component with two tabs:
- **Enquiries Tab**: Lists all client enquiries
- **Quotations Tab**: Lists all generated quotations

#### 2. Enquiry List Component (`enquiry-list.component.ts`)
Features:
- Display all enquiries in table format
- Show enquiry number, customer info, items count, status, date
- Actions:
  - Generate Quotation (disabled if already quoted)
  - Delete Enquiry
- Status badges with color coding

#### 3. Quotation List Component (`quotation-list.component.ts`)
Features:
- Display all quotations in table format
- Show quotation number, client info, total amount, status, date
- Actions based on status:
  - Submit for Approval (only for draft)
  - Approve (only for pending_approval)
  - Send via Email (only for approved)
  - Send via WhatsApp (only for approved)
- Status badges with color coding

#### 4. Quotations Widget (`quotations-widget.component.ts`)
Dashboard widget showing:
- Total enquiries (with new count)
- Total quotations (with pending approval count)
- Approved quotations count
- Sent quotations count

### Client Portal

#### 1. Cart Component (`cart.component.ts`)
Features:
- Display cart items with product name, price, quantity
- Update quantity
- Remove items
- Show total amount
- Submit enquiry button
- Clear cart after submission

#### 2. Client Portal Service (`client-portal.service.ts`)
Cart management:
- `addToCart(item)` - Add product to cart
- `removeFromCart(productId)` - Remove item
- `updateCartItem(productId, quantity)` - Update quantity
- `clearCart()` - Clear all items
- `getCart()` - Get current cart
- `submitEnquiry(clientData)` - Submit cart as enquiry

## Frontend Services

### QuotationsService (`quotations.service.ts`)
```typescript
// Quotations
getQuotations(): Observable<any[]>
getQuotation(id: string): Observable<any>
getQuotationsByClient(clientId: string): Observable<any[]>
createQuotation(quote: any): Observable<any>
createFromEnquiry(enquiryId: string): Observable<any>
updateQuotation(id: string, quote: any): Observable<any>
submitForApproval(id: string): Observable<any>
approveQuotation(id: string): Observable<any>
sendQuotation(id: string, via: 'email' | 'whatsapp'): Observable<any>
deleteQuotation(id: string): Observable<any>

// Enquiries
getEnquiries(): Observable<any[]>
getEnquiry(id: string): Observable<any>
createEnquiry(enquiry: any): Observable<any>
updateEnquiry(id: string, enquiry: any): Observable<any>
deleteEnquiry(id: string): Observable<any>
```

## Integration Points

### 1. Client Manager Integration
- Client credentials created in Client Manager
- Client login authentication
- Client information pulled for enquiries and quotations
- Client ID linked to all enquiries and quotations

### 2. Catalogue Manager Integration
- Products browsed from Catalogue
- Product details (name, price, images) displayed
- Product IDs and pricing pulled for cart items
- Real-time product availability check

### 3. Future Integrations
- **Email Service**: Send quotations via email
- **WhatsApp API**: Send quotations via WhatsApp
- **Notification System**: Notify admins of new enquiries
- **CRM Module**: Convert accepted quotations to deals
- **Order Management**: Convert accepted quotations to orders

## Status Flow Diagrams

### Enquiry Status Flow
```
new → processing → quoted → converted/closed
```

### Quotation Status Flow
```
draft → pending_approval → approved → sent → accepted/declined
                                           ↓
                                        expired
```

## Implementation Checklist

### Backend ✅
- [x] Update Enquiry entity with clientId and organizationId
- [x] Update Quotation entity with approval and delivery fields
- [x] Implement QuotationsService with all methods
- [x] Implement QuotationsController with all endpoints
- [x] Update QuotationsModule with dependencies

### Frontend ✅
- [x] Update QuotationsService with all API methods
- [x] Create EnquiryListComponent
- [x] Update QuotationListComponent with approval workflow
- [x] Update QuotationsComponent with proper tab order
- [x] Create CartComponent for client portal
- [x] Update ClientPortalService with cart management
- [x] Create QuotationsWidgetComponent

### Pending Features 🔄
- [ ] Email template system
- [ ] WhatsApp integration
- [ ] PDF generation for quotations
- [ ] Client portal quotation view
- [ ] Quotation acceptance/rejection by client
- [ ] Global settings for delivery preferences
- [ ] Notification system for new enquiries
- [ ] Analytics and reporting

## Usage Examples

### Client Submitting Enquiry
```typescript
// Add products to cart
clientPortalService.addToCart({
  productId: '123',
  productName: 'Product A',
  quantity: 2,
  unitPrice: 100,
  specifications: 'Custom size'
});

// Submit enquiry
const clientData = {
  clientId: 'client123',
  customerName: 'John Doe',
  customerEmail: 'john@example.com'
};
clientPortalService.submitEnquiry(clientData).subscribe();
```

### Admin Generating Quotation
```typescript
// Generate from enquiry
quotationsService.createFromEnquiry('enquiry123').subscribe(quotation => {
  console.log('Quotation created:', quotation.quotationNumber);
});
```

### Approval Workflow
```typescript
// Submit for approval
quotationsService.submitForApproval('quotation123').subscribe();

// Approve
quotationsService.approveQuotation('quotation123').subscribe();

// Send
quotationsService.sendQuotation('quotation123', 'email').subscribe();
```

## Best Practices

1. **Always validate client authentication** before allowing cart operations
2. **Check product availability** before adding to cart
3. **Verify quotation status** before allowing state transitions
4. **Log all approval actions** for audit trail
5. **Send notifications** at each workflow stage
6. **Archive expired quotations** automatically
7. **Maintain quotation history** for reporting

## Security Considerations

1. Client can only view their own enquiries and quotations
2. Only authorized users can approve quotations
3. Quotation amounts cannot be modified after approval
4. All actions are logged with user ID and timestamp
5. Client authentication required for cart operations

## Performance Optimization

1. Cache product details to reduce database queries
2. Paginate enquiry and quotation lists
3. Index frequently queried fields (clientId, status, organizationId)
4. Use aggregation for dashboard statistics
5. Lazy load quotation details

## Testing Scenarios

1. Client adds products to cart and submits enquiry
2. Admin generates quotation from enquiry
3. Admin submits quotation for approval
4. Manager approves quotation
5. System sends quotation via email
6. Client accepts/declines quotation
7. Quotation expires after valid until date
8. Multiple enquiries from same client
9. Bulk quotation generation
10. Status transition validations

## Future Enhancements

1. **Multi-currency support** for international clients
2. **Discount management** with approval workflow
3. **Quotation templates** for faster generation
4. **Automated follow-ups** for pending quotations
5. **Client feedback** collection after quotation
6. **Quotation comparison** for clients
7. **Bulk operations** for enquiries and quotations
8. **Advanced analytics** and reporting
9. **Integration with accounting** systems
10. **Mobile app** for client portal

---

**Module Status**: ✅ Core Implementation Complete
**Last Updated**: 2024
**Maintained By**: Development Team
