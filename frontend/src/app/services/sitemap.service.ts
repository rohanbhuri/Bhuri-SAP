import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SitemapService {
  
  generateSitemap(baseUrl: string = 'http://localhost:4200'): string {
    const routes = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/login', priority: '0.8', changefreq: 'monthly' },
      { url: '/signup', priority: '0.8', changefreq: 'monthly' },
      { url: '/dashboard', priority: '0.9', changefreq: 'daily' },
      { url: '/modules', priority: '0.9', changefreq: 'weekly' },
      { url: '/modules/user-management', priority: '0.7', changefreq: 'weekly' },
      { url: '/modules/crm', priority: '0.7', changefreq: 'weekly' }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`;

    return sitemap;
  }

  generateRobotsTxt(baseUrl: string = 'http://localhost:4200'): string {
    return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;
  }
}