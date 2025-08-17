# Beax RM System Blueprint

## System Overview
Beax RM is an ERP/SAP-like enterprise resource management tool with a modular architecture, user management, and role-based access control system.

**Architecture:** Full-stack application with NestJS backend and Angular frontend
**Database:** MongoDB
**Authentication:** JWT-based authentication system

---

## Core System Modules

### 1. Authentication & Authorization Module
**Backend:** `/backend/src/auth/`
**Frontend:** `/frontend/src/app/pages/auth/`

**Functionality:**
- User login/logout
- JWT token management
- Organization selection
- User registration
- Password authentication
- Route protection

**Components:**
- Login page
- Signup page
- Organization selection page
- JWT strategy implementation
- Auth guards and interceptors

### 2. User Management Module
**Backend:** `/backend/src/users/`
**Frontend:** `/frontend/src/app/pages/profile/`

**Functionality:**
- User CRUD operations
- Profile management
- User-role assignments
- Organization-based user filtering
- User preferences management

**Components:**
- User profile page
- Edit profile page
- User service for API calls
- User entity with organization relationships

### 3. Organization Management Module
**Backend:** `/backend/src/organizations/`

**Functionality:**
- Multi-tenant organization support
- Organization CRUD operations
- Module activation per organization
- Organization-specific user management
- Organization code and name management

**Features:**
- Create, read, update, delete organizations
- Manage active modules per organization
- Organization-based data isolation

### 4. Role & Permission Management Module
**Backend:** `/backend/src/roles/`

**Functionality:**
- Role-based access control (RBAC)
- Permission management
- Role types: super_admin, admin, staff, custom
- Module-based permissions
- Action-based permissions (read, write, edit, delete)

**Permission Actions:**
- `READ`: View data
- `WRITE`: Create new data
- `EDIT`: Modify existing data
- `DELETE`: Remove data

**Role Types:**
- `super_admin`: Full system access
- `admin`: Organization-level management
- `staff`: Limited access based on permissions
- `custom`: Configurable role permissions

### 5. Module Management System
**Backend:** `/backend/src/modules/`
**Frontend:** `/frontend/src/app/pages/modules/`

**Functionality:**
- Dynamic module activation/deactivation
- Organization-specific module management
- Module availability control
- Module metadata management

**Features:**
- List all available modules
- Activate/deactivate modules per organization
- Module description and display names
- Module availability status

### 6. User Preferences Module
**Backend:** `/backend/src/preferences/`
**Frontend:** `/frontend/src/app/pages/settings/`

**Functionality:**
- User-specific settings
- Theme preferences
- Application preferences
- Settings persistence

**Components:**
- Settings page
- Preferences page
- Theme service
- Preferences service

---

## Frontend Application Structure

### Core Pages & Components

#### Navigation Components
- **Navbar Component**: Top navigation bar
- **Bottom Navbar Component**: Mobile-friendly bottom navigation

#### Main Application Pages
1. **Dashboard** (`/dashboard`)
   - Main landing page after login
   - Overview of user's accessible modules and data

2. **Messages** (`/messages`)
   - Internal messaging system
   - Communication between users

3. **Search** (`/search`)
   - Global search functionality
   - Search across modules and data

4. **Notifications** (`/notifications`)
   - System notifications
   - User alerts and updates

5. **More** (`/more`)
   - Additional features and utilities
   - Extended functionality access

#### User Management Pages
- **Profile** (`/profile`): User profile display
- **Edit Profile** (`/profile/edit`): Profile modification
- **Settings** (`/settings`): Application settings
- **Preferences** (`/settings/preferences`): User preferences

#### Authentication Pages
- **Login** (`/login`): User authentication
- **Signup** (`/signup`): New user registration
- **Select Organization** (`/select-organization`): Organization selection

---

## Data Entities & Models

### Core Entities
1. **User Entity**
   - User information and credentials
   - Organization relationships
   - Role assignments

2. **Organization Entity**
   - Organization details
   - Active module configurations
   - Multi-tenant support

3. **Role Entity**
   - Role definitions
   - Permission assignments
   - Role types and descriptions

4. **Permission Entity**
   - Module-based permissions
   - Action types (CRUD operations)
   - Resource-specific access control

5. **Module Entity**
   - Module metadata
   - Availability status
   - Display information

6. **User Preferences Entity**
   - User-specific settings
   - Theme and UI preferences
   - Application configurations

---

## Security & Access Control

### Authentication Flow
1. User login with email/password
2. JWT token generation and validation
3. Organization selection (if multiple)
4. Role-based access control enforcement

### Authorization Layers
- **Route Guards**: Frontend route protection
- **JWT Guards**: Backend endpoint protection
- **Permission Guards**: Action-level authorization
- **Organization Isolation**: Multi-tenant data separation

### Security Features
- JWT token-based authentication
- Role-based access control (RBAC)
- Organization-level data isolation
- Permission-based feature access
- Secure API endpoints with guards

---

## API Architecture

### RESTful Endpoints
- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Organizations**: `/api/organizations/*`
- **Roles**: `/api/roles/*`
- **Modules**: `/api/modules/*`
- **Preferences**: `/api/preferences/*`

### Request/Response Format
- JSON-based API communication
- Standardized error responses
- JWT Bearer token authentication
- RESTful HTTP methods (GET, POST, PATCH, DELETE)

---

## Technology Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Class-validator decorators
- **Configuration**: Environment-based config

### Frontend
- **Framework**: Angular (Latest version)
- **Styling**: SCSS
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router with guards
- **State Management**: Services-based architecture

### Development Tools
- **TypeScript**: Full-stack type safety
- **Environment Configuration**: .env files
- **API Documentation**: Postman collections
- **Code Organization**: Modular architecture

---

## Deployment & Configuration

### Environment Setup
- MongoDB connection configuration
- JWT secret management
- Environment-specific settings
- CORS configuration for frontend-backend communication

### Project Structure
```
beax-rm/
├── backend/          # NestJS API server
├── frontend/         # Angular application
└── documentation/    # API docs and guides
```

This blueprint provides a comprehensive overview of the Beax RM system's modular architecture, functionality, and technical implementation details.

---
Last updated: 2025-08-17
Current status: Core modules implemented (auth, users, organizations, roles, modules, preferences) with CRM/HR/Projects scaffolding and widgets.
Future work:
- Add real role guards to module routes
- Add WebSocket/live updates to dashboards
- Expand analytics/reporting surfaces
Related docs:
- Index: documentation/README.md
- API: documentation/API_DOCUMENTATION.md
- Project Management: documentation/PROJECT_MANAGEMENT_MODULES.md