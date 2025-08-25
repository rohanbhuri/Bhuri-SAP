# WebSocket Connection Troubleshooting Guide

## Issue Description

The frontend is attempting to connect to WebSocket but failing with the error:
```
WebSocket connection to 'ws://localhost:3001/' failed
```

## Root Cause Analysis

The issue appears to be related to WebSocket URL generation or backend WebSocket server configuration.

## ✅ Immediate Fixes Applied

### 1. Enhanced WebSocket Service Logging
- Added detailed logging to track URL generation
- Added better error handling and connection status tracking
- Made WebSocket connection failures non-blocking

### 2. Graceful Degradation
- Messages system now works without WebSocket connectivity
- HTTP API calls are the primary method for message persistence
- WebSocket is used only for real-time features when available

### 3. Connection Status Monitoring
- Components now check WebSocket connection status before using real-time features
- Fallback to HTTP-only mode when WebSocket is unavailable

## 🔧 Troubleshooting Steps

### Step 1: Verify Backend WebSocket Server

Check if the backend WebSocket server is running:

```bash
# In backend directory
npm run start:dev
```

Look for WebSocket server initialization logs.

### Step 2: Check WebSocket Gateway Configuration

Verify the WebSocket gateway in [`backend/src/messages/messages.gateway.ts`](backend/src/messages/messages.gateway.ts:1):

```typescript
@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway {
  // Should be listening on the same port as HTTP server
}
```

### Step 3: Verify Port Configuration

Check that both frontend and backend are using consistent ports:

**Frontend** ([`brand-config.service.ts`](frontend/src/app/services/brand-config.service.ts:43)):
```typescript
apiUrl: 'http://localhost:3000/api'
```

**Backend** (should be running on port 3000):
```bash
# Check if backend is running on correct port
netstat -an | grep 3000
```

### Step 4: Test WebSocket URL Generation

The WebSocket service should generate:
- API URL: `http://localhost:3000/api`
- WebSocket URL: `ws://localhost:3000`

Check browser console for WebSocket connection logs.

## 🚀 Solutions

### Solution 1: Fix WebSocket URL (Most Likely)

If the WebSocket URL is incorrect, update the [`getWebSocketUrl()`](frontend/src/app/services/websocket.service.ts:114) method:

```typescript
private getWebSocketUrl(): string {
  const apiUrl = this.brand.getApiUrl();
  // Ensure correct transformation
  // From: http://localhost:3000/api
  // To: ws://localhost:3000
  const wsUrl = apiUrl.replace(/^https?:/, 'ws:').replace(/\/api$/, '');
  return wsUrl;
}
```

### Solution 2: Backend WebSocket Configuration

Ensure the NestJS backend has WebSocket properly configured:

```typescript
// In main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for WebSocket
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  
  await app.listen(3000);
}
bootstrap();
```

### Solution 3: Alternative WebSocket Library

If issues persist, consider using Socket.IO instead of native WebSocket:

```bash
# Install Socket.IO
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

### Solution 4: Disable WebSocket (Temporary)

For immediate functionality, disable WebSocket connections:

```typescript
// In navbar.component.ts
private initializeNotifications() {
  // Comment out WebSocket connection
  // this.wsService.connect();
  
  // Keep notification service
  this.notificationsService.unreadCount$.subscribe(count => {
    this.unreadCount.set(count);
  });
}
```

## 🧪 Testing WebSocket Connection

### Manual Test

Open browser console and test WebSocket connection:

```javascript
// Test WebSocket connection manually
const ws = new WebSocket('ws://localhost:3000');
ws.onopen = () => console.log('WebSocket connected');
ws.onerror = (error) => console.error('WebSocket error:', error);
ws.onclose = (event) => console.log('WebSocket closed:', event.code, event.reason);
```

### Backend Health Check

Create a simple WebSocket test endpoint:

```typescript
// In messages.gateway.ts
@SubscribeMessage('ping')
handlePing(@ConnectedSocket() client: Socket) {
  client.emit('pong', { message: 'WebSocket is working!' });
}
```

## 📋 Current System Status

### ✅ Working Features (Without WebSocket)
- User authentication and login
- Organization and member loading
- Message sending and receiving (via HTTP)
- Conversation management
- Notification creation and storage
- Notification badge updates (via HTTP polling)

### ⚠️ Limited Features (Requires WebSocket)
- Real-time message delivery
- Live typing indicators
- Instant notification updates
- Cross-tab synchronization

## 🔄 Fallback Behavior

The system now gracefully handles WebSocket failures:

1. **Message Sending**: Uses HTTP API as primary method
2. **Notifications**: Falls back to HTTP polling
3. **Real-time Updates**: Disabled when WebSocket unavailable
4. **User Experience**: Core functionality remains intact

## 🎯 Next Steps

1. **Immediate**: Verify backend is running on port 3000
2. **Short-term**: Fix WebSocket URL generation if needed
3. **Long-term**: Consider implementing HTTP polling as backup for real-time features

The messaging system is now resilient and will work with or without WebSocket connectivity, ensuring users can always send and receive messages through the HTTP API.