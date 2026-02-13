/**
 * XRM Trainer Content Configuration
 * 
 * This file contains all the training content for different modules.
 * Add new content here to keep the trainer service clean.
 */

import { TrainerContent } from './xrm-trainer.service';

export const TRAINER_CONTENT: Record<string, TrainerContent> = {
  '/dashboard': {
    title: 'Dashboard - Your Command Center',
    description: 'A fully customizable workspace displaying real-time insights and quick access to all your modules. Personalize your view with drag-and-drop widgets, flexible sizing, and smart layouts.',
    features: [
      {
        icon: 'widgets',
        title: 'Widget System',
        description: 'Each active module displays as a widget showing mini analytics and quick action buttons. Widgets provide at-a-glance summaries and direct entry points to module features.',
        steps: [
          'Each widget represents an active module in your system',
          'View key metrics and statistics at the top of each widget',
          'Click action buttons to navigate directly to specific module features',
          'Refresh to update with real-time data',
          'Press Ctrl+Shift+R or Cmd+Shift+R to hard refresh for Chrome Browsers if anything is stuck.'
        ],
      },
      {
        icon: 'open_with',
        title: 'Drag & Drop Arrangement',
        description: 'Organize your workspace by dragging widgets to your preferred positions. Your custom layout is automatically saved and restored on every visit.',
        steps: [
          'Click and hold any widget to start dragging',
          'Move the widget to your desired position',
          'Release to drop the widget in the new location',
          'Your arrangement is saved automatically',
          'Click "Reset Layout" to restore default arrangement',
        ],
      },
      {
        icon: 'aspect_ratio',
        title: 'Flexible Widget Sizing',
        description: 'Resize widgets individually or all at once to optimize your screen space. Choose from Compact, Normal, or Expanded views.',
        steps: [
          'Individual Resize: Click the resize icon on any widget to cycle through sizes',
          'Bulk Resize: Use the view mode button (top-right) to resize all widgets',
          'Compact View: Minimal height, shows essential info only',
          'Normal View: Balanced layout with key metrics',
          'Expanded View: Maximum detail with full analytics',
          'Your size preferences are saved per widget',
        ],
      },
      {
        icon: 'view_compact',
        title: 'View Modes',
        description: 'Switch between Compact, Normal, and Expanded views to control information density across all widgets simultaneously.',
        steps: [
          'Click the view mode icon in the top-right corner',
          'Compact: Dense layout for maximum widgets on screen',
          'Normal: Balanced view with comfortable spacing',
          'Expanded: Detailed view with comprehensive analytics',
          'Your preference is remembered for future sessions',
        ],
      },
      {
        icon: 'refresh',
        title: 'Reset Layout',
        description: 'Restore the default dashboard configuration at any time. This resets widget positions, sizes, and view mode to system defaults.',
        steps: [
          'Click the "Reset Layout" button in the dashboard header',
          'Confirm the reset action',
          'All widgets return to default positions and sizes',
          'View mode resets to Normal',
          'You can customize again after reset',
        ],
      },
      {
        icon: 'navigation',
        title: 'Top Navigation Bar',
        description: 'Access essential tools and account features from the persistent top navigation bar.',
        steps: [
          'Brand Logo (Left): Click to return to dashboard from anywhere',
          'Trainer Button (!): Open contextual help for current page',
          'Theme Toggle: Switch between light and dark modes',
          'Install App: Download XRM as a Progressive Web App (when available)',
          'User Menu: Access profile, settings, preferences, and logout',
        ],
      },
      {
        icon: 'apps',
        title: 'Bottom Navigation Panel',
        description: 'Quick access shortcuts to your most-used modules. Customize which modules appear here through the Module Manager.',
        steps: [
          'Dashboard: Return to main dashboard',
          'Messages: Access conversations (shows unread count badge)',
          'Search: Global search across all modules',
          'Notifications: View system notifications (shows unread count)',
          'Modules: Open Module Manager to pin/unpin shortcuts',
          'Pinned Modules: Your custom shortcuts appear after core items',
          'Scroll horizontally if you have many pinned modules',
        ],
      },
      {
        icon: 'push_pin',
        title: 'Module Manager',
        description: 'Control which modules appear in your bottom navigation panel. Pin frequently-used modules for instant access.',
        steps: [
          'Click "Modules" in the bottom navigation',
          'Browse all available modules',
          'Click the pin icon to add a module to bottom navigation',
          'Click again to unpin and remove from shortcuts',
          'Pinned modules appear in the bottom navigation bar',
          'Your preferences sync across all devices',
        ],
      },
      {
        icon: 'analytics',
        title: 'Real-Time Updates',
        description: 'Dashboard widgets display live data that updates automatically. See changes as they happen without refreshing the page.',
      },
      {
        icon: 'devices',
        title: 'Responsive Design',
        description: 'Your dashboard adapts seamlessly to any screen size. Widgets automatically adjust layout on tablets and mobile devices.',
      },
      {
        icon: 'save',
        title: 'Auto-Save Preferences',
        description: 'All your customizations are saved automatically including widget positions, sizes, view mode, and pinned modules.',
      },
    ],
    faqs: [
      {
        question: 'How do I rearrange widgets on my dashboard?',
        answer: 'Simply click and hold any widget, then drag it to your desired position. Release to drop it in place. Your new arrangement is saved automatically and will be restored when you return.',
      },
      {
        question: 'What\'s the difference between Compact, Normal, and Expanded views?',
        answer: 'Compact shows minimal information in a dense layout, Normal provides balanced spacing with key metrics, and Expanded displays comprehensive analytics with maximum detail. Use the view mode button (top-right) to switch between them.',
      },
      {
        question: 'Can I resize individual widgets or only all at once?',
        answer: 'Both! Click the resize icon on any individual widget to cycle through sizes (Compact → Normal → Expanded), or use the view mode button to resize all widgets simultaneously. Each widget remembers its individual size preference.',
      },
      {
        question: 'How do I add or remove modules from the bottom navigation?',
        answer: 'Click "Modules" in the bottom navigation to open the Module Manager. Click the pin icon next to any module to add it to your shortcuts. Click again to unpin and remove it. Your pinned modules appear in the bottom navigation bar.',
      },
      {
        question: 'What do the badges on Messages and Notifications mean?',
        answer: 'The red badge numbers show unread counts. Messages displays the number of conversations with unread messages, while Notifications shows unread system notifications. The badges disappear when you view the items.',
      },
      {
        question: 'How do I reset my dashboard to default settings?',
        answer: 'Click the "Reset Layout" button in the dashboard header. This restores default widget positions, sizes, and view mode. You can customize again after resetting.',
      },
      {
        question: 'Are my dashboard preferences saved across devices?',
        answer: 'Yes! Your widget arrangement, sizes, view mode, and pinned modules are saved to your account and sync across all devices where you\'re logged in.',
      },
      {
        question: 'What does each widget show?',
        answer: 'Each widget represents an active module and displays: (1) Mini analytics with key metrics at the top, (2) Quick action buttons to access specific features, (3) Real-time data that updates automatically. Click any button to navigate directly to that module feature.',
      },
      {
        question: 'Can I hide widgets I don\'t use?',
        answer: 'Widgets are automatically shown based on your active modules. To hide a widget, you need to deactivate the corresponding module through your system administrator or Module Manager.',
      },
      {
        question: 'How do I install XRM as an app?',
        answer: 'When available, click the download icon in the top navigation bar. This installs XRM as a Progressive Web App (PWA) on your device, allowing you to use it like a native app with offline capabilities and faster loading.',
      },
      {
        question: 'What keyboard shortcuts are available?',
        answer: 'Press Ctrl+/ (or Cmd+/ on Mac) to open the XRM Trainer from anywhere. Press ESC to close panels and dialogs. More shortcuts are available in Settings > Keyboard Shortcuts.',
      },
      {
        question: 'Why is the bottom navigation hidden sometimes?',
        answer: 'The bottom navigation automatically hides when you scroll down to give you more screen space, and reappears when you scroll up. This keeps your workspace clean while maintaining easy access to shortcuts.',
      },
    ],
  },

  '/messages': {
    title: 'Team Messaging - Internal Communication Hub',
    description: 'Real-time text messaging for seamless team collaboration. Connect with colleagues across your organization instantly. Currently supports internal team communication with plans for enhanced features.',
    features: [
      {
        icon: 'forum',
        title: 'Conversation List',
        description: 'View all your conversations organized by organization. Each conversation shows the team member\'s name, avatar, online status, and message preview.',
        steps: [
          'Conversations are grouped by organization in expandable sections',
          'Click any team member to open the conversation',
          'Unread conversations are highlighted with a colored background',
          'Active conversation shows a border accent on the right',
          'Online status indicator (green dot) shows who\'s available',
          'Message preview displays the last message sent',
        ],
      },
      {
        icon: 'search',
        title: 'Search Conversations',
        description: 'Quickly find team members using the search box at the top of the sidebar. Search filters conversations in real-time.',
        steps: [
          'Click the search box in the sidebar',
          'Type a team member\'s name',
          'Results filter instantly as you type',
          'Clear search to see all conversations',
        ],
      },
      {
        icon: 'chat_bubble',
        title: 'Real-Time Messaging',
        description: 'Send and receive messages instantly with live updates. Messages appear immediately without page refresh.',
        steps: [
          'Type your message in the composer at the bottom',
          'Press Enter to send (Shift+Enter for new line)',
          'Or click the send button',
          'Messages appear instantly in the conversation',
          'Delivery status shows with checkmark icons',
          'Failed messages show error indicator',
        ],
      },
      {
        icon: 'notifications_active',
        title: 'Notification System',
        description: 'Stay informed with visual and audio notifications for new messages. Unread count badges keep you updated.',
        steps: [
          'Unread badge appears on Messages in bottom navigation',
          'Sound notification plays for new messages (if enabled)',
          'Unread conversations highlighted in sidebar',
          'Browser notifications when app is in background',
          'Notifications clear when you read messages',
        ],
      },
      {
        icon: 'visibility',
        title: 'Read Receipts',
        description: 'Know when your messages are delivered and read with status indicators.',
        steps: [
          'Single checkmark: Message sent',
          'Double checkmark: Message delivered',
          'Blue checkmarks: Message read by recipient',
          'Clock icon: Message sending',
          'Error icon: Message failed to send',
        ],
      },
      {
        icon: 'edit',
        title: 'Typing Indicators',
        description: 'See when team members are typing a response in real-time.',
        steps: [
          'Typing indicator appears below chat title',
          'Shows "[Name] is typing..." with animated dots',
          'Updates in real-time as they type',
          'Disappears when they stop typing',
        ],
      },
      {
        icon: 'schedule',
        title: 'Message History',
        description: 'Access complete conversation history with date separators and infinite scroll.',
        steps: [
          'Scroll up to load older messages',
          'Date dividers separate messages by day',
          'Messages grouped by sender for clean layout',
          'Timestamps show on all messages',
          'Load more indicator appears when scrolling up',
        ],
      },
      {
        icon: 'person',
        title: 'User Avatars & Status',
        description: 'Visual identification with profile pictures and online status indicators.',
        steps: [
          'Profile pictures display next to messages',
          'Green dot indicates user is online',
          'No dot means user is offline',
          'Avatars help identify senders quickly',
        ],
      },
      {
        icon: 'business',
        title: 'Organization Groups',
        description: 'Conversations organized by organization for easy navigation in multi-org environments.',
        steps: [
          'Organizations shown as expandable sections',
          'Click organization header to expand/collapse',
          'Member count displayed for each organization',
          'Color-coded organization avatars',
        ],
      },
      {
        icon: 'devices',
        title: 'Responsive Design',
        description: 'Seamless experience across desktop, tablet, and mobile devices with adaptive layouts.',
        steps: [
          'Desktop: Split view with sidebar and chat pane',
          'Mobile: Full-screen views with back button',
          'Tablet: Optimized layout for medium screens',
          'Touch-friendly targets on mobile',
          'Swipe gestures supported',
        ],
      },
      {
        icon: 'speed',
        title: 'Performance Features',
        description: 'Optimized for speed with lazy loading, efficient rendering, and smart caching.',
      },
      {
        icon: 'accessibility',
        title: 'Accessibility Support',
        description: 'Keyboard navigation, screen reader support, and high contrast mode for inclusive communication.',
      },
    ],
    faqs: [
      {
        question: 'How do I start a conversation with a team member?',
        answer: 'Click on any team member\'s name in the sidebar to open a conversation. If you haven\'t chatted before, a new conversation will be created automatically when you send your first message.',
      },
      {
        question: 'Can I message people outside my organization?',
        answer: 'Currently, messaging is limited to team members within your organization(s). This ensures secure internal communication. Contact PURPUL to upgrade to a full communication engine with external messaging capabilities.',
      },
      {
        question: 'How do I know if someone has read my message?',
        answer: 'Check the status icon next to the timestamp: Single checkmark = sent, double checkmark = delivered, blue checkmarks = read. If you see a clock icon, the message is still sending.',
      },
      {
        question: 'What does the green dot mean next to names?',
        answer: 'The green dot indicates that the team member is currently online and active. If there\'s no dot, they are offline or away from their device.',
      },
      {
        question: 'How do I turn off message notification sounds?',
        answer: 'Notification sound settings can be managed through your browser settings or system preferences. You can also mute notifications for specific conversations using the conversation menu.',
      },
      {
        question: 'Can I send files or images in messages?',
        answer: 'File and image sharing is part of the enhanced communication engine. Contact PURPUL to upgrade and unlock features like file attachments, image sharing, voice messages, and more.',
      },
      {
        question: 'How do I search for old messages?',
        answer: 'Use the search box at the top of the sidebar to find team members. To search within message content, this feature is available in the full communication engine upgrade.',
      },
      {
        question: 'What happens if my message fails to send?',
        answer: 'Failed messages show an error icon. Check your internet connection and try sending again. If the problem persists, refresh the page or contact support.',
      },
      {
        question: 'Can I delete or edit messages after sending?',
        answer: 'Message editing and deletion are premium features available in the full communication engine. Contact PURPUL to learn more about upgrading your messaging capabilities.',
      },
      {
        question: 'How do I create group chats?',
        answer: 'Group messaging is available in the enhanced communication engine. Upgrade to unlock group chats, channels, broadcast messages, and advanced collaboration features.',
      },
      {
        question: 'Are my messages secure and private?',
        answer: 'Yes! All messages are transmitted securely and stored with encryption. Messages are only visible to you and the recipient. Your organization admin may have access for compliance purposes.',
      },
      {
        question: 'Why can\'t I see some team members in my list?',
        answer: 'You can only message team members who are active in your organization(s). If someone is missing, they may be inactive or not yet added to your organization. Contact your admin for assistance.',
      },
      {
        question: 'How do I know if I have unread messages?',
        answer: 'Unread messages are indicated by: (1) Badge count on Messages icon in bottom navigation, (2) Highlighted conversation in sidebar with colored background, (3) Bold name for conversations with unread messages.',
      },
      {
        question: 'Can I use keyboard shortcuts for messaging?',
        answer: 'Yes! Press Enter to send a message, Shift+Enter to add a new line. Use Tab to navigate between conversations and the message composer. More shortcuts available in Settings.',
      },
      {
        question: 'What features are available in the full communication engine?',
        answer: 'Upgrade to unlock: External messaging, file & image sharing, voice/video calls, group chats, channels, message reactions, message editing/deletion, advanced search, message threading, read receipts control, custom notifications, and much more. Contact PURPUL today!',
      },
    ],
    cta: {
      title: '🚀 Upgrade to Full Communication Engine',
      description: 'Unlock powerful features including external messaging, file sharing, group chats, voice/video calls, message reactions, advanced search, and much more. Transform your team communication today!',
      buttonText: 'Contact PURPUL to Upgrade',
      buttonLink: 'https://purpul.in/contact',
      icon: 'rocket_launch',
      highlight: true,
    },
  },

  '/search': {
    title: 'Global Search - Find Anything Instantly',
    description: 'Powerful search engine that scans across all your active modules. Locate people, projects, resources, and data in seconds with intelligent filtering and relevance ranking.',
    features: [
      {
        icon: 'search',
        title: 'Universal Search Bar',
        description: 'Search across all your active modules from one central location. Type any keyword, name, or identifier to find what you need.',
        steps: [
          'Enter your search query in the main search box',
          'Search works across names, titles, descriptions, emails, and more',
          'Results appear instantly as you type',
          'Press Enter or click Search button to execute',
          'Minimum 2 characters required for search',
        ],
      },
      {
        icon: 'filter_list',
        title: 'Module Filters',
        description: 'Narrow your search to specific modules using filter chips. Only your active modules are available for searching.',
        steps: [
          'Module filter chips appear below the search bar',
          'Click any module chip to filter results to that module',
          'Click multiple chips to search across selected modules',
          'Click again to deselect a module filter',
          'No filters selected = search all active modules',
          'Only modules you have access to are shown',
        ],
      },
      {
        icon: 'apps',
        title: 'Searchable Modules',
        description: 'Search across all your active modules including User Management, HR, Projects, Tasks, CRM, Clients, Catalogue, CMS, Quotations, and Orders.',
        steps: [
          'User Management: Find users by name or email',
          'HR Management: Search employees by name, ID, or position',
          'Projects: Locate projects by name or description',
          'Tasks: Find tasks by title or description',
          'CRM: Search contacts, leads, and deals',
          'Client Management: Find clients and requests',
          'Catalogue: Search products by name or code',
          'CMS: Find blog posts and pages',
          'Quotations: Search by number or client',
          'Orders: Find orders by number or client',
        ],
      },
      {
        icon: 'sort',
        title: 'Relevance Ranking',
        description: 'Results are automatically sorted by relevance score. Most relevant matches appear first based on keyword matching.',
        steps: [
          'Exact matches rank highest',
          'Partial matches ranked by relevance',
          'Results sorted automatically',
          'Top 50 results displayed',
        ],
      },
      {
        icon: 'touch_app',
        title: 'Quick Navigation',
        description: 'Click any search result to navigate directly to that item\'s detail page in its respective module.',
        steps: [
          'Click any result card to open the item',
          'Automatically navigates to the correct module',
          'Opens the detail/edit page for that item',
          'Back button returns to search results',
        ],
      },
      {
        icon: 'security',
        title: 'Permission-Based Results',
        description: 'Search respects your permissions. You only see results from modules and resources you have access to.',
        steps: [
          'Only active modules are searchable',
          'Results filtered by your permissions',
          'Organization-scoped when applicable',
          'Secure and privacy-compliant',
        ],
      },
      {
        icon: 'speed',
        title: 'Real-Time Search',
        description: 'Lightning-fast search with instant results. Powered by optimized database queries and smart caching.',
      },
      {
        icon: 'history',
        title: 'Search Suggestions',
        description: 'Get helpful search suggestions based on common queries and your search history.',
      },
      {
        icon: 'clear',
        title: 'Clear & Reset',
        description: 'Easily clear your search query or reset filters to start a new search.',
        steps: [
          'Click the X icon to clear search text',
          'Click "Reset" to clear all filters',
          'Start typing to begin a new search',
        ],
      },
      {
        icon: 'devices',
        title: 'Responsive Design',
        description: 'Search works seamlessly on desktop, tablet, and mobile devices with touch-optimized interface.',
      },
    ],
    faqs: [
      {
        question: 'How do I search across all modules?',
        answer: 'Simply type your query in the search box without selecting any module filters. By default, search scans all your active modules. You can narrow results by clicking specific module filter chips.',
      },
      {
        question: 'Why don\'t I see certain modules in the filters?',
        answer: 'Module filters only show modules that are active for your account. If a module is missing, it may not be activated for you or your organization. Contact your administrator to activate additional modules.',
      },
      {
        question: 'What can I search for?',
        answer: 'You can search for: People (users, employees, contacts), Projects and tasks, Leads and deals, Clients and requests, Products, Blog posts and pages, Quotations and orders, Departments and organizations. Search works across names, titles, descriptions, emails, IDs, and other key fields.',
      },
      {
        question: 'How does relevance ranking work?',
        answer: 'Results are ranked by how closely they match your search query. Exact matches appear first, followed by partial matches. The algorithm considers multiple fields and calculates a relevance score for each result.',
      },
      {
        question: 'Can I search by partial words?',
        answer: 'Yes! The search is case-insensitive and matches partial words. For example, searching "john" will find "John Smith", "Johnson", and "Johnny". You need at least 2 characters to start a search.',
      },
      {
        question: 'Why are some results missing?',
        answer: 'Search results are filtered by your permissions. You only see items you have access to view. If you expect to see something but don\'t, check with your administrator about your module permissions.',
      },
      {
        question: 'How many results are shown?',
        answer: 'The search displays up to 50 results, sorted by relevance. If you have more matches, try using module filters or more specific search terms to narrow down results.',
      },
      {
        question: 'Can I search within a specific organization?',
        answer: 'Yes, search automatically scopes results to your current organization context when applicable. Multi-organization users can switch context from their profile settings.',
      },
      {
        question: 'What happens when I click a search result?',
        answer: 'Clicking a result navigates you directly to that item\'s detail or edit page in its respective module. For example, clicking a contact opens the contact detail page in CRM.',
      },
      {
        question: 'Can I save my searches?',
        answer: 'Search history and suggestions are automatically tracked. Saved searches and advanced search filters are planned for future updates.',
      },
      {
        question: 'How do I clear my search?',
        answer: 'Click the X icon in the search box to clear your query, or click "Reset" to clear all filters and start fresh.',
      },
      {
        question: 'Is search data secure?',
        answer: 'Yes! Search respects all security and privacy settings. Results are permission-based, organization-scoped, and sensitive data (like prices) may be masked in results.',
      },
      {
        question: 'Can I use keyboard shortcuts?',
        answer: 'Yes! Press Ctrl+K (or Cmd+K on Mac) from anywhere to open global search. Press Enter to execute search, Escape to close, and Tab to navigate through results.',
      },
      {
        question: 'Why is search slow sometimes?',
        answer: 'Search performance depends on database size and network speed. Large result sets may take a moment to load. Using module filters can speed up searches by reducing the scope.',
      },
      {
        question: 'Can I export search results?',
        answer: 'Direct export from search is not currently available. Navigate to the specific module to use its export features. Bulk export from search results is planned for future updates.',
      },
    ],
  },

  '/notifications': {
    title: 'Notifications Center - Stay Informed',
    description: 'Your central hub for all system notifications, alerts, and updates. Never miss important events with real-time notifications, browser alerts, and organized notification management.',
    features: [
      {
        icon: 'notifications_active',
        title: 'Notification Feed',
        description: 'View all your notifications in one organized list. Unread notifications are highlighted for easy identification.',
        steps: [
          'All notifications display in chronological order (newest first)',
          'Unread notifications have a highlighted background',
          'Each notification shows icon, title, message, and timestamp',
          'Type badge indicates notification category',
          'Click any notification to view details or take action',
        ],
      },
      {
        icon: 'category',
        title: 'Notification Types',
        description: 'Different notification types for various system events. Each type has a unique icon and color for quick recognition.',
        steps: [
          'Message: New chat messages from team members',
          'Module Request: Requests for module access',
          'Module Approved: Module access granted',
          'Module Rejected: Module access denied',
          'System: Important system announcements and updates',
        ],
      },
      {
        icon: 'mark_email_read',
        title: 'Mark as Read',
        description: 'Manage notification read status individually or in bulk. Keep your notification center organized.',
        steps: [
          'Click any notification to mark it as read automatically',
          'Use the three-dot menu to manually mark as read',
          'Click "Mark all as read" button to clear all unread',
          'Unread count updates in real-time',
          'Read notifications remain visible in your feed',
        ],
      },
      {
        icon: 'chat',
        title: 'Message Notifications',
        description: 'Get notified instantly when team members send you messages. Click to jump directly to the conversation.',
        steps: [
          'Message notifications show sender name and preview',
          'Click notification to open the conversation',
          'Automatically marks notification as read',
          'Navigates directly to Messages page',
          'Conversation opens with full context',
        ],
      },
      {
        icon: 'extension',
        title: 'Module Request Notifications',
        description: 'Track your module access requests and approvals. Stay informed about your permissions.',
        steps: [
          'Receive notification when you request module access',
          'Get notified when request is approved or rejected',
          'View request status and details',
          'Click to see module information',
        ],
      },
      {
        icon: 'info',
        title: 'System Notifications',
        description: 'Important system announcements, updates, and maintenance alerts delivered directly to you.',
        steps: [
          'System-wide announcements',
          'Maintenance schedules',
          'Feature updates and releases',
          'Security alerts',
          'Policy changes',
        ],
      },
      {
        icon: 'delete',
        title: 'Delete Notifications',
        description: 'Remove notifications you no longer need. Keep your notification center clean and relevant.',
        steps: [
          'Click the three-dot menu on any notification',
          'Select "Delete" from the menu',
          'Notification is permanently removed',
          'Unread count updates if notification was unread',
        ],
      },
      {
        icon: 'refresh',
        title: 'Real-Time Updates',
        description: 'Notifications appear instantly without page refresh. Powered by WebSocket technology for live updates.',
        steps: [
          'New notifications appear automatically',
          'Unread count updates in real-time',
          'No manual refresh needed',
          'Badge updates across all pages',
          'Sound notification plays (if enabled)',
        ],
      },
      {
        icon: 'notifications',
        title: 'Browser Notifications',
        description: 'Receive notifications even when XRM is in the background. Desktop alerts keep you informed.',
        steps: [
          'Grant notification permission when prompted',
          'Receive desktop notifications for new alerts',
          'Notifications appear even when tab is inactive',
          'Click notification to focus XRM and view details',
          'Auto-dismiss after 5 seconds',
        ],
      },
      {
        icon: 'badge',
        title: 'Unread Count Badge',
        description: 'Visual indicator showing number of unread notifications. Appears on Notifications icon in bottom navigation.',
        steps: [
          'Red badge shows unread count',
          'Updates in real-time as notifications arrive',
          'Decreases when you mark notifications as read',
          'Disappears when all notifications are read',
          'Visible across all pages',
        ],
      },
      {
        icon: 'schedule',
        title: 'Relative Timestamps',
        description: 'Easy-to-read time indicators showing when notifications were received.',
        steps: [
          '"Just now" for notifications under 1 minute',
          '"Xm ago" for minutes (e.g., "5m ago")',
          '"Xh ago" for hours (e.g., "2h ago")',
          '"Yesterday" for previous day',
          '"Xd ago" for recent days (e.g., "3d ago")',
          'Full date for older notifications',
        ],
      },
      {
        icon: 'devices',
        title: 'Responsive Design',
        description: 'Notifications work seamlessly on desktop, tablet, and mobile devices with optimized layouts.',
      },
    ],
    faqs: [
      {
        question: 'How do I enable browser notifications?',
        answer: 'When you first visit XRM, you\'ll see a browser prompt asking for notification permission. Click "Allow" to enable desktop notifications. If you missed it, check your browser settings to enable notifications for this site.',
      },
      {
        question: 'Why am I not receiving notifications?',
        answer: 'Check these: (1) Browser notification permission is granted, (2) You\'re logged in to XRM, (3) Your internet connection is stable, (4) Browser notifications aren\'t blocked by system settings. Try refreshing the page or logging out and back in.',
      },
      {
        question: 'What types of notifications will I receive?',
        answer: 'You\'ll receive notifications for: New messages from team members, Module access requests and approvals, System announcements and updates, Important alerts and reminders. Notification types depend on your role and active modules.',
      },
      {
        question: 'Can I turn off notification sounds?',
        answer: 'Notification sounds are controlled by your browser and system settings. To disable: Go to your browser settings > Notifications > Find XRM > Disable sound. You\'ll still receive visual notifications.',
      },
      {
        question: 'How do I mark all notifications as read?',
        answer: 'Click the "Mark all as read" button (double checkmark icon) in the top-right corner of the Notifications page. This marks all current notifications as read and clears the unread count badge.',
      },
      {
        question: 'What happens when I click a message notification?',
        answer: 'Clicking a message notification automatically marks it as read and navigates you to the Messages page with that specific conversation opened. You can immediately reply to the message.',
      },
      {
        question: 'Can I delete notifications?',
        answer: 'Yes! Click the three-dot menu on any notification and select "Delete". The notification is permanently removed from your feed. This action cannot be undone.',
      },
      {
        question: 'How long are notifications stored?',
        answer: 'Notifications are stored indefinitely until you delete them. However, very old notifications (90+ days) may be archived by the system. You can always access recent notifications in your feed.',
      },
      {
        question: 'Why do I see a notification count but no notifications?',
        answer: 'This can happen if: (1) Notifications were just marked as read, (2) Page needs refresh, (3) Notifications were deleted. Try clicking the refresh button or reloading the page. The count should sync automatically.',
      },
      {
        question: 'Can I filter notifications by type?',
        answer: 'Currently, all notifications appear in one unified feed sorted by time. Filtering by type (messages, system, etc.) is planned for a future update. Use the type badges to quickly identify notification categories.',
      },
      {
        question: 'Do notifications work offline?',
        answer: 'No, notifications require an active internet connection. When you reconnect, you\'ll receive any notifications that arrived while you were offline. The system automatically syncs when connection is restored.',
      },
      {
        question: 'How do I know if a notification is unread?',
        answer: 'Unread notifications have: (1) Highlighted background color, (2) Bolder text, (3) Contribute to the unread count badge. Once you click or manually mark as read, the highlighting disappears.',
      },
      {
        question: 'Can I customize which notifications I receive?',
        answer: 'Notification preferences are based on your role and module access. You automatically receive notifications relevant to your permissions. Custom notification settings are planned for future updates.',
      },
      {
        question: 'What does the refresh button do?',
        answer: 'The refresh button manually reloads your notification feed from the server. Use it if notifications seem out of sync or if you want to check for new notifications immediately. Normally, notifications update automatically.',
      },
      {
        question: 'Are notifications secure and private?',
        answer: 'Yes! Notifications are: (1) Only visible to you, (2) Encrypted in transit, (3) Permission-based (you only see what you have access to), (4) Stored securely on the server. Your notification data is private and protected.',
      },
    ],
  },

  '/modules': {
    title: 'Module Management - Your Active Modules',
    description: 'Discover, activate, and manage your organization\'s modules. Control which features appear in your workspace and customize your XRM experience with modular functionality.',
    features: [
      {
        icon: 'apps',
        title: 'Available Modules',
        description: 'Browse all modules available to your organization. Each module represents a specific feature set or business function.',
        steps: [
          'View all modules in a card-based grid layout',
          'Each card shows module icon, name, and description',
          'Active status indicator (green checkmark) shows enabled modules',
          'Search box filters modules by name or description',
          'Color-coded icons help identify module categories',
        ],
      },
      {
        icon: 'toggle_on',
        title: 'Activate Modules',
        description: 'Enable modules to add them to your workspace. Activated modules appear in your dashboard, navigation, and search.',
        steps: [
          'Click "Open" button on any active module card',
          'Module becomes available in your workspace immediately',
          'Widget appears on dashboard automatically',
          'Module added to global search scope',
          'Shortcut can be pinned to bottom navigation',
        ],
      },
      {
        icon: 'toggle_off',
        title: 'Deactivate Modules',
        description: 'Disable modules you don\'t need. Deactivated modules are hidden from your workspace but can be re-enabled anytime.',
        steps: [
          'Click "Deactivate" button on active module card',
          'Confirm deactivation in the dialog',
          'Module removed from dashboard widgets',
          'Module excluded from search results',
          'Pinned shortcut automatically removed',
          'Can be reactivated anytime',
        ],
      },
      {
        icon: 'push_pin',
        title: 'Pin to Navigation',
        description: 'Add frequently-used modules to your bottom navigation bar for quick access.',
        steps: [
          'Click the pin icon on any active module card',
          'Module shortcut appears in bottom navigation',
          'Click pin again to unpin and remove shortcut',
          'Pinned modules sync across all devices',
          'Maximum recommended: 5-7 pinned modules',
        ],
      },
      {
        icon: 'search',
        title: 'Search Modules',
        description: 'Quickly find specific modules using the search box. Search filters by module name and description.',
        steps: [
          'Type in the search box at the top',
          'Results filter instantly as you type',
          'Search works across module names and descriptions',
          'Clear search to see all modules',
        ],
      },
      {
        icon: 'open_in_new',
        title: 'Open Module',
        description: 'Navigate directly to any active module from the modules page.',
        steps: [
          'Click "Open" button on active module card',
          'Navigates to module\'s main page',
          'Module opens in current tab',
          'Use browser back button to return',
        ],
      },
      {
        icon: 'info',
        title: 'Module Information',
        description: 'Each module card displays key information to help you understand its purpose and functionality.',
        steps: [
          'Module Icon: Visual identifier with color coding',
          'Module Name: Official module title',
          'Active Status: Green checkmark for enabled modules',
          'Description: Brief explanation of module features',
          'Action Buttons: Open, Pin, and Deactivate options',
        ],
      },
      {
        icon: 'dashboard',
        title: 'Dashboard Integration',
        description: 'Active modules automatically create widgets on your dashboard for quick access and analytics.',
        steps: [
          'Each active module gets a dashboard widget',
          'Widgets show mini analytics and quick actions',
          'Customize widget size and position on dashboard',
          'Deactivating module removes its widget',
        ],
      },
      {
        icon: 'security',
        title: 'Permission-Based Access',
        description: 'Module availability is controlled by your organization\'s permissions and your role.',
        steps: [
          'Only modules you have permission to access are shown',
          'Organization admins control module availability',
          'Your role determines which modules you can activate',
          'Contact admin to request access to new modules',
        ],
      },
      {
        icon: 'sync',
        title: 'Real-Time Sync',
        description: 'Module changes sync instantly across all your devices and sessions.',
        steps: [
          'Activate/deactivate syncs immediately',
          'Pin changes update across devices',
          'Dashboard widgets update automatically',
          'No manual refresh needed',
        ],
      },
    ],
    faqs: [
      {
        question: 'What are modules in XRM?',
        answer: 'Modules are self-contained feature sets that add specific functionality to your XRM workspace. Examples include Client Management, CMS Management, Catalogue Management, User Management, and Quotations. Each module provides tools and features for a specific business function.',
      },
      {
        question: 'How do I activate a module?',
        answer: 'Find the module card in the "Available Modules" section and click the "Open" button. The module will be activated immediately and appear in your dashboard, navigation, and search. You can then pin it to your bottom navigation for quick access.',
      },
      {
        question: 'Can I deactivate modules I don\'t use?',
        answer: 'Yes! Click the "Deactivate" button on any active module card and confirm. The module will be removed from your workspace but can be reactivated anytime. Deactivating helps keep your workspace clean and focused.',
      },
      {
        question: 'What happens when I deactivate a module?',
        answer: 'When you deactivate a module: (1) Its dashboard widget is removed, (2) It\'s excluded from global search, (3) Any pinned shortcuts are removed, (4) You can\'t access its features until reactivated. Your data is preserved and will be available when you reactivate.',
      },
      {
        question: 'How do I pin modules to my navigation?',
        answer: 'Click the pin icon (📌) on any active module card. The module will appear as a shortcut in your bottom navigation bar. Click the pin icon again to unpin. We recommend pinning 5-7 of your most-used modules for optimal navigation.',
      },
      {
        question: 'Why can\'t I see certain modules?',
        answer: 'Module visibility is controlled by: (1) Your organization\'s subscription, (2) Your role and permissions, (3) Organization admin settings. If you need access to a module you don\'t see, contact your organization administrator.',
      },
      {
        question: 'What\'s the difference between active and inactive modules?',
        answer: 'Active modules (green checkmark) are enabled in your workspace and appear in dashboard, search, and navigation. Inactive modules are available but not currently enabled. You can activate/deactivate modules anytime based on your needs.',
      },
      {
        question: 'Do module changes affect other users?',
        answer: 'No! Module activation, deactivation, and pinning are personal preferences. Your changes only affect your own workspace. Other users can configure their modules independently.',
      },
      {
        question: 'How many modules can I activate?',
        answer: 'You can activate as many modules as you have permission to access. However, we recommend activating only the modules you actively use to keep your workspace organized and performant.',
      },
      {
        question: 'Can I customize module settings?',
        answer: 'Module-level settings are managed within each module. Go to the module\'s page and look for settings or preferences options. The modules page only controls activation, deactivation, and pinning.',
      },
      {
        question: 'What happens to my data when I deactivate a module?',
        answer: 'Your data is completely safe! Deactivating a module only hides it from your workspace. All your data, settings, and configurations are preserved. When you reactivate the module, everything will be exactly as you left it.',
      },
      {
        question: 'How do I search for a specific module?',
        answer: 'Use the search box at the top of the Available Modules section. Type the module name or keywords from its description. Results filter instantly as you type. Clear the search to see all modules again.',
      },
      {
        question: 'Why do some modules have different colors?',
        answer: 'Module icons use color coding to help you quickly identify categories: Blue for management modules, Green for operational modules, Orange for business modules, etc. Colors are consistent across the platform.',
      },
      {
        question: 'Can I request new modules for my organization?',
        answer: 'Yes! Contact your organization administrator or PURPUL support to request additional modules. New modules may require subscription upgrades or special licensing.',
      },
      {
        question: 'Do pinned modules appear on mobile?',
        answer: 'Yes! Pinned modules appear in the bottom navigation on all devices including mobile and tablet. The navigation adapts to smaller screens while maintaining all your pinned shortcuts.',
      },
    ],
  },

  '/profile': {
    title: 'User Profile - Your Account Information',
    description: 'View and manage your personal information, account settings, and activity. Keep your profile up-to-date and customize your XRM experience.',
    features: [
      {
        icon: 'account_circle',
        title: 'Profile Overview',
        description: 'View your complete profile information including name, email, role, and account statistics at a glance.',
        steps: [
          'Profile photo displays at the top',
          'Name and email shown prominently',
          'Role and organization information visible',
          'Account statistics (member since, login count, last login)',
          'Quick action buttons for common tasks',
        ],
      },
      {
        icon: 'edit',
        title: 'Edit Profile',
        description: 'Update your personal information including name, email, phone, and other details.',
        steps: [
          'Click "Edit Profile" button',
          'Update first name and last name',
          'Change email address (if permitted)',
          'Add or update phone number',
          'Modify other profile fields',
          'Click "Save" to apply changes',
          'Changes sync across all devices',
        ],
      },
      {
        icon: 'photo_camera',
        title: 'Profile Photo',
        description: 'Upload or change your profile picture. Your photo appears throughout XRM in messages, comments, and user lists.',
        steps: [
          'Click on your current profile photo',
          'Select "Upload Photo" or "Change Photo"',
          'Choose image file from your device',
          'Supported formats: JPG, PNG, GIF',
          'Image uploads and processes automatically',
          'Photo appears immediately across XRM',
          'Click "Remove Photo" to delete current photo',
        ],
      },
      {
        icon: 'lock',
        title: 'Change Password',
        description: 'Update your account password for security. Use strong passwords to protect your account.',
        steps: [
          'Click "Change Password" button',
          'Enter your current password',
          'Enter new password (minimum 8 characters)',
          'Confirm new password',
          'Click "Update Password"',
          'You\'ll be logged out and need to sign in again',
        ],
      },
      {
        icon: 'info',
        title: 'Account Information',
        description: 'View important account details and statistics about your XRM usage.',
        steps: [
          'Member Since: Your account creation date',
          'Login Count: Total number of logins',
          'Last Login: Most recent login date and time',
          'Active Organizations: Organizations you belong to',
          'Current Role: Your role and permissions level',
        ],
      },
      {
        icon: 'settings',
        title: 'Account Settings',
        description: 'Access advanced settings for notifications, preferences, privacy, and more.',
        steps: [
          'Click "Settings" button',
          'Navigate to Settings page',
          'Configure notification preferences',
          'Set theme preferences (light/dark)',
          'Manage privacy settings',
          'Configure language and region',
        ],
      },
      {
        icon: 'history',
        title: 'Activity History',
        description: 'View your recent activity and actions within XRM for tracking and auditing.',
        steps: [
          'Click "View Activity" button',
          'See chronological list of actions',
          'Filter by date range or activity type',
          'Export activity log if needed',
        ],
      },
      {
        icon: 'business',
        title: 'Organization Information',
        description: 'View which organizations you belong to and your role within each.',
        steps: [
          'Organizations listed in profile',
          'See your role in each organization',
          'View organization-specific permissions',
          'Switch between organizations if multi-org user',
        ],
      },
      {
        icon: 'security',
        title: 'Security & Privacy',
        description: 'Manage your account security settings and privacy preferences.',
        steps: [
          'Change password regularly',
          'Review login history',
          'Manage connected devices',
          'Configure two-factor authentication (if available)',
          'Control data sharing preferences',
        ],
      },
      {
        icon: 'sync',
        title: 'Profile Sync',
        description: 'Your profile changes sync instantly across all devices and sessions.',
        steps: [
          'Updates appear immediately',
          'Photo changes sync in real-time',
          'Name changes update everywhere',
          'No manual refresh needed',
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I update my profile information?',
        answer: 'Click the "Edit Profile" button on your profile page. Update any fields you want to change (name, email, phone, etc.), then click "Save". Your changes will be applied immediately and sync across all devices.',
      },
      {
        question: 'How do I change my profile photo?',
        answer: 'Click on your current profile photo or the camera icon. Select "Upload Photo" and choose an image file (JPG, PNG, or GIF). The photo will upload automatically and appear throughout XRM. To remove your photo, click "Remove Photo".',
      },
      {
        question: 'What image formats are supported for profile photos?',
        answer: 'You can upload JPG, PNG, and GIF files. We recommend using square images (1:1 aspect ratio) for best results. Images are automatically resized and optimized for display.',
      },
      {
        question: 'How do I change my password?',
        answer: 'Click "Change Password" on your profile page. Enter your current password, then your new password twice to confirm. Click "Update Password". For security, you\'ll be logged out and need to sign in with your new password.',
      },
      {
        question: 'What makes a strong password?',
        answer: 'Use at least 8 characters with a mix of uppercase, lowercase, numbers, and special characters. Avoid common words, personal information, or patterns. Consider using a password manager for secure, unique passwords.',
      },
      {
        question: 'Can I change my email address?',
        answer: 'Email changes depend on your organization\'s settings. If permitted, you can update your email in Edit Profile. Some organizations require admin approval for email changes. Contact your administrator if you can\'t change your email.',
      },
      {
        question: 'What does "Member Since" mean?',
        answer: '"Member Since" shows the date your XRM account was created. This helps track your tenure and experience with the platform.',
      },
      {
        question: 'Why is my login count important?',
        answer: 'Login count tracks how many times you\'ve signed into XRM. It\'s useful for activity monitoring and can help identify unusual account access patterns for security purposes.',
      },
      {
        question: 'Can I see my activity history?',
        answer: 'Yes! Click "View Activity" on your profile page to see a chronological log of your actions within XRM. You can filter by date range and activity type, and export the log if needed.',
      },
      {
        question: 'How do I switch between organizations?',
        answer: 'If you belong to multiple organizations, you can switch context from your profile or settings. Your active organization determines which data and modules you see. Some features may vary by organization.',
      },
      {
        question: 'Can other users see my profile?',
        answer: 'Other users in your organization can see your name, photo, role, and basic information. Your email may be visible depending on organization settings. Sensitive information like password and activity history are private.',
      },
      {
        question: 'What happens if I remove my profile photo?',
        answer: 'If you remove your photo, XRM will display a default avatar with your initials. You can upload a new photo anytime. Your previous photo is permanently deleted when removed.',
      },
      {
        question: 'Do profile changes affect my permissions?',
        answer: 'No. Updating your profile information (name, photo, etc.) doesn\'t change your permissions or role. Only organization administrators can modify your role and access levels.',
      },
      {
        question: 'Can I delete my account?',
        answer: 'Account deletion must be requested through your organization administrator. They can deactivate or delete your account following your organization\'s policies. Contact your admin for account deletion requests.',
      },
      {
        question: 'How do I access advanced settings?',
        answer: 'Click the "Settings" button on your profile page or access Settings from the user menu in the top navigation. Settings include notifications, theme preferences, privacy options, and more.',
      },
    ],
  },

  '/settings': {
    title: 'Settings - Customize Your Experience',
    description: 'Configure your XRM preferences, notifications, theme, privacy settings, and more. Personalize your workspace to match your workflow.',
    features: [
      {
        icon: 'tune',
        title: 'General Settings',
        description: 'Configure basic preferences like language, timezone, and display options.',
      },
      {
        icon: 'notifications',
        title: 'Notification Preferences',
        description: 'Control which notifications you receive and how you\'re alerted.',
      },
      {
        icon: 'palette',
        title: 'Theme & Appearance',
        description: 'Choose between light and dark themes, customize colors, and adjust display density.',
      },
      {
        icon: 'lock',
        title: 'Privacy & Security',
        description: 'Manage your privacy settings, security options, and data preferences.',
      },
      {
        icon: 'language',
        title: 'Language & Region',
        description: 'Set your preferred language, date format, and regional settings.',
      },
    ],
    faqs: [
      {
        question: 'How do I change my theme?',
        answer: 'Go to Settings > Theme & Appearance and select Light or Dark theme. You can also use the theme toggle button in the top navigation for quick switching.',
      },
      {
        question: 'Can I customize notification settings?',
        answer: 'Yes! Go to Settings > Notifications to control which notifications you receive, enable/disable sounds, and configure browser notifications.',
      },
      {
        question: 'How do I change my language?',
        answer: 'Go to Settings > Language & Region and select your preferred language from the dropdown. The interface will update immediately.',
      },
    ],
  },

};
