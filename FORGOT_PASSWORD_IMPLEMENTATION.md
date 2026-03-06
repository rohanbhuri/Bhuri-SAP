# Forgot Password Implementation

## Overview
Implemented a secure forgot password feature with email-based password reset functionality for the User Management Module.

## API Endpoints

### 1. Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If the email exists in our system, a password reset link has been sent."
}
```

**Features:**
- Validates email exists in system
- Generates secure one-time reset token
- Token expires after 1 hour
- Sends email with reset link
- Returns generic success message (security best practice)

### 2. Change Password
**Endpoint:** `POST /api/auth/change-password`

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now login with your new password."
}
```

**Features:**
- Validates token is valid and not expired
- Ensures token hasn't been used before (one-time use)
- Hashes new password with bcrypt
- Marks token as used after successful reset

## Security Features

1. **Token Hashing:** Reset tokens are hashed using SHA-256 before storage
2. **One-Time Use:** Tokens can only be used once
3. **Time Expiry:** Tokens expire after 1 hour
4. **Generic Responses:** Doesn't reveal if email exists in system
5. **Secure Password Storage:** New passwords are hashed with bcrypt

## Database Changes

Added to User entity:
- `passwordResetToken` (string, nullable) - Hashed reset token
- `passwordResetExpires` (Date, nullable) - Token expiration timestamp
- `passwordResetUsed` (boolean, default: false) - Tracks if token was used

## Email Template

Professional email template includes:
- Clear reset password button
- Expiry warning (1 hour)
- Security notice
- Fallback link for email clients that don't support buttons
- Branded RACCONTI styling

## Example Reset Link

The password reset link will always point to your main website:

```
https://racconti.in/reset-password?token=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

This ensures a consistent user experience, even when the API is called from `https://xrm.racconti.in` or other subdomains.

## Frontend Integration

The main website (https://racconti.in) needs to:

1. Create a reset password page at `/reset-password`
2. Extract token from URL query parameter
3. Show password reset form
4. Call `/api/auth/change-password` with token and new password

## API Documentation

Updated the User Management API documentation to include both endpoints under the Authentication section, alongside login and logout endpoints.

## Testing

To test the implementation:

1. **Request Password Reset:**
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

2. **Check email for reset link**

3. **Reset Password:**
```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -d '{"token": "TOKEN_FROM_EMAIL", "newPassword": "newPassword123"}'
```

## Files Modified

### Backend
- `backend/src/auth/auth.controller.ts` - Added forgot-password and change-password endpoints
- `backend/src/auth/auth.service.ts` - Added password reset logic
- `backend/src/auth/auth.module.ts` - Imported NotificationsModule
- `backend/src/entities/user.entity.ts` - Added password reset fields
- `backend/src/notifications/mail.service.ts` - Added password reset email template

### Frontend
- `frontend/src/app/modules/user-management/pages/api-docs-page.component.ts` - Updated API documentation

## Next Steps

1. Create frontend reset password page at `/reset-password`
2. Add forgot password link on login page
3. Implement password strength validation on frontend
4. Consider adding rate limiting to prevent abuse
5. Add logging for password reset attempts
