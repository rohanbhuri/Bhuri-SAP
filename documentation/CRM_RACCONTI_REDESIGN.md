# CRM Racconti Redesign - Complete Funnel System

**Last Updated**: 2025-01-XX  
**Version**: 2.0  
**Purpose**: Redesign CRM module to support complete Racconti sales funnel

---

## 🎯 Overview

Transform the existing CRM module to support the complete Racconti sales funnel:

```
Login Credential Request (Website)
    ↓
Convert to Contact (Client Management)
    ↓
Enquiry (Website Cart / Manual)
    ↓
Presentation (Quotation Manager)
    ↓
Quotation (Quotation Manager)
    ↓
Success (PO & Invoice) / Lost / On Hold
```

---

## 📊 Funnel Stages

### Stage 1: Login Credential Request
**Source**: Website form  
**Entity**: `ClientRequest` (existing)  
**Status**: `pending`, `approved`, `rejected`, `converted`

**Fields**:
- Company name, contact person, email, phone
- Website, industry, company size
- Address, city, country
- Message/requirements

**Actions**:
- Admin reviews request
- Approve → Convert to Contact
- Reject → Mark as rejected

---

### Stage 2: Contact (Client)
**Source**: Converted from ClientRequest OR Manual entry  
**Entity**: `Contact` (existing in CRM)  
**Status**: `active`, `inactive`

**Fields**:
- All ClientRequest fields
- `userId` (if converted to user account)
- `organizationId` (if converted to organization)
- `assignedToId` (sales rep)
- `source`: `website_request`, `manual`, `referral`

**Actions**:
- View contact details
- Create enquiry for contact
- Assign to sales rep
- Track all enquiries/quotations

---

### Stage 3: Enquiry
**Source**: Website product cart OR Manual creation  
**Entity**: `Enquiry` (existing)  
**Status**: `new`, `processing`, `presentation_sent`, `quoted`, `converted`, `lost`, `on_hold`

