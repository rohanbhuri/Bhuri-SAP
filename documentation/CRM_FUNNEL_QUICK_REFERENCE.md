# CRM Funnel - Quick Reference Guide

## 🚀 Quick Start

### Access the Funnel
```
Admin Dashboard: /modules/crm/funnel
Pipeline View:   /modules/crm/pipeline
Enquiries:       /modules/crm/enquiries
Orders:          /modules/crm/orders
```

---

## 📊 Complete Funnel Flow

```
1. LOGIN REQUEST (Website)
   ↓ Admin approves in Client Management
   
2. CONTACT (Client Management)
   ↓ Client browses website, adds to cart
   
3. ENQUIRY (Auto-created from cart)
   ↓ Sales rep creates presentation
   
4. PRESENTATION (Quotation Manager)
   ↓ Sales rep creates quotation
   
5. QUOTATION (Quotation Manager)
   ↓ Client accepts
   
6. ORDER (Auto-created)
   ↓ Payment & Delivery tracking
   
7. SUCCESS ✅
```

---

## 🎯 Admin Actions

### Dashboard (`/modules/crm/funnel`)
- View funnel statistics
- See conversion rates
- Check pipeline value
- Monitor revenue

### Pipeline (`/modules/crm/pipeline`)
- Visual kanban board
- 7 columns: New → Processing → Presentation Sent → Quoted → Won → Lost → On Hold
- Drag cards between columns (future)

### Enquiries (`/modules/crm/enquiries`)
**Actions per enquiry:**
- ▶️ Create Presentation
- 📄 Create Quotation
- ❌ Mark as Lost (with reason)
- ⏸️ Mark as On Hold (with follow-up date)

### Orders (`/modules/crm/orders`)
**Update statuses:**
- 💰 Payment: Pending → Partial → Paid
- 🚚 Delivery: Pending → Shipped → Delivered

---

## 👤 Client Actions

### Client Portal (`/client-portal`)

**1. Browse & Add to Cart**
```
Browse products → Add to cart → Submit enquiry
```

**2. View Quotations**
```
My Quotations → View details
```

**3. Accept/Decline**
```
View quotation → Accept ✅ or Decline ❌
```

**On Accept:**
- Order automatically created
- Payment tracking begins
- Delivery tracking begins

---

## 🔌 API Endpoints

### Dashboard
```
GET /api/crm/funnel/dashboard
GET /api/crm/funnel/pipeline
```

### Enquiries
```
GET  /api/crm/funnel/enquiries
POST /api/crm/funnel/enquiries/from-contact/:contactId
PUT  /api/crm/funnel/enquiries/:id/mark-lost
PUT  /api/crm/funnel/enquiries/:id/mark-on-hold
```

### Presentations
```
GET  /api/crm/funnel/presentations
POST /api/crm/funnel/presentations/from-enquiry/:enquiryId
POST /api/crm/funnel/presentations/:id/send
```

### Quotations
```
GET  /api/crm/funnel/quotations
POST /api/crm/funnel/quotations/from-enquiry/:enquiryId
POST /api/crm/funnel/quotations/:id/accept
POST /api/crm/funnel/quotations/:id/decline
```

### Orders
```
GET /api/crm/funnel/orders
PUT /api/crm/funnel/orders/:id/payment-status
PUT /api/crm/funnel/orders/:id/delivery-status
```

---

## 📈 Status Values

### Enquiry Status
- `new` - Just created
- `processing` - Being worked on
- `presentation_sent` - Presentation sent to client
- `quoted` - Quotation sent
- `converted` - Accepted, order created
- `lost` - Client declined
- `on_hold` - Waiting for client response

### Order Status
- `pending` - Order created
- `processing` - Being processed
- `completed` - Delivered and paid
- `cancelled` - Cancelled

### Payment Status
- `pending` - Not paid
- `partial` - Partially paid
- `paid` - Fully paid

### Delivery Status
- `pending` - Not shipped
- `shipped` - In transit
- `delivered` - Delivered

---

## 🎨 Color Codes

### Status Colors
- 🔵 Blue: New, Pending
- 🟣 Purple: Processing
- 🟠 Orange: Quoted
- 🟢 Green: Won, Completed, Paid
- 🔴 Red: Lost, Cancelled
- 🟡 Yellow: On Hold

---

## 💡 Tips & Best Practices

### For Sales Reps
1. **Respond quickly** to new enquiries
2. **Create presentations** for high-value enquiries
3. **Follow up** on on-hold enquiries
4. **Track reasons** for lost enquiries
5. **Update statuses** regularly

### For Admins
1. **Monitor conversion rates** weekly
2. **Analyze lost reasons** to improve
3. **Track pipeline value** for forecasting
4. **Review sales rep performance**
5. **Set follow-up reminders**

### For Clients
1. **Review quotations** carefully
2. **Ask questions** before accepting
3. **Provide decline reasons** to help improve
4. **Track order status** in portal

---

## 🔧 Troubleshooting

### Enquiry not showing?
- Check if status is correct
- Refresh the page
- Check organizationId

### Can't create presentation?
- Ensure enquiry has items
- Check permissions
- Verify enquiry status

### Order not created on accept?
- Check quotation status is 'sent'
- Verify backend is running
- Check browser console for errors

### Status not updating?
- Check network tab for API errors
- Verify authentication token
- Refresh the page

---

## 📞 Quick Commands

### Backend
```bash
cd backend
npm run start:dev
```

### Frontend
```bash
cd frontend
ng serve
```

### Test API
```bash
# Get dashboard
curl http://localhost:3000/api/crm/funnel/dashboard

# Get pipeline
curl http://localhost:3000/api/crm/funnel/pipeline

# Get enquiries
curl http://localhost:3000/api/crm/funnel/enquiries
```

---

## 📚 Related Documentation

- [CRM Racconti Redesign](./CRM_RACCONTI_REDESIGN.md) - Complete specification
- [CRM Funnel Implementation Guide](./CRM_FUNNEL_IMPLEMENTATION_GUIDE.md) - Technical details
- [CRM Funnel Summary](./CRM_FUNNEL_SUMMARY.md) - Implementation summary
- [CRM Funnel Visual Diagram](./CRM_FUNNEL_VISUAL_DIAGRAM.md) - Flow diagram
- [CRM Funnel Frontend Complete](./CRM_FUNNEL_FRONTEND_COMPLETE.md) - Frontend details

---

## ✅ Checklist for New Users

### Setup
- [ ] Backend running on port 3000
- [ ] Frontend running on port 4200
- [ ] MongoDB running
- [ ] User logged in with admin role

### First Time Use
- [ ] Access dashboard at `/modules/crm/funnel`
- [ ] Check pipeline view
- [ ] Create test enquiry
- [ ] Create presentation from enquiry
- [ ] Create quotation from enquiry
- [ ] Test accept/decline as client
- [ ] Verify order creation
- [ ] Update payment status
- [ ] Update delivery status

---

**Need help? Check the documentation or contact support.**

**Happy selling! 🎉**
