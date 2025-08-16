import { Injectable, inject } from '@angular/core';
import { BrandConfigService } from './brand-config.service';
import { SEOData } from './seo.service';

@Injectable({
  providedIn: 'root'
})
export class SeoConfigService {
  private brandConfig = inject(BrandConfigService);

  getPageSEO(page: string, customData?: Partial<SEOData>): SEOData {
    const brandName = this.brandConfig.getBrandName();
    const appDescription = this.brandConfig.getConfig().app.description;
    
    const baseConfig: SEOData = {
      siteName: brandName,
      author: 'Rohan Bhuri',
      image: this.brandConfig.getLogo(),
      url: window.location.href
    };

    const pageConfigs: Record<string, SEOData> = {
      home: {
        title: `${brandName} - ${appDescription}`,
        description: `${brandName} is a comprehensive resource management platform built with modern web technologies. Streamline your business operations with HR management, payroll, project tracking, CRM, and more.`,
        keywords: 'business management, resource management, HR management, payroll, project management, CRM, inventory management, Angular, NestJS',
        type: 'website'
      },
      login: {
        title: `Login - ${brandName}`,
        description: `Sign in to your ${brandName} account to access your business management dashboard and tools.`,
        keywords: 'login, sign in, authentication, business management, dashboard access'
      },
      signup: {
        title: `Sign Up - ${brandName}`,
        description: `Create your ${brandName} account to start managing your business operations with our comprehensive resource management platform.`,
        keywords: 'sign up, register, create account, business management, resource management'
      },
      dashboard: {
        title: `Dashboard - ${brandName}`,
        description: `Access your ${brandName} business management dashboard with real-time insights, module widgets, and comprehensive analytics.`,
        keywords: 'dashboard, business analytics, management dashboard, widgets, business insights'
      },
      modules: {
        title: `Modules - ${brandName}`,
        description: `Discover and activate business modules for ${brandName}. Manage HR, CRM, project management, inventory, and more with our comprehensive module system.`,
        keywords: 'business modules, module management, HR management, CRM, project management, inventory management, activate modules'
      },
      'user-management': {
        title: `User Management - ${brandName}`,
        description: `Manage users, roles, and permissions in ${brandName}. Create user accounts, assign roles, and control access to your business management system.`,
        keywords: 'user management, user roles, permissions, access control, user accounts'
      },
      crm: {
        title: `CRM - ${brandName}`,
        description: `Customer Relationship Management system for ${brandName}. Manage leads, contacts, deals, and customer interactions efficiently.`,
        keywords: 'CRM, customer relationship management, leads management, contacts, deals, sales pipeline'
      },
      '404': {
        title: `Page Not Found - ${brandName}`,
        description: `The page you're looking for doesn't exist. Return to ${brandName} homepage to continue using our business management platform.`,
        keywords: '404, page not found, error page'
      }
    };

    return {
      ...baseConfig,
      ...pageConfigs[page],
      ...customData
    };
  }

  getModuleSEO(moduleName: string, moduleDisplayName: string, moduleDescription?: string): SEOData {
    const brandName = this.brandConfig.getBrandName();
    
    return {
      title: `${moduleDisplayName} - ${brandName}`,
      description: moduleDescription || `${moduleDisplayName} module for ${brandName}. Comprehensive business management tools and features.`,
      keywords: `${moduleName}, ${moduleDisplayName.toLowerCase()}, business management, ${brandName.toLowerCase()}`,
      siteName: brandName,
      author: 'Rohan Bhuri',
      image: this.brandConfig.getLogo(),
      url: window.location.href
    };
  }
}