**Enhanced Fields**:
```typescript
{
  enquiryNumber: string,
  contactId: ObjectId,           // Link to Contact
  clientRequestId?: ObjectId,    // Original request if from website
  customerName: string,
  customerEmail: string,
  customerPhone?: string,
  company?: string,
  items: EnquiryItem[],          // Products from cart
  source: 'website' | 'manual',
  status: EnquiryStatus,
  message?: string,
  presentationId?: ObjectId,     // Link to Presentation
  quotationId?: ObjectId,        // Link to Quotation
  assignedToId?: ObjectId,       // Sales rep
  organizationId: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Actions**:
- Create presentation from enquiry
- Create quotation from enquiry
- Mark as lost/on hold
- Convert to quotation

---

### Stage 4: Presentation
**Source**: Created from Enquiry  
**Entity**: `Presentation` (existing)  
**Status**: `draft`, `sent`, `viewed`, `completed`

**Enhanced Fields**:
```typescript
{
  presentationNumber: string,
  enquiryId: ObjectId,           // Link to Enquiry
  contactId: ObjectId,           // Link to Contact
  clientName: string,
  title: string,
  slides: PresentationSlide[],   // Product slides
  coverBackground?: string,
  status: PresentationStatus,
  sentAt?: Date,
  viewedAt?: Date,
  organizationId: string,
  createdBy: string,
  createdAt: Date
}
```

**Actions**:
- Generate PDF presentation
- Send to client (email/WhatsApp)
- Track views
- Convert to quotation

---

### Stage 5: Quotation
**Source**: Created from Enquiry/Presentation  
**Entity**: `Quotation` (existing)  
**Status**: `draft`, `pending_approval`, `approved`, `sent`, `accepted`, `declined`, `expired`

**Enhanced Fields**:
```typescript
{
  quotationNumber: string,
  enquiryId?: ObjectId,          // Link to Enquiry
  presentationId?: ObjectId,     // Link to Presentation
  contactId: ObjectId,           // Link to Contact
  clientName: string,
  clientEmail: string,
  items: QuotationItem[],
  subtotal: number,
  taxTotal: number,
  discountTotal: number,
  grandTotal: number,
  currency: string,
  status: QuotationStatus,
  approvedBy?: string,
  approvedAt?: Date,
  sentAt?: Date,
  validUntil: Date,
  organizationId: string,
  notes?: string,
  terms?: string,
  createdAt: Date
}
```

**Actions**:
- Approve quotation
- Send to client
- Client accepts → Create PO & Invoice
- Client declines → Mark as lost
- Mark as on hold

---

### Stage 6: Success / Lost / On Hold
**Success**: `Order` + `Invoice` entities  
**Lost**: Update enquiry/quotation status  
**On Hold**: Update enquiry/quotation status with follow-up date

**Order Entity** (new):
```typescript
{
  orderNumber: string,
  quotationId: ObjectId,
  contactId: ObjectId,
  items: OrderItem[],
  totalAmount: number,
  status: 'pending' | 'processing' | 'completed' | 'cancelled',
  paymentStatus: 'pending' | 'partial' | 'paid',
  deliveryStatus: 'pending' | 'shipped' | 'delivered',
  organizationId: string,
  createdAt: Date
}
```

**Invoice Entity** (existing):
```typescript
{
  invoiceNumber: string,
  orderId: ObjectId,
  quotationId: ObjectId,
  contactId: ObjectId,
  items: InvoiceItem[],
  subtotal: number,
  taxTotal: number,
  grandTotal: number,
  status: 'draft' | 'sent' | 'paid' | 'overdue',
  dueDate: Date,
  paidAt?: Date,
  organizationId: string,
  createdAt: Date
}
```

---

## 🔄 Funnel Flow Logic

### Flow 1: Website Login Request → Contact
```
1. User submits login request on website
2. ClientRequest created with status 'pending'
3. Admin reviews in Client Management module
4. Admin approves → Creates Contact + User + Organization
5. Contact linked to ClientRequest via convertedUserId
```

### Flow 2: Contact → Enquiry
```
1. Contact browses website, adds products to cart
2. Submits enquiry with cart items
3. Enquiry created with contactId, items[], source='website'
4. OR Admin manually creates enquiry for contact
5. Enquiry assigned to sales rep
```

### Flow 3: Enquiry → Presentation
```
1. Sales rep reviews enquiry
2. Creates presentation from enquiry
3. Selects products from enquiry items
4. Designs slides with product images/3D models
5. Sends presentation to contact
6. Tracks when contact views presentation
```

### Flow 4: Presentation → Quotation
```
1. After presentation, sales rep creates quotation
2. Quotation inherits items from enquiry/presentation
3. Sales rep adjusts prices, adds discounts
4. Submits for approval (if required)
5. Sends quotation to contact
```

### Flow 5: Quotation → Success
```
1. Contact accepts quotation
2. System creates Order from quotation
3. System creates Invoice from order
4. Payment tracking begins
5. Order fulfillment process starts
```

### Flow 6: Quotation → Lost
```
1. Contact declines quotation
2. Sales rep marks quotation as 'declined'
3. Enquiry status updated to 'lost'
4. Reason for loss captured
5. Follow-up date set (optional)
```

### Flow 7: Quotation → On Hold
```
1. Contact requests time to decide
2. Sales rep marks enquiry as 'on_hold'
3. Follow-up date set
4. Reminder notification scheduled
```

---

## 🗄️ Database Changes

### New Entities

**Order** (`backend/src/entities/order.entity.ts`):
```typescript
import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid'
}

export enum DeliveryStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered'
}

@Entity('orders')
export class Order {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  orderNumber: string;

  @Column()
  quotationId: ObjectId;

  @Column()
  contactId: ObjectId;

  @Column()
  clientName: string;

  @Column()
  clientEmail: string;

  @Column('array')
  items: OrderItem[];

  @Column({ type: 'double' })
  totalAmount: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'enum', enum: DeliveryStatus, default: DeliveryStatus.PENDING })
  deliveryStatus: DeliveryStatus;

  @Column()
  organizationId: string;

  @Column({ nullable: true })
  notes?: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date;

  constructor() {
    this.items = [];
    this.status = OrderStatus.PENDING;
    this.paymentStatus = PaymentStatus.PENDING;
    this.deliveryStatus = DeliveryStatus.PENDING;
    this.createdAt = new Date();
  }
}
```

### Enhanced Entities

**Enquiry** - Add fields:
```typescript
@Column({ nullable: true })
clientRequestId?: ObjectId;

@Column({ nullable: true })
presentationId?: ObjectId;

@Column({ nullable: true })
assignedToId?: ObjectId;

@Column({ nullable: true })
lostReason?: string;

@Column({ nullable: true })
followUpDate?: Date;
```

**Presentation** - Add fields:
```typescript
@Column({ nullable: true })
enquiryId?: ObjectId;

