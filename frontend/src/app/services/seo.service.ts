import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  author?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);

  updateSEO(data: SEOData) {
    // Update title
    if (data.title) {
      this.title.setTitle(data.title);
    }

    // Update meta tags
    this.updateMetaTag('description', data.description);
    this.updateMetaTag('keywords', data.keywords);
    this.updateMetaTag('author', data.author);

    // Open Graph tags
    this.updateMetaTag('og:title', data.title, 'property');
    this.updateMetaTag('og:description', data.description, 'property');
    this.updateMetaTag('og:image', data.image, 'property');
    this.updateMetaTag('og:url', data.url, 'property');
    this.updateMetaTag('og:type', data.type || 'website', 'property');
    this.updateMetaTag('og:site_name', data.siteName, 'property');

    // Twitter Card tags
    this.updateMetaTag('twitter:card', 'summary_large_image', 'name');
    this.updateMetaTag('twitter:title', data.title, 'name');
    this.updateMetaTag('twitter:description', data.description, 'name');
    this.updateMetaTag('twitter:image', data.image, 'name');
  }

  private updateMetaTag(name: string, content?: string, attribute: string = 'name') {
    if (content) {
      if (this.meta.getTag(`${attribute}="${name}"`)) {
        this.meta.updateTag({ [attribute]: name, content });
      } else {
        this.meta.addTag({ [attribute]: name, content });
      }
    }
  }

  generateStructuredData(type: string, data: any): string {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };
    return JSON.stringify(structuredData);
  }

  addStructuredData(structuredData: string) {
    if (typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = structuredData;
      document.head.appendChild(script);
    }
  }
}