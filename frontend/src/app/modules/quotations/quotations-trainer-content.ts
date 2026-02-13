/**
 * Quotations Module Trainer Content
 * 
 * Comprehensive training content for the Quotations module.
 * Covers: Enquiries, Presentations (PPTX), Quotations (BOQ/XLSX), Analytics
 */

import { TrainerContent } from '../../services/xrm-trainer.service';

export const QUOTATIONS_TRAINER_CONTENT: Record<string, TrainerContent> = {
  '/modules/quotations': {
    title: 'Quotations Management - Overview',
    description: 'Complete enquiry and quotation management system. Handle website enquiries from racconti.in with product lists, create branded PPTX presentations, generate BOQ quotations with XLSX downloads, and track performance analytics.',
    relatedPages: [
      { key: '/modules/quotations', label: 'Overview', icon: 'home' },
      { key: 'enquiries', label: 'Enquiries', icon: 'inbox' },
      { key: 'presentations', label: 'Presentations', icon: 'slideshow' },
      { key: 'quotations', label: 'Quotations', icon: 'description' },
      { key: 'analytics', label: 'Analytics', icon: 'analytics' }
    ],
    features: [
      {
        icon: 'inbox',
        title: 'Website Enquiries',
        description: 'Capture and manage enquiries from racconti.in with product lists.',
        steps: [
          'Enquiries submitted from racconti.in website',
          'View customer details and requirements',
          'See products selected by customer',
          'Review quantities and specifications',
          'Team can work on enquiry collaboratively',
          'Convert to presentation or quotation',
        ],
      },
      {
        icon: 'slideshow',
        title: 'PPTX Presentations',
        description: 'Create branded PowerPoint presentations in fixed theme for client sharing.',
        steps: [
          'Create presentation from enquiry or manually',
          'Add products with images and details',
          'Apply fixed branded theme automatically',
          'Company logo and branding included',
          'Generate PPTX file for download',
          'Share with clients via email',
          'Can be edited in PowerPoint or Keynote',
        ],
      },
      {
        icon: 'description',
        title: 'BOQ Quotations',
        description: 'Generate Bill of Quantities with pricing details in branded XLSX format.',
        steps: [
          'Create quotation from enquiry',
          'Add multiple products with quantities',
          'Provide detailed pricing information',
          'Set discounts and taxes',
          'Generate fixed branded XLSX file',
          'Download quotation instantly',
          'Can be modified and re-downloaded',
          'Further editing possible in Excel',
        ],
      },
      {
        icon: 'analytics',
        title: 'Quotations Analytics',
        description: 'Track enquiry conversion, quotation performance, and revenue metrics.',
        steps: [
          'View total enquiries and quotations',
          'Monitor conversion rates',
          'Track quotation values',
          'Analyze response times',
          'Review win/loss ratios',
        ],
      },
      {
        icon: 'shopping_cart',
        title: 'Product Cart Management',
        description: 'Handle product selections in enquiries with cart functionality.',
        steps: [
          'View products in enquiry cart',
          'Check quantities requested',
          'See product specifications',
          'Modify quantities if needed',
          'Add or remove products',
          'Calculate total value',
        ],
      },
      {
        icon: 'file_download',
        title: 'Document Generation',
        description: 'Automated generation of PPTX presentations and XLSX quotations.',
        steps: [
          'Select document type (PPTX or XLSX)',
          'System generates formatted document',
          'Includes branding and styling',
          'Download instantly',
          'Share with clients via email',
        ],
      },
      {
        icon: 'email',
        title: 'Enquiry Communication',
        description: 'Respond to enquiries and communicate with potential clients.',
        steps: [
          'View enquiry details and messages',
          'Reply to customer questions',
          'Send quotations and presentations',
          'Track communication history',
          'Set follow-up reminders',
        ],
      },
      {
        icon: 'calculate',
        title: 'Pricing & Calculations',
        description: 'Automated pricing calculations with discounts, taxes, and totals.',
        steps: [
          'Product prices pulled automatically',
          'Apply discounts (percentage or fixed)',
          'Calculate subtotals',
          'Add taxes (VAT, GST)',
          'Show grand total',
          'Display in multiple currencies',
        ],
      },
      {
        icon: 'history',
        title: 'Enquiry Tracking',
        description: 'Complete history of enquiries from submission to conversion.',
        steps: [
          'Track enquiry status (new, quoted, won, lost)',
          'View timeline of actions',
          'Monitor response times',
          'See conversion progress',
          'Review historical data',
        ],
      },
      {
        icon: 'branding_watermark',
        title: 'Branding & Customization',
        description: 'Customize presentations and quotations with company branding.',
        steps: [
          'Add company logo to documents',
          'Set brand colors and fonts',
          'Customize templates',
          'Add terms and conditions',
          'Include contact information',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is an enquiry in this system?',
        answer: 'An enquiry is a request captured from the racconti.in website where visitors select products they\'re interested in. It includes customer details, selected products with quantities, and any messages or requirements. Your team can view and work on these enquiries.',
      },
      {
        question: 'How do enquiries come from racconti.in?',
        answer: 'Customers browse products on racconti.in, add items to their enquiry list, fill in their contact details and requirements, and submit. The enquiry appears in your Quotations module immediately for your team to process.',
      },
      {
        question: 'What\'s the difference between presentations and quotations?',
        answer: 'Presentations (PPTX) are visual, branded documents showcasing products with images and descriptions - great for initial pitches. Quotations (BOQ/XLSX) are detailed pricing documents with line items, quantities, and costs - used when sharing actual pricing with clients.',
      },
      {
        question: 'Can I edit the PPTX after downloading?',
        answer: 'Yes! The generated PPTX uses a fixed branded theme but can be further edited in PowerPoint, Keynote, or any compatible presentation software. Make final adjustments, add custom slides, or modify content as needed.',
      },
      {
        question: 'What is BOQ?',
        answer: 'BOQ (Bill of Quantities) is a detailed list of products/services with quantities, unit prices, and total costs. It\'s the standard format for sharing pricing with clients. Our system generates BOQ as professionally branded XLSX (Excel) files.',
      },
      {
        question: 'Can I modify and re-download quotations?',
        answer: 'Yes! Edit the quotation to change products, quantities, or pricing, then regenerate and download the updated XLSX file. You can do this multiple times as negotiations progress. Each version is tracked in the system.',
      },
      {
        question: 'How do I convert an enquiry to a presentation?',
        answer: 'Open the enquiry and click "Create Presentation". Products from the enquiry are automatically added. The system applies your fixed branded theme, generates the PPTX file, and you can download it to share with the client.',
      },
      {
        question: 'How do I convert an enquiry to a quotation?',
        answer: 'Open the enquiry and click "Create Quotation". Products and quantities are pre-loaded. Add pricing details, set discounts and taxes, then generate the branded XLSX file. Download and send to the client.',
      },
      {
        question: 'Can multiple team members work on an enquiry?',
        answer: 'Yes! Enquiries can be assigned to team members, and multiple people can view and work on them. Add internal notes, track actions, and collaborate to provide the best response to customers.',
      },
      {
        question: 'What branding is applied to documents?',
        answer: 'Both PPTX presentations and XLSX quotations use your company\'s fixed branded theme including logo, colors, fonts, and layout. This ensures consistent, professional documents for all client communications.',
      },
      {
        question: 'Can I add products not in the enquiry?',
        answer: 'Yes! When creating presentations or quotations, you can add additional products from your catalogue or create custom line items. This is useful for upselling or including related products the customer might need.',
      },
      {
        question: 'How do I track enquiry status?',
        answer: 'Enquiries have status indicators: New (just received), Quoted (quotation sent), Won (customer ordered), Lost (declined). Update status as you progress through the sales process. Analytics track conversion rates.',
      },
      {
        question: 'Can I create presentations without an enquiry?',
        answer: 'Yes! Click "New Presentation" and add products manually from your catalogue. This is useful for proactive pitches, standard product showcases, or when creating presentations for meetings.',
      },
      {
        question: 'What file formats are supported?',
        answer: 'Presentations are generated as PPTX (PowerPoint) files. Quotations are generated as XLSX (Excel) files. Both formats are industry-standard and can be opened on any device with compatible software.',
      },
      {
        question: 'How do I share documents with clients?',
        answer: 'Download the generated PPTX or XLSX file and email it to the client. You can also use your company\'s file sharing system. The system tracks when documents were generated for your records.',
      },
    ],
  },

  // Enquiries screen specific trainer
  'enquiries': {
    title: 'Enquiries - Website Requests',
    description: 'Manage customer enquiries captured from racconti.in website. View product lists, work on enquiries with your team, and convert to presentations or quotations.',
    features: [
      {
        icon: 'inbox',
        title: 'View All Enquiries',
        description: 'See all customer enquiries in one organized list.',
        steps: [
          'Enquiries displayed in table format',
          'Shows customer name, company, date',
          'Status badges (new, quoted, won, lost)',
          'Product count and total value',
          'Sort by date, value, or status',
          'Filter by status or date range',
        ],
      },
      {
        icon: 'visibility',
        title: 'Review Enquiry Details',
        description: 'View complete enquiry information including products and requirements.',
        steps: [
          'Click on any enquiry to open',
          'See customer contact information',
          'Read customer message and requirements',
          'View product list with quantities',
          'Check product specifications',
          'See total estimated value',
          'Review submission date and time',
        ],
      },
      {
        icon: 'shopping_cart',
        title: 'Product Cart',
        description: 'View and manage products selected by the customer.',
        steps: [
          'See all products in enquiry cart',
          'View product images and names',
          'Check quantities requested',
          'See product prices (if visible)',
          'Review product specifications',
          'Calculate total cart value',
          'Modify quantities if needed',
        ],
      },
      {
        icon: 'reply',
        title: 'Respond to Enquiry',
        description: 'Send replies and communicate with customers.',
        steps: [
          'Click "Reply" button',
          'Write your response',
          'Answer customer questions',
          'Provide additional information',
          'Send reply via email',
          'Response tracked in history',
        ],
      },
      {
        icon: 'request_quote',
        title: 'Create Quotation',
        description: 'Convert enquiry to formal quotation with pricing.',
        steps: [
          'Click "Create Quotation" button',
          'Products pre-loaded from enquiry',
          'Set pricing and discounts',
          'Add terms and conditions',
          'Generate XLSX file',
          'Download and send to customer',
          'Enquiry marked as "Quoted"',
        ],
      },
      {
        icon: 'slideshow',
        title: 'Create Presentation',
        description: 'Generate PPTX presentation from enquiry products.',
        steps: [
          'Click "Create Presentation" button',
          'Products pre-loaded from enquiry',
          'Customize slides and branding',
          'Add company information',
          'Generate PPTX file',
          'Download and share',
        ],
      },
      {
        icon: 'label',
        title: 'Update Enquiry Status',
        description: 'Track enquiry progress through the sales pipeline.',
        steps: [
          'Change status: New, Quoted, Won, Lost',
          'New: Just received, not yet processed',
          'Quoted: Quotation sent to customer',
          'Won: Customer accepted and ordered',
          'Lost: Customer declined or no response',
          'Status updates tracked in analytics',
        ],
      },
      {
        icon: 'search',
        title: 'Search & Filter Enquiries',
        description: 'Find specific enquiries quickly.',
        steps: [
          'Type in search box (name, company, email)',
          'Filter by status',
          'Filter by date range',
          'Filter by value range',
          'Sort by various criteria',
          'Combine multiple filters',
        ],
      },
      {
        icon: 'flag',
        title: 'Priority & Assignment',
        description: 'Mark urgent enquiries and assign to team members.',
        steps: [
          'Flag high-priority enquiries',
          'Assign to sales team members',
          'Set follow-up reminders',
          'Track assigned enquiries',
          'Filter by assignee',
        ],
      },
      {
        icon: 'history',
        title: 'Enquiry History',
        description: 'View complete timeline of enquiry interactions.',
        steps: [
          'See submission date',
          'View all responses sent',
          'Track quotations generated',
          'See presentations created',
          'Monitor status changes',
          'Review all communications',
        ],
      },
    ],
    faqs: [
      {
        question: 'How do customers submit enquiries from racconti.in?',
        answer: 'Customers browse products on racconti.in, select items they\'re interested in, add them to their enquiry list with quantities, fill in their contact details and requirements, and submit. The enquiry appears in your system immediately.',
      },
      {
        question: 'What information is included in an enquiry?',
        answer: 'Enquiries include customer name, email, phone, company name, message/requirements, and a list of selected products with quantities. Some enquiries may include project details or delivery requirements.',
      },
      {
        question: 'How do I know when a new enquiry arrives?',
        answer: 'New enquiries appear with a "New" status badge. You may also receive email notifications (if configured). The dashboard widget shows pending enquiry count. Check regularly to respond quickly.',
      },
      {
        question: 'Can I modify the products in an enquiry?',
        answer: 'Yes! You can add products, remove items, or adjust quantities when creating a quotation or presentation. The original enquiry remains unchanged for reference, but your quotation reflects the modifications.',
      },
      {
        question: 'How quickly should I respond to enquiries?',
        answer: 'Aim to respond within 24 hours for best results. Quick responses increase conversion rates. Analytics track your average response time. Set up notifications to stay on top of new enquiries.',
      },
      {
        question: 'What if an enquiry has no products?',
        answer: 'Some enquiries are general questions without specific products. Reply with information, suggest products, or call the customer to understand their needs. You can manually add products when creating a quotation.',
      },
      {
        question: 'Can I assign enquiries to team members?',
        answer: 'Yes! Use the assignment feature to distribute enquiries among your sales team. Filter by assignee to see your enquiries. This helps manage workload and ensures follow-up.',
      },
      {
        question: 'How do I mark an enquiry as won or lost?',
        answer: 'Open the enquiry and change status to "Won" if the customer placed an order, or "Lost" if they declined or didn\'t respond. Add notes about why it was won/lost for future reference.',
      },
      {
        question: 'Can I export enquiry data?',
        answer: 'Yes! Use the export button to download enquiry data as CSV. This includes customer details, products, values, and status. Useful for reporting and CRM integration.',
      },
      {
        question: 'What if a customer submits duplicate enquiries?',
        answer: 'Check for duplicates by searching the customer\'s email or name. You can merge enquiries or mark one as duplicate. Contact the customer to clarify which enquiry is current.',
      },
      {
        question: 'How do I calculate the value of an enquiry?',
        answer: 'The system calculates estimated value by multiplying product prices by quantities. This is an estimate - actual quotation may differ based on discounts, custom pricing, or additional items.',
      },
      {
        question: 'Can I add notes to enquiries?',
        answer: 'Yes! Add internal notes to track conversations, decisions, or follow-up actions. Notes are only visible to your team, not customers. Great for handoffs and collaboration.',
      },
      {
        question: 'What happens to old enquiries?',
        answer: 'Enquiries remain in the system indefinitely unless deleted. Archive old enquiries to keep the active list clean. Archived enquiries are still searchable for reference.',
      },
      {
        question: 'How do I handle enquiries for custom products?',
        answer: 'Reply to the customer to gather requirements, then create a custom quotation with manual pricing. You can add custom line items to quotations even if they\'re not in your product catalogue.',
      },
      {
        question: 'Can customers track their enquiry status?',
        answer: 'Customer portal features depend on your setup. Typically, customers receive email updates when you send quotations or replies. Contact your administrator about customer portal access.',
      },
    ],
  },

  // Presentations screen specific trainer
  'presentations': {
    title: 'Presentations - PPTX Generation',
    description: 'Create professional PowerPoint presentations in fixed branded theme. Generate PPTX files to share with clients, editable in PowerPoint or Keynote for finishing touches.',
    features: [
      {
        icon: 'add_circle',
        title: 'Create New Presentation',
        description: 'Build presentations from enquiries or from scratch.',
        steps: [
          'Click "New Presentation" button',
          'Enter presentation title',
          'Select source (enquiry or manual)',
          'If from enquiry, products pre-loaded',
          'If manual, add products individually',
          'Set presentation details',
          'Configure branding options',
          'Save as draft or generate immediately',
        ],
      },
      {
        icon: 'inventory_2',
        title: 'Add Products to Slides',
        description: 'Select and organize products for presentation slides.',
        steps: [
          'Click "Add Products" button',
          'Search or browse product catalogue',
          'Select products to include',
          'Products added as individual slides',
          'Each slide shows product image',
          'Includes product name and description',
          'Reorder slides by dragging',
          'Remove products as needed',
        ],
      },
      {
        icon: 'palette',
        title: 'Fixed Branded Theme',
        description: 'Presentations use your company\'s fixed branded theme automatically.',
        steps: [
          'Company logo included automatically',
          'Brand colors applied to all slides',
          'Consistent fonts and styling',
          'Professional layout and design',
          'Header and footer with company info',
          'No manual branding needed',
        ],
      },
      {
        icon: 'edit',
        title: 'Further Editing in External Tools',
        description: 'Downloaded PPTX can be edited in PowerPoint or Keynote.',
        steps: [
          'Download generated PPTX file',
          'Open in Microsoft PowerPoint',
          'Or open in Apple Keynote',
          'Or use Google Slides',
          'Make final adjustments',
          'Add custom slides if needed',
          'Polish and finalize presentation',
        ],
      },
      {
        icon: 'view_carousel',
        title: 'Slide Templates',
        description: 'Choose from pre-designed slide layouts.',
        steps: [
          'Select template for presentation',
          'Options: Modern, Classic, Minimal',
          'Each template has unique styling',
          'Cover slide with company info',
          'Product slides with images',
          'Closing slide with contact details',
          'Consistent design throughout',
        ],
      },
      {
        icon: 'file_download',
        title: 'Generate PPTX',
        description: 'Create downloadable PowerPoint file.',
        steps: [
          'Review all slides',
          'Click "Generate PPTX" button',
          'System creates PowerPoint file',
          'Processing takes 10-30 seconds',
          'Download button appears',
          'Click to download PPTX',
          'File ready to share with client',
        ],
      },
      {
        icon: 'sort',
        title: 'Reorder Slides',
        description: 'Arrange slides in the best sequence.',
        steps: [
          'Drag and drop slides to reorder',
          'Cover slide always first',
          'Organize products logically',
          'Group similar products',
          'Closing slide always last',
          'Order saved automatically',
        ],
      },
      {
        icon: 'content_copy',
        title: 'Duplicate Presentation',
        description: 'Create copies for similar projects.',
        steps: [
          'Click on presentation',
          'Select "Duplicate" from menu',
          'All slides and settings copied',
          'Modify for new client',
          'Saves time on similar presentations',
        ],
      },
      {
        icon: 'history',
        title: 'Presentation History',
        description: 'Track all presentations created.',
        steps: [
          'View list of all presentations',
          'See creation date and author',
          'Check which enquiry it\'s for',
          'Download previous versions',
          'Track client interactions',
        ],
      },
      {
        icon: 'email',
        title: 'Share Presentation',
        description: 'Send presentations to clients.',
        steps: [
          'Download PPTX file',
          'Email to client manually',
          'Or use built-in email feature',
          'Track when sent',
          'Follow up with client',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the fixed branded theme?',
        answer: 'The fixed branded theme is your company\'s pre-configured presentation design including logo, colors, fonts, and layout. It\'s applied automatically to all presentations, ensuring consistent, professional branding without manual setup.',
      },
      {
        question: 'Can I customize the theme for each presentation?',
        answer: 'The system applies a fixed theme automatically for consistency. However, after downloading the PPTX, you can edit it in PowerPoint or Keynote to make presentation-specific customizations while maintaining the base branding.',
      },
      {
        question: 'Can I edit the PPTX after downloading?',
        answer: 'Yes! The generated PPTX is a standard PowerPoint file. Open it in Microsoft PowerPoint, Apple Keynote, Google Slides, or any compatible software to make additional edits, add slides, or customize content for finishing touches.',
      },
      {
        question: 'What information appears on each product slide?',
        answer: 'Each slide includes product image, name, description, key features, and specifications. You can optionally include pricing. The layout is professional and consistent across all slides.',
      },
      {
        question: 'How do I add my company logo to presentations?',
        answer: 'Your company logo is included automatically in the fixed branded theme. The system administrator configures the logo once, and it appears on all presentations. No need to upload it each time.',
      },
      {
        question: 'Can I change the template after creating a presentation?',
        answer: 'The system uses a fixed branded theme for consistency. If you need different styling, download the PPTX and edit it in PowerPoint or Keynote. Contact your administrator if you need multiple branded themes configured.',
      },
      {
        question: 'How long does it take to generate a PPTX?',
        answer: 'Generation typically takes 10-30 seconds depending on the number of slides and image sizes. The system processes images, applies branding, and creates the PowerPoint file. You\'ll see a progress indicator.',
      },
      {
        question: 'Can I edit the PPTX after downloading?',
        answer: 'Yes! The generated PPTX is a standard PowerPoint file. Open it in Microsoft PowerPoint, Google Slides, or any compatible software to make additional edits, add slides, or customize further.',
      },
      {
        question: 'What if product images are missing?',
        answer: 'Products without images show a placeholder. For best presentations, ensure all products have high-quality images. Edit products in the Catalogue module to add images before creating presentations.',
      },
      {
        question: 'Can I include pricing in presentations?',
        answer: 'Yes, pricing is optional. Toggle "Show Pricing" when creating the presentation. Some businesses prefer to show prices, others prefer to discuss pricing separately. Choose based on your sales strategy.',
      },
      {
        question: 'How do I reorder products in the presentation?',
        answer: 'Drag and drop slides to reorder them. Organize products logically - by category, price range, or importance. The cover and closing slides stay in their positions.',
      },
      {
        question: 'Can I save a presentation as a draft?',
        answer: 'Yes! Save as draft to work on it later. Drafts are not generated as PPTX until you\'re ready. This lets you prepare presentations in advance and generate them when needed.',
      },
      {
        question: 'What software can I use to edit the PPTX?',
        answer: 'Use Microsoft PowerPoint (Windows/Mac), Apple Keynote (Mac), Google Slides (web), LibreOffice Impress (free), or any PPTX-compatible software. The file format is standard and works across all platforms.',
      },
      {
        question: 'Can I create presentations without an enquiry?',
        answer: 'Yes! Click "New Presentation" and select "Manual" mode. Add products individually from your catalogue. Useful for proactive pitches or standard product showcases.',
      },
      {
        question: 'How do I track which presentations were sent to which clients?',
        answer: 'Presentations are linked to enquiries. View the enquiry to see all presentations created for that customer. Add notes about when you sent it and client feedback.',
      },
    ],
  },

  // Quotations screen specific trainer
  'quotations': {
    title: 'Quotations - BOQ & Pricing',
    description: 'Generate Bill of Quantities with detailed pricing. Create branded XLSX quotations with multiple products, pricing details, and downloadable format. Modify and re-download as needed.',
    features: [
      {
        icon: 'add_circle',
        title: 'Create New Quotation',
        description: 'Build detailed quotations with line items and pricing.',
        steps: [
          'Click "New Quotation" button',
          'Enter quotation number (auto-generated)',
          'Select customer/enquiry',
          'Add quotation date and validity',
          'Products pre-loaded if from enquiry',
          'Or add products manually',
          'Set pricing and terms',
          'Save as draft or finalize',
        ],
      },
      {
        icon: 'inventory_2',
        title: 'Add Multiple Products',
        description: 'Add multiple products to quotation with quantities and details.',
        steps: [
          'Click "Add Item" button',
          'Search product catalogue',
          'Select products to add',
          'Set quantity for each product',
          'Add multiple products easily',
          'Unit price pulled automatically',
          'Or set custom pricing',
          'Line totals calculated automatically',
        ],
      },
      {
        icon: 'calculate',
        title: 'Pricing & Calculations',
        description: 'Automated calculations for totals, discounts, and taxes.',
        steps: [
          'Quantity × Unit Price = Line Total',
          'Apply line-item discounts',
          'Calculate subtotal (sum of lines)',
          'Apply overall discount (% or fixed)',
          'Calculate tax (VAT, GST)',
          'Grand Total = Subtotal - Discount + Tax',
          'All calculations automatic',
        ],
      },
      {
        icon: 'local_offer',
        title: 'Provide All Pricing Details',
        description: 'Add comprehensive pricing information for transparency.',
        steps: [
          'Set unit prices for each product',
          'Add discounts (per item or overall)',
          'Include tax rates and amounts',
          'Show subtotals and grand total',
          'Add pricing notes if needed',
          'Display currency clearly',
          'All pricing visible in XLSX',
        ],
      },
      {
        icon: 'receipt',
        title: 'Tax Configuration',
        description: 'Set up and apply taxes to quotations.',
        steps: [
          'Configure tax rate (VAT, GST, sales tax)',
          'Tax applied to subtotal',
          'Tax-inclusive or tax-exclusive pricing',
          'Tax amount shown separately',
          'Multiple tax rates supported',
          'Compliant with local tax regulations',
        ],
      },
      {
        icon: 'description',
        title: 'Terms & Conditions',
        description: 'Add payment terms, delivery terms, and conditions.',
        steps: [
          'Add payment terms (30 days, advance, etc.)',
          'Include delivery/shipping terms',
          'Add warranty information',
          'Include validity period',
          'Add custom terms and conditions',
          'Terms appear in XLSX footer',
        ],
      },
      {
        icon: 'file_download',
        title: 'Generate Fixed Branded XLSX',
        description: 'Create professional Excel quotation with company branding.',
        steps: [
          'Review all line items and pricing',
          'Click "Generate XLSX" button',
          'System creates branded Excel file',
          'Company logo and branding included',
          'Professional BOQ layout applied',
          'Download button appears instantly',
          'Click to download XLSX file',
          'Ready to share with client',
        ],
      },
      {
        icon: 'edit',
        title: 'Modify and Re-download',
        description: 'Edit quotations and regenerate XLSX files as needed.',
        steps: [
          'Open existing quotation',
          'Make changes to products or pricing',
          'Adjust quantities or discounts',
          'Update any details needed',
          'Click "Regenerate XLSX"',
          'Download updated file',
          'Can repeat as many times as needed',
          'All versions tracked in history',
        ],
      },
      {
        icon: 'content_copy',
        title: 'Duplicate Quotation',
        description: 'Create copies for similar projects.',
        steps: [
          'Click on quotation',
          'Select "Duplicate"',
          'All items and pricing copied',
          'New quotation number assigned',
          'Modify for new customer',
          'Saves time on similar quotes',
        ],
      },
      {
        icon: 'history',
        title: 'Version History',
        description: 'Track quotation revisions and changes.',
        steps: [
          'View all versions of quotation',
          'See what changed in each version',
          'Download previous versions',
          'Track revision dates',
          'Useful for audit trail',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is BOQ?',
        answer: 'BOQ (Bill of Quantities) is a detailed list of items with quantities, unit prices, and total costs. It\'s commonly used in construction, manufacturing, and B2B sales. Our system generates BOQ as professionally formatted XLSX files.',
      },
      {
        question: 'How do I create a quotation from an enquiry?',
        answer: 'Open the enquiry and click "Create Quotation". Products and quantities are pre-loaded. Set pricing, apply discounts, add terms, and generate XLSX. Much faster than manual creation.',
      },
      {
        question: 'Can I add custom line items not in the catalogue?',
        answer: 'Yes! When adding items, select "Custom Item" and enter description, quantity, and price manually. Useful for services, custom products, or one-off items not in your standard catalogue.',
      },
      {
        question: 'How do discounts work?',
        answer: 'Apply discounts per line item (e.g., 10% off a specific product) or to the entire quotation (e.g., 5% overall discount). Enter as percentage or fixed amount. The XLSX shows original price, discount, and final price.',
      },
      {
        question: 'What tax rates can I use?',
        answer: 'Configure tax rates in system settings (VAT, GST, sales tax, etc.). You can set different rates for different regions or product types. Tax is calculated on the subtotal after discounts.',
      },
      {
        question: 'Can I show prices in different currencies?',
        answer: 'Currency settings depend on your system configuration. You can typically set a default currency and optionally support multiple currencies. Contact your administrator for multi-currency setup.',
      },
      {
        question: 'How do I set quotation validity?',
        answer: 'Add a validity period when creating the quotation (e.g., "Valid for 30 days"). This appears in the XLSX and sets client expectations. After expiry, you can extend validity or create a new quotation.',
      },
      {
        question: 'What appears in the generated XLSX file?',
        answer: 'The XLSX includes: Company header with logo, quotation number and date, customer details, line items table (description, quantity, unit price, total), subtotal, discounts, tax, grand total, terms and conditions, and contact information.',
      },
      {
        question: 'Can I edit the XLSX after downloading?',
        answer: 'Yes! The XLSX is a standard Excel file. Open in Microsoft Excel, Google Sheets, or any compatible software to make additional edits. However, changes won\'t sync back to the system.',
      },
      {
        question: 'How do I track quotation versions?',
        answer: 'Each time you regenerate a quotation, a new version is created. View version history to see all revisions, what changed, and download previous versions. Useful for tracking negotiations.',
      },
      {
        question: 'Can I add images to quotations?',
        answer: 'Product images can be included if you enable that option. The XLSX shows small product thumbnails next to line items. This helps clients visualize what they\'re ordering.',
      },
      {
        question: 'What if I need to revise a quotation after sending?',
        answer: 'Open the quotation, make changes, and regenerate the XLSX. The system creates a new version. Download and send to the client with a note about the revision. Previous version remains in history.',
      },
      {
        question: 'How do I handle quantity-based pricing?',
        answer: 'Set different unit prices based on quantity tiers. For example, 1-10 units at $100, 11-50 at $90. You can manually adjust unit price per line item or set up pricing rules (contact administrator).',
      },
      {
        question: 'Can I add notes to line items?',
        answer: 'Yes! Add notes or specifications to each line item. These appear in the XLSX below the item description. Use for delivery notes, specifications, or special instructions.',
      },
      {
        question: 'How do I convert a quotation to an order?',
        answer: 'When a customer accepts, mark the quotation as "Accepted" and create an order in your order management system. Integration depends on your setup - contact administrator about automated order creation.',
      },
    ],
  },

  // Analytics screen specific trainer
  'analytics': {
    title: 'Quotations Analytics - Performance Metrics',
    description: 'Track enquiry conversion, quotation performance, revenue metrics, and sales pipeline analytics. Make data-driven decisions to improve conversion rates.',
    features: [
      {
        icon: 'dashboard',
        title: 'Overview Statistics',
        description: 'Get a snapshot of quotation module performance.',
        steps: [
          'View total enquiries received',
          'See quotations generated',
          'Track presentations created',
          'Monitor conversion rate',
          'View total quoted value',
          'All stats update in real-time',
        ],
      },
      {
        icon: 'trending_up',
        title: 'Conversion Metrics',
        description: 'Track how enquiries convert through the sales pipeline.',
        steps: [
          'Enquiry to quotation conversion rate',
          'Quotation to order conversion rate',
          'Win/loss ratio',
          'Average deal size',
          'Time to quote (response time)',
          'Identify bottlenecks',
        ],
      },
      {
        icon: 'attach_money',
        title: 'Revenue Analytics',
        description: 'Track quoted values and potential revenue.',
        steps: [
          'Total value of all quotations',
          'Won quotation value (revenue)',
          'Lost quotation value',
          'Pending quotation value (pipeline)',
          'Average quotation value',
          'Revenue trends over time',
        ],
      },
      {
        icon: 'schedule',
        title: 'Response Time Tracking',
        description: 'Monitor how quickly you respond to enquiries.',
        steps: [
          'Average response time',
          'Fastest and slowest responses',
          'Response time by team member',
          'Impact on conversion rates',
          'Set response time goals',
          'Improve customer satisfaction',
        ],
      },
      {
        icon: 'pie_chart',
        title: 'Status Distribution',
        description: 'Visualize enquiry and quotation status breakdown.',
        steps: [
          'New enquiries count',
          'Quoted enquiries count',
          'Won vs lost breakdown',
          'Pie chart visualization',
          'Identify where enquiries drop off',
          'Focus on improving weak areas',
        ],
      },
      {
        icon: 'show_chart',
        title: 'Trend Analysis',
        description: 'Track performance trends over time.',
        steps: [
          'Enquiries by month/week',
          'Quotations generated over time',
          'Conversion rate trends',
          'Revenue trends',
          'Seasonal patterns',
          'Compare time periods',
        ],
      },
      {
        icon: 'people',
        title: 'Team Performance',
        description: 'Analyze individual and team performance.',
        steps: [
          'Enquiries handled per person',
          'Quotations created per person',
          'Conversion rates by team member',
          'Response times by person',
          'Top performers',
          'Identify training needs',
        ],
      },
      {
        icon: 'inventory_2',
        title: 'Product Analytics',
        description: 'See which products are most quoted.',
        steps: [
          'Most quoted products',
          'Products with highest conversion',
          'Average quantities per product',
          'Product revenue contribution',
          'Identify popular products',
          'Stock planning insights',
        ],
      },
      {
        icon: 'flag',
        title: 'Win/Loss Analysis',
        description: 'Understand why quotations are won or lost.',
        steps: [
          'Win rate percentage',
          'Loss rate percentage',
          'Reasons for losses (if tracked)',
          'Win/loss by product category',
          'Win/loss by value range',
          'Improve win rates',
        ],
      },
      {
        icon: 'download',
        title: 'Export Reports',
        description: 'Download analytics data for external analysis.',
        steps: [
          'Click export button',
          'Choose report type',
          'Select date range',
          'Choose format (CSV, Excel, PDF)',
          'Download file',
          'Use for presentations or deeper analysis',
        ],
      },
    ],
    faqs: [
      {
        question: 'How is conversion rate calculated?',
        answer: 'Conversion rate = (Won Enquiries / Total Enquiries) × 100. For example, if you received 100 enquiries and won 25, your conversion rate is 25%. Higher conversion rates indicate effective sales processes.',
      },
      {
        question: 'What is a good conversion rate?',
        answer: 'It varies by industry. B2B typically sees 20-30%, B2C might be 1-5%. Compare your rate to your historical average and industry benchmarks. Focus on improving your own rate over time.',
      },
      {
        question: 'How do I improve response time?',
        answer: 'Set up email notifications for new enquiries, assign enquiries to team members, use templates for common responses, prioritize high-value enquiries, and track response time metrics to identify delays.',
      },
      {
        question: 'What does "quoted value" mean?',
        answer: 'Quoted value is the total amount of all quotations generated. It represents potential revenue if all quotations convert. Track this alongside win rate to forecast actual revenue.',
      },
      {
        question: 'How do I track why quotations are lost?',
        answer: 'When marking an enquiry as "Lost", add notes about the reason (price too high, chose competitor, no response, etc.). Analytics can then show loss reasons, helping you address common issues.',
      },
      {
        question: 'Can I see analytics by date range?',
        answer: 'Yes! Select custom date ranges to analyze specific periods. Compare this month vs last month, or this year vs last year. Identify seasonal trends and plan accordingly.',
      },
      {
        question: 'What is pipeline value?',
        answer: 'Pipeline value is the total of all pending quotations (not yet won or lost). It represents potential revenue in your sales pipeline. Monitor this to forecast future revenue.',
      },
      {
        question: 'How do I identify top-performing team members?',
        answer: 'View team performance metrics showing conversion rates, response times, and revenue per person. Top performers have high conversion rates and fast response times. Share best practices across the team.',
      },
      {
        question: 'Can I export analytics data?',
        answer: 'Yes! Export reports as CSV, Excel, or PDF. Choose the metrics and date range you need. Use exported data for presentations, deeper analysis in Excel, or integration with other systems.',
      },
      {
        question: 'How do I track seasonal trends?',
        answer: 'View trend charts showing enquiries and quotations by month. Look for patterns - do enquiries spike in certain months? Use this to plan staffing, inventory, and marketing campaigns.',
      },
      {
        question: 'What if my conversion rate is low?',
        answer: 'Analyze: Are you responding quickly? Are prices competitive? Is quotation quality good? Review lost quotations for patterns. Consider improving response time, pricing strategy, or quotation presentation.',
      },
      {
        question: 'How do I measure quotation quality?',
        answer: 'Track metrics like: Time to create quotation, accuracy (revisions needed), win rate per quotation type, and customer feedback. High-quality quotations have fewer revisions and higher win rates.',
      },
      {
        question: 'Can I see which products convert best?',
        answer: 'Yes! Product analytics show which products are most quoted and which have highest conversion rates. Focus marketing on high-converting products and investigate why others don\'t convert.',
      },
      {
        question: 'What is average deal size?',
        answer: 'Average deal size = Total Won Value / Number of Won Deals. This shows your typical order value. Track this over time - increasing deal size indicates upselling success or market shift.',
      },
      {
        question: 'How often should I review analytics?',
        answer: 'Review weekly for operational metrics (response time, pending enquiries) and monthly for strategic metrics (conversion rates, revenue trends). Set up dashboards for at-a-glance monitoring.',
      },
      {
        question: 'Can I set conversion rate goals?',
        answer: 'Set goals in your business planning. Track actual vs goal in analytics. If you\'re below goal, analyze why and implement improvements. Celebrate when you exceed goals and understand what worked.',
      },
    ],
  },
};
