# Client Security Settings Sync to User - Best Solution

## Problem
When a client becomes a user, security settings (2FA, password change, business hours, API access) are stored only in the Client entity. These need to be accessible during login and user settings management.

## Best Solution: Dual Storage Pattern

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Entity                              │
│  (Authentication & Core Settings)                           │
├─────────────────────────────────────────────────────────────┤
│ • email, password, firstName, lastName                      │
│ • organizationIds, roleIds, permissionIds                   │
│ • isActive, forcePasswordChange                             │
│ • SECURITY SETTINGS (synced from Client):                   │
│   - requireTwoFactor                                        │
│   - sessionTimeout                                          │
│   - restrictToBusinessHours                                 │
│   - allowApiAccess                                          │
│   - expiryDate                                              │
│   - ipWhitelist                                             │
│   - maxDevices                                              │
└─────────────────────────────────────────────────────────────┘
                          ↕ (sync)
┌─────────────────────────────────────────────────────────────┐
│                    Client Entity                            │
│  (Business Details & Source of Truth for Security)          │
├─────────────────────────────────────────────────────────────┤
│ • userId (FK to User)                                       │
│ • companyName, contactPerson, email, phone                  │
│ • SECURITY SETTINGS (source of truth):                      │
│   - requireTwoFactor                                        │
│   - sessionTimeout                                          │
│   - restrictToBusinessHours                                 │
│   - allowApiAccess                                          │
│   - expiryDate                                              │
│   - ipWhitelist                                             │
│   - maxDevices                                              │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Strategy

### 1. Add Security Fields to User Entity

```typescript
@Column({ default: false })
requireTwoFactor: boolean;

@Column({ nullable: true })
sessionTimeout?: number; // in minutes

@Column({ default: false })
restrictToBusinessHours: boolean;

@Column({ default: false })
allowApiAccess: boolean;

@Column({ nullable: true })
expiryDate?: Date;

@Column({ nullable: true })
ipWhitelist?: string; // comma-separated IPs

@Column({ nullable: true })
maxDevices?: number;
```

### 2. Sync Strategy: Client → User

**When to sync:**
- On client creation
- On client update
- On credential request
- On client status change

**Sync Method:**
```typescript
private async syncClientSecurityToUser(client: Client, user: User): Promise<void> {
  user.requireTwoFactor = client.requireTwoFactor;
  user.sessionTimeout = client.sessionTimeout;
  user.restrictToBusinessHours = client.restrictToBusinessHours;
  user.allowApiAccess = client.allowApiAccess;
  user.expiryDate = client.expiryDate;
  user.ipWhitelist = client.ipWhitelist;
  user.maxDevices = client.maxDevices;
  
  await this.userRepository.save(user);
}
```

### 3. Update Client Management Service

**In convertToClient():**
```typescript
// After creating user, sync security settings
await this.syncClientSecurityToUser(savedClient, savedUser);
```

**In requestLoginCredentials():**
```typescript
// After creating/updating user, sync security settings
await this.syncClientSecurityToUser(client, user);
```

**In updateClient():**
```typescript
// After updating client, sync to user
if (client.userId) {
  const user = await this.userRepository.findOne({ 
    where: { _id: client.userId } 
  });
  if (user) {
    await this.syncClientSecurityToUser(client, user);
  }
}
```

### 4. Update Auth Service for Login Checks

**In login() method:**
```typescript
async login(email: string, password: string) {
  const user = await this.validateUser(email, password);
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Check security constraints
  if (user.expiryDate && new Date() > user.expiryDate) {
    throw new UnauthorizedException('Account has expired');
  }

  if (user.restrictToBusinessHours) {
    const hour = new Date().getHours();
    if (hour < 9 || hour >= 18) {
      throw new UnauthorizedException('Login restricted to business hours (9 AM - 6 PM)');
    }
  }

  if (user.requireTwoFactor) {
    // Trigger 2FA flow
    return { requiresTwoFactor: true, userId: user._id };
  }

  // ... rest of login logic
}
```

### 5. Create User Settings Endpoint

**GET /users/:userId/security-settings**
```typescript
async getSecuritySettings(userId: string) {
  const user = await this.userRepository.findOne({
    where: { _id: new ObjectId(userId) }
  });

  return {
    requireTwoFactor: user.requireTwoFactor,
    sessionTimeout: user.sessionTimeout,
    restrictToBusinessHours: user.restrictToBusinessHours,
    allowApiAccess: user.allowApiAccess,
    expiryDate: user.expiryDate,
    ipWhitelist: user.ipWhitelist,
    maxDevices: user.maxDevices
  };
}
```

**PUT /users/:userId/security-settings** (Admin only)
```typescript
async updateSecuritySettings(userId: string, settings: any) {
  const user = await this.userRepository.findOne({
    where: { _id: new ObjectId(userId) }
  });

  Object.assign(user, settings);
  await this.userRepository.save(user);

  // If user is a client, also update client
  const client = await this.clientRepository.findOne({
    where: { userId: new ObjectId(userId) }
  });
  if (client) {
    Object.assign(client, settings);
    await this.clientRepository.save(client);
  }

  return this.getSecuritySettings(userId);
}
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Admin Updates Client Security Settings                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────────┐
        │ PUT /clients/:id           │
        │ { requireTwoFactor: true } │
        └────────────┬───────────────┘
                     │
                     ↓
        ┌────────────────────────────────────────┐
        │ ClientManagementService.updateClient() │
        └────────────┬───────────────────────────┘
                     │
                     ↓
        ┌────────────────────────────────────────┐
        │ syncClientSecurityToUser()             │
        │ • Copy all security fields             │
        │ • Save to User entity                  │
        └────────────┬───────────────────────────┘
                     │
                     ↓
        ┌────────────────────────────────────────┐
        │ User Login                             │
        │ • Check expiryDate                     │
        │ • Check businessHours                  │
        │ • Check 2FA requirement                │
        │ • Validate IP whitelist                │
        └────────────────────────────────────────┘
```

## Benefits of This Approach

✅ **Single Source of Truth**: Client entity is the master for security settings
✅ **Fast Login**: All settings available in User entity (no joins needed)
✅ **Consistency**: Sync ensures User always has latest settings
✅ **Flexibility**: Can update via Client or User endpoints
✅ **Backward Compatible**: Existing User fields unchanged
✅ **Easy Auditing**: Can track changes in both entities
✅ **Performance**: No additional queries during login

## Migration for Existing Clients

```typescript
async migrateClientSecurityToUsers() {
  const clients = await this.clientRepository.find();
  
  for (const client of clients) {
    if (client.userId) {
      const user = await this.userRepository.findOne({
        where: { _id: client.userId }
      });
      if (user) {
        await this.syncClientSecurityToUser(client, user);
      }
    }
  }
}
```

## Summary

**Best Practice**: Maintain security settings in both entities with Client as source of truth. Sync to User on every Client update. This provides:
- Fast authentication (no joins)
- Consistency (sync ensures alignment)
- Flexibility (manage from either entity)
- Scalability (ready for future features)
