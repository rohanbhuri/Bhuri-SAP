# User Preferences Persistence Fix

## Issue
User preferences were not being saved to the database, causing a 401 Unauthorized error when trying to save preferences.

## Root Cause
The preferences endpoint requires JWT authentication, and there were potential issues with:
1. TypeORM MongoDB query syntax
2. Missing null checks for userId
3. Port mismatch (frontend calling wrong backend port)

## Changes Made

### Backend Changes

#### 1. Updated Preferences Service (`backend/src/preferences/preferences.service.ts`)
- Added null check for userId in `getUserPreferences()`
- Fixed TypeORM MongoDB queries with proper type casting (`as any`)
- Added error handling for missing userId in `saveUserPreferences()`

```typescript
async getUserPreferences(userId: string) {
  if (!userId) return null;
  const prefs = await this.userPreferencesRepository.findOne({ where: { userId } as any });
  return prefs || null;
}

async saveUserPreferences(userId: string, preferences: any) {
  if (!userId) throw new Error('User ID is required');
  
  const existing = await this.userPreferencesRepository.findOne({ where: { userId } as any });
  
  if (existing) {
    await this.userPreferencesRepository.update({ userId } as any, preferences);
    return this.userPreferencesRepository.findOne({ where: { userId } as any });
  } else {
    const newPreferences = this.userPreferencesRepository.create({ userId, ...preferences });
    return this.userPreferencesRepository.save(newPreferences);
  }
}
```

#### 2. Updated Preferences Controller (`backend/src/preferences/preferences.controller.ts`)
- Added authentication checks before processing requests
- Return null instead of error for unauthenticated GET requests
- Throw error for unauthenticated POST requests

```typescript
@Get()
async getUserPreferences(@Request() req) {
  if (!req.user?.userId) {
    return null;
  }
  return this.preferencesService.getUserPreferences(req.user.userId);
}

@Post()
async saveUserPreferences(@Request() req, @Body(ValidationPipe) preferencesDto: UserPreferencesDto) {
  if (!req.user?.userId) {
    throw new Error('User not authenticated');
  }
  return this.preferencesService.saveUserPreferences(req.user.userId, preferencesDto);
}
```

## How It Works

### Database Schema
Preferences are stored in the `user-preferences` collection with the following structure:

```typescript
{
  _id: ObjectId,
  userId: string (unique),
  theme: string (default: 'light'),
  primaryColor: string (default: '#1976d2'),
  accentColor: string (default: '#ff4081'),
  secondaryColor: string (default: '#424242'),
  currency: string (default: 'USD'),
  currencySymbol: string (default: '$'),
  pinnedModules: string[],
  dashboardPreferences: {
    widgets: [{
      id: string,
      size: 's' | 'm' | 'l',
      position: number
    }]
  }
}
```

### API Endpoints

#### GET /api/preferences
- Requires: JWT authentication
- Returns: User preferences or null if not found
- Response: `UserPreferences` object

#### POST /api/preferences
- Requires: JWT authentication
- Body: Partial `UserPreferences` object
- Creates new preferences if none exist
- Updates existing preferences if found
- Response: Updated `UserPreferences` object

#### POST /api/preferences/toggle-pinned-module
- Requires: JWT authentication
- Body: `{ moduleId: string }`
- Toggles module in pinnedModules array
- Response: Updated `UserPreferences` object

#### POST /api/preferences/dashboard
- Requires: JWT authentication
- Body: Dashboard preferences object
- Updates dashboard preferences
- Response: Updated `UserPreferences` object

## Testing

### Manual Testing
1. Login to the application
2. Go to Preferences page
3. Change any preference (theme, colors, currency)
4. Click Save
5. Refresh the page
6. Verify preferences are persisted

### Using Test Script
```bash
# Get your JWT token from browser localStorage
# Then run:
node tests/test-preferences.js <your-jwt-token>
```

## Troubleshooting

### 401 Unauthorized Error
**Cause**: User is not authenticated or token is invalid
**Solution**: 
- Ensure user is logged in
- Check if token exists in localStorage
- Verify token is being sent in Authorization header
- Check backend logs for authentication errors

### Port Mismatch Error
**Cause**: Frontend calling wrong backend port
**Solution**:
- BeaX RM: Backend on port 3000, Frontend on port 4200
- True Process: Backend on port 3001, Frontend on port 4201
- Check `brand-config.service.ts` for correct API URL

### Preferences Not Persisting
**Cause**: Database connection issue or MongoDB not running
**Solution**:
- Verify MongoDB is running
- Check `MONGODB_URI` environment variable
- Check backend logs for database errors
- Verify `user-preferences` collection exists

## Frontend Integration

The preferences are automatically loaded when:
1. User logs in
2. Application initializes
3. Preferences page is opened

The preferences are saved when:
1. User clicks Save in Preferences page
2. User toggles pinned modules
3. User rearranges dashboard widgets

## Notes
- Preferences are user-specific (tied to userId)
- Each user can have only one preferences document
- Preferences are created on first save
- Missing fields use default values from entity
- All preference updates are incremental (partial updates supported)
