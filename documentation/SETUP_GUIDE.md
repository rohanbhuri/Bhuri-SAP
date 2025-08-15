# Beax RM Backend Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB database
- npm or yarn

## Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection:
```
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/beax_rm
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
```

3. **Start the server:**
```bash
npm run start:dev
```

## Testing with Postman

1. Import the collection: `documentation/beax-rm-api.postman_collection.json`
2. Set environment variables:
   - `base_url`: `http://localhost:3000/api`
   - `access_token`: (auto-set after login)

## Initial Data Setup

Create initial super admin user directly in MongoDB:

```javascript
// Connect to MongoDB and run:
db.user.insertOne({
  email: "admin@example.com",
  password: "$2b$10$hashed_password_here", // bcrypt hash of "password123"
  firstName: "Super",
  lastName: "Admin",
  isActive: true,
  organizationId: null,
  roleIds: [ObjectId("role_id_here")], // Super admin role ID
  permissionIds: [],
  createdAt: new Date()
});

// Create super admin role:
db.role.insertOne({
  name: "Super Administrator",
  type: "super_admin",
  description: "Full system access",
  permissionIds: [],
  createdAt: new Date()
});
```

## API Testing Flow

1. **Login** to get access token
2. **Create Organization** (SuperAdmin only)
3. **Create Users** and assign to organization
4. **Create Roles** and assign permissions
5. **Activate/Deactivate Modules** for organizations

## Available Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production