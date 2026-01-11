const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { getConfig } = require('./config.js');
const { getBrandIPConfig } = require('./utils/ip-detector.js');

const brand = process.argv[2] || 'beax-rm';
const buildOnly = process.argv.includes('--build-only');
const brandConfig = getConfig(brand);

if (!brandConfig) {
  console.error(`Brand "${brand}" not found in config.js`);
  process.exit(1);
}

console.log(`${buildOnly ? 'Configuring' : 'Starting'} ${brandConfig.brand.name} (${brand})...`);

// Get dynamic IP configuration
const ipConfig = getBrandIPConfig(brand);
console.log(`Environment: ${ipConfig.isProduction ? 'Production' : 'Development'}`);
console.log(`Using IP: ${ipConfig.ip}`);

// Update brand config with dynamic IP
brandConfig.app.dynamicApiUrl = ipConfig.getURL(brandConfig.development.PORT || brandConfig.production.PORT) + '/api';
brandConfig.app.dynamicFrontendUrl = ipConfig.getURL(brandConfig.app.port);

// Replace environment variables in frontend files using templates
const templatePath = path.join(__dirname, 'frontend/src/index.template.html');
const indexPath = path.join(__dirname, 'frontend/src/index.html');
const manifestPath = path.join(__dirname, 'frontend/public/manifest.json');
const robotsPath = path.join(__dirname, 'frontend/public/robots.txt');
const swPath = path.join(__dirname, 'frontend/public/sw.js');
const sitemapPath = path.join(__dirname, 'frontend/public/sitemap.xml');
const environmentPath = path.join(__dirname, 'frontend/src/environments/environment.ts');

let indexContent = fs.readFileSync(templatePath, 'utf8');
let manifestContent = fs.readFileSync(manifestPath, 'utf8');
let robotsContent = fs.readFileSync(robotsPath, 'utf8');
let swContent = fs.readFileSync(swPath, 'utf8');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
let environmentContent = fs.readFileSync(environmentPath, 'utf8');

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
  '{{API_URL}}': brandConfig.app.dynamicApiUrl || brandConfig.app.apiUrl,
  '{{CANONICAL_URL}}': brandConfig.app.dynamicFrontendUrl || `http://localhost:${brandConfig.app.port}`
};

Object.keys(replacements).forEach(placeholder => {
  const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
  indexContent = indexContent.replace(regex, replacements[placeholder]);
  manifestContent = manifestContent.replace(regex, replacements[placeholder]);
  robotsContent = robotsContent.replace(regex, replacements[placeholder]);
  swContent = swContent.replace(regex, replacements[placeholder]);
  sitemapContent = sitemapContent.replace(regex, replacements[placeholder]);
  environmentContent = environmentContent.replace(regex, replacements[placeholder]);
});

fs.writeFileSync(indexPath, indexContent);
fs.writeFileSync(manifestPath, manifestContent);
fs.writeFileSync(robotsPath, robotsContent);
fs.writeFileSync(swPath, swContent);
fs.writeFileSync(sitemapPath, sitemapContent);
fs.writeFileSync(environmentPath, environmentContent);
console.log(`Environment variables replaced for ${brand}`);

// Set database credentials (same for all environments)
if (brandConfig.database) {
  Object.keys(brandConfig.database).forEach(key => {
    process.env[key] = brandConfig.database[key];
  });
}

// Set environment-specific config
const envConfig = process.env.NODE_ENV === 'production' ? brandConfig.production : brandConfig.development;
if (envConfig) {
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
}

// Set brand-specific environment variables
process.env.BRAND = brand;
process.env.BRAND_NAME = brandConfig.brand.name;
process.env.APP_NAME = brandConfig.app.name;
process.env.VERSION = brandConfig.app.version;
process.env.DESCRIPTION = brandConfig.app.description;
process.env.APP_PORT = brandConfig.app.port;
process.env.API_URL = brandConfig.app.dynamicApiUrl || brandConfig.app.apiUrl;
process.env.PRIMARY_COLOR = brandConfig.colors.primary;
process.env.ACCENT_COLOR = brandConfig.colors.accent;
process.env.SECONDARY_COLOR = brandConfig.colors.secondary;
process.env.BRAND_LOGO = brandConfig.brand.logo;
process.env.BRAND_LOGO_DARK = brandConfig.brand.logoDark;
process.env.BRAND_ICON = brandConfig.brand.icon;
process.env.CANONICAL_URL = brandConfig.app.dynamicFrontendUrl || `http://localhost:${brandConfig.app.port}`;

if (buildOnly) {
  console.log(`Configuration complete for ${brand}`);
  process.exit(0);
}

// Start backend
const backend = spawn('npm', ['run', 'start:dev'], {
  cwd: './backend',
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

// Start frontend with dynamic port
const frontend = spawn('npm', ['start', '--', '--project', brand, '--port', brandConfig.app.port.toString()], {
  cwd: './frontend',
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

// Start MCP server in development
const mcpServer = spawn('node', ['mcp-server.js'], {
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  mcpServer.kill();
  process.exit();
});