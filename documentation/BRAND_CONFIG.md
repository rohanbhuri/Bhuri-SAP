# Brand Configuration Guide

This application supports multiple brands through the `config.js` file. Each brand has its own configuration including colors, logos, database settings, and app details.

## Available Brands

- `beax-rm` - Beax Resource Manager (default)
- `true-process` - True Process Manager

## Running Different Brands

### Start Beax RM (default)
```bash
npm start
# or
npm run start:beax-rm
```

### Start True Process
```bash
npm run start:true-process
```

## Configuration Structure

Each brand configuration includes:

- **Brand Identity**: name, logo, icon
- **Colors**: primary, accent, secondary
- **App Settings**: name, version, description, port, API URL
- **Development Environment**: MongoDB URI, JWT secret, port

## How It Works

1. `start.js` reads the brand parameter and loads the corresponding configuration
2. Environment variables are set based on the brand configuration
3. Backend uses `load-config.js` to apply the configuration
4. Frontend uses `BrandConfigService` to access brand-specific settings
5. Colors are applied as CSS variables for dynamic theming

## Adding New Brands

1. Add a new brand configuration to `config.js`
2. Create brand assets in `configs/assets/[brand-name]/`
3. Add a new npm script in `package.json`
4. The application will automatically use the new brand configuration