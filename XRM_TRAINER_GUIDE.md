# XRM Trainer - Contextual Help System

## Overview

The XRM Trainer is a contextual help system that provides module-specific training, feature guides, and FAQs. It appears as a side panel when users click the help button (!) in the navbar.

## Features

- **Contextual Help**: Automatically shows relevant content based on the current route
- **Side Panel UI**: Non-intrusive panel that slides in from the right
- **Feature Guides**: Step-by-step instructions for using features
- **FAQs**: Frequently asked questions with expandable answers
- **Theme Support**: Works with both light and dark themes
- **Mobile Responsive**: Adapts to smaller screens

## Components

### 1. XrmTrainerService (`frontend/src/app/services/xrm-trainer.service.ts`)

Manages the trainer state and content mapping.

**Key Methods:**
- `toggle()` - Toggle the panel open/closed
- `open()` - Open the panel
- `close()` - Close the panel
- `addContent(route, content)` - Add content for a new route

### 2. XrmTrainerPanelComponent (`frontend/src/app/components/xrm-trainer-panel.component.ts`)

The side panel UI component that displays the training content.

### 3. Navbar Integration

The help button (!) is added to the navbar, positioned before the theme toggle button.

## Usage

### For Users

1. Click the help icon (!) in the navbar
2. View contextual help for the current page
3. Expand FAQ sections for more details
4. Click outside or press the close button to dismiss

### For Developers - Adding Content for New Routes

To add training content for a new module or page:

```typescript
import { XrmTrainerService } from './services/xrm-trainer.service';

// In your component or service
constructor(private trainerService: XrmTrainerService) {
  this.trainerService.addContent('/your-route', {
    title: 'Your Module Name',
    description: 'Brief description of what this module does.',
    features: [
      {
        icon: 'icon_name', // Material icon name
        title: 'Feature Name',
        description: 'What this feature does',
        steps: [ // Optional
          'Step 1: Do this',
          'Step 2: Then do this',
          'Step 3: Finally this'
        ]
      }
    ],
    faqs: [
      {
        question: 'How do I...?',
        answer: 'You can do this by...'
      }
    ]
  });
}
```

### Content Structure

```typescript
interface TrainerContent {
  title: string;              // Module/page title
  description: string;        // Brief overview
  features: TrainerFeature[]; // List of features
  faqs: TrainerFAQ[];        // List of FAQs
}

interface TrainerFeature {
  icon: string;              // Material icon name
  title: string;             // Feature name
  description: string;       // What it does
  steps?: string[];          // Optional step-by-step guide
}

interface TrainerFAQ {
  question: string;          // The question
  answer: string;            // The answer
}
```

## Pre-configured Routes

The following routes already have content configured:

- `/dashboard` - Dashboard Overview
- `/messages` - Messaging System
- `/cms` - Content Management

## Customization

### Styling

The trainer panel uses CSS variables for theming:
- `--theme-primary` - Primary brand color
- Automatically adapts to light/dark theme

### Adding More Content

Edit `frontend/src/app/services/xrm-trainer.service.ts` and add entries to the `contentMap` in the constructor.

### Programmatic Control

```typescript
// Inject the service
constructor(private trainerService: XrmTrainerService) {}

// Open the trainer
this.trainerService.open();

// Close the trainer
this.trainerService.close();

// Toggle
this.trainerService.toggle();

// Check if open
if (this.trainerService.isOpen()) {
  // Do something
}
```

## Best Practices

1. **Keep content concise** - Users want quick answers
2. **Use clear steps** - Number steps for complex processes
3. **Update regularly** - Keep content in sync with feature changes
4. **Test on mobile** - Ensure content is readable on small screens
5. **Use appropriate icons** - Choose Material icons that match the feature

## Future Enhancements

Potential improvements:
- Video tutorials integration
- Search functionality within trainer
- Bookmark favorite help topics
- Interactive walkthroughs
- Multi-language support
- Analytics to track which help topics are most viewed

## Troubleshooting

**Trainer not showing content:**
- Check if the route is registered in the contentMap
- Verify the route path matches exactly
- Check browser console for errors

**Styling issues:**
- Ensure theme service is working correctly
- Check CSS variable definitions
- Verify Material Design imports

**Content not updating:**
- The service listens to route changes automatically
- If adding content dynamically, ensure it's added before navigation
