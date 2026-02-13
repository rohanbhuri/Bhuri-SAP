# XRM Trainer - Quick Start

## What is it?

A contextual help system that provides training, feature guides, and FAQs for each module in your XRM application.

## How to Use

### For End Users

1. **Open the Trainer**: Click the help icon (!) in the navbar (next to the theme toggle)
2. **Keyboard Shortcut**: Press `Ctrl+/` (Windows/Linux) or `Cmd+/` (Mac)
3. **Close**: Click outside, press ESC, or click the X button

### For Developers

#### Adding Content for a New Route

Edit `frontend/src/app/services/xrm-trainer-content.ts`:

```typescript
export const TRAINER_CONTENT: Record<string, TrainerContent> = {
  // ... existing content ...
  
  '/your-new-route': {
    title: 'Your Module Name',
    description: 'Brief description of the module',
    features: [
      {
        icon: 'material_icon_name',
        title: 'Feature Name',
        description: 'What this feature does',
        steps: ['Step 1', 'Step 2', 'Step 3'] // Optional
      }
    ],
    faqs: [
      {
        question: 'Common question?',
        answer: 'The answer to the question.'
      }
    ]
  }
};
```

#### Programmatic Control

```typescript
import { XrmTrainerService } from './services/xrm-trainer.service';

constructor(private trainer: XrmTrainerService) {}

// Open the trainer
this.trainer.open();

// Close the trainer
this.trainer.close();

// Toggle
this.trainer.toggle();

// Check if open
if (this.trainer.isOpen()) {
  // Do something
}
```

## Files Created

1. `frontend/src/app/services/xrm-trainer.service.ts` - Service managing state
2. `frontend/src/app/services/xrm-trainer-content.ts` - Content configuration
3. `frontend/src/app/components/xrm-trainer-panel.component.ts` - UI component
4. Updated `frontend/src/app/components/navbar.component.ts` - Added button
5. Updated `frontend/src/app/app.ts` - Added panel to app

## Features

- ✅ Contextual help based on current route
- ✅ Side panel UI (slides from right)
- ✅ Feature guides with step-by-step instructions
- ✅ Expandable FAQ sections
- ✅ Keyboard shortcuts (Ctrl+/ to toggle, ESC to close)
- ✅ Light/Dark theme support
- ✅ Mobile responsive
- ✅ Active state indicator on button

## Pre-configured Routes

Content is already configured for:
- `/dashboard` - Dashboard Overview
- `/messages` - Messaging System
- `/cms` - Content Management
- `/crm` - Customer Relationship Management
- `/catalogue` - Product Catalogue
- `/enquiry` - Enquiry Management
- `/hr` - Human Resources
- `/finance` - Finance Management

## Customization

### Change Icon

Edit `navbar.component.ts`:
```typescript
<mat-icon>help</mat-icon> // Change to any Material icon
```

### Change Position

Edit `xrm-trainer-panel.component.ts` styles:
```css
.trainer-panel {
  right: 0; // Change to left: 0 for left side
}
```

### Change Width

Edit `xrm-trainer-panel.component.ts` styles:
```css
.trainer-panel {
  width: 400px; // Adjust as needed
}
```

## Next Steps

1. Test the trainer by clicking the help button
2. Navigate to different routes to see contextual content
3. Add content for your custom routes
4. Customize styling to match your brand
5. Consider adding video tutorials or interactive walkthroughs

## Support

For detailed documentation, see `XRM_TRAINER_GUIDE.md`
