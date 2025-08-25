import { Injectable } from '@angular/core';

export interface BrandConfig {
  brand: {
    name: string;
    logo: string;
    icon: string;
  };
  colors: {
    primary: string;
    accent: string;
    secondary: string;
  };
  app: {
    name: string;
    version: string;
    description: string;
    port: number;
    apiUrl: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BrandConfigService {
  private config: BrandConfig = {
    brand: {
      name: 'Beax RM',
      logo: '/config/assets/beax-rm/logo.png',
      icon: '/config/assets/beax-rm/icon.png'
    },
    colors: {
      primary: '#3B82F6',
      accent: '#F59E0B',
      secondary: '#6B7280'
    },
    app: {
      name: 'Beax Resource Manager',
      version: '1.0.0',
      description: 'Resource Management System',
      port: 4200,
      apiUrl: typeof window !== 'undefined' && window.location.hostname !== 'localhost' ?
        `http://${window.location.hostname}:3000/api` : 'http://localhost:3000/api'
    }
  };

  constructor() {
    this.loadConfigFromEnvironment();
  }

  private loadConfigFromEnvironment(): void {
    // Load configuration from environment variables set by start.js
    if (typeof window !== 'undefined' && (window as any).brandConfig) {
      this.config = (window as any).brandConfig;
    }
  }

  getBrandConfig(): BrandConfig {
    return this.config;
  }

  getConfig(): BrandConfig {
    return this.config;
  }

  getBrandName(): string {
    return this.config.brand.name;
  }

  getAppName(): string {
    return this.config.app.name;
  }

  getLogo(): string {
    return this.config.brand.logo;
  }

  getIcon(): string {
    return this.config.brand.icon;
  }

  getColors() {
    return this.config.colors;
  }

  getApiUrl(): string {
    return this.config.app.apiUrl;
  }

  getPrimaryColor(): string {
    return this.config.colors.primary;
  }
}