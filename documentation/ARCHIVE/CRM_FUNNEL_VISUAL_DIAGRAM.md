# CRM Funnel - Visual Flow Diagram

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                         RACCONTI CRM FUNNEL SYSTEM                            ║
╚═══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: LOGIN CREDENTIAL REQUEST                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ Source: Website Form                                                        │
│ Entity: ClientRequest                                                       │
│ Status: pending → approved → rejected → converted                          │
│                                                                             │
│ Fields:                                                                     │
│ • Company name, contact person, email, phone                               │
│ • Website, industry, company size                                          │
│ • Address, city, country                                                   │
│                                                                             │
│ Actions:                                                                    │
│ • Admin reviews request                                                    │
│ • Approve → Convert to Contact                                             │
│ • Reject → Mark as rejected                                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ STAGE 2: CONTACT (CLIENT)                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Source: Converted from ClientRequest OR Manual Entry                       │
│ Entity: Contact                                                             │
│ Status: active / inactive                                                  │
│                                                                             │
│ Fields:                                                                     │
│ • All ClientRequest fields                                                 │
│ • clientRequestId (link to original request)                               │
│ • source: website_request / manual / referral                              │
│ • assignedToId (sales rep)                                                 │
│                                                                             │
│ Actions:                                                                    │
│ • View contact details                                                     │
│ • Create enquiry for contact                                               │
│ • Assign to sales rep                                                      │
│ • Track all enquiries/quotations/orders                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ STAGE 3: ENQUIRY                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ Source: Website Product Cart OR Manual Creation                            │
│ Entity: Enquiry                                                             │
│ Status: new → processing → presentation_sent → quoted → converted          │
│         lost / on_hold                                                      │
│                                                                             │
│ Fields:                                                                     │
│ • enquiryNumber, contactId, clientRequestId                                │
│ • items[] (products from cart)                                             │
│ • source: website / manual                                                 │
│ • presentationId, quotationId                                              │
│ • assignedToId (inherited from contact)                                    │
│ • lostReason, followUpDate                                                 │
│                                                                             │
│ Actions:                                                                    │
│ • Create presentation from enquiry                                         │
│ • Create quotation from enquiry                                            │
│ • Mark as lost (with reason)                                               │
│ • Mark as on hold (with follow-up date)                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ STAGE 4: PRESENTATION                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ Source: Created from Enquiry                                                │
│ Entity: Presentation                                                        │
│ Status: draft → sent → viewed → completed                                  │
│                                                                             │
│ Fields:                                                                     │
│ • presentationNumber, enquiryId, contactId                                 │
│ • slides[] (product slides with images/3D models)                          │
│ • coverBackground, overlayColor, textColor                                 │
│ • sentAt, viewedAt                                                         │
│                                                                             │
│ Actions:                                                                    │
│ • Design slides with product selection                                     │
│ • Customize cover page                                                     │
│ • Generate PDF presentation                                                │
│ • Send to client (email/WhatsApp)                                          │
│ • Track when client views                                                  │
│ • Convert to quotation                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ STAGE 5: QUOTATION                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ Source: Created from Enquiry/Presentation                                  │
│ Entity: Quotation                                                           │
│ Status: draft → pending_approval → approved → sent → accepted/declined     │
│                                                                             │
│ Fields:                                                                     │
│ • quotationNumber, enquiryId, presentationId, contactId                    │
│ • items[] (inherited from enquiry)                                         │
│ • subtotal, taxTotal, discountTotal, grandTotal                            │
│ • validUntil, terms, notes                                                 │
│ • declineReason                                                            │
│                                                                             │
│ Actions:                                                                    │
│ • Adjust prices from enquiry items                                         │
│ • Add discounts and taxes                                                  │
│ • Set terms and validity period                                            │
│ • Submit for approval (if required)                                        │
│ • Send to client                                                           │
│ • Client accepts → Create Order                                            │
│ • Client declines → Mark as lost                                           │
│ • Mark as on hold                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
                    ┌───────────────┴───────────────┐
                    ↓                               ↓
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│ STAGE 6A: SUCCESS               │   │ STAGE 6B: LOST                  │
├─────────────────────────────────┤   ├─────────────────────────────────┤
│ Entity: Order + Invoice         │   │ Action: Mark as Lost            │
│ Status:                         │   │                                 │
│ • Order: pending → processing   │   │ Updates:                        │
│   → completed / cancelled       │   │ • Quotation status → declined   │
│ • Payment: pending → partial    │   │ • Enquiry status → lost         │
│   → paid                        │   │ • Capture decline reason        │
│ • Delivery: pending → shipped   │   │                                 │
│   → delivered                   │   │ Follow-up:                      │
│                                 │   │ • Analyze lost reasons          │
│ Fields:                         │   │ • Schedule future contact       │
│ • orderNumber, quotationId      │   │                                 │
│ • contactId, enquiryId          │   └─────────────────────────────────┘
│ • items[], totalAmount          │
│ • shippingAddress               │   ┌─────────────────────────────────┐
│ • billingAddress                │   │ STAGE 6C: ON HOLD               │
│ • expectedDeliveryDate          │   ├─────────────────────────────────┤
│                                 │   │ Action: Mark as On Hold         │
│ Actions:                        │   │                                 │
│ • Track payment status          │   │ Updates:                        │
│ • Track delivery status         │   │ • Enquiry status → on_hold      │
│ • Generate invoice              │   │ • Set follow-up date            │
│ • Send invoice to client        │   │ • Schedule reminder             │
│ • Mark as paid                  │   │                                 │
│ • Mark as delivered             │   │ Follow-up:                      │
└─────────────────────────────────┘   │ • Automatic reminder on date    │
                                       │ • Re-engage with client         │
                                       └─────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════════════════╗
