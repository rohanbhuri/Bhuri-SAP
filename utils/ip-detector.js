const os = require('os');

/**
 * Detects the current environment and returns appropriate IP configuration
 */
function detectEnvironment() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isLocal = !isProduction;
  
  return {
    isProduction,
    isLocal,
    getIP: () => isLocal ? 'localhost' : getServerIP(),
    getFullURL: (port) => `http://${isLocal ? 'localhost' : getServerIP()}:${port}`
  };
}

/**
 * Gets the server's external IP address
 */
function getServerIP() {
  const interfaces = os.networkInterfaces();
  
  // Try to find the first non-internal IPv4 address
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  // Fallback to localhost if no external IP found
  return 'localhost';
}

/**
 * Gets brand-specific IP configuration
 */
function getBrandIPConfig(brand) {
  const env = detectEnvironment();
  
  const ipMappings = {
    'beax-rm': {
      production: '13.126.228.247',
      local: 'localhost'
    },
    'true-process': {
      production: '3.111.139.181', 
      local: 'localhost'
    },
    'raccontixrm': {
      production: '68.178.171.103',
      local: 'localhost'
    }
  };
  
  const brandMapping = ipMappings[brand] || ipMappings['beax-rm'];
  const ip = env.isProduction ? brandMapping.production : brandMapping.local;
  
  return {
    ip,
    getURL: (port) => `http://${ip}:${port}`,
    isLocal: env.isLocal,
    isProduction: env.isProduction
  };
}

module.exports = {
  detectEnvironment,
  getServerIP,
  getBrandIPConfig
};