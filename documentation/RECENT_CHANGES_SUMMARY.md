# Recent Changes Summary

## Brand Name Standardization (Latest)

### Issue Fixed
- **Problem**: Inconsistent naming between "beax-rm" and "beaxrm" throughout the repository
- **Solution**: Standardized all references to use "beaxrm" consistently

### Files Updated
- `package.json` - Updated all npm scripts from "beax-rm" to "beaxrm"
- `config.js` - Changed brand key from "beax-rm" to "beaxrm"
- `ecosystem.config.js` - Updated PM2 process names
- `start.js` - Updated default brand reference
- `frontend/angular.json` - Updated Angular project configuration
- `frontend/package.json` - Updated build scripts
- `backend/src/scripts/demo-seed.js` - Updated default brand values
- `frontend/src/app/modules/module-registry.ts` - Updated brand arrays

### Command Updates
Added new commands to match RaccontiXRM pattern:
- `build:beaxrm:bothend` - Build both backend and frontend for BeaX RM
- `pm2:start:beaxrm` - Simplified PM2 start command (removed build steps)

## MongoDB Index Error Fix

### Issue Fixed
- **Problem**: MongoDB duplicate key error on productCode field
- **Root Cause**: Unique index didn't allow multiple null values
- **Solution**: Made productCode nullable and added sparse index

### Files Modified
- `backend/src/entities/product.entity.ts`
  - Changed `@Column({ unique: true })` to `@Column({ nullable: true })`
  - Added `@Index({ sparse: true })` decorator

## BeaX RM Seeding Script

### New File Created
- `backend/src/scripts/seed-beaxrm-complete.js`

### Features
- **9 Test Users**: superadmin@beaxrm.in, admin@beaxrm.in, manager@beaxrm.in, etc.
- **Organizations**: BeaX RM Headquarters with departments
- **Roles & Permissions**: Complete RBAC setup
- **Modules**: All 15 modules with kebab-case names matching frontend
- **CRM Data**: Leads, contacts, deals, activities
- **HR Data**: Employees, departments, positions
- **Projects**: Sample projects with tasks and assignments

### Critical Module Names (Must Match Frontend)
```javascript
const modules = [
  { name: 'dashboard', displayName: 'Dashboard' },
  { name: 'user-management', displayName: 'User Management' },
  { name: 'projects-management', displayName: 'Projects Management' },
  { name: 'crm', displayName: 'CRM' },
  { name: 'hr-management', displayName: 'HR Management' },
  { name: 'catalogue', displayName: 'Catalogue' },
  { name: 'quotations', displayName: 'Quotations' },
  { name: 'cms', displayName: 'CMS' },
  { name: 'messages', displayName: 'Messages' },
  { name: 'calendar', displayName: 'Calendar' },
  { name: 'reports', displayName: 'Reports' },
  { name: 'settings', displayName: 'Settings' },
  { name: 'notifications', displayName: 'Notifications' },
  { name: 'file-manager', displayName: 'File Manager' },
  { name: 'analytics', displayName: 'Analytics' }
];
```

## Module Widget Display Fix

### Issue Fixed
- **Problem**: Dashboard widgets not loading despite successful seeding
- **Root Cause**: Module name mismatch between backend seeding and frontend registry
- **Solution**: Ensured exact kebab-case naming consistency

### Key Learning
Frontend `module-registry.ts` expects exact module names. Any mismatch prevents widget loading.

## Multi-Brand Architecture

### Current Brands
1. **BeaX RM** (beaxrm)
   - Server: 13.126.228.247
   - Backend: :3000 | Frontend: :4200
   
2. **True Process** (true-process)
   - Server: 13.126.228.247
   - Backend: :3001 | Frontend: :4201
   
3. **RaccontiXRM** (raccontixrm)
   - Server: 68.178.171.103
   - Backend: :3002 | Frontend: :4202

### Brand Configuration Structure
Each brand in `config.js` contains:
- Brand details (name, logo, colors)
- App configuration (ports, API URLs)
- Development settings (database, JWT)

## Production Deployment Commands

### Build Commands
```bash
npm run build:beaxrm:bothend     # BeaX RM (Backend + Frontend)
npm run build:raccontixrm:bothend # RaccontiXRM (Backend + Frontend)
```

### PM2 Commands
```bash
npm run pm2:start:beaxrm         # Start BeaX RM
npm run pm2:start:true-process   # Start True Process
npm run pm2:start:raccontixrm    # Start RaccontiXRM
```

## Database Seeding Best Practices

### Module Naming Convention
- Use kebab-case for module names
- Must match frontend `module-registry.ts` exactly
- Example: "user-management", not "userManagement" or "User Management"

### User Creation
- Always create superadmin first
- Assign proper roles and permissions
- Set activeModuleIds for dashboard widgets

### Organization Structure
- Create organization before users
- Link users to organization
- Set up departments and hierarchies

## Testing Scripts

### Available Tests
- `test-auth.js` - Authentication testing
- `test-catalogue-api-key.js` - Catalogue API testing
- `test-quotations-api-key.js` - Quotations API testing
- `test-cms-api-key.js` - CMS API testing
- `mobile-dashboard-test.html` - Mobile dashboard testing

## Environment Variables

### Required for Production
```bash
NODE_ENV=production
DATABASE_URI=mongodb://...
JWT_SECRET=your_secret_key
```

### Brand-Specific Ports
- BeaX RM: 3000 (backend), 4200 (frontend)
- True Process: 3001 (backend), 4201 (frontend)
- RaccontiXRM: 3002 (backend), 4202 (frontend)

## Memory Optimization (EC2 t3.micro)
- Max memory restart: 200MB per process
- Node.js heap size: 256MB
- Single instance per application
- PM2 process management with auto-restart