@Column({ nullable: true })
contactId?: ObjectId;

@Column({ nullable: true })
sentAt?: Date;

@Column({ nullable: true })
viewedAt?: Date;
```

**Quotation** - Add fields:
```typescript
@Column({ nullable: true })
enquiryId?: ObjectId;

@Column({ nullable: true })
presentationId?: ObjectId;

@Column({ nullable: true })
contactId?: ObjectId;

@Column({ nullable: true })
declineReason?: string;
```

**Contact** - Add fields:
```typescript
@Column({ nullable: true })
clientRequestId?: ObjectId;

@Column({ nullable: true })
source?: 'website_request' | 'manual' | 'referral';
```

---

## 🔌 API Endpoints

### CRM Funnel API (`/api/crm/funnel`)

**Dashboard**:
- `GET /funnel/dashboard` - Get funnel statistics
- `GET /funnel/pipeline` - Get pipeline view

**Login Requests**:
- `GET /funnel/requests` - List all login requests
- `GET /funnel/requests/:id` - Get request details
- `PUT /funnel/requests/:id/approve` - Approve request
- `PUT /funnel/requests/:id/reject` - Reject request
- `POST /funnel/requests/:id/convert` - Convert to contact

**Contacts**:
- `GET /funnel/contacts` - List all contacts
- `GET /funnel/contacts/:id` - Get contact with full history
- `POST /funnel/contacts` - Create contact manually
- `PUT /funnel/contacts/:id` - Update contact

**Enquiries**:
- `GET /funnel/enquiries` - List all enquiries
- `GET /funnel/enquiries/:id` - Get enquiry details
- `POST /funnel/enquiries` - Create enquiry
- `PUT /funnel/enquiries/:id` - Update enquiry
- `POST /funnel/enquiries/:id/create-presentation` - Create presentation
- `POST /funnel/enquiries/:id/create-quotation` - Create quotation
- `PUT /funnel/enquiries/:id/mark-lost` - Mark as lost
- `PUT /funnel/enquiries/:id/mark-on-hold` - Mark as on hold

**Presentations**:
- `GET /funnel/presentations` - List all presentations
- `GET /funnel/presentations/:id` - Get presentation details
- `POST /funnel/presentations` - Create presentation
- `PUT /funnel/presentations/:id` - Update presentation
- `POST /funnel/presentations/:id/send` - Send to client
- `GET /funnel/presentations/:id/pdf` - Generate PDF
- `POST /funnel/presentations/:id/create-quotation` - Create quotation

**Quotations**:
- `GET /funnel/quotations` - List all quotations
- `GET /funnel/quotations/:id` - Get quotation details
- `POST /funnel/quotations` - Create quotation
- `PUT /funnel/quotations/:id` - Update quotation
- `POST /funnel/quotations/:id/approve` - Approve quotation
- `POST /funnel/quotations/:id/send` - Send to client
- `POST /funnel/quotations/:id/accept` - Client accepts
- `POST /funnel/quotations/:id/decline` - Client declines
- `GET /funnel/quotations/:id/pdf` - Generate PDF

**Orders**:
- `GET /funnel/orders` - List all orders
- `GET /funnel/orders/:id` - Get order details
- `POST /funnel/orders` - Create order from quotation
- `PUT /funnel/orders/:id` - Update order
- `PUT /funnel/orders/:id/payment-status` - Update payment
- `PUT /funnel/orders/:id/delivery-status` - Update delivery

**Invoices**:
- `GET /funnel/invoices` - List all invoices
- `GET /funnel/invoices/:id` - Get invoice details
- `POST /funnel/invoices` - Create invoice from order
- `PUT /funnel/invoices/:id` - Update invoice
- `POST /funnel/invoices/:id/send` - Send to client
- `PUT /funnel/invoices/:id/mark-paid` - Mark as paid
- `GET /funnel/invoices/:id/pdf` - Generate PDF

---

## 🎨 Frontend Components

### Module Structure
```
frontend/src/app/modules/crm-funnel/
├── crm-funnel.routes.ts
├── components/
│   ├── dashboard/
│   │   ├── funnel-dashboard.component.ts
│   │   └── pipeline-view.component.ts
│   ├── requests/
│   │   ├── request-list.component.ts
│   │   └── request-detail.component.ts
│   ├── contacts/
│   │   ├── contact-list.component.ts
│   │   ├── contact-detail.component.ts
│   │   └── contact-form.component.ts
│   ├── enquiries/
│   │   ├── enquiry-list.component.ts
│   │   ├── enquiry-detail.component.ts
│   │   └── enquiry-form.component.ts
│   ├── presentations/
│   │   ├── presentation-list.component.ts
│   │   ├── presentation-builder.component.ts
│   │   └── presentation-viewer.component.ts
│   ├── quotations/
│   │   ├── quotation-list.component.ts
│   │   ├── quotation-form.component.ts
│   │   └── quotation-viewer.component.ts
│   ├── orders/
│   │   ├── order-list.component.ts
│   │   └── order-detail.component.ts
│   └── invoices/
│       ├── invoice-list.component.ts
│       └── invoice-detail.component.ts
└── services/
    └── crm-funnel.service.ts
