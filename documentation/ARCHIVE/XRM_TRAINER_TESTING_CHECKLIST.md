# XRM Trainer - Testing Checklist

## Visual Testing

### Navbar Button
- [ ] Help icon (!) appears in navbar before theme toggle
- [ ] Button has proper tooltip "XRM Trainer - Get Help (Ctrl+/)"
- [ ] Button color matches theme primary color
- [ ] Hover effect works (scale + background)
- [ ] Active state shows when panel is open
- [ ] Button is visible on mobile devices

### Panel Appearance
- [ ] Panel slides in from right smoothly
- [ ] Panel width is 400px on desktop
- [ ] Panel is full width on mobile
- [ ] Overlay appears with blur effect
- [ ] Header has gradient background
- [ ] School icon and title are visible
- [ ] Close button (X) is visible and clickable

### Content Display
- [ ] Module title displays correctly
- [ ] Description text is readable
- [ ] Features section shows with star icon
- [ ] Feature cards have left border in primary color
- [ ] Feature icons display correctly
- [ ] Steps are numbered and formatted
- [ ] FAQ section shows with help icon
- [ ] FAQ items are expandable/collapsible

## Functional Testing

### Opening/Closing
- [ ] Click help button opens panel
- [ ] Click help button again closes panel
- [ ] Click overlay closes panel
- [ ] Click X button closes panel
- [ ] Press ESC key closes panel
- [ ] Press Ctrl+/ (or Cmd+/) toggles panel

### Content Switching
- [ ] Navigate to /dashboard - shows Dashboard content
- [ ] Navigate to /messages - shows Messaging content
- [ ] Navigate to /cms - shows CMS content
- [ ] Navigate to /crm - shows CRM content
- [ ] Navigate to /catalogue - shows Catalogue content
- [ ] Navigate to /enquiry - shows Enquiry content
- [ ] Navigate to /hr - shows HR content
- [ ] Navigate to /finance - shows Finance content
- [ ] Navigate to unknown route - shows default content

### Interactions
- [ ] FAQ items expand when clicked
- [ ] FAQ items collapse when clicked again
- [ ] Multiple FAQs can be open simultaneously
- [ ] Scrolling works when content is long
- [ ] All links/buttons are clickable

## Theme Testing

### Light Theme
- [ ] Panel background is white
- [ ] Text is dark and readable
- [ ] Borders are light gray
- [ ] Feature cards have light background
- [ ] Header gradient uses primary color

### Dark Theme
- [ ] Panel background is dark
- [ ] Text is light and readable
- [ ] Borders are dark gray
- [ ] Feature cards have dark background
- [ ] Header gradient uses primary color
- [ ] Switching themes updates panel immediately

## Responsive Testing

### Desktop (> 768px)
- [ ] Panel is 400px wide
- [ ] Overlay covers entire screen
- [ ] All content is readable
- [ ] Scrolling works properly

### Tablet (768px - 480px)
- [ ] Panel adapts to screen size
- [ ] Content remains readable
- [ ] Touch interactions work

### Mobile (< 480px)
- [ ] Panel is full width
- [ ] Logo size adjusts
- [ ] All buttons are tappable
- [ ] Content is readable
- [ ] Scrolling works smoothly

## Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab key navigates through elements
- [ ] Enter/Space activates buttons
- [ ] ESC closes panel
- [ ] Focus is visible
- [ ] Focus returns to button after closing

### Screen Reader
- [ ] Button has proper label
- [ ] Panel content is announced
- [ ] Headings are properly structured
- [ ] Interactive elements are labeled

## Performance Testing

- [ ] Panel opens/closes smoothly (no lag)
- [ ] Animation is smooth (60fps)
- [ ] No memory leaks when opening/closing repeatedly
- [ ] Content loads instantly
- [ ] No console errors

## Edge Cases

- [ ] Works when user is not logged in
- [ ] Works on first page load
- [ ] Works after page refresh
- [ ] Works with browser back/forward
- [ ] Works with deep links
- [ ] Multiple rapid clicks don't break it
- [ ] Works with very long content
- [ ] Works with no content (default)

## Integration Testing

- [ ] Doesn't interfere with other modals
- [ ] Doesn't interfere with navigation
- [ ] Doesn't interfere with theme switching
- [ ] Doesn't interfere with user menu
- [ ] Works alongside other panels/drawers

## Content Quality

- [ ] All titles are clear and concise
- [ ] Descriptions are helpful
- [ ] Steps are easy to follow
- [ ] FAQs answer common questions
- [ ] Icons match the content
- [ ] No typos or grammar errors

## Developer Experience

- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Code is well-documented
- [ ] Easy to add new content
- [ ] Service methods work as expected

## Known Issues

Document any issues found:

1. Issue: _______________
   - Steps to reproduce: _______________
   - Expected: _______________
   - Actual: _______________
   - Priority: High/Medium/Low

## Sign-off

- [ ] All critical tests passed
- [ ] All medium priority tests passed
- [ ] Documentation is complete
- [ ] Ready for production

Tested by: _______________
Date: _______________
Version: _______________
