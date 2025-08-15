const fs = require('fs');
const path = require('path');
const { getConfig } = require('../config.js');

const brand = process.env.BRAND || 'beax-rm';
const brandConfig = getConfig(brand);

const indexPath = path.join(__dirname, 'src/index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

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
  '{{API_URL}}': brandConfig.app.apiUrl
};

Object.keys(replacements).forEach(placeholder => {
  const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
  indexContent = indexContent.replace(regex, replacements[placeholder]);
});

fs.writeFileSync(indexPath, indexContent);
console.log('Environment variables replaced in index.html');