/**
 * Catalogue Module Trainer Content
 * 
 * Comprehensive training content for the Catalogue module.
 * Covers: Products, Categories, Collections, Designers, Analytics
 */

import { TrainerContent } from '../../services/xrm-trainer.service';

export const CATALOGUE_TRAINER_CONTENT: Record<string, TrainerContent> = {
  '/modules/catalogue': {
    title: 'Catalogue Management - Overview',
    description: 'Complete product catalogue system for managing products, categories, collections, and designers. Organize inventory, track stock, and showcase your product range with powerful e-commerce tools.',
    relatedPages: [
      { key: '/modules/catalogue', label: 'Overview', icon: 'home' },
      { key: 'products', label: 'Products', icon: 'inventory_2' },
      { key: 'categories', label: 'Categories', icon: 'category' },
      { key: 'collections', label: 'Collections', icon: 'collections' },
      { key: 'designers', label: 'Designers', icon: 'palette' },
      { key: 'analytics', label: 'Analytics', icon: 'analytics' }
    ],
    features: [
      {
        icon: 'inventory_2',
        title: 'Product Management',
        description: 'Create and manage products with images, pricing, variants, and inventory tracking.',
        steps: [
          'Add products with details and specifications',
          'Upload product images and galleries',
          'Set pricing and manage variants (size, color)',
          'Track inventory and stock levels',
          'Bulk import/export products via CSV',
          'Organize with categories and collections',
        ],
      },
      {
        icon: 'category',
        title: 'Categories',
        description: 'Organize products into hierarchical categories for easy navigation and filtering.',
        steps: [
          'Create parent and child categories',
          'Build category hierarchies',
          'Add category images and descriptions',
          'Assign products to categories',
          'Manage category visibility',
          'Track products per category',
        ],
      },
      {
        icon: 'collections',
        title: 'Collections',
        description: 'Curate product collections for seasonal campaigns, promotions, and featured items.',
        steps: [
          'Create themed collections',
          'Add products to collections',
          'Set collection visibility and dates',
          'Feature collections on homepage',
          'Track collection performance',
        ],
      },
      {
        icon: 'palette',
        title: 'Designers',
        description: 'Manage designer profiles and associate products with designers or brands.',
        steps: [
          'Add designer profiles with bios',
          'Upload designer logos and images',
          'Link products to designers',
          'Showcase designer collections',
          'Track designer product counts',
        ],
      },
      {
        icon: 'upload_file',
        title: 'Bulk Import/Export',
        description: 'Efficiently manage large product catalogues with CSV import and export.',
        steps: [
          'Download CSV template',
          'Fill in product data in Excel',
          'Upload CSV to import products',
          'Export existing products to CSV',
          'Update products in bulk',
          'Validate data before import',
        ],
      },
      {
        icon: 'analytics',
        title: 'Catalogue Analytics',
        description: 'Track product performance, inventory levels, and catalogue growth metrics.',
        steps: [
          'View total products and categories',
          'Monitor stock levels and alerts',
          'Track top-performing products',
          'Analyze category distribution',
          'Review catalogue growth trends',
        ],
      },
      {
        icon: 'photo_library',
        title: 'Product Images',
        description: 'Manage product photography with galleries, zoom, and multiple angles.',
        steps: [
          'Upload multiple product images',
          'Set primary product image',
          'Reorder gallery images',
          'Add image alt text for SEO',
          'Support high-resolution images',
        ],
      },
      {
        icon: 'tune',
        title: 'Product Variants',
        description: 'Manage product variations like size, color, and material with separate pricing and stock.',
        steps: [
          'Define variant attributes (size, color)',
          'Create variant combinations',
          'Set individual variant pricing',
          'Track stock per variant',
          'Display variants on product pages',
        ],
      },
      {
        icon: 'local_offer',
        title: 'Pricing & Discounts',
        description: 'Set regular prices, sale prices, and manage promotional pricing.',
        steps: [
          'Set base product price',
          'Add sale/discount prices',
          'Schedule price changes',
          'Track price history',
          'Display original vs sale price',
        ],
      },
      {
        icon: 'inventory',
        title: 'Stock Management',
        description: 'Track inventory levels, set low stock alerts, and manage availability.',
        steps: [
          'Set stock quantities per product',
          'Enable/disable stock tracking',
          'Get low stock alerts',
          'Mark products as out of stock',
          'Track stock movements',
          'View stock analytics',
        ],
      },
    ],
    faqs: [
      {
        question: 'What\'s the difference between categories and collections?',
        answer: 'Categories are permanent organizational structures (e.g., "Dresses", "Shoes") that help customers browse. Collections are curated groups for campaigns or themes (e.g., "Summer 2024", "Best Sellers"). Products can be in multiple categories and collections.',
      },
      {
        question: 'How do I add a new product?',
        answer: 'Go to the Products tab, click "New Product", fill in product name, description, price, upload images, set category and designer, configure variants if needed, set stock quantity, and click "Save" or "Publish".',
      },
      {
        question: 'Can I import products in bulk?',
        answer: 'Yes! Download the CSV template from the Products tab, fill in your product data in Excel, then upload the CSV file. The system validates data and imports products in batch. Great for adding large catalogues quickly.',
      },
      {
        question: 'How do product variants work?',
        answer: 'Variants let you offer the same product in different options (size, color, material). Each variant can have its own price, SKU, and stock level. Customers select variants on the product page.',
      },
      {
        question: 'What image formats are supported?',
        answer: 'JPG, JPEG, PNG, and WebP formats are supported. For best results, use high-quality images (at least 1000x1000 pixels) with white or transparent backgrounds. Images are automatically optimized for web display.',
      },
      {
        question: 'How do I organize products into categories?',
        answer: 'Create categories in the Categories tab, then assign products to categories when creating or editing products. You can create parent categories (e.g., "Clothing") and child categories (e.g., "Dresses", "Tops") for hierarchical organization.',
      },
      {
        question: 'Can I feature products on the homepage?',
        answer: 'Yes! Mark products as "Featured" when editing them, or add them to a featured collection. Featured products and collections can be displayed prominently on your homepage and landing pages.',
      },
      {
        question: 'How does stock tracking work?',
        answer: 'Enable stock tracking for each product, set the quantity available, and the system automatically decrements stock when orders are placed. You\'ll receive low stock alerts when quantities fall below your threshold.',
      },
      {
        question: 'What are designers used for?',
        answer: 'Designers (or brands) let you organize products by creator or manufacturer. Add designer profiles with logos and bios, then link products to designers. Customers can browse products by designer.',
      },
      {
        question: 'Can I schedule products to go live later?',
        answer: 'Save products as drafts and publish manually when ready. Scheduled publishing is planned for a future update. Use the draft system to prepare products in advance for seasonal launches.',
      },
      {
        question: 'How do I set sale prices?',
        answer: 'When editing a product, add both regular price and sale price. The system displays the sale price prominently with the original price crossed out. You can also schedule when sale prices are active.',
      },
      {
        question: 'Can I export my product catalogue?',
        answer: 'Yes! Use the export button in the Products tab to download your entire catalogue as CSV. This includes all product details, pricing, stock, categories, and more. Useful for backups and external analysis.',
      },
      {
        question: 'What happens when a product is out of stock?',
        answer: 'Out of stock products are marked clearly on the website. You can choose to hide them or show them as "Out of Stock". Customers cannot purchase out of stock items. You\'ll receive alerts to restock.',
      },
      {
        question: 'How do I create a collection?',
        answer: 'Go to Collections tab, click "New Collection", enter name and description, upload collection image, select products to include, set visibility, and save. Collections are great for seasonal campaigns and promotions.',
      },
      {
        question: 'Can I duplicate products?',
        answer: 'Yes! Click on a product and select "Duplicate" from the menu. This copies all details, images, and settings to a new product. Useful for creating similar products or variants quickly.',
      },
    ],
  },

  // Products screen specific trainer
  'products': {
    title: 'Products - Inventory Management',
    description: 'Create, manage, and organize your product catalogue. Add products with images, pricing, variants, and inventory tracking. Bulk import/export for efficient catalogue management.',
    features: [
      {
        icon: 'add_circle',
        title: 'Create New Product',
        description: 'Add products to your catalogue with comprehensive details and specifications.',
        steps: [
          'Click "New Product" button in top-right',
          'Enter product name (required)',
          'Write detailed product description',
          'Add SKU (Stock Keeping Unit) for tracking',
          'Upload product images (primary + gallery)',
          'Set regular price and optional sale price',
          'Select category and designer',
          'Configure variants if applicable',
          'Set stock quantity and tracking',
          'Add tags for searchability',
          'Configure SEO metadata',
          'Save as draft or publish immediately',
        ],
      },
      {
        icon: 'edit',
        title: 'Edit Product Details',
        description: 'Update product information, pricing, images, and availability.',
        steps: [
          'Click on any product in the list',
          'Update name, description, or specifications',
          'Modify pricing and sale prices',
          'Add or remove images',
          'Change category or designer',
          'Update stock quantities',
          'Modify variants',
          'Click "Save Changes"',
          'Changes reflect immediately on website',
        ],
      },
      {
        icon: 'upload_file',
        title: 'Bulk Import Products',
        description: 'Import hundreds of products at once using CSV files.',
        steps: [
          'Click "Import" button',
          'Download CSV template',
          'Open template in Excel or Google Sheets',
          'Fill in product data (name, price, SKU, etc.)',
          'Save as CSV file',
          'Upload CSV file',
          'Review validation results',
          'Confirm import',
          'Products created automatically',
          'Check import log for any errors',
        ],
      },
      {
        icon: 'download',
        title: 'Export Products',
        description: 'Download your product catalogue as CSV for backup or external use.',
        steps: [
          'Click "Export" button',
          'Choose export format (CSV, Excel)',
          'Select fields to include',
          'Apply filters if needed (category, status)',
          'Download file',
          'Use for backups, analysis, or migration',
        ],
      },
      {
        icon: 'photo_library',
        title: 'Product Image Gallery',
        description: 'Manage product photos with multiple images and ordering.',
        steps: [
          'Upload primary product image (main photo)',
          'Add additional images to gallery',
          'Drag to reorder gallery images',
          'Set image alt text for SEO',
          'Delete unwanted images',
          'Images display in product page carousel',
          'Support for high-resolution images',
        ],
      },
      {
        icon: 'tune',
        title: 'Product Variants',
        description: 'Create product variations with different attributes and pricing.',
        steps: [
          'Enable variants for product',
          'Define variant attributes (Size, Color, Material)',
          'Add attribute values (S, M, L or Red, Blue)',
          'Create variant combinations',
          'Set price for each variant',
          'Set SKU for each variant',
          'Track stock per variant',
          'Customers select variants on product page',
        ],
      },
      {
        icon: 'inventory',
        title: 'Stock Management',
        description: 'Track inventory levels and manage product availability.',
        steps: [
          'Enable stock tracking for product',
          'Set initial stock quantity',
          'System decrements on orders',
          'Set low stock threshold',
          'Receive low stock alerts',
          'Mark as out of stock manually',
          'View stock history',
          'Restock and update quantities',
        ],
      },
      {
        icon: 'local_offer',
        title: 'Pricing & Sales',
        description: 'Set regular prices, sale prices, and manage promotional pricing.',
        steps: [
          'Enter regular price (required)',
          'Add sale price for discounts',
          'System calculates discount percentage',
          'Schedule sale start/end dates',
          'Display crossed-out original price',
          'Track price history',
          'Bulk update prices via CSV',
        ],
      },
      {
        icon: 'search',
        title: 'Search & Filter Products',
        description: 'Find products quickly with powerful search and filtering.',
        steps: [
          'Type in search box (name, SKU, description)',
          'Filter by category',
          'Filter by designer/brand',
          'Filter by status (published, draft, out of stock)',
          'Sort by name, price, or date',
          'Combine multiple filters',
          'Save filter presets',
        ],
      },
      {
        icon: 'content_copy',
        title: 'Duplicate Product',
        description: 'Create copies of existing products to save time.',
        steps: [
          'Click on product to duplicate',
          'Select "Duplicate" from menu',
          'All details copied to new product',
          'Modify name and SKU (must be unique)',
          'Adjust details as needed',
          'Save new product',
          'Great for creating similar products',
        ],
      },
    ],
    faqs: [
      {
        question: 'What information is required to create a product?',
        answer: 'Product name and price are required. SKU, description, images, category, and stock quantity are highly recommended. The more details you provide, the better the customer experience.',
      },
      {
        question: 'How do I upload product images?',
        answer: 'Click "Upload Image" in the product form. Select one image as primary (main photo), then add more to the gallery. Drag to reorder. Recommended size: 1000x1000px or larger. Formats: JPG, PNG, WebP.',
      },
      {
        question: 'What is a SKU and do I need one?',
        answer: 'SKU (Stock Keeping Unit) is a unique identifier for each product (e.g., "DRESS-001-BLK-M"). While optional, SKUs are essential for inventory management, order processing, and integration with other systems. We highly recommend using them.',
      },
      {
        question: 'How do I create product variants?',
        answer: 'When creating/editing a product, enable "Has Variants", define attributes (Size, Color), add values (S/M/L, Red/Blue), then create combinations. Each variant gets its own price, SKU, and stock level.',
      },
      {
        question: 'Can I import products from another platform?',
        answer: 'Yes! Export products from your old platform as CSV, then map the columns to our CSV template format. Upload the CSV to import. You may need to adjust column names and data format to match our template.',
      },
      {
        question: 'What happens when I import products?',
        answer: 'The system validates your CSV data (checks required fields, formats, duplicates), then creates products in batch. You\'ll see a summary of successful imports and any errors. Fix errors and re-import if needed.',
      },
      {
        question: 'How do I handle products with multiple sizes and colors?',
        answer: 'Use variants! Create a single product, enable variants, add Size attribute (S, M, L) and Color attribute (Red, Blue), then generate all combinations. Each combination (e.g., "Red - M") becomes a purchasable variant.',
      },
      {
        question: 'Can I set different prices for variants?',
        answer: 'Yes! Each variant can have its own price. For example, XL sizes might cost more, or premium colors might have higher prices. Set individual prices when creating variant combinations.',
      },
      {
        question: 'How do I mark a product as out of stock?',
        answer: 'Edit the product and set stock quantity to 0, or toggle the "Out of Stock" switch. Out of stock products show as unavailable on the website. Customers cannot purchase them until restocked.',
      },
      {
        question: 'Can I schedule sale prices?',
        answer: 'Yes! When setting a sale price, you can specify start and end dates. The sale price automatically activates and deactivates on those dates. Great for seasonal sales and promotions.',
      },
      {
        question: 'What\'s the best way to organize a large catalogue?',
        answer: 'Use a combination of categories (permanent structure), collections (seasonal/promotional), and tags (flexible keywords). Also use consistent SKU naming conventions and keep product data clean.',
      },
      {
        question: 'How do I update prices in bulk?',
        answer: 'Export products to CSV, update prices in Excel, then re-import. The system matches by SKU or product ID and updates existing products. You can also use the bulk edit feature for selected products.',
      },
      {
        question: 'Can I hide products without deleting them?',
        answer: 'Yes! Change product status to "Draft" or "Unpublished". The product remains in your catalogue but is hidden from the website. Useful for seasonal products or items being updated.',
      },
      {
        question: 'How do I add product specifications?',
        answer: 'Use the description field for detailed specifications, or add custom fields if available. You can format specifications as bullet points or tables in the rich text editor. Include dimensions, materials, care instructions, etc.',
      },
      {
        question: 'What if I make a mistake during import?',
        answer: 'The import process validates data first and shows errors before creating products. If products are created incorrectly, you can delete them and re-import, or export, fix in CSV, and re-import to update.',
      },
    ],
  },

  // Categories screen specific trainer
  'categories': {
    title: 'Categories - Product Organization',
    description: 'Create and manage product categories with hierarchical structure. Organize your catalogue for easy browsing and navigation.',
    features: [
      {
        icon: 'add_circle',
        title: 'Create Category',
        description: 'Add new categories to organize your product catalogue.',
        steps: [
          'Click "New Category" button',
          'Enter category name (required)',
          'Write category description',
          'Upload category image (optional)',
          'Select parent category (for subcategories)',
          'Set display order',
          'Configure visibility settings',
          'Add SEO metadata',
          'Click "Save"',
        ],
      },
      {
        icon: 'account_tree',
        title: 'Category Hierarchy',
        description: 'Build multi-level category structures with parent and child categories.',
        steps: [
          'Create parent categories (e.g., "Clothing")',
          'Create child categories (e.g., "Dresses", "Tops")',
          'Select parent when creating child',
          'Build up to 3-4 levels deep',
          'Drag to reorder categories',
          'View hierarchy in tree view',
          'Customers navigate through hierarchy',
        ],
      },
      {
        icon: 'edit',
        title: 'Edit Category',
        description: 'Update category details, images, and settings.',
        steps: [
          'Click on any category',
          'Update name or description',
          'Change category image',
          'Modify parent category',
          'Adjust display order',
          'Update visibility',
          'Save changes',
        ],
      },
      {
        icon: 'image',
        title: 'Category Images',
        description: 'Add visual appeal with category images and banners.',
        steps: [
          'Upload category image (square format)',
          'Image displays in category listings',
          'Optional banner image for category pages',
          'Recommended size: 500x500px',
          'Update or remove images anytime',
        ],
      },
      {
        icon: 'sort',
        title: 'Reorder Categories',
        description: 'Control the display order of categories on your website.',
        steps: [
          'Drag and drop to reorder',
          'Or set numeric order value',
          'Order applies to navigation menus',
          'Subcategories ordered within parent',
          'Changes reflect immediately',
        ],
      },
      {
        icon: 'visibility',
        title: 'Category Visibility',
        description: 'Control which categories are shown on the website.',
        steps: [
          'Toggle visibility on/off',
          'Hidden categories not shown to customers',
          'Products remain accessible via search',
          'Useful for seasonal categories',
          'Reactivate anytime',
        ],
      },
      {
        icon: 'inventory_2',
        title: 'Assign Products',
        description: 'Link products to categories for organization.',
        steps: [
          'Assign when creating/editing products',
          'Products can be in multiple categories',
          'View product count per category',
          'Bulk assign products to categories',
          'Remove products from categories',
        ],
      },
      {
        icon: 'public',
        title: 'Category SEO',
        description: 'Optimize category pages for search engines.',
        steps: [
          'Set SEO title and description',
          'Add meta keywords',
          'Configure URL slug',
          'Add structured data',
          'Improve search visibility',
        ],
      },
      {
        icon: 'delete',
        title: 'Delete Category',
        description: 'Remove unused categories from your catalogue.',
        steps: [
          'Click on category',
          'Select "Delete" from menu',
          'Cannot delete if products assigned',
          'Reassign products first',
          'Confirm deletion',
          'Subcategories also deleted',
        ],
      },
      {
        icon: 'search',
        title: 'Search Categories',
        description: 'Find categories quickly by name.',
        steps: [
          'Type in search box',
          'Results filter instantly',
          'Search includes subcategories',
          'Clear to see all',
        ],
      },
    ],
    faqs: [
      {
        question: 'What\'s the difference between parent and child categories?',
        answer: 'Parent categories are top-level (e.g., "Clothing", "Accessories"). Child categories are subcategories under parents (e.g., "Dresses" under "Clothing"). This creates a browsable hierarchy for customers.',
      },
      {
        question: 'How many category levels can I create?',
        answer: 'You can create up to 3-4 levels deep (e.g., Clothing > Women > Dresses > Evening Dresses). However, we recommend keeping it to 2-3 levels for better user experience and navigation.',
      },
      {
        question: 'Can a product be in multiple categories?',
        answer: 'Yes! Products can belong to multiple categories. For example, a "Red Summer Dress" could be in both "Dresses" and "Summer Collection". This improves discoverability.',
      },
      {
        question: 'How do I reorder categories?',
        answer: 'Drag and drop categories to reorder them, or set a numeric order value. The order determines how categories appear in navigation menus and category listings on your website.',
      },
      {
        question: 'What happens to products when I delete a category?',
        answer: 'You cannot delete a category that has products assigned. First reassign those products to other categories or remove the category assignment, then you can delete the category.',
      },
      {
        question: 'Should I add images to categories?',
        answer: 'Yes! Category images make your website more visual and engaging. They appear in category grids and help customers quickly identify what they\'re looking for. Use high-quality, representative images.',
      },
      {
        question: 'How do I create a subcategory?',
        answer: 'Click "New Category", enter the name, then select a parent category from the dropdown. The new category becomes a child of the selected parent. You can change the parent later if needed.',
      },
      {
        question: 'Can I hide a category temporarily?',
        answer: 'Yes! Toggle the visibility setting to hide a category without deleting it. Hidden categories don\'t appear on the website but products remain accessible via search. Great for seasonal categories.',
      },
      {
        question: 'How do I optimize categories for SEO?',
        answer: 'Add descriptive SEO titles and meta descriptions, use keyword-rich category names, create unique descriptions, add alt text to images, and use clean URL slugs. Good category SEO improves search rankings.',
      },
      {
        question: 'What\'s a good category structure?',
        answer: 'Keep it simple and logical. Start with broad parent categories (5-10), then add specific subcategories as needed. Think about how customers browse. Example: Clothing > Women > Dresses > Casual Dresses.',
      },
      {
        question: 'Can I move a category to a different parent?',
        answer: 'Yes! Edit the category and change the parent category selection. All subcategories move with it. This lets you reorganize your category structure as your catalogue grows.',
      },
      {
        question: 'How do I see which products are in a category?',
        answer: 'Click on the category to view details, then see the product count and list. You can also filter products by category in the Products tab to see all products in that category.',
      },
      {
        question: 'Should I use categories or collections?',
        answer: 'Use both! Categories are permanent organizational structures (Dresses, Shoes). Collections are temporary or promotional groups (Summer Sale, New Arrivals). Categories help browsing, collections drive campaigns.',
      },
      {
        question: 'Can I import categories via CSV?',
        answer: 'Category import depends on your system configuration. Contact your administrator. For small numbers, manual creation is quick. For large hierarchies, CSV import or API integration may be available.',
      },
      {
        question: 'What if I have too many categories?',
        answer: 'Consolidate similar categories, use subcategories to group related items, or consider using tags/filters instead. Too many categories can overwhelm customers. Aim for 5-15 top-level categories.',
      },
    ],
  },

  // Collections screen specific trainer
  'collections': {
    title: 'Collections - Curated Product Groups',
    description: 'Create themed collections for seasonal campaigns, promotions, and featured products. Showcase curated product selections to drive sales.',
    features: [
      {
        icon: 'add_circle',
        title: 'Create Collection',
        description: 'Build curated product collections for campaigns and promotions.',
        steps: [
          'Click "New Collection" button',
          'Enter collection name (e.g., "Summer 2024")',
          'Write compelling description',
          'Upload collection banner image',
          'Select products to include',
          'Set display order for products',
          'Configure visibility and dates',
          'Mark as featured (optional)',
          'Add SEO metadata',
          'Click "Save" or "Publish"',
        ],
      },
      {
        icon: 'inventory_2',
        title: 'Add Products to Collection',
        description: 'Select and organize products within collections.',
        steps: [
          'Open collection details',
          'Click "Add Products" button',
          'Search or browse products',
          'Select multiple products',
          'Drag to reorder products',
          'Remove products as needed',
          'Save changes',
        ],
      },
      {
        icon: 'edit',
        title: 'Edit Collection',
        description: 'Update collection details, products, and settings.',
        steps: [
          'Click on any collection',
          'Update name or description',
          'Change banner image',
          'Add or remove products',
          'Modify visibility settings',
          'Update featured status',
          'Save changes',
        ],
      },
      {
        icon: 'star',
        title: 'Featured Collections',
        description: 'Highlight important collections on homepage and landing pages.',
        steps: [
          'Check "Featured" when editing collection',
          'Featured collections appear prominently',
          'Displayed on homepage',
          'Tracked in analytics',
          'Multiple collections can be featured',
          'Uncheck to remove featured status',
        ],
      },
      {
        icon: 'schedule',
        title: 'Schedule Collections',
        description: 'Set start and end dates for seasonal or time-limited collections.',
        steps: [
          'Set start date (when collection goes live)',
          'Set end date (when collection expires)',
          'Collection auto-activates on start date',
          'Auto-hides after end date',
          'Great for seasonal campaigns',
          'Extend dates as needed',
        ],
      },
      {
        icon: 'image',
        title: 'Collection Banners',
        description: 'Add eye-catching banner images to collection pages.',
        steps: [
          'Upload banner image (wide format)',
          'Recommended size: 1920x600px',
          'Banner displays on collection page',
          'Update for seasonal themes',
          'Remove or replace anytime',
        ],
      },
      {
        icon: 'sort',
        title: 'Order Products',
        description: 'Control the order products appear within collections.',
        steps: [
          'Drag and drop products to reorder',
          'Or set numeric order values',
          'Feature best products first',
          'Order affects collection page display',
          'Update order anytime',
        ],
      },
      {
        icon: 'visibility',
        title: 'Collection Visibility',
        description: 'Control when and where collections are displayed.',
        steps: [
          'Toggle visibility on/off',
          'Hidden collections not shown to customers',
          'Use for draft collections',
          'Schedule with start/end dates',
          'Reactivate anytime',
        ],
      },
      {
        icon: 'public',
        title: 'Collection SEO',
        description: 'Optimize collection pages for search engines.',
        steps: [
          'Set SEO title and description',
          'Add relevant keywords',
          'Configure URL slug',
          'Add OG image for social sharing',
          'Improve search visibility',
        ],
      },
      {
        icon: 'delete',
        title: 'Delete Collection',
        description: 'Remove old or unused collections.',
        steps: [
          'Click on collection',
          'Select "Delete" from menu',
          'Confirm deletion',
          'Products remain in catalogue',
          'Only collection grouping is removed',
        ],
      },
    ],
    faqs: [
      {
        question: 'What\'s the difference between collections and categories?',
        answer: 'Categories are permanent organizational structures (Dresses, Shoes) for browsing. Collections are curated groups for campaigns (Summer Sale, New Arrivals). Use categories for structure, collections for marketing.',
      },
      {
        question: 'How do I create a seasonal collection?',
        answer: 'Click "New Collection", name it (e.g., "Fall 2024"), add seasonal products, upload a themed banner, set start/end dates for the season, mark as featured, and publish. Update products throughout the season.',
      },
      {
        question: 'Can a product be in multiple collections?',
        answer: 'Yes! Products can belong to multiple collections. For example, a dress could be in "New Arrivals", "Summer Collection", and "Best Sellers" simultaneously. This increases product visibility.',
      },
      {
        question: 'How do I feature a collection on the homepage?',
        answer: 'Edit the collection and check the "Featured" checkbox. Featured collections appear in the homepage collections section. You can feature multiple collections and control their display order.',
      },
      {
        question: 'Can I schedule collections to go live automatically?',
        answer: 'Yes! Set start and end dates when creating/editing a collection. The collection automatically becomes visible on the start date and hides after the end date. Perfect for seasonal campaigns.',
      },
      {
        question: 'What\'s a good banner image size?',
        answer: 'We recommend 1920x600 pixels for collection banners (wide format). This displays well on desktop and mobile. Use high-quality images that represent the collection theme. JPG or PNG format.',
      },
      {
        question: 'How many products should be in a collection?',
        answer: 'It varies by purpose. "New Arrivals" might have 20-50 products. "Best Sellers" might have 10-20. "Seasonal" collections could have 50-100+. Keep it focused and curated for best results.',
      },
      {
        question: 'Can I reorder products within a collection?',
        answer: 'Yes! Drag and drop products to reorder them, or set numeric order values. Feature your best or newest products first. The order determines how products appear on the collection page.',
      },
      {
        question: 'How do I create a "Best Sellers" collection?',
        answer: 'Create a new collection named "Best Sellers", manually add your top-performing products, or use analytics to identify them. Update regularly based on sales data. Mark as featured for homepage display.',
      },
      {
        question: 'What happens when a collection expires?',
        answer: 'When the end date passes, the collection automatically becomes hidden from the website. Products remain in your catalogue. You can extend the dates or delete the collection if no longer needed.',
      },
      {
        question: 'Can I duplicate a collection?',
        answer: 'Yes! Click on a collection and select "Duplicate". This copies the name, description, and products to a new collection. Useful for creating similar collections or seasonal variations.',
      },
      {
        question: 'How do I promote a collection?',
        answer: 'Mark as featured for homepage display, share the collection URL on social media, create email campaigns linking to it, add collection banners to your site, and optimize SEO for search visibility.',
      },
      {
        question: 'Should I delete old collections?',
        answer: 'You can delete expired seasonal collections or keep them for reference. Hidden collections don\'t affect performance. Consider keeping historical collections for analytics and future planning.',
      },
      {
        question: 'Can I add products to collections in bulk?',
        answer: 'Yes! When editing a collection, use the "Add Products" feature to select multiple products at once. You can also filter products by category or tag to quickly add related items.',
      },
      {
        question: 'How do I track collection performance?',
        answer: 'View collection analytics to see views, clicks, and conversions. Track which collections drive the most sales. Use this data to optimize future collections and product selection.',
      },
    ],
  },

  // Designers screen specific trainer
  'designers': {
    title: 'Designers - Brand Management',
    description: 'Manage designer and brand profiles. Associate products with designers, showcase designer collections, and build brand presence.',
    features: [
      {
        icon: 'add_circle',
        title: 'Create Designer Profile',
        description: 'Add designer or brand profiles to your catalogue.',
        steps: [
          'Click "New Designer" button',
          'Enter designer/brand name (required)',
          'Write designer bio or brand story',
          'Upload designer logo',
          'Add profile image or photo',
          'Enter website URL (optional)',
          'Add social media links',
          'Set display order',
          'Click "Save"',
        ],
      },
      {
        icon: 'edit',
        title: 'Edit Designer',
        description: 'Update designer information, images, and details.',
        steps: [
          'Click on any designer',
          'Update name or bio',
          'Change logo or profile image',
          'Modify website and social links',
          'Update visibility settings',
          'Save changes',
        ],
      },
      {
        icon: 'image',
        title: 'Designer Logo & Images',
        description: 'Add visual branding with logos and profile images.',
        steps: [
          'Upload designer logo (square format)',
          'Recommended size: 300x300px',
          'Add profile/banner image (optional)',
          'Logo displays on product pages',
          'Images appear on designer page',
          'Update for rebranding',
        ],
      },
      {
        icon: 'inventory_2',
        title: 'Assign Products',
        description: 'Link products to designers or brands.',
        steps: [
          'Assign when creating/editing products',
          'Select designer from dropdown',
          'Products can have one designer',
          'View product count per designer',
          'Bulk assign products to designers',
          'Change designer assignment anytime',
        ],
      },
      {
        icon: 'description',
        title: 'Designer Bio',
        description: 'Tell the designer\'s story with rich text bios.',
        steps: [
          'Write compelling designer bio',
          'Include brand history and values',
          'Add achievements and awards',
          'Use rich text formatting',
          'Keep it engaging and authentic',
          'Update for new milestones',
        ],
      },
      {
        icon: 'link',
        title: 'Social Media Links',
        description: 'Connect designer profiles to social media and websites.',
        steps: [
          'Add website URL',
          'Add Instagram handle',
          'Add Facebook page',
          'Add other social links',
          'Links display on designer page',
          'Customers can follow designers',
        ],
      },
      {
        icon: 'star',
        title: 'Featured Designers',
        description: 'Highlight key designers on your website.',
        steps: [
          'Mark designer as featured',
          'Featured designers appear prominently',
          'Displayed on homepage or designer page',
          'Multiple designers can be featured',
          'Rotate featured designers seasonally',
        ],
      },
      {
        icon: 'sort',
        title: 'Order Designers',
        description: 'Control display order of designers on your website.',
        steps: [
          'Drag and drop to reorder',
          'Or set numeric order values',
          'Order affects designer listings',
          'Feature top designers first',
          'Update order anytime',
        ],
      },
      {
        icon: 'visibility',
        title: 'Designer Visibility',
        description: 'Control which designers are shown on the website.',
        steps: [
          'Toggle visibility on/off',
          'Hidden designers not shown to customers',
          'Products remain visible',
          'Useful for inactive designers',
          'Reactivate anytime',
        ],
      },
      {
        icon: 'delete',
        title: 'Delete Designer',
        description: 'Remove designer profiles from the system.',
        steps: [
          'Click on designer',
          'Select "Delete" from menu',
          'Cannot delete if products assigned',
          'Reassign products first',
          'Confirm deletion',
        ],
      },
    ],
    faqs: [
      {
        question: 'What\'s the difference between designers and brands?',
        answer: 'In this system, they\'re the same! Use "Designers" for individual designers or brand names. Whether you sell designer fashion or branded products, this feature organizes products by creator/manufacturer.',
      },
      {
        question: 'How do I add a designer to a product?',
        answer: 'When creating or editing a product, select the designer from the "Designer" dropdown. Each product can have one designer. If you need multiple designers per product, contact your administrator.',
      },
      {
        question: 'Can customers browse products by designer?',
        answer: 'Yes! Customers can click on a designer name to see all products from that designer. Designer pages show the logo, bio, and product collection. Great for brand-focused shopping.',
      },
      {
        question: 'What should I include in a designer bio?',
        answer: 'Include brand story, design philosophy, achievements, years in business, and what makes them unique. Keep it 2-3 paragraphs. Make it engaging and authentic. Update for major milestones.',
      },
      {
        question: 'What\'s a good logo size?',
        answer: 'We recommend 300x300 pixels (square format) for designer logos. Use PNG with transparent background for best results. Logos appear on product pages and designer listings.',
      },
      {
        question: 'Can I feature multiple designers?',
        answer: 'Yes! Mark multiple designers as featured. Featured designers appear in a special section on your homepage or designer page. Rotate featured designers seasonally or for promotions.',
      },
      {
        question: 'How do I hide a designer without deleting?',
        answer: 'Toggle the visibility setting to hide a designer. Hidden designers don\'t appear on the website, but their products remain visible. Useful for inactive designers or temporary removal.',
      },
      {
        question: 'Can I add social media links?',
        answer: 'Yes! Add Instagram, Facebook, Twitter, and website URLs to designer profiles. These links appear on designer pages, allowing customers to follow and connect with designers.',
      },
      {
        question: 'What if I delete a designer with products?',
        answer: 'You cannot delete a designer that has products assigned. First reassign those products to another designer or remove the designer assignment, then you can delete the designer profile.',
      },
      {
        question: 'How do I showcase a designer collection?',
        answer: 'Create a collection named after the designer (e.g., "Gucci Collection"), add all products from that designer, add a banner image, mark as featured, and promote it. Great for designer spotlights.',
      },
      {
        question: 'Can I import designers via CSV?',
        answer: 'Designer import depends on your system configuration. For small numbers, manual creation is quick. For large designer lists, contact your administrator about CSV import or API integration.',
      },
      {
        question: 'How do I reorder designers?',
        answer: 'Drag and drop designers to reorder them, or set numeric order values. The order determines how designers appear in listings. Feature your top or exclusive designers first.',
      },
      {
        question: 'Should I add all brands or just featured ones?',
        answer: 'Add all brands you carry for complete organization. Mark key brands as featured for homepage display. This gives customers multiple ways to browse - by category, collection, or designer.',
      },
      {
        question: 'Can I track designer performance?',
        answer: 'View designer analytics to see product counts and sales per designer. Track which designers are most popular. Use this data to inform purchasing and marketing decisions.',
      },
      {
        question: 'What if a designer changes their name or rebrands?',
        answer: 'Edit the designer profile and update the name, logo, and bio. All product associations are preserved. The updated branding appears immediately across the website.',
      },
    ],
  },

  // Analytics screen specific trainer
  'analytics': {
    title: 'Catalogue Analytics - Performance Insights',
    description: 'Track catalogue performance with comprehensive analytics. Monitor products, categories, collections, stock levels, and growth trends.',
    features: [
      {
        icon: 'dashboard',
        title: 'Overview Statistics',
        description: 'Get a snapshot of your entire catalogue with key metrics.',
        steps: [
          'View total products count',
          'See published vs draft products',
          'Track total categories',
          'Monitor active collections',
          'View designer count',
          'All stats update in real-time',
        ],
      },
      {
        icon: 'trending_up',
        title: 'Top Products',
        description: 'Identify best-performing products by views, sales, or revenue.',
        steps: [
          'View top 10 products',
          'Sort by views, sales, or revenue',
          'See product images and names',
          'Track performance trends',
          'Click to view product details',
          'Use data for inventory decisions',
        ],
      },
      {
        icon: 'category',
        title: 'Category Distribution',
        description: 'Analyze product distribution across categories.',
        steps: [
          'View products per category',
          'See category percentages',
          'Identify over/under-stocked categories',
          'Visual chart display',
          'Track category growth',
          'Balance catalogue distribution',
        ],
      },
      {
        icon: 'inventory',
        title: 'Stock Levels',
        description: 'Monitor inventory levels and identify stock issues.',
        steps: [
          'View total stock quantity',
          'See low stock alerts',
          'Identify out of stock products',
          'Track stock value',
          'Get restock recommendations',
          'Export stock reports',
        ],
      },
      {
        icon: 'show_chart',
        title: 'Growth Trends',
        description: 'Track catalogue growth over time with trend analysis.',
        steps: [
          'View products added by month',
          'Track category creation trends',
          'Monitor collection activity',
          'See growth charts',
          'Compare periods',
          'Identify seasonal patterns',
        ],
      },
      {
        icon: 'collections',
        title: 'Collection Performance',
        description: 'Track which collections drive the most engagement and sales.',
        steps: [
          'View collection views and clicks',
          'Track conversion rates',
          'See top-performing collections',
          'Monitor featured collection impact',
          'Compare collection effectiveness',
          'Optimize future collections',
        ],
      },
      {
        icon: 'palette',
        title: 'Designer Analytics',
        description: 'Analyze product distribution and performance by designer.',
        steps: [
          'View products per designer',
          'Track designer sales',
          'See top designers',
          'Monitor designer growth',
          'Identify trending designers',
          'Make purchasing decisions',
        ],
      },
      {
        icon: 'local_offer',
        title: 'Pricing Analytics',
        description: 'Analyze pricing distribution and discount effectiveness.',
        steps: [
          'View average product price',
          'See price range distribution',
          'Track products on sale',
          'Monitor discount percentages',
          'Analyze pricing strategy',
          'Optimize pricing tiers',
        ],
      },
      {
        icon: 'search',
        title: 'Search Analytics',
        description: 'Understand what customers search for in your catalogue.',
        steps: [
          'View top search terms',
          'See zero-result searches',
          'Track search trends',
          'Identify missing products',
          'Optimize product titles and tags',
          'Improve discoverability',
        ],
      },
      {
        icon: 'download',
        title: 'Export Reports',
        description: 'Download analytics data for external analysis and reporting.',
        steps: [
          'Click export button',
          'Choose report type',
          'Select date range',
          'Choose format (CSV, Excel, PDF)',
          'Download file',
          'Use for presentations or analysis',
        ],
      },
    ],
    faqs: [
      {
        question: 'How often do analytics update?',
        answer: 'Analytics update in real-time for most metrics. Some complex calculations (like trends) may update hourly or daily. Refresh the page to see the latest data.',
      },
      {
        question: 'What does "top products" mean?',
        answer: 'Top products are ranked by views, sales, or revenue depending on your selection. These are your best-performing products. Use this data to identify winners and inform inventory decisions.',
      },
      {
        question: 'How do I identify products to restock?',
        answer: 'Check the "Low Stock" section in analytics. Products below your threshold appear here. Also review "Top Products" - if best sellers are low on stock, prioritize restocking them.',
      },
      {
        question: 'What if I have too many products in one category?',
        answer: 'Category distribution shows imbalances. If one category dominates, consider creating subcategories, adding products to other categories, or creating collections to diversify your catalogue.',
      },
      {
        question: 'Can I see historical trends?',
        answer: 'Yes! Growth trends show historical data by month. You can compare different time periods to see how your catalogue has grown and identify seasonal patterns.',
      },
      {
        question: 'How do I track collection effectiveness?',
        answer: 'Collection performance shows views, clicks, and conversion rates. Compare featured vs non-featured collections. Use this data to optimize which collections to promote.',
      },
      {
        question: 'What are zero-result searches?',
        answer: 'These are search terms customers used that returned no products. Review these to identify missing products, improve product titles/tags, or add new products to meet demand.',
      },
      {
        question: 'How do I export analytics data?',
        answer: 'Click the export button, select the report type (products, categories, collections), choose date range and format, then download. Use for presentations, external analysis, or record keeping.',
      },
      {
        question: 'What\'s a good category distribution?',
        answer: 'It depends on your business. Aim for balance - no single category should dominate unless that\'s your focus. If one category has 80% of products, consider expanding other categories or creating subcategories.',
      },
      {
        question: 'How do I use pricing analytics?',
        answer: 'Review average prices and distribution to ensure competitive pricing. Track discount effectiveness - are sale products converting better? Use this to optimize pricing strategy and promotional tactics.',
      },
      {
        question: 'Can I compare different time periods?',
        answer: 'Yes! Most analytics allow date range selection. Compare this month vs last month, or this year vs last year. Identify trends, seasonal patterns, and growth rates.',
      },
      {
        question: 'What if my top products are out of stock?',
        answer: 'This is critical! Prioritize restocking top performers immediately. Consider increasing stock levels for these products. Lost sales on best sellers significantly impact revenue.',
      },
      {
        question: 'How do I identify trending designers?',
        answer: 'Designer analytics show sales and growth trends. Look for designers with increasing sales or high conversion rates. Feature trending designers and consider expanding their product lines.',
      },
      {
        question: 'What should I do with low-performing products?',
        answer: 'Review products with low views or sales. Consider improving images, descriptions, or pricing. Try featuring them in collections. If they consistently underperform, consider discontinuing or discounting.',
      },
      {
        question: 'How do I track catalogue growth?',
        answer: 'Growth trends show products added over time. Track monthly additions to ensure consistent catalogue expansion. Identify slow periods and plan product launches accordingly.',
      },
      {
        question: 'Can I see which products need better SEO?',
        answer: 'Products with low views despite being in stock may need SEO improvement. Review their titles, descriptions, and tags. Check if they appear in zero-result searches - this indicates missing keywords.',
      },
    ],
  },
};
