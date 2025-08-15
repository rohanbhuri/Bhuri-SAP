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

## Development

### Backend Development
```bash
cd backend
npm run start:dev    # Development with hot reload
npm run build        # Production build
```

### Frontend Development
```bash
cd frontend
npm start           # Development server
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