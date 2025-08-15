const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'src/index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Replace placeholders with environment variables
const replacements = {
  '{{BRAND_NAME}}': process.env.BRAND_NAME || 'Beax RM',
  '{{BRAND_LOGO}}': process.env.BRAND_LOGO || '/config/assets/beax-rm/logo.png',
  '{{BRAND_ICON}}': process.env.BRAND_ICON || '/config/assets/beax-rm/icon.png',
  '{{PRIMARY_COLOR}}': process.env.PRIMARY_COLOR || '#3B82F6',
  '{{ACCENT_COLOR}}': process.env.ACCENT_COLOR || '#F59E0B',
  '{{SECONDARY_COLOR}}': process.env.SECONDARY_COLOR || '#6B7280',
  '{{APP_NAME}}': process.env.APP_NAME || 'Beax Resource Manager',
  '{{APP_PORT}}': process.env.APP_PORT || '3000',
  '{{API_URL}}': process.env.API_URL || 'http://localhost:8000/api'
};

Object.keys(replacements).forEach(placeholder => {
  const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
  indexContent = indexContent.replace(regex, replacements[placeholder]);
});

fs.writeFileSync(indexPath, indexContent);
console.log('Environment variables replaced in index.html');