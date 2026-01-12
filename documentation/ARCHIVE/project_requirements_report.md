# Racconti XRM - Project Requirement Report & Implementation Plan

**Date:** 2025-12-23  
**Source:** Racconti x PURPUL - Racconti XRM.xlsx  
**Status:** Generated based on gap analysis.

## 1. Executive Summary

The **Racconti XRM** project requires a specialized extension of the Bhuri-SAP platform. Unlike the generic ERP functions (HR, Project Management) present in the core, Racconti XRM focuses heavily on **Customer Experience (CX)**, **Content Management (CMS)**, **Product Catalogue with 3D capabilities**, and **Sales/Quotation** workflows.

**Critical Differentiator:** The inclusion of "3D GLB Upload + Preview" and a full "CMS" suggests this system is backend for a **visual-heavy, customer-facing website** or portal, likely for furniture, real estate, or high-end retail.

## 2. Requirement Breakdown & Gap Analysis

The following table compares the Excel requirements with the current Bhuri-SAP codebase status.

| Module | Key Requirements | Current Status | Gap / Action Item |
| :--- | :--- | :--- | :--- |
| **1. Auth & Users** | Login, 2FA, User CRUD, Role Matrix | ✅ **High** | Implement 2FA (optional); Verify "Invite User" flow. |
| **2. Admin Dashboard** | Visitor Analytics, Login Requests | ⚠️ **Partial** | Widgets exist, but specific *Visitor* and *Login Request* widgets need creation. |
| **3. Client Mgmt** | Requests, Active Clients, Client Login, Portal | ⚠️ **Partial** | Client role exists. **Client Portal UI** needs to be built/verified. |
| **4. CMS** | Pages, Blogs, Menus, **Media Manager** | ❌ **Missing** | **CRITICAL**. Setup `CmsModule`. Create Page/Blog entities. Implement SEO fields. |
| **5. Mini CRM** | Leads, Visitor Tracking, Activity Feed | ⚠️ **Partial** | CRM exists. Need to add *Visitor Tracking* (middleware/analytics). |
| **6. Catalogue** | Collections, Categories, Products, **3D GLB** | ❌ **Missing** | **CRITICAL**. Create `Product`, `Category`, `Collection` entities. Add **File Upload for GLB**. Implement 3D Viewer integration. |
| **7. Email Templates** | Template List, Assign Template | ❌ **Missing** | Create `EmailTemplate` entity and basic CRUD. |
| **8. Workflows** | Workflow List, Triggers | ❌ **Missing** | Low priority for tonight. Stub `Workflow` module. |
| **9. Quotations** | Create/Edit Quote, Client Accept/Reject | ❌ **Missing** | **HIGH**. Create `Quotation` entity. Link to Client & Products. |
| **10. Analytics** | Website Analytics, CRM Reports | ❌ **Missing** | Low priority. Stub basic report views. |
| **11. Settings** | SEO, Email, API Keys, Security | ⚠️ **Partial** | Config exists. Need specific UI for SEO/Email settings. |

## 3. Implementation Roadmap (Target: "Tonight")

To deliver the core value rapidly, we must prioritize the **unique** features (CMS, Catalogue, 3D) over generic ones already partially covered.

### Phase 1: Core Data Structure (Immediate)
1.  **Catalogue Module**:
    *   Entities: `Product`, `Category`, `Collection`.
    *   Fields: Name, SKU, Price, Media Gallery (Array), **3D_Model_URL**.
    *   API: CRUD endpoints.
2.  **CMS Module**:
    *   Entities: `Page`, `BlogPost`, `Menu`.
    *   Fields: Title, Slug, Content (HTML), SEO Meta.
3.  **Quotation Module**:
    *   Entities: `Quotation`, `QuotationItem`.
    *   Status Workflow: Draft -> Sent -> Accepted/Rejected.

### Phase 2: Feature Implementation
1.  **Media Manager Update**: Ensure the file upload system supports `.glb` and `.gltf` files (for 3D).
2.  **3D Logic**: Add specific field in Product entity to store the 3D model path separately from general images.
3.  **Client Portal**: Ensure a user with `client` role can log in and see a "My Quotations" list.

### Phase 3: UI Scaffolding (Frontend)
1.  **Product Form**: Add input for "3D Model" upload.
2.  **Quotations**: Internal view to create, External view (Client) to accept.
3.  **CMS Admin**: Basic form to edit Page content.

## 4. Technical Specifications for New Modules

### Database Schema (Proposed)

**Product**
```typescript
{
  name: string;
  sku: string;
  category: ObjectId;
  collection: ObjectId;
  images: string[];
  video: string; // URL
  model3d: string; // URL to .glb file
  attributes: Record<string, any>;
  seo: { title: string, desc: string };
  isPublished: boolean;
}
```

**Quotation**
```typescript
{
  client: ObjectId;
  items: { product: ObjectId, quantity: number, price: number }[];
  totalAmount: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED';
  validUntil: Date;
}
```

**Page (CMS)**
```typescript
{
  title: string;
  slug: string; // unique
  content: string; // HTML
  status: 'PUBLISHED' | 'DRAFT';
  meta: { title: string, desc: string, ogImage: string };
}
```

## 5. Next Steps
1.  **Approve this roadmap.**
2.  **Generate Entities**: Run generation scripts for Product, Quotation, and Page entities.
3.  **Update Requirement Checklist**: Update `task.md` with these specific actionable items.
