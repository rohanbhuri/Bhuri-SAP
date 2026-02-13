# XRM Trainer - Visual Guide

## UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] XRM    [!] [☀] [👤 User Name ▼]                        │ ← Navbar
└─────────────────────────────────────────────────────────────────┘
                                                                    
┌─────────────────────────────┐  ┌──────────────────────────────┐
│                             │  │  🎓 XRM Trainer          [X] │ ← Trainer Header
│                             │  ├──────────────────────────────┤
│                             │  │                              │
│   Main Content Area         │  │  Dashboard Overview          │
│                             │  │  Your central hub for...     │
│                             │  │                              │
│                             │  │  ⭐ Features                 │
│                             │  │  ┌────────────────────────┐ │
│                             │  │  │ 📊 Widget Management   │ │
│                             │  │  │ Customize your...      │ │
│                             │  │  │ Steps:                 │ │
│                             │  │  │ 1. Click settings...   │ │
│                             │  │  └────────────────────────┘ │
│                             │  │                              │
│                             │  │  ❓ FAQs                    │
│                             │  │  ▶ How do I customize?      │
│                             │  │  ▶ Can I reset layout?      │
│                             │  │                              │
└─────────────────────────────┘  └──────────────────────────────┘
```

## Button States

### Normal State
```
[!] ← Help icon in navbar (before theme toggle)
```

### Active State (Trainer Open)
```
[!] ← Highlighted with background color
```

### Hover State
```
[!] ← Slightly scaled up with background
```

## Panel Sections

### 1. Header
- Gradient background with primary color
- School icon + "XRM Trainer" title
- Close button (X)

### 2. Content Section
```
┌──────────────────────────────┐
│  Module Title                │ ← Large, primary color
│  Brief description...        │ ← Gray text
└──────────────────────────────┘
```

### 3. Features Section
```
┌──────────────────────────────┐
│  ⭐ Features                 │
│                              │
│  ┌────────────────────────┐ │
│  │ 📊 Feature Name        │ │ ← Card with left border
│  │ Description text...    │ │
│  │ Steps:                 │ │
│  │ 1. First step          │ │
│  │ 2. Second step         │ │
│  └────────────────────────┘ │
└──────────────────────────────┘
```

### 4. FAQ Section
```
┌──────────────────────────────┐
│  ❓ Frequently Asked Questions│
│                              │
│  ▶ Question 1?               │ ← Expandable
│  ▼ Question 2?               │ ← Expanded
│    Answer text appears here  │
│    when expanded...          │
└──────────────────────────────┘
```

## Responsive Behavior

### Desktop (> 768px)
- Panel width: 400px
- Slides from right
- Overlay with blur effect

### Mobile (≤ 768px)
- Panel width: 100vw (full screen)
- Slides from right
- Full overlay

## Color Scheme

### Light Theme
- Background: White (#ffffff)
- Text: Dark gray (#111827)
- Border: Light gray (#e5e7eb)
- Header: Primary gradient

### Dark Theme
- Background: Dark (#1a1a1a)
- Text: Light gray (#f9fafb)
- Border: Dark gray (#374151)
- Header: Primary gradient

## Animations

### Panel Entry
```
Animation: slideIn (0.3s ease-out)
From: translateX(100%)
To: translateX(0)
```

### Overlay
```
Backdrop: rgba(0, 0, 0, 0.5)
Blur: 2px
```

## Interaction Flow

```
User clicks [!] button
        ↓
Panel slides in from right
        ↓
Overlay appears with blur
        ↓
Content loads based on route
        ↓
User reads/interacts
        ↓
User clicks outside/ESC/X
        ↓
Panel slides out
        ↓
Overlay fades away
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+/` or `Cmd+/` | Toggle trainer panel |
| `ESC` | Close trainer panel |

## Material Icons Used

| Icon | Usage |
|------|-------|
| `help` | Navbar button |
| `school` | Trainer header |
| `close` | Close button |
| `star` | Features section |
| `help_outline` | FAQ section |
| Various | Feature-specific icons |

## Content Structure Example

```typescript
{
  title: "Dashboard Overview",           // Main heading
  description: "Your central hub...",    // Subheading
  features: [                            // Feature cards
    {
      icon: "dashboard",                 // Material icon
      title: "Widget Management",        // Feature name
      description: "Customize...",       // What it does
      steps: [                           // Optional steps
        "Step 1...",
        "Step 2..."
      ]
    }
  ],
  faqs: [                                // Expandable FAQs
    {
      question: "How do I...?",
      answer: "You can..."
    }
  ]
}
```

## Best Practices for Content

1. **Title**: Keep it short (2-4 words)
2. **Description**: One sentence overview
3. **Features**: 3-5 key features max
4. **Steps**: 3-5 steps per feature
5. **FAQs**: 3-5 most common questions

## Accessibility

- Keyboard navigation supported
- ARIA labels on interactive elements
- Focus management
- Screen reader friendly
- High contrast support
