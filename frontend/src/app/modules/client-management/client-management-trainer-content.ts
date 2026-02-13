/**
 * Client Management Module Trainer Content
 * 
 * Comprehensive training content for the Client Management module.
 * Covers: Login Credential Requests, Clients, Contact Us Requests, Analytics
 */

import { TrainerContent } from '../../services/xrm-trainer.service';

export const CLIENT_MANAGEMENT_TRAINER_CONTENT: Record<string, TrainerContent> = {
  '/modules/client-management': {
    title: 'Client Management - Overview',
    description: 'Complete client relationship management system. Handle login credential requests from website, manage client accounts, respond to contact us inquiries, and track engagement with powerful CRM tools.',
    relatedPages: [
      { key: '/modules/client-management', label: 'Overview', icon: 'home' },
      { key: 'requests', label: 'Login Credential Requests', icon: 'person_add' },
      { key: 'clients', label: 'Clients', icon: 'business' },
      { key: 'contacts', label: 'Contact Us Enquiries', icon: 'mail' },
      { key: 'analytics', label: 'Analytics', icon: 'analytics' }
    ],
    features: [
      {
        icon: 'person_add',
        title: 'Login Credential Requests',
        description: 'Website captures login credential requests. Approve, disapprove, or create client login accounts.',
        steps: [
          'View all incoming requests from website',
          'Review request details and information',
          'Approve requests to create client accounts',
          'Disapprove requests with optional reasons',
          'Or manually create client login',
          'Track request status and history',
        ],
      },
      {
        icon: 'business',
        title: 'Clients',
        description: 'All available clients. Create new client login manually or manage existing accounts.',
        steps: [
          'View all active clients',
          'Create new client accounts manually',
          'Update client information and details',
          'Manage client status (active/inactive)',
          'Track client activity and engagement',
          'Export client lists for reporting',
        ],
      },
      {
        icon: 'mail',
        title: 'Contact Us Enquiries',
        description: 'Website contact us form data captured here. Mark status and view submissions.',
        steps: [
          'View all contact form submissions from website',
          'Read enquiry details and messages',
          'Mark status (new, in progress, resolved)',
          'View contact information',
          'Respond to enquiries',
          'Archive resolved enquiries',
        ],
      },
      {
        icon: 'analytics',
        title: 'Client Analytics',
        description: 'Track client acquisition, engagement metrics, and request patterns.',
        steps: [
          'View total clients and growth trends',
          'Monitor request conversion rates',
          'Track contact inquiry volumes',
          'Analyze client activity patterns',
          'Generate reports for stakeholders',
        ],
      },
      {
        icon: 'check_circle',
        title: 'Request Approval Workflow',
        description: 'Streamlined process for reviewing and approving client access requests.',
        steps: [
          'Review request details',
          'Verify contact information',
          'Check for duplicate requests',
          'Approve to create client account',
          'System sends welcome email',
          'Client receives login credentials',
        ],
      },
      {
        icon: 'search',
        title: 'Search & Filter',
        description: 'Quickly find clients, requests, and inquiries with powerful search tools.',
        steps: [
          'Search by name, email, or company',
          'Filter by status or date',
          'Sort by various criteria',
          'Save common filter combinations',
          'Export filtered results',
        ],
      },
      {
        icon: 'notifications',
        title: 'Request Notifications',
        description: 'Stay informed about new requests and inquiries with real-time alerts.',
        steps: [
          'Receive notifications for new requests',
          'Get alerts for urgent inquiries',
          'Badge counts show pending items',
          'Email notifications (if enabled)',
          'Configure notification preferences',
        ],
      },
      {
        icon: 'history',
        title: 'Activity Tracking',
        description: 'Complete history of client interactions and request handling.',
        steps: [
          'View request submission dates',
          'Track approval/rejection history',
          'Monitor client activity logs',
          'See who handled each request',
          'Export activity reports',
        ],
      },
      {
        icon: 'email',
        title: 'Communication Tools',
        description: 'Built-in tools for communicating with clients and prospects.',
        steps: [
          'Respond to contact inquiries',
          'Send welcome emails to new clients',
          'Notify clients of status changes',
          'Template-based responses',
          'Track communication history',
        ],
      },
      {
        icon: 'security',
        title: 'Data Privacy & Security',
        description: 'Secure handling of client information with privacy controls.',
        steps: [
          'Client data is encrypted',
          'Access controlled by permissions',
          'Audit trail for all actions',
          'GDPR compliance features',
          'Secure credential generation',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is a login credential request?',
        answer: 'A login credential request is submitted by potential clients who want access to your platform. They fill out a form with their information, and you review and approve/reject their request. Approved requests become active client accounts.',
      },
      {
        question: 'How do I approve a login request?',
        answer: 'Go to the Requests tab, click on a pending request to view details, verify the information, and click "Approve". The system automatically creates a client account and sends welcome email with login credentials.',
      },
      {
        question: 'What happens when I reject a request?',
        answer: 'Rejected requests are marked as rejected and moved to the rejected list. You can optionally provide a reason. The requester is not automatically notified, but you can send a custom message if needed.',
      },
      {
        question: 'Can I create client accounts manually?',
        answer: 'Yes! Go to the Clients tab and click "New Client". Fill in the required information (name, email, company) and save. The client will receive an email to set their password. This is useful for adding clients who didn\'t submit a request.',
      },
      {
        question: 'What\'s the difference between clients and contact requests?',
        answer: 'Clients are active accounts with login access. Contact requests are inquiries from website visitors who may or may not want an account. Login requests are specifically for account access, while contact requests are general inquiries.',
      },
      {
        question: 'How do I respond to contact inquiries?',
        answer: 'Go to the Contact Us tab, click on an inquiry to view details, and use the "Reply" button to send a response. You can also mark inquiries as read/resolved without replying if they don\'t require a response.',
      },
      {
        question: 'Can I export the client list?',
        answer: 'Yes! Use the export button in the Clients tab to download client data as CSV or Excel. This includes names, emails, companies, and status. Useful for reporting and external analysis.',
      },
      {
        question: 'How do I deactivate a client account?',
        answer: 'Click on the client, change their status to "Inactive", and save. Inactive clients cannot log in but their data is preserved. You can reactivate them anytime. This is better than deleting for temporary access removal.',
      },
      {
        question: 'What information is collected in login requests?',
        answer: 'Typically: Name, email, company name, phone number, and sometimes additional fields like industry or reason for access. You can customize the request form fields based on your needs.',
      },
      {
        question: 'How do I track conversion rates?',
        answer: 'Go to the Analytics tab to see request conversion metrics. This shows how many requests were approved vs rejected, conversion rates over time, and trends. Helps measure your client acquisition effectiveness.',
      },
      {
        question: 'Can I bulk approve requests?',
        answer: 'Bulk approval is not currently available. Each request should be reviewed individually to ensure quality and prevent spam accounts. This manual review process helps maintain account security.',
      },
      {
        question: 'How do I handle duplicate requests?',
        answer: 'The system flags potential duplicates based on email. When reviewing a request, check if the email already exists. You can reject the duplicate or merge it with the existing client account.',
      },
      {
        question: 'Are client credentials secure?',
        answer: 'Yes! Credentials are generated securely, passwords are hashed, and sent via encrypted email. Clients must set their own password on first login. We never store or display plain-text passwords.',
      },
      {
        question: 'Can clients update their own information?',
        answer: 'Yes, clients can update their profile information (name, phone, company) through their account settings. Email changes require verification. Admins can also update client information from the Clients tab.',
      },
      {
        question: 'How long are contact inquiries stored?',
        answer: 'Contact inquiries are stored indefinitely unless manually deleted. You can archive resolved inquiries to keep the active list clean. Archived inquiries remain searchable for reference.',
      },
    ],
  },

  // Login Credential Requests screen
  'requests': {
    title: 'Login Credential Requests - Access Management',
    description: 'Review and process requests from potential clients seeking platform access. Approve qualified requests to create client accounts or reject with reasons.',
    features: [
      {
        icon: 'inbox',
        title: 'View All Requests',
        description: 'See all login credential requests in one organized list.',
        steps: [
          'Requests displayed in table format',
          'Shows name, email, company, date',
          'Status badges (pending, approved, rejected)',
          'Sort by date, name, or status',
          'Filter by status or date range',
          'Search by name or email',
        ],
      },
      {
        icon: 'visibility',
        title: 'Review Request Details',
        description: 'View complete information submitted by the requester.',
        steps: [
          'Click on any request to open details',
          'See full name and contact information',
          'View company name and details',
          'Check submission date and time',
          'Read any additional notes or comments',
          'Verify email format and validity',
        ],
      },
      {
        icon: 'check_circle',
        title: 'Approve Request',
        description: 'Accept qualified requests and create client accounts automatically.',
        steps: [
          'Review request details thoroughly',
          'Click "Approve" button',
          'Confirm the approval action',
          'System creates client account',
          'Welcome email sent automatically',
          'Client receives login credentials',
          'Request marked as approved',
          'Client appears in Clients tab',
        ],
      },
      {
        icon: 'cancel',
        title: 'Reject Request',
        description: 'Decline requests that don\'t meet criteria with optional reasons.',
        steps: [
          'Click "Reject" button',
          'Optionally add rejection reason',
          'Confirm the rejection',
          'Request marked as rejected',
          'Moved to rejected list',
          'Can be reviewed later if needed',
        ],
      },
      {
        icon: 'filter_list',
        title: 'Filter Requests',
        description: 'Narrow down requests by status, date, or other criteria.',
        steps: [
          'Click filter icon',
          'Select status (pending, approved, rejected)',
          'Choose date range',
          'Apply filters',
          'View filtered results',
          'Clear filters to see all',
        ],
      },
      {
        icon: 'search',
        title: 'Search Requests',
        description: 'Find specific requests quickly by name, email, or company.',
        steps: [
          'Type in search box',
          'Search by name, email, or company',
          'Results filter instantly',
          'Clear search to see all',
          'Combine with filters for precision',
        ],
      },
      {
        icon: 'warning',
        title: 'Duplicate Detection',
        description: 'System flags potential duplicate requests based on email.',
        steps: [
          'Duplicate badge appears on requests',
          'Click to see existing client',
          'Compare information',
          'Reject duplicate or merge',
          'Prevents multiple accounts per email',
        ],
      },
      {
        icon: 'history',
        title: 'Request History',
        description: 'Track when requests were submitted and processed.',
        steps: [
          'View submission timestamp',
          'See who approved/rejected',
          'Check processing date',
          'Review action history',
          'Export history for auditing',
        ],
      },
      {
        icon: 'notifications',
        title: 'Pending Request Alerts',
        description: 'Get notified about new requests requiring attention.',
        steps: [
          'Badge shows pending count',
          'New requests highlighted',
          'Email notifications (if enabled)',
          'Dashboard widget shows count',
          'Stay on top of new requests',
        ],
      },
      {
        icon: 'download',
        title: 'Export Requests',
        description: 'Download request data for reporting and analysis.',
        steps: [
          'Click export button',
          'Choose format (CSV, Excel)',
          'Select date range',
          'Download file',
          'Use for external analysis',
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I know if a request is legitimate?',
        answer: 'Check for: Valid email format, real company name, complete information, no suspicious patterns. If unsure, you can contact the requester before approving. Trust your judgment and company policies.',
      },
      {
        question: 'What happens after I approve a request?',
        answer: 'The system automatically creates a client account, generates secure login credentials, and sends a welcome email with instructions. The client can then log in and set their password. The request moves to the approved list.',
      },
      {
        question: 'Can I undo an approval or rejection?',
        answer: 'Rejections can be reversed by approving the request later. Approvals create client accounts which cannot be automatically undone - you would need to deactivate the client account manually in the Clients tab.',
      },
      {
        question: 'How long should I keep rejected requests?',
        answer: 'Keep rejected requests for at least 30-90 days for reference. You can delete them after that period if needed. Some organizations keep them indefinitely for audit purposes.',
      },
      {
        question: 'What if someone submits multiple requests?',
        answer: 'The system flags duplicates based on email. Review both requests, approve one if legitimate, and reject the duplicate. You can add a note explaining it\'s a duplicate.',
      },
      {
        question: 'Can I customize the welcome email?',
        answer: 'Welcome email templates can be customized by system administrators. Contact your admin if you need to change the email content, branding, or instructions sent to new clients.',
      },
      {
        question: 'How do I handle requests from competitors?',
        answer: 'Review carefully and reject if you suspect competitive intelligence gathering. Add a rejection reason for your records. You can also block specific email domains if needed.',
      },
      {
        question: 'What information is required in a request?',
        answer: 'Typically: Name, email (required), company name, phone number. Additional fields may be required based on your form configuration. Incomplete requests should be rejected.',
      },
      {
        question: 'Can I add notes to requests?',
        answer: 'Yes, you can add internal notes when reviewing requests. These notes are only visible to admins and help track decision-making, especially for edge cases or special circumstances.',
      },
      {
        question: 'How do I prioritize which requests to review first?',
        answer: 'Sort by date to see oldest first, or filter by company size/industry if those fields are available. Some organizations prioritize based on business value or referral source.',
      },
      {
        question: 'What if a request has invalid information?',
        answer: 'Reject the request and optionally add a note about the invalid information. If it seems like a genuine mistake, you could try contacting them to get correct information before deciding.',
      },
    ],
  },

  // Clients screen
  'clients': {
    title: 'Clients - Account Management',
    description: 'Manage active client accounts, update information, track activity, and maintain client relationships. Your complete client database.',
    features: [
      {
        icon: 'business',
        title: 'View All Clients',
        description: 'See all client accounts in an organized, searchable list.',
        steps: [
          'Clients displayed in table format',
          'Shows name, email, company, status',
          'Active/inactive status badges',
          'Sort by name, date, or status',
          'Filter by status or organization',
          'Search by any field',
        ],
      },
      {
        icon: 'person_add',
        title: 'Create New Client',
        description: 'Manually add client accounts without going through the request process.',
        steps: [
          'Click "New Client" button',
          'Enter name and email (required)',
          'Add company name and details',
          'Enter phone and address (optional)',
          'Set initial status (active/inactive)',
          'Click "Create Client"',
          'Client receives setup email',
        ],
      },
      {
        icon: 'edit',
        title: 'Edit Client Information',
        description: 'Update client details, contact information, and account settings.',
        steps: [
          'Click on any client',
          'Update name, email, or company',
          'Modify contact details',
          'Change account status',
          'Add internal notes',
          'Click "Save Changes"',
          'Updates apply immediately',
        ],
      },
      {
        icon: 'toggle_on',
        title: 'Activate/Deactivate Clients',
        description: 'Control client access by changing account status.',
        steps: [
          'Open client details',
          'Toggle status switch',
          'Confirm status change',
          'Inactive clients cannot log in',
          'Reactivate anytime',
          'Data is preserved',
        ],
      },
      {
        icon: 'search',
        title: 'Search Clients',
        description: 'Find clients quickly by name, email, company, or other fields.',
        steps: [
          'Type in search box',
          'Search across all fields',
          'Results filter instantly',
          'Clear to see all clients',
          'Combine with filters',
        ],
      },
      {
        icon: 'filter_list',
        title: 'Filter Clients',
        description: 'Narrow down client list by status, date, or custom criteria.',
        steps: [
          'Click filter icon',
          'Select status (active/inactive)',
          'Choose date range',
          'Apply multiple filters',
          'View filtered results',
          'Export filtered list',
        ],
      },
      {
        icon: 'lock_reset',
        title: 'Reset Client Password',
        description: 'Send password reset email to clients who need access help.',
        steps: [
          'Click on client',
          'Select "Reset Password"',
          'Confirm action',
          'Client receives reset email',
          'They set new password',
          'Old password invalidated',
        ],
      },
      {
        icon: 'history',
        title: 'Client Activity Log',
        description: 'View complete history of client interactions and changes.',
        steps: [
          'Open client details',
          'Click "Activity" tab',
          'See login history',
          'View account changes',
          'Track interactions',
          'Export activity log',
        ],
      },
      {
        icon: 'download',
        title: 'Export Client List',
        description: 'Download client data for reporting and external use.',
        steps: [
          'Click export button',
          'Choose format (CSV, Excel)',
          'Select fields to include',
          'Download file',
          'Use for CRM or analysis',
        ],
      },
      {
        icon: 'delete',
        title: 'Delete Client',
        description: 'Permanently remove client accounts (use with caution).',
        steps: [
          'Click on client',
          'Select "Delete"',
          'Confirm deletion',
          'Client permanently removed',
          'Consider deactivating instead',
          'Audit logs preserved',
        ],
      },
    ],
    faqs: [
      {
        question: 'What\'s the difference between active and inactive clients?',
        answer: 'Active clients can log in and access the platform. Inactive clients cannot log in but their account and data remain in the system. Use inactive status for temporary access removal without deleting the account.',
      },
      {
        question: 'Can I create a client without them requesting access?',
        answer: 'Yes! Click "New Client" and fill in their information. They\'ll receive an email to set up their password. This is useful for adding clients from other sources like sales leads or partnerships.',
      },
      {
        question: 'How do I bulk import clients?',
        answer: 'Bulk import via CSV is available for admins. Prepare a CSV file with required fields (name, email, company), then use the import function. The system validates data and creates accounts in batch.',
      },
      {
        question: 'Can clients update their own information?',
        answer: 'Yes, clients can update their profile (name, phone, company) through their account settings. Email changes require verification. Admins can also update client information from this screen.',
      },
      {
        question: 'What happens when I delete a client?',
        answer: 'The client account is permanently removed. They cannot log in and lose all access. Their activity history is preserved for audit purposes. We recommend deactivating instead of deleting.',
      },
      {
        question: 'How do I track client activity?',
        answer: 'Open client details and click the "Activity" tab. You\'ll see login history, account changes, and interactions. This helps monitor engagement and troubleshoot access issues.',
      },
      {
        question: 'Can I add notes about clients?',
        answer: 'Yes, use the notes field in client details to add internal comments. These are only visible to admins and help track important information, special requirements, or account history.',
      },
      {
        question: 'How do I handle duplicate client accounts?',
        answer: 'If you find duplicates, choose the primary account, transfer any important data/notes, then deactivate or delete the duplicate. The system prevents duplicate emails but duplicates can occur with different emails.',
      },
      {
        question: 'What if a client forgets their password?',
        answer: 'Clients can use "Forgot Password" on the login page. As an admin, you can also send a password reset email from the client details page. They\'ll receive a secure link to set a new password.',
      },
      {
        question: 'Can I export client data?',
        answer: 'Yes, use the export button to download client data as CSV or Excel. Choose which fields to include. Useful for CRM integration, reporting, or backup purposes.',
      },
      {
        question: 'How do I reactivate an inactive client?',
        answer: 'Open the client details, toggle the status from inactive to active, and save. The client can immediately log in again. No need to send new credentials.',
      },
      {
        question: 'What information is required to create a client?',
        answer: 'Name and email are required. Company name, phone, and address are optional but recommended. Email must be unique - you cannot create multiple clients with the same email.',
      },
    ],
  },

  // Contact Us Enquiries screen
  'contacts': {
    title: 'Contact Us Enquiries - Website Submissions',
    description: 'Manage contact us form submissions from website. View enquiry details, mark status, and respond to customer enquiries.',
    features: [
      {
        icon: 'mail',
        title: 'View All Enquiries',
        description: 'See all contact us form submissions from website in one organized list.',
        steps: [
          'Enquiries displayed in list format',
          'Shows name, email, subject, date',
          'Status indicators (new, in progress, resolved)',
          'Sort by date or status',
          'Filter by status or date',
          'Search by name or subject',
        ],
      },
      {
        icon: 'visibility',
        title: 'Read Enquiry Details',
        description: 'View complete contact us form submission and sender information.',
        steps: [
          'Click on any enquiry',
          'See sender name and email',
          'Read full message content',
          'View submission date and time',
          'Check phone number if provided',
          'Review any additional fields',
        ],
      },
      {
        icon: 'reply',
        title: 'Respond to Inquiries',
        description: 'Send replies directly from the platform.',
        steps: [
          'Open inquiry details',
          'Click "Reply" button',
          'Write your response',
          'Use templates for common replies',
          'Add attachments if needed',
          'Click "Send"',
          'Response tracked in history',
        ],
      },
      {
        icon: 'label',
        title: 'Mark Status',
        description: 'Update enquiry status to track progress and resolution.',
        steps: [
          'Open enquiry details',
          'Select status: New, In Progress, Resolved',
          'New: Just received, not yet processed',
          'In Progress: Being worked on',
          'Resolved: Completed and closed',
          'Status updates tracked in history',
        ],
      },
      {
        icon: 'label',
        title: 'Categorize Inquiries',
        description: 'Organize inquiries by type or topic for better management.',
        steps: [
          'Open inquiry details',
          'Select category (sales, support, general)',
          'Add tags for organization',
          'Filter by category later',
          'Track inquiry types',
        ],
      },
      {
        icon: 'archive',
        title: 'Archive Inquiries',
        description: 'Move resolved inquiries to archive to keep inbox clean.',
        steps: [
          'Select resolved inquiries',
          'Click "Archive" button',
          'Inquiries moved to archive',
          'Still searchable',
          'Can be unarchived if needed',
        ],
      },
      {
        icon: 'search',
        title: 'Search Inquiries',
        description: 'Find specific messages by sender, subject, or content.',
        steps: [
          'Type in search box',
          'Search name, email, or message',
          'Results filter instantly',
          'Clear to see all',
          'Combine with filters',
        ],
      },
      {
        icon: 'schedule',
        title: 'Response Time Tracking',
        description: 'Monitor how quickly inquiries are being addressed.',
        steps: [
          'View time since submission',
          'Track average response time',
          'Identify overdue inquiries',
          'Set response time goals',
          'Improve customer service',
        ],
      },
      {
        icon: 'download',
        title: 'Export Inquiries',
        description: 'Download inquiry data for reporting and analysis.',
        steps: [
          'Click export button',
          'Choose format (CSV, Excel)',
          'Select date range',
          'Download file',
          'Use for analysis',
        ],
      },
      {
        icon: 'delete',
        title: 'Delete Inquiries',
        description: 'Remove spam or irrelevant messages.',
        steps: [
          'Select inquiries to delete',
          'Click "Delete" button',
          'Confirm deletion',
          'Permanently removed',
          'Use for spam only',
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I respond to a contact inquiry?',
        answer: 'Click on the inquiry to open details, click "Reply" button, write your response, and send. The response is sent via email to the sender. You can also use templates for common responses.',
      },
      {
        question: 'Can I use templates for responses?',
        answer: 'Yes! Create response templates for common inquiries (pricing, support, general info). When replying, select a template and customize as needed. Saves time and ensures consistent messaging.',
      },
      {
        question: 'What\'s the difference between archive and delete?',
        answer: 'Archive moves inquiries out of the active inbox but keeps them searchable for reference. Delete permanently removes inquiries. Use archive for resolved inquiries, delete only for spam.',
      },
      {
        question: 'How do I handle spam inquiries?',
        answer: 'Mark as spam and delete. If you receive spam from specific domains, you can block them. Consider adding CAPTCHA to your contact form to reduce spam submissions.',
      },
      {
        question: 'Can I assign inquiries to team members?',
        answer: 'Assignment features depend on your system configuration. Some setups allow assigning inquiries to specific team members for follow-up. Check with your administrator about this feature.',
      },
      {
        question: 'How long should I keep inquiries?',
        answer: 'Keep active inquiries until resolved, then archive. Archived inquiries can be kept indefinitely for reference. Delete only spam or irrelevant messages. Some organizations keep inquiries for 1-2 years.',
      },
      {
        question: 'What if someone submits multiple inquiries?',
        answer: 'You\'ll see multiple entries from the same email. Review all messages to understand the full context. You can respond to the most recent one referencing previous inquiries.',
      },
      {
        question: 'Can I track response times?',
        answer: 'Yes, the system shows time since submission. You can also view average response times in the Analytics tab. Use this to set service level goals and improve response speed.',
      },
      {
        question: 'How do I categorize inquiries?',
        answer: 'Open inquiry details and select a category (sales, support, general, etc.). Categories help organize inquiries and generate reports by type. You can also add custom tags.',
      },
      {
        question: 'Can I attach files in responses?',
        answer: 'Yes, you can attach files when replying to inquiries. Useful for sending brochures, documents, or images. Keep file sizes reasonable for email delivery.',
      },
      {
        question: 'What if I accidentally delete an inquiry?',
        answer: 'Deleted inquiries cannot be recovered. Be careful when deleting. We recommend archiving instead of deleting unless it\'s spam. Always review before confirming deletion.',
      },
      {
        question: 'How do I export inquiry data?',
        answer: 'Click the export button, choose format (CSV/Excel), select date range, and download. Export includes sender info, message content, dates, and status. Useful for reporting.',
      },
    ],
  },

  // Analytics screen
  'analytics': {
    title: 'Client Management Analytics - Insights & Reports',
    description: 'Track client acquisition, request conversion rates, inquiry volumes, and engagement metrics. Make data-driven decisions about client management.',
    features: [
      {
        icon: 'dashboard',
        title: 'Overview Statistics',
        description: 'Get a quick snapshot of your client management metrics.',
        steps: [
          'View total clients count',
          'See active vs inactive clients',
          'Track pending requests',
          'Monitor unread inquiries',
          'Check conversion rates',
          'All stats update in real-time',
        ],
      },
      {
        icon: 'trending_up',
        title: 'Client Growth Trends',
        description: 'Track client acquisition and growth over time.',
        steps: [
          'View new clients by month',
          'See growth rate trends',
          'Compare periods',
          'Identify growth patterns',
          'Forecast future growth',
        ],
      },
      {
        icon: 'check_circle',
        title: 'Request Conversion Metrics',
        description: 'Analyze how many requests become active clients.',
        steps: [
          'View approval vs rejection rates',
          'Track conversion percentage',
          'See average processing time',
          'Identify bottlenecks',
          'Improve approval process',
        ],
      },
      {
        icon: 'mail',
        title: 'Inquiry Volume Analysis',
        description: 'Monitor contact inquiry patterns and response performance.',
        steps: [
          'View inquiries by month',
          'Track response times',
          'See inquiry categories',
          'Identify peak periods',
          'Plan resource allocation',
        ],
      },
      {
        icon: 'people',
        title: 'Client Activity Metrics',
        description: 'Track client engagement and platform usage.',
        steps: [
          'View active client count',
          'Monitor login frequency',
          'Track last activity dates',
          'Identify inactive clients',
          'Measure engagement levels',
        ],
      },
      {
        icon: 'schedule',
        title: 'Response Time Analytics',
        description: 'Monitor how quickly requests and inquiries are handled.',
        steps: [
          'View average response time',
          'Track by inquiry type',
          'Identify slow responses',
          'Set performance goals',
          'Improve service levels',
        ],
      },
      {
        icon: 'bar_chart',
        title: 'Visual Data Representation',
        description: 'Easy-to-read charts and graphs for quick insights.',
        steps: [
          'Line charts for trends',
          'Bar charts for comparisons',
          'Pie charts for distribution',
          'Color-coded metrics',
          'Interactive visualizations',
        ],
      },
      {
        icon: 'refresh',
        title: 'Real-Time Updates',
        description: 'Analytics refresh automatically when you switch to the tab.',
        steps: [
          'Data loads on tab switch',
          'Click refresh for manual update',
          'Last updated timestamp shown',
          'All metrics update together',
        ],
      },
      {
        icon: 'download',
        title: 'Export Reports',
        description: 'Download analytics data for presentations and external analysis.',
        steps: [
          'Click export button',
          'Choose format (CSV, Excel, PDF)',
          'Select date range',
          'Download report',
          'Use for stakeholder meetings',
        ],
      },
      {
        icon: 'insights',
        title: 'Performance Insights',
        description: 'Get actionable recommendations based on your data.',
        steps: [
          'View key insights',
          'See trend analysis',
          'Get improvement suggestions',
          'Track goal progress',
          'Make data-driven decisions',
        ],
      },
    ],
    faqs: [
      {
        question: 'How often do analytics update?',
        answer: 'Analytics update automatically when you switch to the Analytics tab. You can also click the refresh button for manual updates. Data is pulled from the database in real-time.',
      },
      {
        question: 'What is request conversion rate?',
        answer: 'Conversion rate is the percentage of login requests that are approved and become active clients. For example, if you receive 100 requests and approve 80, your conversion rate is 80%. Higher is generally better.',
      },
      {
        question: 'How do I improve my conversion rate?',
        answer: 'Review rejection reasons, streamline the approval process, respond faster to requests, and ensure your request form collects quality information. Track trends to identify what works.',
      },
      {
        question: 'What\'s a good response time for inquiries?',
        answer: 'Industry standard is 24-48 hours for initial response. Urgent inquiries should be answered within a few hours. Track your average and set goals. Faster response times improve customer satisfaction.',
      },
      {
        question: 'Can I filter analytics by date range?',
        answer: 'Yes, most analytics views support date range filtering. Select start and end dates to view metrics for specific periods. Useful for monthly, quarterly, or yearly reports.',
      },
      {
        question: 'How do I export analytics data?',
        answer: 'Click the "Export" button, choose your format (CSV, Excel, PDF), select date range if applicable, and download. Use exported data for presentations, reports, or external analysis.',
      },
      {
        question: 'What does "active clients" mean?',
        answer: 'Active clients are accounts with active status who can log in. This excludes inactive/deactivated accounts. Track this to understand your actual user base size.',
      },
      {
        question: 'How do I track client engagement?',
        answer: 'View client activity metrics showing login frequency and last activity dates. Clients who haven\'t logged in for 30+ days may need re-engagement. Use this data to plan outreach.',
      },
      {
        question: 'Can I compare different time periods?',
        answer: 'Yes, select two date ranges to compare metrics side-by-side. Useful for month-over-month or year-over-year comparisons. Helps identify trends and measure growth.',
      },
      {
        question: 'What should I do with inactive clients?',
        answer: 'Review inactive client list from analytics. Consider re-engagement campaigns, check if they need help, or deactivate accounts that are no longer needed. Keep your client base clean.',
      },
      {
        question: 'How do I set performance goals?',
        answer: 'Use historical data to establish baselines, then set realistic improvement targets. Common goals: 80%+ conversion rate, <24hr response time, 10% monthly growth. Track progress in analytics.',
      },
      {
        question: 'Can I schedule automated reports?',
        answer: 'Automated report scheduling depends on your system configuration. Check with your administrator. You can manually export reports on a regular schedule if automation isn\'t available.',
      },
    ],
  },
};
