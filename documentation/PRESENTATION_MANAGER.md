# Presentation Manager Module

## Overview
The Presentation Manager is integrated into the Quotation Manager module, allowing users to create professional PPTX presentations for client enquiries.

## Features

### 1. Presentation Creation
- Create presentations manually for any client and products
- Link presentations to specific enquiries (optional)
- Manage multiple presentations per client

### 2. Slide Configuration
- **Cover Page**: Fixed background image with brand logo (max 250px) centered, client name below
- **Product Slides**: Configurable layouts
  - Single product per slide
  - Multiple products per slide
- Custom product selection for each slide
- Organization logo fixed on top right (max 100px) on all slides

### 3. Presentation Specifications
- Resolution: 1920x1080px (16:9 aspect ratio)
- Format: Editable PPTX
- Compatible with MS PowerPoint and other presentation tools

### 4. Workflow
1. Navigate to Quotations → Presentations tab
2. Click "Create Presentation"
3. Select client and optionally link to enquiry
4. Add slides and configure layout (single/multiple products)
5. Select products for each slide
6. Save and download as PPTX

## Backend Implementation

### Entity: `Presentation`
```typescript
{
  _id: ObjectId
  presentationNumber: string
  clientId: string
  clientName: string
  enquiryId?: string
  title: string
  organizationId: string
  slides: PresentationSlide[]
  status: 'draft' | 'completed'
  createdBy: string
  createdAt: Date
  updatedAt?: Date
}
```

### API Endpoints
- `GET /quotations/presentations/all` - Get all presentations
- `GET /quotations/presentations/:id` - Get single presentation
- `POST /quotations/presentations` - Create presentation
- `PUT /quotations/presentations/:id` - Update presentation
- `DELETE /quotations/presentations/:id` - Delete presentation
- `POST /quotations/presentations/:id/generate` - Generate and download PPTX

### Dependencies
- `pptxgenjs` - PowerPoint generation library

## Frontend Implementation

### Components
1. **PresentationListComponent** - List all presentations with actions
2. **PresentationDialogComponent** - Create/edit presentation form

### Service Methods
```typescript
getAllPresentations()
getPresentation(id)
createPresentation(data)
updatePresentation(id, data)
deletePresentation(id)
downloadPresentation(id) // Returns Blob
```

## Usage

### Creating a Presentation
1. Open Quotations module
2. Switch to "Presentations" tab
3. Click "Create Presentation"
4. Fill in:
   - Title
   - Client (required)
   - Enquiry (optional)
5. Add slides:
   - Choose layout (single/multiple)
   - Select products
6. Save

### Downloading
- Click download icon on any presentation
- PPTX file downloads automatically
- Open in PowerPoint for further editing

## Configuration

### Assets Required
Place in `backend/uploads/`:
- `cover-background.jpg` - Cover page background
- `logo.png` - Organization logo

### Customization
Edit `quotations.service.ts` → `generatePPTX()` method to customize:
- Slide layouts
- Font styles
- Colors
- Positioning

## Notes
- Presentations are organization-specific
- Product images must be accessible URLs
- PPTX generation happens server-side
- Files are streamed directly to client (not stored)
