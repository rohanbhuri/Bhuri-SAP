---
description: Repository Information Overview
alwaysApply: true
---

# Bhuri SAP Information

## Summary
A comprehensive resource management platform built with modern web technologies, featuring two main applications: BeaX RM (Resource Management) and True Process (Process Management). The system uses a dynamic brand configuration system to switch between applications.

## Structure
- **backend/**: NestJS API server with TypeORM and MongoDB
- **frontend/**: Angular 20+ application with Material UI
- **configs/**: Application configurations and brand assets
- **documentation/**: Project documentation and API references
- **start.js**: Application launcher with brand switching capability

## Language & Runtime
**Languages**: TypeScript, JavaScript
**Frontend**: Angular 20+
**Backend**: NestJS 10+
**Database**: MongoDB 6.0+
**Build System**: Angular CLI, NestJS CLI
**Package Manager**: npm

## Dependencies

### Backend Dependencies
- **@nestjs/common, @nestjs/core**: ^10.0.0
- **@nestjs/typeorm**: ^10.0.0
- **@nestjs/jwt, @nestjs/passport**: ^10.0.0
- **mongodb**: ^6.0.0
- **typeorm**: ^0.3.17
- **bcrypt**: ^5.1.0

### Frontend Dependencies
- **@angular/core, @angular/common**: ^20.1.0
- **@angular/material**: ^20.1.6
- **@angular/ssr**: ^20.1.5
- **rxjs**: ~7.8.0

## Build & Installation
```bash
# Install all dependencies
npm run install-all

# Development server (BeaX RM)
npm run dev

# Start specific application
npm run start:beax-rm
npm run start:true-process

# Production build
npm run build:prod

# Deploy to production
npm run deploy:prod
```

## Docker
No Docker configuration found in the repository. Deployment is managed through PM2.

## Applications

### BeaX RM
**Configuration**: Brand "beax-rm" in config.js
**Frontend Port**: 4200
**Backend Port**: 3000
**Database**: MongoDB (beaxrm collection)
**Description**: Primary resource management application with user authentication, role-based access control, and organizational management.

### True Process
**Configuration**: Brand "true-process" in config.js
**Frontend Port**: 4201
**Backend Port**: 3001
**Database**: MongoDB (trueprocess collection)
**Description**: Secondary application for process management.

## Production Deployment
**Process Manager**: PM2
**Server**: t3.micro EC2 instance (13.126.228.247)
**Memory Optimization**: 
- Max memory restart: 200MB per process
- Node.js heap size: 256MB
- Single instance per application

**PM2 Commands**:
```bash
# Start all applications
npm run pm2:start

# Start specific application
npm run pm2:start:beax-rm
npm run pm2:start:true-process
```

## Modules
The backend includes multiple management modules:
- User Management
- Organization Management
- CRM
- HR Management
- Projects Management
- Roles Management
- Preferences Management

## Testing
No specific testing configuration found in the repository.