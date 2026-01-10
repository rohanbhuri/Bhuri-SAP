import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfig } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const brand = process.env.BRAND || 'beax-rm';
const brandConfig = getConfig(brand);

const templatePath = join(__dirname, 'src/index.template.html');
const indexPath = join(__dirname, 'src/index.html');
const manifestPath = join(__dirname, 'public/manifest.json');
const robotsPath = join(__dirname, 'public/robots.txt');
const swPath = join(__dirname, 'public/sw.js');
const sitemapPath = join(__dirname, 'public/sitemap.xml');

let indexContent = readFileSync(templatePath, 'utf8');
let manifestContent = readFileSync(manifestPath, 'utf8');
let robotsContent = readFileSync(robotsPath, 'utf8');
let swContent = readFileSync(swPath, 'utf8');
let sitemapContent = readFileSync(sitemapPath, 'utf8');

// Replace placeholders with config data
// Determine correct API URL based on environment
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    const ipMappings = {
      'beax-rm': '13.126.228.247:3000',
      'true-process': '3.111.139.181:3001',
      'raccontixrm': '68.178.171.103:3002'
    };
    const mapping = ipMappings[brand] || ipMappings['beax-rm'];
    return `http://${mapping}/api`;
  }
  return brandConfig.app.apiUrl;
};

const replacements = {
  '{{BRAND_NAME}}': brandConfig.brand.name,
  '{{BRAND_LOGO}}': brandConfig.brand.logo,
  '{{BRAND_LOGO_DARK}}': brandConfig.brand.logoDark,
  '{{BRAND_ICON}}': brandConfig.brand.icon,
  '{{PRIMARY_COLOR}}': brandConfig.colors.primary,
  '{{ACCENT_COLOR}}': brandConfig.colors.accent,
  '{{SECONDARY_COLOR}}': brandConfig.colors.secondary,
  '{{APP_NAME}}': brandConfig.app.name,
  '{{VERSION}}': brandConfig.app.version,
  '{{DESCRIPTION}}': brandConfig.app.description,
  '{{APP_PORT}}': brandConfig.app.port.toString(),
  '{{API_URL}}': getApiUrl(),
  '{{CANONICAL_URL}}': process.env.NODE_ENV === 'production'
    ? `http://${brand === 'raccontixrm' ? '68.178.171.103' : brand === 'true-process' ? '3.111.139.181' : '13.126.228.247'}:${brandConfig.app.port}`
    : `http://localhost:${brandConfig.app.port}`
};

Object.keys(replacements).forEach(placeholder => {
  const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
  indexContent = indexContent.replace(regex, replacements[placeholder]);
  manifestContent = manifestContent.replace(regex, replacements[placeholder]);
  robotsContent = robotsContent.replace(regex, replacements[placeholder]);
  swContent = swContent.replace(regex, replacements[placeholder]);
  sitemapContent = sitemapContent.replace(regex, replacements[placeholder]);
});

writeFileSync(indexPath, indexContent);
writeFileSync(manifestPath, manifestContent);
writeFileSync(robotsPath, robotsContent);
writeFileSync(swPath, swContent);
writeFileSync(sitemapPath, sitemapContent);
console.log(`Environment variables replaced for ${brand} (${process.env.NODE_ENV || 'development'})`);
console.log(`API URL: ${getApiUrl()}`);
console.log(`Canonical URL: ${replacements['{{CANONICAL_URL}}']}`);