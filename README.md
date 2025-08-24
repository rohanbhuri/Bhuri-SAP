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

- [Documentation Index](./documentation/README.md)
- [Setup Guide](./documentation/SETUP_GUIDE.md) - Installation and configuration
- [API Documentation](./documentation/API_DOCUMENTATION.md) - REST API reference
- [System Blueprint](./documentation/blueprint.md) - System architecture and design
- [Database Blueprint](./documentation/DATABASE_BLUEPRINT.md) - Database design
- [Role & Permission Management](./documentation/ROLE_PERMISSION_MANAGEMENT.md)
- [Project Management Modules](./documentation/PROJECT_MANAGEMENT_MODULES.md)
- [Brand Configuration](./documentation/BRAND_CONFIG.md) - Branding and theming guide
- [PWA Setup](./documentation/PWA_SETUP.md)

- [Module Management User Story](./documentation/MODULE_MANAGEMENT_USER_STORY.md)
- [CRM Setup](./documentation/crm-setup.md)
- [Database Setup](./documentation/database-setup.md)
- [User Management Setup](./documentation/user-management-setup.md)
- [User Management Complete](./documentation/user-management-complete.md)
- [Dynamic Theme System](./documentation/DYNAMIC_THEME_SYSTEM.md) - Comprehensive theming guide
- [Theme Implementation Guide](./documentation/THEME_IMPLEMENTATION_GUIDE.md) - Current status and roadmap


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
npm run build:ssr   # SSR production build
```

## Production Deployment

### EC2 Server Configuration
- **Server**: t3.micro EC2 instance
- **IP**: 13.126.228.247
- **Process Manager**: PM2 with optimized settings
- **Build**: SSR prerendering for production

### Production Build & Deploy
```bash
# Build all applications for production
npm run build:prod

# Start PM2 processes
npm run pm2:start

# Full deployment (build + restart)
npm run deploy:prod
```

### PM2 Management
```bash
# All Applications
npm run pm2:start     # Start all applications
npm run pm2:stop      # Stop all applications
npm run pm2:restart   # Restart all applications
npm run pm2:delete    # Delete all applications
npm run pm2:logs      # View logs

# Individual Projects (Backend + Frontend)
npm run pm2:start:beax-rm        # Start BeaX RM (Backend + Frontend)
npm run pm2:start:true-process   # Start True Process (Backend + Frontend)
npm run pm2:stop:beax-rm         # Stop BeaX RM
npm run pm2:stop:true-process    # Stop True Process
npm run pm2:restart:beax-rm      # Restart BeaX RM
npm run pm2:restart:true-process # Restart True Process
```

### Production URLs
**Backend APIs:**
- **BeaX RM API**: http://13.126.228.247:3000/api
- **True Process API**: http://13.126.228.247:3001/api

**Frontend Applications:**
- **BeaX RM**: http://localhost:4200
- **True Process**: http://localhost:4201

### Memory Optimization
- Max memory restart: 200MB per process
- Node.js heap size: 256MB
- Single instance per application (optimized for t3.micro)

## Environment Setup

### Development
1. Copy `.env.example` to `.env` in the backend directory
2. Configure your MongoDB connection and JWT secrets
3. Run `npm run install-all` to install dependencies
4. Start the development server with `npm run dev`

### Production
1. Set environment variables on EC2:
   ```bash
   export NODE_ENV=production
   export DATABASE_URI=your_mongodb_uri
   export JWT_SECRET=your_jwt_secret
   ```
2. Create logs directory: `mkdir -p logs`
3. Install PM2 globally: `npm install -g pm2`
4. Run production deployment: `npm run deploy:prod`

## License

Private - All rights reserved

## Author

Rohan Bhuri