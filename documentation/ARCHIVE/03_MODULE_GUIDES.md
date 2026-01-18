# Bhuri-SAP Module Guides

**Last Updated**: 2026-01-13  
**Purpose**: Detailed business logic and workflows for core platform modules.

---

## 🏎️ CRM & Sales Funnel

The CRM Funnel tracks the complete customer journey from initial interest to paid orders.

### The Sales Funnel Stages
1. **Requests**: Website visitor submits a contact form or login request.
2. **Contacts**: Approved requests become contacts in the CRM.
3. **Enquiries**: Contacts add products to their cart and submit an enquiry.
4. **Presentations**: Sales reps create 3D product presentations for enquiries.
5. **Quotations**: Official price quotes are generated from presentations or enquiries.
6. **Orders**: Accepted quotations become active orders with payment/delivery tracking.

### Key Logic
- **Conversion**: Enquiries can be marked as `LOST`, `ON_HOLD`, or converted to `WON` (Orders).
- **History Tracking**: Each contact maintains a full history of interactions across the funnel.

---

## 📦 Catalogue Management

Handles the product life cycle with support for advanced media and 3D visualization.

### Product Structure
- **Core Info**: SKU, Price, Categories, and Collections.
- **Media**: Featured images, galleries, videos, and **3D Models (.glb/.gltf)**.
- **Variations**: Support for colors, sizes, and custom specifications.
- **Designer Management**: Link products to specific designers with portfolios.

### 3D Model Flow
1. Upload `.glb` file via Product Form.
2. Direct integration with `<model-viewer>` for frontend previewing.
3. 3D models are passed into **Presentations** for client viewing.

---

## 💰 Quotation & Presentation Manager

A specialized system for high-end retail sales workflows.

### Workflow: Enquiry to Quotation
1. **Review Enquiry**: Admin sees products selected by the client.
2. **Build Presentation**: (Optional) Rep creates a slide-based presentation of selected 3D products.
3. **Generate Quote**: System pulls prices, calculates tax/totals, and sets a 30-day expiry.
4. **Approval**: Quotes go through `Draft` -> `Pending Approval` -> `Approved`.
5. **Delivery**: Approved quotes are sent via Email or WhatsApp.

---

## 👥 Client Management

Manages the self-service portal and client lifecycle.

### Client Onboarding
1. **Public Request**: Visitor fills out the "Request Access" form.
2. **Review & Convert**: Admin reviews request and clicks "Convert to Client".
3. **System Generation**: Automatically creates an **Organization**, a **User Account** (Client role), and a **Client Profile**.
4. **Credentials**: System generates secure login details to be shared with the client.

### Client Portal Features
- **My Quotations**: View and accept/reject official quotes.
- **Product Cart**: Browse catalogue and submit enquiries.
- **Security**: Granular IP whitelisting and 2FA settings per client.

---

## 📝 CMS & Content Management

Powers the external-facing website content.

### Components
- **Pages**: Static content (About, Privacy, etc.) with SEO meta fields.
- **Blogs**: Dynamic articles with categories, tags, and featured images.
- **Menus**: Drag-and-drop hierarchy for Header and Footer navigation.
- **SEO**: Built-in fields for `metaTitle`, `metaDescription`, and `OpenGraph` tags.
