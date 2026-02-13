/**
 * CMS Module Trainer Content
 * 
 * Comprehensive training content for the Content Management System module.
 * Covers: Blogs & Articles, News & Media, Analytics
 */

import { TrainerContent } from '../../services/xrm-trainer.service';

export const CMS_TRAINER_CONTENT: Record<string, TrainerContent> = {
  '/modules/cms': {
    title: 'Content Management System - Overview',
    description: 'Your complete content publishing platform for blogs, articles, news, and media. Create, manage, and publish engaging content with powerful tools for SEO, media management, and analytics.',
    relatedPages: [
      { key: '/modules/cms', label: 'Overview', icon: 'home' },
      { key: 'blog', label: 'Blogs & Articles', icon: 'article' },
      { key: 'news', label: 'News & Media', icon: 'newspaper' },
      { key: 'analytics', label: 'Analytics', icon: 'analytics' }
    ],
    features: [
      {
        icon: 'article',
        title: 'Blogs & Articles',
        description: 'Create and publish blog posts with rich text editing, media galleries, and SEO optimization.',
        steps: [
          'Access from CMS widget or bottom navigation',
          'Create new posts with title, content, and featured images',
          'Add multiple images to gallery with captions',
          'Organize with tags for better categorization',
          'Set SEO metadata for search engine optimization',
          'Publish, save as draft, or archive posts',
        ],
      },
      {
        icon: 'newspaper',
        title: 'News & Media',
        description: 'Manage news items and media content with support for images, videos, and documents.',
        steps: [
          'Create news items with multimedia support',
          'Upload images, videos, and documents',
          'Feature important news on homepage',
          'Track publication status and dates',
          'Manage media galleries per news item',
        ],
      },
      {
        icon: 'analytics',
        title: 'Analytics & Reports',
        description: 'Track content performance with detailed analytics, tag insights, and publishing trends.',
        steps: [
          'View total content statistics',
          'Monitor published vs draft content',
          'Analyze top-performing tags',
          'Track content creation trends by month',
          'Review recent activity and updates',
        ],
      },
      {
        icon: 'photo_library',
        title: 'Media Gallery System',
        description: 'Advanced media management with drag-and-drop upload, captions, and ordering.',
        steps: [
          'Upload multiple images at once',
          'Drag and drop to reorder gallery images',
          'Add captions to each image',
          'Preview images before publishing',
          'Delete unwanted images easily',
        ],
      },
      {
        icon: 'public',
        title: 'SEO Optimization',
        description: 'Built-in SEO tools to improve search engine visibility and social media sharing.',
        steps: [
          'Set custom SEO title and description',
          'Add meta keywords for search engines',
          'Configure Open Graph image for social sharing',
          'Generate SEO-friendly slugs automatically',
          'Preview how content appears in search results',
        ],
      },
      {
        icon: 'label',
        title: 'Tag Management',
        description: 'Organize content with tags for easy categorization and filtering.',
        steps: [
          'Add multiple tags to each post',
          'Create new tags on the fly',
          'View tag usage in analytics',
          'Filter content by tags',
          'Track most popular tags',
        ],
      },
      {
        icon: 'edit_note',
        title: 'Draft System',
        description: 'Save work in progress and publish when ready. Never lose your content.',
        steps: [
          'Save posts as drafts automatically',
          'Continue editing drafts anytime',
          'Preview drafts before publishing',
          'Track draft count in widget',
          'Publish drafts with one click',
        ],
      },
      {
        icon: 'star',
        title: 'Featured Content',
        description: 'Highlight important content by marking it as featured for homepage display.',
        steps: [
          'Toggle featured status with checkbox',
          'Featured content appears prominently',
          'Track featured count in analytics',
          'Unfeature content anytime',
        ],
      },
      {
        icon: 'history',
        title: 'Change Tracking',
        description: 'Complete audit trail of all content changes with timestamps and user information.',
        steps: [
          'Every change is automatically logged',
          'View who created and updated content',
          'Track publication dates',
          'Review change history for compliance',
        ],
      },
      {
        icon: 'search',
        title: 'Content Search',
        description: 'Quickly find content with powerful search and filtering capabilities.',
        steps: [
          'Search by title, content, or tags',
          'Filter by status (draft, published, archived)',
          'Sort by date or title',
          'View search results instantly',
        ],
      },
    ],
    faqs: [
      {
        question: 'What\'s the difference between Blogs and News & Media?',
        answer: 'Blogs & Articles are for long-form content like blog posts and articles. News & Media is for shorter news items with multimedia support (images, videos, documents). Both support galleries, SEO, and tags, but News & Media has additional media file management.',
      },
      {
        question: 'How do I create a new blog post?',
        answer: 'Click the "Blogs & Articles" button in the CMS widget or navigate to CMS module. Click "New Blog Post" button, fill in the title, content, add images to gallery, set tags, configure SEO settings, and click "Save as Draft" or "Publish".',
      },
      {
        question: 'Can I upload multiple images at once?',
        answer: 'Yes! The gallery system supports drag-and-drop for multiple images. You can upload several images simultaneously, then reorder them by dragging, add captions, and set the display order.',
      },
      {
        question: 'What image formats are supported?',
        answer: 'The CMS supports JPG, JPEG, PNG, GIF, and WebP formats. Images are automatically optimized for web display. For best results, use high-quality images with appropriate dimensions.',
      },
      {
        question: 'How does SEO optimization work?',
        answer: 'Each post has SEO fields: Title (appears in search results), Description (meta description), Keywords (for search engines), and OG Image (for social media sharing). Fill these fields to improve search visibility and social media appearance.',
      },
      {
        question: 'Can I schedule posts for future publication?',
        answer: 'Currently, you can save posts as drafts and publish them manually. Scheduled publishing is planned for a future update. Use the draft system to prepare content in advance.',
      },
      {
        question: 'What happens when I archive content?',
        answer: 'Archived content is hidden from public view but remains in the system. You can view archived content in the CMS module and restore it to published or draft status anytime. Archiving is useful for seasonal or outdated content.',
      },
      {
        question: 'How do I feature a blog post or news item?',
        answer: 'When creating or editing content, check the "Featured" checkbox. Featured content appears prominently on your website homepage and is tracked separately in analytics. You can feature multiple items.',
      },
      {
        question: 'Can I edit published content?',
        answer: 'Yes! Click on any published post to edit it. Changes are saved immediately and the "Updated At" timestamp is recorded. All changes are logged in the change history for audit purposes.',
      },
      {
        question: 'What are tags and how should I use them?',
        answer: 'Tags are keywords that categorize your content. Use tags like "Technology", "Tutorial", "News", etc. to organize posts. Tags help with filtering, searching, and analytics. You can add multiple tags per post and create new tags on the fly.',
      },
      {
        question: 'How do I view analytics for my content?',
        answer: 'Click the "Analytics" button in the CMS widget or navigate to the Analytics tab. You\'ll see total content stats, top tags, publishing trends by month, and recent activity. Analytics refresh automatically when you switch to the tab.',
      },
      {
        question: 'Can I delete content permanently?',
        answer: 'Yes, but use caution! Deleted content cannot be recovered. We recommend archiving content instead of deleting it. To delete, open the content and use the delete button, then confirm the action.',
      },
      {
        question: 'What\'s the difference between excerpt and content?',
        answer: 'Content is the full article body (HTML supported). Excerpt is a short summary (2-3 sentences) that appears in listings and previews. If you don\'t provide an excerpt, the system may auto-generate one from the content.',
      },
      {
        question: 'How do I add videos to News & Media?',
        answer: 'In News & Media, you can upload video files or add video URLs. The system supports MP4 and WebM formats. Videos are displayed alongside images in the media gallery. Add captions to provide context.',
      },
      {
        question: 'Is there a limit on content or images?',
        answer: 'Limits depend on your organization\'s plan and server configuration. Generally, you can create unlimited posts. Image file size limits are typically 5-10MB per image. Contact your administrator for specific limits.',
      },
      {
        question: 'Can multiple users edit the same content?',
        answer: 'Yes, but be careful of conflicts! The system tracks who created and last updated each post. If two users edit simultaneously, the last save wins. Check the "Updated By" field to see who last modified content.',
      },
    ],
  },

  // Blogs & Articles specific trainer
  'blog': {
    title: 'Blogs & Articles - Content Creation',
    description: 'Create engaging blog posts and articles with rich text editing, media galleries, SEO optimization, and tag management. Perfect for long-form content, tutorials, and thought leadership.',
    features: [
      {
        icon: 'add_circle',
        title: 'Create New Blog Post',
        description: 'Start a new blog post with our intuitive editor and comprehensive publishing tools.',
        steps: [
          'Click "New Blog Post" button in the top-right',
          'Enter a compelling title (required)',
          'Write your content using the rich text editor',
          'Add a featured image to attract readers',
          'Upload additional images to the gallery',
          'Add tags for categorization',
          'Configure SEO settings for better visibility',
          'Save as draft or publish immediately',
        ],
      },
      {
        icon: 'edit',
        title: 'Rich Text Editor',
        description: 'Powerful WYSIWYG editor with formatting tools, HTML support, and content styling.',
        steps: [
          'Type or paste your content',
          'Use toolbar for formatting (bold, italic, lists)',
          'Add headings for structure (H1, H2, H3)',
          'Insert links to external resources',
          'Add blockquotes for emphasis',
          'Switch to HTML mode for advanced editing',
          'Preview your content before publishing',
        ],
      },
      {
        icon: 'image',
        title: 'Featured Image',
        description: 'Set a main image that represents your blog post in listings and social media.',
        steps: [
          'Click "Upload Featured Image" button',
          'Select image from your device',
          'Image uploads and displays immediately',
          'Featured image appears in blog listings',
          'Used as OG image for social sharing',
          'Click "Remove" to change or delete',
        ],
      },
      {
        icon: 'photo_library',
        title: 'Image Gallery',
        description: 'Add multiple images to your post with captions and custom ordering.',
        steps: [
          'Click "Add to Gallery" button',
          'Select one or multiple images',
          'Drag and drop to reorder images',
          'Click image to add or edit caption',
          'Set display order with drag handles',
          'Remove images with delete button',
          'Gallery displays in post content',
        ],
      },
      {
        icon: 'label',
        title: 'Tags & Categories',
        description: 'Organize your blog posts with tags for easy filtering and discovery.',
        steps: [
          'Type tag name in the tags field',
          'Press Enter to add tag',
          'Add multiple tags per post',
          'Create new tags on the fly',
          'Remove tags by clicking X',
          'Tags appear in analytics',
          'Use tags for content filtering',
        ],
      },
      {
        icon: 'public',
        title: 'SEO Configuration',
        description: 'Optimize your blog post for search engines and social media sharing.',
        steps: [
          'Expand "SEO Settings" section',
          'Enter SEO Title (appears in search results)',
          'Write Meta Description (160 characters max)',
          'Add Keywords separated by commas',
          'Upload OG Image for social media',
          'System auto-generates slug from title',
          'Preview how post appears in search',
        ],
      },
      {
        icon: 'description',
        title: 'Excerpt & Summary',
        description: 'Write a short summary that appears in blog listings and previews.',
        steps: [
          'Enter 2-3 sentences in excerpt field',
          'Keep it concise and engaging',
          'Excerpt appears in blog listings',
          'Used in search results and previews',
          'If empty, auto-generated from content',
        ],
      },
      {
        icon: 'star',
        title: 'Featured Posts',
        description: 'Mark important posts as featured to highlight them on your website.',
        steps: [
          'Check "Featured" checkbox when editing',
          'Featured posts appear prominently',
          'Tracked separately in analytics',
          'Uncheck to remove featured status',
          'Multiple posts can be featured',
        ],
      },
      {
        icon: 'save',
        title: 'Save & Publish',
        description: 'Control when your content goes live with draft and publish options.',
        steps: [
          'Click "Save as Draft" to save without publishing',
          'Drafts are private and editable',
          'Click "Publish" to make content live',
          'Published posts appear on website',
          'Edit published posts anytime',
          'Publication date is recorded',
        ],
      },
      {
        icon: 'list',
        title: 'Blog List Management',
        description: 'View, search, filter, and manage all your blog posts in one place.',
        steps: [
          'View all posts in table format',
          'Search by title or content',
          'Filter by status (all, published, draft, archived)',
          'Sort by date, title, or status',
          'Click any post to edit',
          'Use action menu for quick operations',
          'Bulk actions for multiple posts',
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I format text in the editor?',
        answer: 'Use the toolbar buttons for basic formatting: Bold, Italic, Underline, Lists (ordered/unordered), Headings (H1-H6), Links, and Blockquotes. For advanced formatting, switch to HTML mode using the code button.',
      },
      {
        question: 'What\'s the best image size for featured images?',
        answer: 'We recommend 1200x630 pixels for featured images. This size works well for both website display and social media sharing (Open Graph). Images are automatically optimized, but starting with good quality helps.',
      },
      {
        question: 'Can I add images within the content?',
        answer: 'Yes! Use the image button in the rich text editor toolbar to insert images directly into your content. You can also use the gallery feature to add multiple images that display in a gallery format.',
      },
      {
        question: 'How do I create a good SEO title?',
        answer: 'Keep it under 60 characters, include your main keyword, make it compelling and descriptive. Example: "10 Tips for Better Blog Writing | Your Brand". If you don\'t set an SEO title, the post title is used.',
      },
      {
        question: 'What should I write in the meta description?',
        answer: 'Write 150-160 characters that summarize your post and include keywords. This appears in search results below the title. Make it compelling to encourage clicks. Example: "Learn proven strategies to improve your blog writing and engage readers with these 10 actionable tips."',
      },
      {
        question: 'How many tags should I add per post?',
        answer: 'We recommend 3-7 tags per post. Use specific, relevant tags that describe the content. Avoid over-tagging. Good tags: "Web Development", "JavaScript", "Tutorial". Avoid generic tags like "Post" or "Article".',
      },
      {
        question: 'Can I preview my post before publishing?',
        answer: 'Yes! Click the "Preview" button to see how your post will look on the website. Preview opens in a new tab and shows the exact layout, images, and formatting. Make adjustments and preview again until satisfied.',
      },
      {
        question: 'What happens to drafts?',
        answer: 'Drafts are saved but not published. They\'re only visible to you and other CMS users. You can edit drafts anytime and publish when ready. Drafts don\'t have a publication date until published.',
      },
      {
        question: 'Can I unpublish a post?',
        answer: 'Yes! Edit the post and change status from "Published" to "Draft" or "Archived". Draft makes it private again, Archived hides it but keeps it in the system. You can republish anytime.',
      },
      {
        question: 'How do I duplicate a post?',
        answer: 'Currently, you need to manually copy content to create a duplicate. Open the post, copy the content, create a new post, and paste. We\'re planning a "Duplicate" feature for a future update.',
      },
      {
        question: 'Can I import blog posts from another platform?',
        answer: 'Direct import is not currently available. You can copy and paste content from other platforms. For bulk imports, contact your administrator about database import options.',
      },
      {
        question: 'How do I delete a blog post?',
        answer: 'Open the post, click the "Delete" button (usually in the action menu), and confirm. Deleted posts are permanently removed and cannot be recovered. Consider archiving instead of deleting.',
      },
      {
        question: 'What\'s the difference between slug and title?',
        answer: 'Title is the post headline shown to readers. Slug is the URL-friendly version used in the web address (e.g., "my-blog-post"). Slugs are auto-generated from titles but can be customized for better SEO.',
      },
      {
        question: 'Can I schedule posts for future publication?',
        answer: 'Scheduled publishing is not currently available. Save posts as drafts and publish manually when ready. This feature is planned for a future update.',
      },
      {
        question: 'How do I reorder gallery images?',
        answer: 'Click and drag the drag handle (⋮⋮) on each image to reorder. Images display in the order you set. You can also set a numeric order value if you prefer precise control.',
      },
      {
        question: 'Are my changes saved automatically?',
        answer: 'No, you must click "Save as Draft" or "Publish" to save changes. We recommend saving frequently to avoid losing work. Auto-save is planned for a future update.',
      },
    ],
  },

  // News & Media specific trainer
  'news': {
    title: 'News & Media - Multimedia Content',
    description: 'Create and manage news items with rich multimedia support including images, videos, and documents. Perfect for announcements, press releases, and media-rich content.',
    features: [
      {
        icon: 'add_circle',
        title: 'Create News Item',
        description: 'Create news items with multimedia content and rich formatting.',
        steps: [
          'Click "New News Item" button',
          'Enter news title (required)',
          'Write content with rich text editor',
          'Add featured image',
          'Upload media files (images, videos, documents)',
          'Add gallery images with captions',
          'Set tags and SEO settings',
          'Publish or save as draft',
        ],
      },
      {
        icon: 'perm_media',
        title: 'Media File Management',
        description: 'Upload and manage various media types including images, videos, and documents.',
        steps: [
          'Click "Add Media File" button',
          'Select file type (image, video, document)',
          'Upload file from your device',
          'Add caption to describe media',
          'Media displays in news item',
          'Supports multiple media files per item',
          'Remove or replace media anytime',
        ],
      },
      {
        icon: 'video_library',
        title: 'Video Support',
        description: 'Embed videos directly in your news items with full playback support.',
        steps: [
          'Upload video files (MP4, WebM)',
          'Or add video URL from YouTube/Vimeo',
          'Videos play inline in news items',
          'Add captions for accessibility',
          'Control video display settings',
          'Multiple videos per news item',
        ],
      },
      {
        icon: 'description',
        title: 'Document Attachments',
        description: 'Attach PDF documents and other files to news items for download.',
        steps: [
          'Upload PDF or document files',
          'Documents appear as download links',
          'Add descriptive captions',
          'Track document downloads (if enabled)',
          'Update or replace documents anytime',
        ],
      },
      {
        icon: 'photo_library',
        title: 'News Gallery',
        description: 'Create image galleries for news items with captions and ordering.',
        steps: [
          'Upload multiple images to gallery',
          'Drag to reorder images',
          'Add captions to each image',
          'Gallery displays in news item',
          'Lightbox view for full-size images',
          'Remove images as needed',
        ],
      },
      {
        icon: 'star',
        title: 'Featured News',
        description: 'Highlight important news by marking as featured for homepage display.',
        steps: [
          'Check "Featured" checkbox',
          'Featured news appears prominently',
          'Tracked in analytics separately',
          'Multiple items can be featured',
          'Uncheck to remove featured status',
        ],
      },
      {
        icon: 'public',
        title: 'SEO for News',
        description: 'Optimize news items for search engines and social media sharing.',
        steps: [
          'Set SEO title and description',
          'Add relevant keywords',
          'Upload OG image for social sharing',
          'Auto-generated slug from title',
          'Preview search appearance',
        ],
      },
      {
        icon: 'label',
        title: 'News Tags',
        description: 'Categorize news items with tags for organization and filtering.',
        steps: [
          'Add multiple tags per news item',
          'Create new tags instantly',
          'Use tags for filtering',
          'View tag analytics',
          'Remove tags easily',
        ],
      },
      {
        icon: 'list',
        title: 'News List Management',
        description: 'View and manage all news items with search, filter, and sort capabilities.',
        steps: [
          'View all news in table format',
          'Search by title or content',
          'Filter by status',
          'Sort by date or title',
          'Click to edit any item',
          'Quick actions menu',
        ],
      },
      {
        icon: 'archive',
        title: 'Archive News',
        description: 'Archive outdated news while keeping it in the system for reference.',
        steps: [
          'Change status to "Archived"',
          'Archived news hidden from public',
          'Still accessible in CMS',
          'Restore to published anytime',
          'Track archived count',
        ],
      },
    ],
    faqs: [
      {
        question: 'What video formats are supported?',
        answer: 'The system supports MP4 and WebM video formats. For best compatibility, use MP4 (H.264 codec). You can also embed videos from YouTube or Vimeo by pasting the video URL.',
      },
      {
        question: 'What\'s the maximum file size for uploads?',
        answer: 'File size limits depend on your server configuration. Typically: Images 5-10MB, Videos 50-100MB, Documents 10-20MB. Contact your administrator if you need to upload larger files.',
      },
      {
        question: 'Can I add multiple videos to one news item?',
        answer: 'Yes! You can add multiple media files including videos to a single news item. Each video can have its own caption. Videos display in the order you add them.',
      },
      {
        question: 'How do I embed a YouTube video?',
        answer: 'When adding a media file, select "Video" type and paste the YouTube URL (e.g., https://youtube.com/watch?v=...). The system will embed the video player automatically. Same works for Vimeo.',
      },
      {
        question: 'What document formats can I attach?',
        answer: 'You can attach PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, and TXT files. PDFs are most common for press releases and reports. Documents appear as download links in the news item.',
      },
      {
        question: 'How is News & Media different from Blogs?',
        answer: 'News & Media is designed for shorter, time-sensitive content with rich multimedia (videos, documents). Blogs are for longer articles. Both support galleries, SEO, and tags, but News has additional media file types.',
      },
      {
        question: 'Can I reorder media files?',
        answer: 'Yes! Drag and drop media files to reorder them. The order determines how they display in the news item. You can also set a numeric order value for precise control.',
      },
      {
        question: 'How do I add captions to media?',
        answer: 'When uploading or editing media files, there\'s a caption field. Add descriptive text that appears below the media. Captions help with accessibility and provide context for readers.',
      },
      {
        question: 'Can I replace a media file after uploading?',
        answer: 'Yes! Click the media file, then use the "Replace" button to upload a new file. The caption and order are preserved. You can also delete and re-upload if you prefer.',
      },
      {
        question: 'Do videos play automatically?',
        answer: 'No, videos require user interaction to play (click play button). Autoplay is disabled for better user experience and to save bandwidth. Users control when videos play.',
      },
      {
        question: 'How do I create a press release?',
        answer: 'Use News & Media for press releases. Create a new item, write the release content, add company logo as featured image, attach PDF version as document, set relevant tags, and publish. Mark as featured for homepage display.',
      },
      {
        question: 'Can I add image galleries to news items?',
        answer: 'Yes! News items support both media files and image galleries. Use media files for primary content and galleries for additional images. Both support captions and ordering.',
      },
      {
        question: 'How do I archive old news?',
        answer: 'Edit the news item and change status to "Archived". Archived news is hidden from public view but remains in the system. You can view archived items in the CMS module and restore them anytime.',
      },
      {
        question: 'Are media files optimized automatically?',
        answer: 'Images are automatically optimized for web display. Videos and documents are stored as-is. For best performance, optimize videos before uploading (compress, use web-friendly formats).',
      },
      {
        question: 'Can I track media downloads?',
        answer: 'Download tracking depends on your system configuration. Contact your administrator to enable analytics for document downloads and media views.',
      },
      {
        question: 'How do I delete a news item?',
        answer: 'Open the news item, click "Delete" button, and confirm. Deleted items are permanently removed. Consider archiving instead of deleting to preserve content history.',
      },
    ],
  },

  // Analytics specific trainer
  'analytics': {
    title: 'CMS Analytics - Content Insights',
    description: 'Track your content performance with comprehensive analytics including publication stats, tag insights, monthly trends, and recent activity. Make data-driven decisions about your content strategy.',
    features: [
      {
        icon: 'dashboard',
        title: 'Overview Statistics',
        description: 'Get a quick snapshot of your entire content library with key metrics.',
        steps: [
          'View total blog posts and news items',
          'See published vs draft counts',
          'Track featured content',
          'Monitor draft content',
          'All stats update in real-time',
        ],
      },
      {
        icon: 'label',
        title: 'Top Tags Analysis',
        description: 'Discover which tags are most used in your content for better organization.',
        steps: [
          'View top blog tags with usage counts',
          'See top news tags separately',
          'Visual bar charts show relative popularity',
          'Identify trending topics',
          'Plan content around popular tags',
        ],
      },
      {
        icon: 'trending_up',
        title: 'Monthly Trends',
        description: 'Track content creation patterns over the last 6 months.',
        steps: [
          'View blog posts by month',
          'See news items by month',
          'Identify publishing patterns',
          'Spot seasonal trends',
          'Plan content calendar accordingly',
        ],
      },
      {
        icon: 'history',
        title: 'Recent Activity',
        description: 'Monitor content updates and changes from the last 7 days.',
        steps: [
          'See blog updates count',
          'View news updates count',
          'Track recent changes',
          'Monitor team activity',
          'Stay informed on content status',
        ],
      },
      {
        icon: 'refresh',
        title: 'Real-Time Updates',
        description: 'Analytics refresh automatically when you switch to the analytics tab.',
        steps: [
          'Data loads automatically on tab switch',
          'Click refresh button for manual update',
          'Last updated timestamp shown',
          'All metrics update together',
          'No page refresh needed',
        ],
      },
      {
        icon: 'bar_chart',
        title: 'Visual Data Representation',
        description: 'Easy-to-read charts and graphs make data interpretation simple.',
        steps: [
          'Color-coded stat cards',
          'Horizontal bar charts for tags',
          'Monthly trend visualizations',
          'Percentage-based bar widths',
          'Hover for detailed information',
        ],
      },
      {
        icon: 'star',
        title: 'Featured Content Tracking',
        description: 'Monitor how much content is marked as featured across both content types.',
        steps: [
          'See total featured content count',
          'Breakdown by blogs and news',
          'Track featured content ratio',
          'Ensure balanced featuring',
        ],
      },
      {
        icon: 'edit_note',
        title: 'Draft Monitoring',
        description: 'Keep track of work in progress with draft content statistics.',
        steps: [
          'View total drafts across all content',
          'See drafts by content type',
          'Identify unpublished content',
          'Plan publishing schedule',
        ],
      },
      {
        icon: 'insights',
        title: 'Content Strategy Insights',
        description: 'Use analytics to inform your content creation and publishing strategy.',
        steps: [
          'Identify most-used tags',
          'Spot publishing patterns',
          'Balance content types',
          'Plan future content',
          'Optimize publishing schedule',
        ],
      },
    ],
    faqs: [
      {
        question: 'How often do analytics update?',
        answer: 'Analytics update automatically when you switch to the Analytics tab. You can also click the refresh button for manual updates. Data is pulled from the database in real-time, so you always see current statistics.',
      },
      {
        question: 'What does "Recent Activity" show?',
        answer: 'Recent Activity shows the number of content updates (creates, edits, publishes) in the last 7 days. This helps you monitor team activity and content freshness. Separate counts for blogs and news items.',
      },
      {
        question: 'How are top tags calculated?',
        answer: 'Top tags are ranked by usage count (how many posts use each tag). The system shows the most frequently used tags with visual bars indicating relative popularity. Helps identify trending topics and content themes.',
      },
      {
        question: 'What time period do monthly trends cover?',
        answer: 'Monthly trends show the last 6 months of content creation. Each bar represents one month with the count of posts published that month. Helps identify seasonal patterns and publishing consistency.',
      },
      {
        question: 'Can I export analytics data?',
        answer: 'Direct export is not currently available in the analytics view. You can take screenshots or manually record data. CSV export functionality is planned for a future update.',
      },
      {
        question: 'Why don\'t I see any tags in the analytics?',
        answer: 'If no tags appear, it means no content has been tagged yet. Start adding tags to your blog posts and news items. Tags will appear in analytics once content is tagged and published.',
      },
      {
        question: 'What\'s the difference between total and published counts?',
        answer: 'Total includes all content (published, draft, archived). Published shows only live content visible on your website. The difference helps you track work in progress and content pipeline.',
      },
      {
        question: 'How do I use analytics to improve my content strategy?',
        answer: 'Look at top tags to understand popular topics, check monthly trends to identify best publishing times, monitor draft counts to manage workflow, and track featured content to ensure balanced highlighting. Use insights to plan future content.',
      },
      {
        question: 'Can I see analytics for individual posts?',
        answer: 'The current analytics show aggregate data across all content. Individual post analytics (views, engagement) are not currently available but planned for future updates. Focus on overall content strategy for now.',
      },
      {
        question: 'Why is my recent activity count zero?',
        answer: 'If recent activity shows zero, no content has been created or updated in the last 7 days. This is normal for less active periods. The count will update as soon as you create or edit content.',
      },
      {
        question: 'How do I interpret the bar charts?',
        answer: 'Bar charts show relative values. The longest bar represents the highest count (100% width). Other bars are proportional. Hover over bars to see exact numbers. This makes it easy to compare values at a glance.',
      },
      {
        question: 'Can I filter analytics by date range?',
        answer: 'Custom date range filtering is not currently available. Analytics show fixed periods: all-time for totals, last 6 months for trends, last 7 days for recent activity. Custom ranges are planned for future updates.',
      },
      {
        question: 'Do archived posts count in analytics?',
        answer: 'Yes, archived posts are included in total counts but shown separately. They don\'t count as published. This gives you a complete picture of all content in your system, including archived items.',
      },
      {
        question: 'How can I increase my content output?',
        answer: 'Use analytics to identify gaps: If monthly trends show low output, plan more content. If drafts are piling up, focus on publishing. If certain tags are underused, create content for those topics. Analytics guide your strategy.',
      },
      {
        question: 'Can multiple users view analytics?',
        answer: 'Yes! All users with CMS module access can view analytics. Analytics show system-wide data, not user-specific. This helps teams collaborate on content strategy with shared insights.',
      },
    ],
  },
};
