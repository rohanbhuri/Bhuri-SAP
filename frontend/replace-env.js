import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfig } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const brand = process.env.BRAND || 'beax-rm';
const brandConfig = getConfig(brand);

const indexPath = join(__dirname, 'src/index.html');
let indexContent = readFileSync(indexPath, 'utf8');

// Replace placeholders with config data
const replacements = {
  '{{BRAND_NAME}}': brandConfig.brand.name,
  '{{BRAND_LOGO}}': brandConfig.brand.logo,
  '{{BRAND_ICON}}': brandConfig.brand.icon,
  '{{PRIMARY_COLOR}}': brandConfig.colors.primary,
  '{{ACCENT_COLOR}}': brandConfig.colors.accent,
  '{{SECONDARY_COLOR}}': brandConfig.colors.secondary,
  '{{APP_NAME}}': brandConfig.app.name,
  '{{VERSION}}': brandConfig.app.version,
  '{{DESCRIPTION}}': brandConfig.app.description,
  '{{APP_PORT}}': brandConfig.app.port.toString(),
  '{{API_URL}}': brandConfig.app.apiUrl,
  '{{CANONICAL_URL}}': process.env.NODE_ENV === 'production' ? `http://13.126.228.247:${brandConfig.app.port}` : `http://localhost:${brandConfig.app.port}`
};

Object.keys(replacements).forEach(placeholder => {
  const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
  indexContent = indexContent.replace(regex, replacements[placeholder]);
});

writeFileSync(indexPath, indexContent);
console.log('Environment variables replaced in index.html');