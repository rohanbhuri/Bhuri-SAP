# Bhuri SAP - Systems Applications and Products in Data Processing

A comprehensive resource management platform built with modern web technologies.

## Architecture

- **Frontend**: Angular 20+ with Angular Material
- **Backend**: NestJS with TypeORM
- **Database**: MongoDB
- **Authentication**: JWT with Passport

## Quick Start

```bash
# Install all dependencies
npm run install-all

# Start development server (BeaX RM)
npm run dev

# Start specific application
npm run start:beax-rm
npm run start:true-process
```

## Project Structure

```
├── backend/          # NestJS API server
├── frontend/         # Angular application
├── configs/          # Application configurations
├── documentation/    # Project documentation
└── start.js         # Application launcher
```

## Applications

### BeaX RM (Resource Management)
Primary resource management application with user authentication, role-based access control, and organizational management.

### True Process
Secondary application for process management.

## Documentation

- [Setup Guide](./documentation/SETUP_GUIDE.md) - Installation and configuration
- [API Documentation](./documentation/API_DOCUMENTATION.md) - REST API reference
- [Blueprint](./documentation/blueprint.md) - System architecture and design
- [Brand Configuration](./BRAND_CONFIG.md) - Branding and theming guide

## Brand Configuration System

The application uses a dynamic brand configuration system that automatically switches between different applications based on the startup command.

### How It Works

1. **Configuration Source**: All brand configurations are stored in `config.js`
2. **Dynamic Replacement**: `start.js` reads the config and replaces placeholders in `frontend/src/index.html`
3. **Environment Variables**: Backend receives the correct environment variables for each brand
4. **Automatic Startup**: Both frontend and backend start with the correct configuration

### Brand Switching

```bash
# Start True Process application
npm run start:true-process
# → Backend: localhost:3001 | Frontend: localhost:4201 | API: localhost:3001/api

# Start Beax RM application  
npm run start:beax-rm
# → Backend: localhost:3000 | Frontend: localhost:4200 | API: localhost:3000/api
```

### Configuration Structure

Each brand in `config.js` contains:
- **Brand**: Name, logo, icon paths
- **Colors**: Primary, accent, secondary theme colors
- **App**: Name, version, description, port, API URL
- **Development**: Database URI, JWT secret, backend port

## Development

### Adding New Brands

1. Add new brand configuration to `config.js`
2. Create assets in `configs/assets/[brand-name]/`
3. Add npm script in root `package.json`
4. The system automatically handles environment replacement

### Backend Development
```bash
cd backend
npm run start:dev    # Development with hot reload
npm run build        # Production build
```

### Frontend Development
```bash
cd frontend
npm start           # Development server (requires brand setup first)
npm run build       # Production build
```

## Environment Setup

1. Copy `.env.example` to `.env` in the backend directory
2. Configure your MongoDB connection and JWT secrets
3. Run `npm run install-all` to install dependencies
4. Start the development server with `npm run dev`

## License

Private - All rights reserved

## Author

Rohan Bhuri