║                              KEY FEATURES                                     ║
╚═══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. COMPLETE FUNNEL TRACKING                                                 │
│    • Every stage linked to previous stage                                   │
│    • Automatic status updates cascade through related entities              │
│    • Complete audit trail with timestamps                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. ASSIGNMENT MANAGEMENT                                                    │
│    • Contacts assigned to sales reps                                        │
│    • Assignment inherited: Contact → Enquiry → Quotation → Order           │
│    • Track performance per sales rep                                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. CONVERSION LOGIC                                                         │
│    • ClientRequest → Contact (manual approval)                              │
│    • Contact → Enquiry (website cart or manual)                             │
│    • Enquiry → Presentation (product selection)                             │
│    • Enquiry → Quotation (price adjustment)                                 │
│    • Quotation → Order (automatic on acceptance)                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. DASHBOARD & ANALYTICS                                                    │
│    • Funnel statistics (counts at each stage)                               │
│    • Conversion rates (stage to stage)                                      │
│    • Pipeline value (active quotations)                                     │
│    • Revenue tracking (completed orders)                                    │
│    • Win/loss analysis with reasons                                         │
└─────────────────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════════════════╗
║                           API ENDPOINTS SUMMARY                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Dashboard:
  GET  /api/crm/funnel/dashboard              → Funnel statistics
  GET  /api/crm/funnel/pipeline               → Pipeline view by status

Contacts:
  GET  /api/crm/funnel/contacts/:id/history   → Contact with full history

Enquiries:
  GET  /api/crm/funnel/enquiries              → List all enquiries
  POST /api/crm/funnel/enquiries/from-contact/:contactId
  PUT  /api/crm/funnel/enquiries/:id/mark-lost
  PUT  /api/crm/funnel/enquiries/:id/mark-on-hold

Presentations:
  GET  /api/crm/funnel/presentations          → List all presentations
  POST /api/crm/funnel/presentations/from-enquiry/:enquiryId
  POST /api/crm/funnel/presentations/:id/send

Quotations:
  GET  /api/crm/funnel/quotations             → List all quotations
  POST /api/crm/funnel/quotations/from-enquiry/:enquiryId
  POST /api/crm/funnel/quotations/:id/accept  → Creates order
  POST /api/crm/funnel/quotations/:id/decline

Orders:
  GET  /api/crm/funnel/orders                 → List all orders
  POST /api/crm/funnel/orders/from-quotation/:quotationId
  PUT  /api/crm/funnel/orders/:id/payment-status
  PUT  /api/crm/funnel/orders/:id/delivery-status

╔═══════════════════════════════════════════════════════════════════════════════╗
║                         CONVERSION METRICS                                    ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Request → Contact:     X% conversion rate
Contact → Enquiry:     X% conversion rate
Enquiry → Quotation:   X% conversion rate
Quotation → Order:     X% conversion rate (Win Rate)

Pipeline Value:        $XXX,XXX (sum of active quotations)
Total Revenue:         $XXX,XXX (sum of completed orders)
Average Deal Size:     $X,XXX
Sales Cycle Length:    XX days (enquiry to order)

```
