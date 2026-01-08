# Quotation Manager - Quick Reference

## Workflow Summary

```
Client Login → Browse Catalogue → Add to Cart → Submit Enquiry
                                                      ↓
Admin Reviews Enquiry → Generate Quotation → Submit for Approval
                                                      ↓
Manager Approves → Send to Client (Email/WhatsApp) → Client Accepts/Declines
```

## Key Features

### ✅ Implemented
- Client cart management with add/remove/update
- Enquiry submission from cart
- Automatic quotation generation from enquiries
- Multi-stage approval workflow (draft → pending → approved → sent)
- Status tracking for enquiries and quotations
- Integration with Client Manager and Catalogue Manager
- Dashboard widget with real-time statistics

### 🔄 Pending
- Email/WhatsApp delivery integration
- PDF quotation generation
- Client portal quotation view
- Global delivery settings
- Notification system

## Status Definitions

### Enquiry Status
- **new**: Just submitted by client
- **processing**: Under review by admin
- **quoted**: Quotation generated
- **converted**: Converted to order
- **closed**: Completed or cancelled

### Quotation Status
- **draft**: Initial state, can be edited
- **pending_approval**: Submitted for approval
- **approved**: Approved, ready to send
- **sent**: Delivered to client
- **accepted**: Client accepted
- **declined**: Client declined
- **expired**: Past valid date

## Quick Actions

### For Admins
1. View new enquiries: `/modules/quotations?tab=enquiries`
2. Generate quotation: Click "Generate Quotation" on enquiry
3. Submit for approval: Click "Submit for Approval" on draft quotation
4. View all quotations: `/modules/quotations?tab=quotations`

### For Managers
1. Approve quotations: Click "Approve" on pending quotations
2. Send quotations: Click "Send via Email/WhatsApp" on approved quotations

### For Clients
1. Browse products: Catalogue Manager
2. Add to cart: Product detail page
3. View cart: `/client-portal/cart`
4. Submit enquiry: Cart page
5. View quotations: `/client-portal/quotations`

## API Quick Reference

```typescript
// Generate quotation from enquiry
POST /quotations/from-enquiry/:enquiryId

// Submit for approval
POST /quotations/:id/submit-approval

// Approve quotation
POST /quotations/:id/approve

// Send quotation
POST /quotations/:id/send
Body: { via: 'email' | 'whatsapp' }

// Submit enquiry
POST /quotations/enquiries
Body: { clientId, customerName, customerEmail, items[] }
```

## Integration Points

| Module | Integration |
|--------|-------------|
| Client Manager | Client credentials, authentication, client data |
| Catalogue Manager | Product browsing, pricing, availability |
| Email Service | Quotation delivery (pending) |
| WhatsApp API | Quotation delivery (pending) |
| CRM | Convert to deals (future) |
| Order Management | Convert to orders (future) |

## File Structure

```
backend/src/
├── entities/
│   ├── enquiry.entity.ts          ✅ Updated
│   └── quotation.entity.ts        ✅ Updated
└── quotations/
    ├── quotations.controller.ts   ✅ Updated
    ├── quotations.service.ts      ✅ Updated
    └── quotations.module.ts       ✅ Updated

frontend/src/app/modules/
├── quotations/
│   ├── components/
│   │   ├── enquiry-list/          ✅ Created
│   │   └── quotation-list/        ✅ Updated
│   ├── quotations.component.ts    ✅ Updated
│   ├── quotations.service.ts      ✅ Updated
│   └── quotations-widget.component.ts ✅ Created
└── client-portal/
    ├── components/
    │   └── cart/                  ✅ Created
    └── client-portal.service.ts   ✅ Updated
```

## Testing Checklist

- [ ] Client can add products to cart
- [ ] Client can submit enquiry
- [ ] Admin can view enquiries
- [ ] Admin can generate quotation from enquiry
- [ ] Admin can submit quotation for approval
- [ ] Manager can approve quotation
- [ ] System tracks all status changes
- [ ] Widget shows correct statistics
- [ ] Cart persists in localStorage
- [ ] Enquiry links to quotation

## Common Issues & Solutions

**Issue**: Quotation not generating from enquiry
- Check if enquiry has valid clientId
- Verify products exist in catalogue
- Check organizationId matches

**Issue**: Cannot approve quotation
- Verify quotation status is 'pending_approval'
- Check user has approval permissions
- Ensure quotation has all required fields

**Issue**: Cart items not persisting
- Check localStorage is enabled
- Verify cart service is properly injected
- Check browser console for errors

## Next Steps

1. Implement email delivery service
2. Add WhatsApp integration
3. Create PDF generation for quotations
4. Build client portal quotation view
5. Add notification system
6. Implement global settings for delivery preferences
7. Create analytics dashboard
8. Add bulk operations support

---

**Quick Start**: Navigate to `/modules/quotations` to begin managing enquiries and quotations.
