import { Injectable, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TRAINER_CONTENT } from './xrm-trainer-content';

// Import module-specific trainer content
// Add more module imports as they are created
let CMS_TRAINER_CONTENT: any = null;
try {
  CMS_TRAINER_CONTENT = require('../modules/cms/cms-trainer-content').CMS_TRAINER_CONTENT;
} catch (e) {
  // CMS trainer content not available
}

let USER_MANAGEMENT_TRAINER_CONTENT: any = null;
try {
  USER_MANAGEMENT_TRAINER_CONTENT = require('../modules/user-management/user-management-trainer-content').USER_MANAGEMENT_TRAINER_CONTENT;
} catch (e) {
  // User Management trainer content not available
}

let CLIENT_MANAGEMENT_TRAINER_CONTENT: any = null;
try {
  CLIENT_MANAGEMENT_TRAINER_CONTENT = require('../modules/client-management/client-management-trainer-content').CLIENT_MANAGEMENT_TRAINER_CONTENT;
} catch (e) {
  // Client Management trainer content not available
}

let CATALOGUE_TRAINER_CONTENT: any = null;
try {
  CATALOGUE_TRAINER_CONTENT = require('../modules/catalogue/catalogue-trainer-content').CATALOGUE_TRAINER_CONTENT;
} catch (e) {
  // Catalogue trainer content not available
}

let QUOTATIONS_TRAINER_CONTENT: any = null;
try {
  QUOTATIONS_TRAINER_CONTENT = require('../modules/quotations/quotations-trainer-content').QUOTATIONS_TRAINER_CONTENT;
} catch (e) {
  // Quotations trainer content not available
}

export interface TrainerContent {
  title: string;
  description: string;
  features: TrainerFeature[];
  faqs: TrainerFAQ[];
  cta?: TrainerCTA;
  relatedPages?: TrainerRelatedPage[];
}

export interface TrainerRelatedPage {
  key: string;
  label: string;
  icon: string;
}

export interface TrainerFeature {
  icon: string;
  title: string;
  description: string;
  steps?: string[];
}

export interface TrainerFAQ {
  question: string;
  answer: string;
}

export interface TrainerCTA {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon?: string;
  highlight?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class XrmTrainerService {
  isOpen = signal(false);
  currentContent = signal<TrainerContent | null>(null);
  availablePages = signal<TrainerRelatedPage[]>([]);
  currentPageKey = signal<string | null>(null);

  private contentMap: Map<string, TrainerContent> = new Map();

  constructor(private router: Router) {
    // Load core trainer content
    Object.entries(TRAINER_CONTENT).forEach(([route, content]) => {
      this.contentMap.set(route, content);
    });

    // Load module-specific trainer content
    if (CMS_TRAINER_CONTENT) {
      Object.entries(CMS_TRAINER_CONTENT).forEach(([route, content]: [string, any]) => {
        this.contentMap.set(route, content);
      });
    }

    if (USER_MANAGEMENT_TRAINER_CONTENT) {
      Object.entries(USER_MANAGEMENT_TRAINER_CONTENT).forEach(([route, content]: [string, any]) => {
        this.contentMap.set(route, content);
      });
    }

    if (CLIENT_MANAGEMENT_TRAINER_CONTENT) {
      Object.entries(CLIENT_MANAGEMENT_TRAINER_CONTENT).forEach(([route, content]: [string, any]) => {
        this.contentMap.set(route, content);
      });
    }

    if (CATALOGUE_TRAINER_CONTENT) {
      Object.entries(CATALOGUE_TRAINER_CONTENT).forEach(([route, content]: [string, any]) => {
        this.contentMap.set(route, content);
      });
    }

    if (QUOTATIONS_TRAINER_CONTENT) {
      Object.entries(QUOTATIONS_TRAINER_CONTENT).forEach(([route, content]: [string, any]) => {
        this.contentMap.set(route, content);
      });
    }

    // Update content when route changes (including query params)
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateContentForCurrentRoute();
      });

    // Initial content load
    this.updateContentForCurrentRoute();

