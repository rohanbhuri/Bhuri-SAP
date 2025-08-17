const { getConfig } = require('../config.js');

const brand = process.env.BRAND || 'beax-rm';
const brandConfig = getConfig(brand);

if (brandConfig) {
  // Set database credentials (same for all environments)
  if (brandConfig.database) {
    Object.keys(brandConfig.database).forEach(key => {
      if (!process.env[key]) {
        process.env[key] = brandConfig.database[key];
      }
    });
  }
  
  // Set environment-specific config
  const envConfig = process.env.NODE_ENV === 'production' ? brandConfig.production : brandConfig.development;
  if (envConfig) {
    Object.keys(envConfig).forEach(key => {
      if (!process.env[key]) {
        process.env[key] = envConfig[key];
      }
    });
  }
}

module.exports = brandConfig;