# WebSocket Authentication Fix

## Problem
WebSocket connections were failing with: `WebSocket: No authenticated user or user ID, skipping connection`

### Root Causes
1. **Timing Issue**: WebSocket service attempted connection before user authentication
2. **No Token Passing**: JWT token wasn't sent to the WebSocket server
3. **No Backend Validation**: Gateway didn't authenticate incoming connections

## Solution

### 1. Backend: JWT Authentication on Connection
**File**: `backend/src/messages/messages.gateway.ts`

- Added `OnGatewayConnection` and `OnGatewayDisconnect` interfaces
- Implemented JWT verification in `handleConnection()`
- Extracts token from `client.handshake.auth.token` or Authorization header
- Disconnects unauthenticated clients immediately
- Stores user data on socket for later use

```typescript
handleConnection(client: Socket) {
  const token = client.handshake.auth?.token || 
                client.handshake.headers?.authorization?.split(' ')[1];
  
  if (!token) {
    client.disconnect();
    return;
  }

  try {
    const decoded = this.jwtService.verify(token);
    client.data.userId = decoded.sub || decoded.userId;
    client.data.user = decoded;
  } catch (error) {
    client.disconnect();
  }
}
```

### 2. Frontend: Pass JWT Token on Connection
**File**: `frontend/src/app/services/websocket.service.ts`

- Updated `connect()` to require both user AND token
- Pass token in Socket.IO auth config:

```typescript
this.socket = io(socketUrl, {
  auth: { token },
  transports: ['websocket', 'polling'],
  // ... other options
});
```

- Added `isConnected()` helper method

### 3. Frontend: Auto-Connect After Login
**File**: `frontend/src/app/services/auth.service.ts`

- Injected `WebSocketService`
- Call `this.webSocketService.connect()` after successful login/signup
- Call `this.webSocketService.disconnect()` on logout

```typescript
login(credentials): Observable<AuthResponse> {
  return this.http.post(...).pipe(
    tap(response => {
      // ... store token and user
      this.webSocketService.connect();
    })
  );
}

logout(): void {
  // ... cleanup
  this.webSocketService.disconnect();
}
```

### 4. Backend: Enable JWT in Messages Module
**File**: `backend/src/messages/messages.module.ts`

- Added `JwtModule` import with same secret as auth module
- Allows gateway to verify tokens

## Testing

1. **Login**: User logs in → token stored → WebSocket auto-connects
2. **Connection**: Backend verifies token → socket authenticated
3. **Messages**: Real-time messaging works with authenticated socket
4. **Logout**: WebSocket disconnects cleanly

## Verification Steps

```bash
# 1. Check browser console for successful connection
# Should see: "Socket.IO connected successfully"

# 2. Check backend logs
# Should see: "Client [id] connected with user: [userId]"

# 3. Test messaging
# Send a message → should emit in real-time

# 4. Check Network tab
# WebSocket connection should show auth token in handshake
```

## Environment Variables

Ensure `JWT_SECRET` is set consistently:
- Backend: `process.env.JWT_SECRET`
- Messages Module: Uses same secret
- Frontend: Passes token from localStorage

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No authenticated user" | Ensure user is logged in before WebSocket connects |
| "Invalid token" | Check JWT_SECRET matches between auth and messages modules |
| Connection drops | Check token expiration, implement token refresh |
| CORS errors | Verify frontend URLs in gateway CORS config |

## Future Enhancements

1. **Token Refresh**: Implement token refresh before expiration
2. **Reconnection**: Add exponential backoff for reconnection attempts
3. **Multiple Rooms**: Auto-join organization/conversation rooms on connect
4. **Error Handling**: Emit specific error events for client-side handling
