# Modular Trainer System - Quick Start Guide

## 🎯 Overview

The XRM Trainer now uses a modular architecture where each module has its own trainer content file. This keeps files manageable and makes it easy to add new module trainers.

## 📂 Architecture

```
Core Trainers (Platform-wide)
└── frontend/src/app/services/xrm-trainer-content.ts
    ├── Dashboard
    ├── Messages
    ├── Search
    ├── Notifications
    ├── Modules
    ├── Profile
    └── Settings

Module Trainers (Module-specific)
└── frontend/src/app/modules/[module]/[module]-trainer-content.ts
    ├── Module Overview
    ├── Tab 1 Content
    ├── Tab 2 Content
    └── Tab N Content
```

## 🚀 Creating a New Module Trainer

### Step 1: Create Trainer Content File

**Location**: `frontend/src/app/modules/[module]/[module]-trainer-content.ts`

**Template**:
```typescript
/**
 * [Module Name] Trainer Content
 * 
 * Comprehensive training content for the [Module Name] module.
 * Covers: [List main screens/tabs]
 */

import { TrainerContent } from '../../services/xrm-trainer.service';

export const [MODULE]_TRAINER_CONTENT: Record<string, TrainerContent> = {
  // Module overview (shows when user first opens module)
  '/modules/[module]': {
    title: '[Module Name] - Overview',
    description: 'Brief description of what this module does.',
    features: [
      {
        icon: 'icon_name',
        title: 'Feature Name',
        description: 'What this feature does.',
        steps: [
          'Step 1',
          'Step 2',
          'Step 3',
        ],
      },
      // Add 8-12 features
    ],
    faqs: [
      {
        question: 'Common question?',
        answer: 'Clear, helpful answer.',
      },
      // Add 12-16 FAQs
    ],
  },

  // Tab-specific content (shows when user switches to specific tab)
  'tab-name': {
    title: 'Tab Name - Specific Features',
    description: 'What users can do on this tab.',
    features: [
      // 8-12 features specific to this tab
    ],
    faqs: [
      // 12-16 FAQs specific to this tab
    ],
  },

  // Add more tabs as needed
};
```

### Step 2: Import in Trainer Service

**File**: `frontend/src/app/services/xrm-trainer.service.ts`

**Add import** (after existing imports):
```typescript
// Import module-specific trainer content
let [MODULE]_TRAINER_CONTENT: any = null;
try {
  [MODULE]_TRAINER_CONTENT = require('../modules/[module]/[module]-trainer-content').[MODULE]_TRAINER_CONTENT;
} catch (e) {
  // Module trainer content not available
}
```

**Add loading** (in constructor, after existing module loads):
```typescript
// Load module-specific trainer content
if ([MODULE]_TRAINER_CONTENT) {
  Object.entries([MODULE]_TRAINER_CONTENT).forEach(([route, content]: [string, any]) => {
    this.contentMap.set(route, content);
  });
}
```

### Step 3: Test

1. Navigate to your module: `/modules/[module]`
2. Open trainer (Ctrl+/ or click ! button)
3. Verify overview content appears
4. Switch tabs and verify tab-specific content appears

## 📝 Content Guidelines

### Features Section

**Structure**:
- 8-12 features per trainer
- Each feature has: icon, title, description, steps (optional)
- Steps are action-oriented (start with verbs)

**Example**:
```typescript
{
  icon: 'add_circle',
  title: 'Create New Item',
  description: 'Start creating a new item with our intuitive form.',
  steps: [
    'Click "New Item" button in top-right',
    'Fill in required fields (marked with *)',
    'Add optional details as needed',
    'Click "Save" or "Save & Publish"',
  ],
}
```

### FAQs Section

**Structure**:
- 12-16 FAQs per trainer
- Questions users actually ask
- Clear, concise answers
- Include examples when helpful

**Example**:
```typescript
{
  question: 'How do I delete an item?',
  answer: 'Open the item, click the "Delete" button in the action menu, and confirm. Deleted items cannot be recovered, so consider archiving instead if you might need the data later.',
}
```

### Writing Tips

1. **Be Clear**: Use simple language, avoid jargon
2. **Be Concise**: Get to the point quickly
3. **Be Helpful**: Answer the "why" not just the "how"
4. **Be Specific**: Use exact button names, field names
5. **Be Complete**: Cover all major features and common questions

## 🎨 Icon Selection

Use Material Icons that match the feature:

