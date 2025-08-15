const { getConfig } = require('../config.js');

const brand = process.env.BRAND || 'beax-rm';
const brandConfig = getConfig(brand);

if (brandConfig && brandConfig.development) {
  Object.keys(brandConfig.development).forEach(key => {
    if (!process.env[key]) {
      process.env[key] = brandConfig.development[key];
    }
  });
}

module.exports = brandConfig;