```

### Key Components

**Funnel Dashboard**:
- Visual funnel chart showing conversion rates
- Stage-wise counts (Requests → Contacts → Enquiries → Presentations → Quotations → Orders)
- Revenue pipeline
- Recent activities
- Assigned items per sales rep

**Pipeline View**:
- Kanban board with columns: New Enquiries, Presentation Sent, Quotation Sent, Won, Lost, On Hold
- Drag-and-drop to change status
- Quick actions on cards
- Filters by sales rep, date range, value

**Contact Detail**:
- Contact information
- Timeline of all interactions
- List of enquiries
- List of quotations
- List of orders
- Activity log

**Enquiry Form**:
- Contact selection
- Product selection (from catalogue)
- Quantity and specifications
- Source (website/manual)
- Assign to sales rep
- Actions: Create Presentation, Create Quotation, Mark Lost, Mark On Hold

**Presentation Builder**:
- Select products from enquiry
- Drag-and-drop slide ordering
- Cover page customization
- Product slide layouts (single/multiple)
- Preview mode
- Send via email/WhatsApp

**Quotation Form**:
- Inherit items from enquiry/presentation
- Adjust prices
- Add discounts
- Tax calculation
- Terms and conditions
- Validity period
- Approval workflow

---

## 🚀 Implementation Plan

### Phase 1: Backend Foundation (Week 1)
1. Create Order entity
2. Enhance Enquiry, Presentation, Quotation, Contact entities
3. Create CRM Funnel module
4. Implement all API endpoints
5. Add conversion logic between stages

### Phase 2: Frontend Core (Week 2)
1. Create CRM Funnel module structure
2. Implement Funnel Dashboard
3. Implement Pipeline View
4. Create Contact List and Detail views
5. Create Enquiry List and Form

### Phase 3: Presentation & Quotation (Week 3)
1. Implement Presentation Builder
2. Add PDF generation for presentations
3. Enhance Quotation Form with funnel integration
4. Add PDF generation for quotations
5. Implement approval workflow

### Phase 4: Orders & Invoices (Week 4)
1. Implement Order management
2. Implement Invoice management
3. Add PDF generation for invoices
4. Integrate payment tracking
5. Add delivery tracking

### Phase 5: Client Portal (Week 5)
1. Create client login
2. Client dashboard
3. View enquiries
4. View presentations
5. Accept/Decline quotations
6. View orders and invoices

### Phase 6: Testing & Polish (Week 6)
1. End-to-end testing
2. Performance optimization
3. UI/UX refinements
4. Documentation
5. Deployment

---

## 📊 Success Metrics

- **Conversion Rate**: Requests → Contacts → Enquiries → Quotations → Orders
- **Average Deal Size**: Total order value / Number of orders
- **Sales Cycle Length**: Days from enquiry to order
- **Win Rate**: Orders / Quotations sent
- **Pipeline Value**: Sum of all active quotations
- **Sales Rep Performance**: Orders per rep, conversion rate per rep

---

## 🎯 Key Features

1. **Complete Funnel Tracking**: From first website visit to invoice payment
2. **Automated Workflows**: Auto-create next stage entities
3. **Client Portal**: Self-service for clients
4. **PDF Generation**: Professional documents for all stages
5. **Assignment Management**: Assign contacts/enquiries to sales reps
6. **Pipeline Visualization**: Kanban board for easy management
7. **Activity Timeline**: Complete history per contact
8. **Reporting**: Funnel analytics and conversion reports

---

**End of CRM Racconti Redesign Documentation**
