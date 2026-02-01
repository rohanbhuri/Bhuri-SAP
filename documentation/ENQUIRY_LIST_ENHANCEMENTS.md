# Enquiry List Component - Feature Enhancements

## Overview
Enhanced the enquiry-list component in the Quotations module with advanced features for managing enquiry workflows, including presentation/quotation creation and client management.

## Features Implemented

### 1. **Create Presentation from Enquiry**
- Button appears when `presentationId` is not set
- Creates a new presentation with enquiry data
- Button changes to "View Presentation" after creation
- Color: Blue (#2196f3)

### 2. **Create Quotation from Enquiry**
- Button appears when `quotationId` is not set
- Creates a new quotation with enquiry data
- Button changes to "View Quotation" after creation
- Color: Green (#4caf50)

### 3. **Dynamic Button State Management**
- Buttons automatically update when presentation/quotation is created
- Buttons revert to "Create" state when deleted (via quotationDeleted$ subscription)
- UI updates without full page reload

### 4. **Create Client from Enquiry**
- Button appears when enquiry doesn't have `clientId`
- Creates a new client entry with customer data from enquiry
- Automatically hidden after client is created
- Color: Orange (#ff9800)

### 5. **View Details**
- "View Presentation" button navigates to presentation details
- "View Quotation" button navigates to quotation details
- "View Details" menu option for enquiry information
- Color: Purple (#9c27b0)

## Files Modified

### 1. **Frontend Service** - [quotations.service.ts](frontend/src/app/modules/quotations/quotations.service.ts)
Added three new methods:
```typescript
createPresentationFromEnquiry(enquiryId: string): Observable<any>
getEnquiryDetails(enquiryId: string): Observable<any>
```

### 2. **Frontend Component** - [enquiry-list.component.ts](frontend/src/app/modules/quotations/components/enquiry-list/enquiry-list.component.ts)

#### New Methods Added:
- `createPresentation()` - Creates presentation from enquiry
- `createQuotation()` - Creates quotation from enquiry
- `createClient()` - Creates client from enquiry data
- `viewPresentation()` - Opens presentation details
- `viewQuotation()` - Opens quotation details
- `viewEnquiry()` - Opens enquiry details
- `subscribeToQuotationDeletion()` - Handles quotation deletion events
- `subscribeToPresentationDeletion()` - Placeholder for presentation deletion

#### Enhanced Template:
- Conditional rendering of action buttons based on `clientId`, `presentationId`, `quotationId`
- Icon buttons with tooltips
- Material design with color-coded buttons
- Responsive layout with flex wrapping

#### Styling Updates:
- `.action-buttons` - Flex container for button grouping
- Color-coded buttons:
  - Orange: Create Client
  - Blue: Create/View Presentation
  - Green: Create/View Quotation
  - Purple: View actions
- Hover effects with transform and shadow
- Compact button styling

## Dependencies
- Material Button Module (MatButtonModule)
- Material Icon Module (MatIconModule)
- Material Menu Module (MatMenuModule)
- Material Tooltip Module (MatTooltipModule)
- Material Dialog Module (MatDialog)
- ClientManagementService

## Data Structure Expected

Each enquiry object should have:
```typescript
{
  _id: string;
  enquiryNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  items: any[];
  status: 'new' | 'processing' | 'quoted' | 'converted' | 'closed';
  createdAt: Date;
  clientId?: string;           // Optional - if exists, no "Create Client" button
  presentationId?: string;     // Optional - if exists, shows "View Presentation" button
  quotationId?: string;        // Optional - if exists, shows "View Quotation" button
}
```

## Event Flow

### Creating Presentation:
1. User clicks "Create Presentation" button
2. Service calls `/presentations/from-enquiry/{enquiryId}`
3. Response updates enquiry with `presentationId`
4. Button changes to "View Presentation"
5. Snackbar shows success message

### Creating Quotation:
1. User clicks "Create Quotation" button
2. Service calls `/from-enquiry/{enquiryId}`
3. Response updates enquiry with `quotationId`
4. Button changes to "View Quotation"
5. Snackbar shows success message

### Creating Client:
1. User clicks "Create Client" button
2. Service calls `/client-management/requests/{enquiryId}/convert`
3. Response updates enquiry with `clientId`
4. "Create Client" button disappears
5. Snackbar shows success message

### Deletion Handling:
1. When quotation is deleted externally, `quotationDeleted$` is triggered
2. Component finds matching enquiry and clears `quotationId`
3. Button reverts to "Create Quotation"

## Future Enhancements
- Implement dialog-based details viewers for presentations and quotations
- Add presentation/quotation deletion tracking (add `presentationDeleted$` to service)
- Add bulk actions for multiple enquiries
- Implement filters for enquiry status
- Add export functionality

## Testing Checklist
- [ ] Create presentation from enquiry
- [ ] Create quotation from enquiry
- [ ] Create client from enquiry
- [ ] View presentation details
- [ ] View quotation details
- [ ] View enquiry details
- [ ] Delete enquiry
- [ ] Verify button state changes after creation
- [ ] Verify button state reverts after deletion
- [ ] Test error handling for all operations
- [ ] Verify "Create Client" button only appears when no clientId exists
