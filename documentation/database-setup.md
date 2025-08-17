# Database Setup Instructions

## 1. Insert Super Admin Role
First, insert the super admin role into your MongoDB `role` collection:

```javascript
db.role.insertOne({
  "name": "Super Administrator",
  "type": "super_admin", 
  "description": "Full system access with all permissions across all organizations",
  "permissionIds": [],
  "createdAt": new Date("2025-01-14T22:03:42.147Z")
})
```

## 2. Get the Role ID
After inserting, get the ObjectId of the role:
```javascript
const superAdminRole = db.role.findOne({"type": "super_admin"});
console.log(superAdminRole._id);
```

## 3. Insert Super Admin User
Insert the super admin user with the role ID:

```javascript
db.user.insertOne({
  "email": "superadmin@bhuri-sap.com",
  "password": "$2b$10$yi0yUeiMtCWRm8qsAX2bu.R/D0IJmbzZpgEusZLcabsSgmNaUD.VS",
  "firstName": "Super",
  "lastName": "Admin", 
  "isActive": true,
  "organizationId": null,
  "roleIds": [superAdminRole._id], // Use the actual ObjectId from step 2
  "permissionIds": [],
  "createdAt": new Date("2025-01-14T22:03:42.147Z")
})
```

## 4. Clean Up Duplicate Users
Remove duplicate users keeping only the first occurrence:

```javascript
// Find duplicates
db.user.aggregate([
  { $group: { _id: "$email", count: { $sum: 1 }, docs: { $push: "$_id" } } },
  { $match: { count: { $gt: 1 } } }
]).forEach(function(doc) {
  // Keep first, remove rest
  doc.docs.shift();
  db.user.deleteMany({ _id: { $in: doc.docs } });
});
```

## Login Credentials
- **Email**: superadmin@bhuri-sap.com
- **Password**: password123 (same as your current user)

The super admin can see all modules and manage all organizations.