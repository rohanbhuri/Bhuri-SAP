const { spawn } = require('child_process');
const { getConfig } = require('./config.js');

const brand = process.argv[2] || 'beax-rm';
const brandConfig = getConfig(brand);

if (!brandConfig) {
  console.error(`Brand "${brand}" not found in config.js`);
  process.exit(1);
}

console.log(`Starting ${brandConfig.brand.name} (${brand})...`);

// Set environment variables from development config
Object.keys(brandConfig.development).forEach(key => {
  process.env[key] = brandConfig.development[key];
});

// Set brand-specific environment variables
process.env.BRAND = brand;
process.env.BRAND_NAME = brandConfig.brand.name;
process.env.APP_NAME = brandConfig.app.name;
process.env.APP_PORT = brandConfig.app.port;
process.env.API_URL = brandConfig.app.apiUrl;
process.env.PRIMARY_COLOR = brandConfig.colors.primary;
process.env.ACCENT_COLOR = brandConfig.colors.accent;
process.env.SECONDARY_COLOR = brandConfig.colors.secondary;
process.env.BRAND_LOGO = brandConfig.brand.logo;
process.env.BRAND_ICON = brandConfig.brand.icon;

// Start backend
const backend = spawn('npm', ['run', 'start:dev'], {
  cwd: './backend',
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

// Start frontend
const frontend = spawn('npm', ['start'], {
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