**Common Icons**:
- `add_circle` - Create/Add
- `edit` - Edit/Modify
- `delete` - Delete/Remove
- `search` - Search/Find
- `filter_list` - Filter
- `sort` - Sort
- `save` - Save
- `publish` - Publish
- `archive` - Archive
- `star` - Featured/Favorite
- `label` - Tags/Categories
- `image` - Images
- `video_library` - Videos
- `description` - Documents
- `analytics` - Analytics/Reports
- `settings` - Settings/Config
- `help` - Help/Info

## 🔄 Tab-Specific Content

### When to Use

Use tab-specific content when:
- Module has multiple distinct screens/tabs
- Each tab has unique features
- Users need different guidance per tab

### How It Works

**URL Pattern**: `/modules/[module]?tab=[tab-name]`

**Content Key**: Just the tab name (e.g., `'blogs'`, `'analytics'`)

**Example** (CMS Module):
```typescript
export const CMS_TRAINER_CONTENT: Record<string, TrainerContent> = {
  '/modules/cms': { ... },      // Shows when no tab or unknown tab
  'blogs': { ... },              // Shows when ?tab=blogs
  'news-media': { ... },         // Shows when ?tab=news-media
  'analytics': { ... },          // Shows when ?tab=analytics
};
```

## ✅ Quality Checklist

Before considering your trainer complete:

- [ ] Overview trainer with 8-12 features
- [ ] Overview trainer with 12-16 FAQs
- [ ] Tab-specific trainers for each major tab
- [ ] All features have clear descriptions
- [ ] Complex features have step-by-step instructions
- [ ] FAQs answer real user questions
- [ ] Icons are appropriate and consistent
- [ ] Writing is clear and concise
- [ ] No typos or grammatical errors
- [ ] Tested in browser (all tabs work)

## 📊 Example: CMS Module

**File**: `frontend/src/app/modules/cms/cms-trainer-content.ts`

**Structure**:
```typescript
export const CMS_TRAINER_CONTENT: Record<string, TrainerContent> = {
  '/modules/cms': {
    // 10 features covering all CMS capabilities
    // 16 FAQs about CMS in general
  },
  'blogs': {
    // 10 features specific to blog creation
    // 16 FAQs about blogs
  },
  'news-media': {
    // 10 features specific to news & media
    // 15 FAQs about news & media
  },
  'analytics': {
    // 9 features specific to analytics
    // 15 FAQs about analytics
  },
};
```

**Result**: 
- 4 trainers (1 overview + 3 tabs)
- 39 total features
- 62 total FAQs
- ~8,500 words
- Complete coverage of CMS module

## 🎯 Best Practices

### DO:
✅ Co-locate trainer with module code
✅ Cover all major features
✅ Answer common questions
✅ Use clear, simple language
✅ Include step-by-step instructions
✅ Test in browser before committing
✅ Follow the established pattern

### DON'T:
❌ Put module trainers in main content file
❌ Skip FAQs (users need them!)
❌ Use technical jargon without explanation
❌ Forget to test tab switching
❌ Copy-paste without customizing
❌ Leave features without descriptions

## 🚀 Quick Reference

**Create new module trainer**:
```bash
# 1. Create file
touch frontend/src/app/modules/[module]/[module]-trainer-content.ts

# 2. Copy template from this guide

# 3. Fill in content (8-12 features, 12-16 FAQs per trainer)

# 4. Add import to xrm-trainer.service.ts

# 5. Test in browser
```

**Test checklist**:
- [ ] Navigate to module
- [ ] Open trainer (Ctrl+/)
- [ ] Verify overview content
- [ ] Switch to each tab
- [ ] Verify tab-specific content
- [ ] Check all icons display
- [ ] Read through for typos

## 📚 Resources

- **CMS Trainer**: `frontend/src/app/modules/cms/cms-trainer-content.ts` (reference implementation)
- **Service**: `frontend/src/app/services/xrm-trainer.service.ts` (loading logic)
- **Interface**: `frontend/src/app/services/xrm-trainer.service.ts` (TrainerContent type)
- **Component**: `frontend/src/app/components/xrm-trainer-panel.component.ts` (UI rendering)

## 🎉 You're Ready!

Follow this guide to create trainers for:
- CRM Module
- Catalogue Module
- Enquiry Module
- HR Module
- Finance Module
- Any future modules

The pattern is proven, scalable, and maintainable. Happy training! 🚀
