# PWA (Progressive Web App) Setup

This document explains the PWA functionality added to the Bhuri SAP application.

## Features Added

### 1. PWA Install Button
- **Location**: Landing page and navbar (when app is installable)
- **Functionality**: Shows install modal with instructions and triggers PWA installation
- **Visibility**: Only appears when the app meets PWA installability criteria

### 2. Install Modal
- **Component**: `PwaInstallModalComponent`
- **Features**:
  - App icon and branding
  - Installation benefits (offline access, notifications, quick access)
  - Install and dismiss buttons
  - Responsive design

### 3. Update Notifications
- **Component**: `PwaUpdateAlertComponent`
- **Functionality**: 
  - Automatically detects when a new version is available
  - Shows snackbar notification with update option
  - Refreshes app after update

### 4. PWA Service
- **Service**: `PwaService`
- **Responsibilities**:
  - Manages PWA installation state
  - Handles service worker registration
  - Detects and manages app updates
  - Provides observables for install/update states

## Files Created/Modified

### New Files
- `src/app/services/pwa.service.ts` - Core PWA functionality
- `src/app/components/pwa-install-modal.component.ts` - Install modal
- `src/app/components/pwa-update-alert.component.ts` - Update notification

### Modified Files
- `src/app/app.ts` - Added PWA update handling
- `src/app/pages/landing/landing.component.ts` - Added install button
- `src/app/components/navbar.component.ts` - Added install button
- `public/sw.js` - Enhanced service worker with update handling
- `src/styles.scss` - Added PWA-specific styles

## How It Works

### Installation Flow
1. User visits the app in a PWA-compatible browser
2. Browser fires `beforeinstallprompt` event
3. PWA service captures the event and shows install button
4. User clicks install button → modal opens with instructions
5. User clicks "Install App" → browser's native install prompt appears
6. App gets installed to device/desktop

### Update Flow
1. Service worker detects new version available
2. PWA service receives update notification
3. Update alert appears at bottom of screen
4. User clicks "Update" → app refreshes with new version

## Browser Support

### Installation Support
- Chrome/Edge: Full support
- Firefox: Limited support (Android only)
- Safari: iOS 16.4+ (Add to Home Screen)

### Update Support
- All modern browsers with service worker support

## Testing

### Test Installation
1. Serve the app over HTTPS (required for PWA)
2. Open in Chrome/Edge
3. Install button should appear when installability criteria are met
4. Click install button and follow prompts

### Test Updates
1. Modify service worker cache version
2. Reload the app
3. Update notification should appear
4. Click update to refresh with new version

## Configuration

### Manifest File
- Located at `public/manifest.json`
- Contains app metadata, icons, and display settings
- Automatically updated by brand configuration system

### Service Worker
- Located at `public/sw.js`
- Handles caching and update notifications
- Version controlled for update detection

## Customization

### Brand-Specific Icons
- Icons are automatically loaded from brand configuration
- Supports different sizes (192x192, 512x512)
- Falls back to default icons if brand icons unavailable

### Styling
- PWA components use brand colors from CSS variables
- Responsive design for mobile and desktop
- Follows Material Design principles

## Troubleshooting

### Install Button Not Showing
- Ensure app is served over HTTPS
- Check browser console for PWA criteria warnings
- Verify manifest.json is accessible
- Ensure service worker is registered successfully

### Updates Not Working
- Check service worker registration in DevTools
- Verify cache version is updated in sw.js
- Clear browser cache and reload
- Check network tab for service worker updates

## Production Considerations

1. **HTTPS Required**: PWA features only work over HTTPS
2. **Cache Strategy**: Implement appropriate caching for your use case
3. **Icon Sizes**: Provide multiple icon sizes for different devices
4. **Offline Functionality**: Consider what features work offline
5. **Update Frequency**: Balance between fresh content and performance