    // Add keyboard shortcut (Ctrl/Cmd + ?)
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
          e.preventDefault();
          this.toggle();
        }
        // ESC to close
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      });
    }
  }

  toggle() {
    this.isOpen.update((value) => !value);
    // Update content when toggling open
    if (!this.isOpen()) {
      this.updateContentForCurrentRoute();
    }
  }

  open() {
    this.isOpen.set(true);
    // Update content when opening
    this.updateContentForCurrentRoute();
  }

  close() {
    this.isOpen.set(false);
  }

  private updateContentForCurrentRoute() {
    const currentUrl = this.router.url; // Keep query params for tab detection
    const content = this.findContentForRoute(currentUrl);
    this.currentContent.set(content);
    
    // Update available pages based on current route
    this.updateAvailablePages(currentUrl);
  }

  private updateAvailablePages(url: string) {
    const urlWithoutParams = url.split('?')[0];
    let pages: TrainerRelatedPage[] = [];
    
    // First, try to get related pages from the current content
    const content = this.currentContent();
    if (content?.relatedPages && content.relatedPages.length > 0) {
      pages = content.relatedPages;
    } else {
      // Fallback: Check if we're in a module with multiple pages
      if (urlWithoutParams.includes('/modules/catalogue')) {
        pages.push(
          { key: '/modules/catalogue', label: 'Overview', icon: 'home' },
          { key: 'products', label: 'Products', icon: 'inventory_2' },
          { key: 'categories', label: 'Categories', icon: 'category' },
          { key: 'collections', label: 'Collections', icon: 'collections' },
          { key: 'designers', label: 'Designers', icon: 'palette' },
          { key: 'technical-sheet-downloads', label: 'Technical Sheet Downloads', icon: 'download' },
          { key: 'analytics', label: 'Analytics', icon: 'analytics' }
        );
      } else if (urlWithoutParams.includes('/modules/cms')) {
        pages.push(
          { key: '/modules/cms', label: 'Overview', icon: 'home' },
          { key: 'blog', label: 'Blogs & Articles', icon: 'article' },
          { key: 'news', label: 'News & Media', icon: 'newspaper' },
          { key: 'analytics', label: 'Analytics', icon: 'analytics' }
        );
      } else if (urlWithoutParams.includes('/modules/client-management')) {
        pages.push(
          { key: '/modules/client-management', label: 'Overview', icon: 'home' },
          { key: 'requests', label: 'Login Credential Requests', icon: 'person_add' },
          { key: 'clients', label: 'Clients', icon: 'business' },
          { key: 'contacts', label: 'Contact Us Enquiries', icon: 'mail' },
          { key: 'analytics', label: 'Analytics', icon: 'analytics' }
        );
      } else if (urlWithoutParams.includes('/modules/quotations')) {
        pages.push(
          { key: '/modules/quotations', label: 'Overview', icon: 'home' },
          { key: 'quotations', label: 'Quotations', icon: 'description' },
          { key: 'templates', label: 'Templates', icon: 'content_copy' },
          { key: 'analytics', label: 'Analytics', icon: 'analytics' }
        );
      } else if (urlWithoutParams.includes('/modules/user-management')) {
        pages.push(
          { key: '/modules/user-management', label: 'Overview', icon: 'home' },
          { key: 'users', label: 'Users', icon: 'person' },
          { key: 'roles', label: 'Roles', icon: 'admin_panel_settings' },
          { key: 'permissions', label: 'Permissions', icon: 'lock' },
          { key: 'analytics', label: 'Analytics', icon: 'analytics' }
        );
      }
    }
    
    this.availablePages.set(pages);
    
    // Set current page key
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const tab = urlParams.get('tab');
    if (tab && pages.some(p => p.key === tab)) {
      this.currentPageKey.set(tab);
    } else if (pages.some(p => p.key === urlWithoutParams)) {
      this.currentPageKey.set(urlWithoutParams);
    } else if (pages.length > 0) {
      this.currentPageKey.set(pages[0].key);
    }
  }

  loadPage(pageKey: string) {
    const content = this.contentMap.get(pageKey);
    if (content) {
      this.currentContent.set(content);
      this.currentPageKey.set(pageKey);
      
      // Update available pages if the content has relatedPages
      if (content.relatedPages && content.relatedPages.length > 0) {
        this.availablePages.set(content.relatedPages);
      }
    }
  }

  private findContentForRoute(url: string): TrainerContent | null {
    const urlWithoutParams = url.split('?')[0]; // URL without query params for matching
    // Try exact match first
    if (this.contentMap.has(urlWithoutParams)) {
      return this.contentMap.get(urlWithoutParams)!;
    }

    // For CMS module, check for tab-specific content
    if (urlWithoutParams.includes('/modules/cms')) {
      const urlParams = new URLSearchParams(url.split('?')[1] || '');
      const tab = urlParams.get('tab');
      
      if (tab && this.contentMap.has(tab)) {
        return this.contentMap.get(tab)!;
      }
      
      // Default to CMS overview if no tab or tab not found
      if (this.contentMap.has('/modules/cms')) {
        return this.contentMap.get('/modules/cms')!;
      }
    }

    // For User Management module, check for screen-specific content
    if (urlWithoutParams.includes('/modules/user-management')) {
      // Extract the last segment as the screen name (users, roles, permissions, analytics)
      const segments = urlWithoutParams.split('/');
      const lastSegment = segments[segments.length - 1].split('?')[0];
      
      if (lastSegment && lastSegment !== 'user-management' && this.contentMap.has(lastSegment)) {
        return this.contentMap.get(lastSegment)!;
      }
      
      // Default to User Management overview
      if (this.contentMap.has('/modules/user-management')) {
        return this.contentMap.get('/modules/user-management')!;
      }
    }

    // For Client Management module, check for tab-specific content
    if (urlWithoutParams.includes('/modules/client-management')) {
      const urlParams = new URLSearchParams(url.split('?')[1] || '');
      const tab = urlParams.get('tab');
      
      if (tab && this.contentMap.has(tab)) {
        return this.contentMap.get(tab)!;
      }
      
      // Default to Client Management overview
      if (this.contentMap.has('/modules/client-management')) {
        return this.contentMap.get('/modules/client-management')!;
      }
    }

    // For Catalogue module, check for tab-specific content
    if (urlWithoutParams.includes('/modules/catalogue')) {
      const urlParams = new URLSearchParams(url.split('?')[1] || '');
      const tab = urlParams.get('tab');
      
      if (tab && this.contentMap.has(tab)) {
        return this.contentMap.get(tab)!;
      }
      
      // Default to Catalogue overview
      if (this.contentMap.has('/modules/catalogue')) {
        return this.contentMap.get('/modules/catalogue')!;
      }
    }

    // For Quotations module, check for tab-specific content
    if (urlWithoutParams.includes('/modules/quotations')) {
      const urlParams = new URLSearchParams(url.split('?')[1] || '');
      const tab = urlParams.get('tab');
      
      if (tab && this.contentMap.has(tab)) {
        return this.contentMap.get(tab)!;
      }
      
      // Default to Quotations overview
      if (this.contentMap.has('/modules/quotations')) {
        return this.contentMap.get('/modules/quotations')!;
      }
    }

    // Try partial match (for nested routes)
    for (const [route, content] of this.contentMap.entries()) {
      if (urlWithoutParams.startsWith(route)) {
        return content;
      }
    }

    // Return default content if no match
    return {
      title: 'XRM Trainer',
      description: 'Welcome to XRM! Navigate to different modules to see contextual help.',
      features: [
        {
          icon: 'help',
          title: 'Contextual Help',
          description: 'Get help specific to the page you\'re viewing.',
        },
        {
          icon: 'school',
          title: 'Module Training',
          description: 'Learn how to use each module effectively.',
        },
        {
          icon: 'question_answer',
          title: 'FAQs',
          description: 'Find answers to commonly asked questions.',
        },
      ],
      faqs: [
        {
          question: 'How does the trainer work?',
          answer: 'The trainer provides contextual help based on the page you\'re currently viewing.',
        },
      ],
    };
  }

  // Method to programmatically add content for new routes
  addContent(route: string, content: TrainerContent) {
    this.contentMap.set(route, content);
  }
}
