# Activate Client Management Module for RaccontiXRM

## Option 1: Using MongoDB Compass or mongosh

Connect to your MongoDB database and run these commands:

```javascript
// 1. Add client-management module to modules collection
db.modules.insertOne({
  id: 'client-management',
  name: 'client-management',
  displayName: 'Client Management',
  description: 'Manage client account requests and client profiles. Public endpoint for account creation requests.',
  permissionType: 'public',
  category: 'administration',
  icon: 'people_outline',
  color: '#00BCD4',
  isActive: true,
  createdAt: new Date()
});

// 2. Create CLIENT role if it doesn't exist
db.roles.insertOne({
  name: 'Client',
  type: 'client',
  description: 'Client user with limited access to client portal',
  permissionIds: [],
  createdAt: new Date()
});

// 3. Find RaccontiXRM organization ID
db.organizations.findOne({ name: /racconti/i });

// 4. Get the module _id
const clientModule = db.modules.findOne({ name: 'client-management' });

// 5. Activate module for RaccontiXRM organization (replace YOUR_ORG_ID with actual ID)
db.organizations.updateOne(
  { name: /racconti/i },
  { 
    $addToSet: { 
      activeModuleIds: clientModule._id 
    } 
  }
);
```

## Option 2: Quick Activation Script

If you have mongosh installed, save this as `activate-client-management.js` and run:
`mongosh YOUR_DATABASE_URI < activate-client-management.js`

```javascript
use('your_database_name');

// Insert module
const moduleResult = db.modules.insertOne({
  id: 'client-management',
  name: 'client-management',
  displayName: 'Client Management',
  description: 'Manage client account requests and client profiles',
  permissionType: 'public',
  category: 'administration',
  icon: 'people_outline',
  color: '#00BCD4',
  isActive: true,
  createdAt: new Date()
});

print('Module inserted with ID:', moduleResult.insertedId);

// Create CLIENT role
db.roles.insertOne({
  name: 'Client',
  type: 'client',
  description: 'Client user with limited access',
  permissionIds: [],
  createdAt: new Date()
});

// Find and activate for RaccontiXRM
const org = db.organizations.findOne({ name: /racconti/i });
if (org) {
  db.organizations.updateOne(
    { _id: org._id },
    { $addToSet: { activeModuleIds: moduleResult.insertedId } }
  );
  print('Module activated for organization:', org.name);
} else {
  print('RaccontiXRM organization not found');
}
```

## Option 3: Via API (if backend is running)

```bash
# Login as super admin first to get token
TOKEN="your_jwt_token_here"

# Add module via API
curl -X POST http://localhost:3000/api/modules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "client-management",
    "name": "client-management",
    "displayName": "Client Management",
    "description": "Manage client account requests and client profiles",
    "permissionType": "public",
    "category": "administration",
    "icon": "people_outline",
    "color": "#00BCD4",
    "isActive": true
  }'
```

## Verification

After activation, verify by:

1. Login to RaccontiXRM
2. Go to Modules page
3. Client Management should appear in the list
4. Dashboard should show Client Management widget
5. Navigate to `/modules/client-management` to access the module

## Public Request Form

The public request form is available at:
`/modules/client-management/request-access`

This can be embedded on any landing page or accessed directly without authentication.
