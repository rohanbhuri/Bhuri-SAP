const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { getConfig } = require('./config.js');

const brand = process.argv[2] || 'beax-rm';
const buildOnly = process.argv.includes('--build-only');
const brandConfig = getConfig(brand);

if (!brandConfig) {
  console.error(`Brand "${brand}" not found in config.js`);
  process.exit(1);
}

console.log(`${buildOnly ? 'Configuring' : 'Starting'} ${brandConfig.brand.name} (${brand})...`);

// Replace environment variables in frontend index.html using template
const templatePath = path.join(__dirname, 'frontend/src/index.template.html');
const indexPath = path.join(__dirname, 'frontend/src/index.html');
let indexContent = fs.readFileSync(templatePath, 'utf8');

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
console.log(`Environment variables replaced for ${brand}`);

// Set environment variables from development config
Object.keys(brandConfig.development).forEach(key => {
  process.env[key] = brandConfig.development[key];
});

// Set brand-specific environment variables
process.env.BRAND = brand;
process.env.BRAND_NAME = brandConfig.brand.name;
process.env.APP_NAME = brandConfig.app.name;
process.env.VERSION = brandConfig.app.version;
process.env.DESCRIPTION = brandConfig.app.description;
process.env.APP_PORT = brandConfig.app.port;
process.env.API_URL = brandConfig.app.apiUrl;
process.env.PRIMARY_COLOR = brandConfig.colors.primary;
process.env.ACCENT_COLOR = brandConfig.colors.accent;
process.env.SECONDARY_COLOR = brandConfig.colors.secondary;
process.env.BRAND_LOGO = brandConfig.brand.logo;
process.env.BRAND_ICON = brandConfig.brand.icon;

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
const frontend = spawn('npm', ['start', '--', '--port', brandConfig.app.port.toString()], {
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