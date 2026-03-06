# Password Reset API Documentation
## For Website Team Integration

---

## Overview

This document provides complete API documentation for implementing the forgot password feature on the RACCONTI website (https://racconti.in).

**Base URL:** `https://xrm.racconti.in/api/auth`

---

## API Endpoints

### 1. Request Password Reset

**Endpoint:** `POST /forgot-password`

**Description:** Initiates the password reset process by sending a reset link to the user's email.

**Authentication:** None required (Public endpoint)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Request Body Parameters:**

| Parameter | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| email     | string | Yes      | User's registered email address |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "If the email exists in our system, a password reset link has been sent."
}
```

**Notes:**
- Returns the same success message whether the email exists or not (security best practice)
- If email exists, a reset link will be sent to: `https://racconti.in/reset-password?token={token}`
- Token expires in 1 hour
- Token can only be used once

**Example cURL Request:**
```bash
curl -X POST https://xrm.racconti.in/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Example JavaScript (Fetch API):**
```javascript
async function requestPasswordReset(email) {
  try {
    const response = await fetch('https://xrm.racconti.in/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Password reset email sent');
      return data;
    }
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
}

// Usage
requestPasswordReset('user@example.com');
```

**Example JavaScript (Axios):**
```javascript
import axios from 'axios';

async function requestPasswordReset(email) {
  try {
    const response = await axios.post(
      'https://xrm.racconti.in/api/auth/forgot-password',
      { email }
    );
    
    if (response.data.success) {
      console.log('Password reset email sent');
      return response.data;
    }
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
}
```

---

### 2. Reset Password with Token

**Endpoint:** `POST /change-password`

**Description:** Resets the user's password using the token received via email.

**Authentication:** None required (Public endpoint)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  "newPassword": "newSecurePassword123"
}
```

**Request Body Parameters:**

| Parameter   | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| token       | string | Yes      | Reset token from email URL (64 characters)       |
| newPassword | string | Yes      | New password (minimum 6 characters)              |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now login with your new password."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired password reset token",
  "error": "Unauthorized"
}
```

**Error Scenarios:**
- Token has expired (> 1 hour old)
- Token has already been used
- Token is invalid or doesn't exist
- Token format is incorrect

**Example cURL Request:**
```bash
curl -X POST https://xrm.racconti.in/api/auth/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
    "newPassword": "newSecurePassword123"
  }'
```

**Example JavaScript (Fetch API):**
```javascript
async function resetPassword(token, newPassword) {
  try {
    const response = await fetch('https://xrm.racconti.in/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('Password reset successful');
      return data;
    } else {
      throw new Error(data.message || 'Password reset failed');
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}

// Usage
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
resetPassword(token, 'newSecurePassword123');
```

**Example JavaScript (Axios):**
```javascript
import axios from 'axios';

async function resetPassword(token, newPassword) {
  try {
    const response = await axios.post(
      'https://xrm.racconti.in/api/auth/change-password',
      { token, newPassword }
    );
    
    if (response.data.success) {
      console.log('Password reset successful');
      return response.data;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Invalid or expired token');
    } else {
      console.error('Error resetting password:', error);
    }
    throw error;
  }
}
```

---

## Complete User Flow

### Step 1: User Requests Password Reset
1. User visits forgot password page on website
2. User enters their email address
3. Website calls `POST /forgot-password` with email
4. User sees success message
5. User receives email with reset link

### Step 2: User Receives Email
Email contains:
- Reset link: `https://racconti.in/reset-password?token={64-char-token}`
- Expiry warning (1 hour)
- Security notice

### Step 3: User Resets Password
1. User clicks link in email
2. User lands on `https://racconti.in/reset-password?token=...`
3. Website extracts token from URL query parameter
4. User enters new password
5. Website calls `POST /change-password` with token and new password
6. User sees success message
7. User can now login with new password

---

## Frontend Implementation Guide

### 1. Forgot Password Page

Create a form to collect the user's email:

```html
<form id="forgotPasswordForm">
  <input 
    type="email" 
    id="email" 
    name="email" 
    placeholder="Enter your email"
    required 
  />
  <button type="submit">Send Reset Link</button>
  <div id="message"></div>
</form>

<script>
document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const messageDiv = document.getElementById('message');
  
  try {
    const response = await fetch('https://xrm.racconti.in/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (data.success) {
      messageDiv.innerHTML = '<p class="success">Check your email for reset instructions.</p>';
    }
  } catch (error) {
    messageDiv.innerHTML = '<p class="error">Something went wrong. Please try again.</p>';
  }
});
</script>
```

### 2. Reset Password Page

Create a page at `/reset-password` to handle the token:

```html
<form id="resetPasswordForm">
  <input 
    type="password" 
    id="newPassword" 
    name="newPassword" 
    placeholder="Enter new password"
    minlength="6"
    required 
  />
  <input 
    type="password" 
    id="confirmPassword" 
    name="confirmPassword" 
    placeholder="Confirm new password"
    minlength="6"
    required 
  />
  <button type="submit">Reset Password</button>
  <div id="message"></div>
</form>

<script>
// Extract token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
  document.getElementById('message').innerHTML = 
    '<p class="error">Invalid reset link. Please request a new one.</p>';
}

document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const messageDiv = document.getElementById('message');
  
  // Validate passwords match
  if (newPassword !== confirmPassword) {
    messageDiv.innerHTML = '<p class="error">Passwords do not match.</p>';
    return;
  }
  
  // Validate password length
  if (newPassword.length < 6) {
    messageDiv.innerHTML = '<p class="error">Password must be at least 6 characters.</p>';
    return;
  }
  
  try {
    const response = await fetch('https://xrm.racconti.in/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      messageDiv.innerHTML = '<p class="success">Password reset successful! Redirecting to login...</p>';
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      messageDiv.innerHTML = `<p class="error">${data.message || 'Invalid or expired reset link.'}</p>`;
    }
  } catch (error) {
    messageDiv.innerHTML = '<p class="error">Something went wrong. Please try again.</p>';
  }
});
</script>
```

---

## Security Features

1. **Token Hashing:** Tokens are hashed with SHA-256 before storage
2. **One-Time Use:** Each token can only be used once
3. **Time Expiry:** Tokens expire after 1 hour
4. **Generic Responses:** API doesn't reveal if email exists (prevents user enumeration)
5. **Secure Password Storage:** Passwords are hashed with bcrypt (10 rounds)
6. **HTTPS Only:** All API calls must use HTTPS

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired password reset token",
  "error": "Unauthorized"
}
```

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Testing

### Test Scenarios

1. **Valid Email:**
   - Request reset for existing user
   - Verify email is received
   - Click link and reset password
   - Login with new password

2. **Invalid Email:**
   - Request reset for non-existent email
   - Should still show success message
   - No email should be sent

3. **Expired Token:**
   - Wait > 1 hour after requesting reset
   - Try to use token
   - Should show error

4. **Used Token:**
   - Reset password successfully
   - Try to use same token again
   - Should show error

5. **Invalid Token:**
   - Use random/malformed token
   - Should show error

---

## Support

For technical support or questions, contact:
- Email: admin@purpul.in
- Development Team: deeksha@racconti.in, rosemary@racconti.in

---

## Changelog

**Version 1.0 - March 2026**
- Initial implementation
- Added forgot-password endpoint
- Added change-password endpoint
- Email notifications with branded template
- Security features: token hashing, expiry, one-time use
