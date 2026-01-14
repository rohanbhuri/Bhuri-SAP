# WebSocket Architecture & Real-Time Communication

## Overview

The Bhuri SAP application uses Socket.IO for real-time communication, providing instant messaging, notifications, and live updates across the platform.

## Architecture Components

### Backend Components

#### 1. Messages Gateway (`backend/src/messages/messages.gateway.ts`)
- **Purpose**: Main WebSocket gateway for real-time messaging
- **Technology**: Socket.IO with NestJS WebSocket decorators
- **Authentication**: JWT token validation on connection

#### 2. Messages Service (`backend/src/messages/messages.service.ts`)
- **Purpose**: Business logic for messaging operations
- **Database**: MongoDB with TypeORM
- **Features**: Message CRUD, unread count calculation, conversation management

#### 3. Messages Controller (`backend/src/messages/messages.controller.ts`)
- **Purpose**: HTTP API endpoints for messaging
- **Integration**: Triggers WebSocket events after HTTP operations

### Frontend Components

#### 1. WebSocket Service (`frontend/src/app/services/websocket.service.ts`)
- **Purpose**: Socket.IO client wrapper
- **Features**: Connection management, room joining, event emission

#### 2. Messages API Service (`frontend/src/app/services/messages.service.ts`)
- **Purpose**: HTTP API client + WebSocket event handling
- **State**: Message count management, online user tracking

#### 3. App Component (`frontend/src/app/app.ts`)
- **Purpose**: Global WebSocket event handling
- **Scope**: Application-wide message count updates

## WebSocket Events

### Connection Events

#### `handleConnection`
```typescript
// Triggered when user connects
- Validates JWT token
- Joins user room: `user:${userId}`
- Joins organization rooms: `org:${orgId}`
- Sends initial unread count
- Updates user online status
```

#### `handleDisconnect`
```typescript
// Triggered when user disconnects
- Updates user offline status
- Broadcasts offline status to organizations
```

### Message Events

#### `message:new`
```typescript
// Real-time message delivery
Emitted to: conversation:${conversationId}
Payload: Message object
Recipients: Users actively viewing the conversation
```

#### `message:count`
```typescript
// Unread message count updates
Emitted to: user:${userId}
Payload: { count: number }
Recipients: All conversation participants
```

#### `message:send` (WebSocket)
```typescript
// Send message via WebSocket
Handler: handleSend()
Triggers: message:new + message:count events
```

#### `message:read`
```typescript
// Mark messages as read
Handler: handleMessageRead()
Triggers: messages:read + message:count events
```

### Notification Events

#### `notification:new`
```typescript
// New notification delivery
Emitted to: user:${userId} or org:${orgId}
Payload: Notification object
Recipients: Users not in conversation room
```

#### `notification:count`
```typescript
// Unread notification count
Emitted to: user:${userId}
Payload: { count: number }
Recipients: Notification recipients
```

### User Status Events

#### `user:online`
```typescript
// User comes online
Emitted to: org:${orgId}
Payload: { userId, timestamp }
```

#### `user:offline`
```typescript
// User goes offline
Emitted to: org:${orgId}
Payload: { userId, lastSeen }
```

### Typing Events

#### `typing:start` / `typing:stop`
```typescript
// Typing indicators
Emitted to: conversation:${conversationId}
Payload: { conversationId, userId, userName, isTyping }
```

## Room Management

### Room Types

1. **User Rooms**: `user:${userId}`
   - Purpose: Personal notifications, message counts
   - Auto-joined: On connection
   - Members: Individual user

2. **Organization Rooms**: `org:${orgId}`
   - Purpose: Organization-wide events, user status
   - Auto-joined: On connection (user's organizations)
   - Members: All organization members

3. **Conversation Rooms**: `conversation:${conversationId}`
   - Purpose: Real-time messaging, typing indicators
   - Manually joined: When viewing conversation
   - Members: Users actively in conversation

### Room Joining Logic

```typescript
// Automatic (on connection)
client.join(`user:${userId}`);
client.join(`org:${orgId}`);

// Manual (when viewing conversation)
wsService.joinRoom(`conversation:${conversationId}`);
```

## Message Flow

### Sending a Message

1. **HTTP Request**: `POST /messages/chat/:conversationId`
2. **Database**: Save message with `readBy: [senderId]`
3. **WebSocket Events**:
   - `message:new` → `conversation:${conversationId}` (other participants)
   - `message:count` → `user:${userId}` (all participants)
4. **Notifications**: Create notification for recipients not in conversation room

### Receiving a Message

#### Scenario 1: User in Conversation Room
```typescript
Receives: message:new event
Action: Display message in real-time
Count: Updated via message:count event
```

#### Scenario 2: User Not in Conversation Room
```typescript
Receives: notification:new event
Action: Show notification badge
Count: Updated via message:count event
```

## Unread Count Logic

### Calculation Method
```typescript
// For each conversation
const unreadCount = allMessages.filter(msg => {
  const readByIds = msg.readBy.map(id => String(id));
  return !readByIds.includes(userId);
}).length;
```

### Update Triggers
- New message sent
- Message marked as read
- User joins/leaves conversation

## Connection Management

### Authentication
```typescript
// Token validation on connection
const token = client.handshake.auth?.token;
const decoded = this.jwtService.verify(token);
```

### Reconnection
```typescript
// Frontend handles reconnection
- Automatic reconnection on disconnect
- Rejoin conversation rooms on reconnect
- Fetch updated counts on reconnect
```

### Error Handling
```typescript
// Invalid token → disconnect
// Connection errors → retry with backoff
// Event errors → log and continue
```

## Frontend Integration

### Global Event Handling (App Component)
```typescript
// Message count updates
if (msg?.type === 'message:count') {
  this.messagesService.setMessageCount(msg.payload.count);
}

// Notification handling
if (msg?.type === 'notification:new') {
  // Handled by NotificationsService
}
```

### Component-Level Handling (Messages Component)
```typescript
// Real-time message display
if (message?.type === 'message:new') {
  this.handleNewMessage(message.payload);
}

// Typing indicators
if (message?.type === 'typing:update') {
  this.handleTypingUpdate(message.payload);
}
```

## Performance Considerations

### Scalability
- Room-based event targeting (not broadcast)
- Efficient unread count calculation
- Connection pooling and management

### Optimization
- Event debouncing for typing indicators
- Batch message count updates
- Lazy loading of conversation history

### Memory Management
- Automatic cleanup on disconnect
- Limited message history in memory
- Garbage collection of old events

## Security

### Authentication
- JWT token validation on every connection
- Token refresh handling
- Secure WebSocket transport (WSS in production)

### Authorization
- Room-based access control
- User can only join their own rooms
- Message visibility based on conversation membership

### Data Validation
- Input sanitization on all events
- Rate limiting on message sending
- Payload size limits

## Monitoring & Debugging

### Logging
```typescript
// Connection events
console.log(`Client ${client.id} connected with user: ${userId}`);

// Message events
console.log(`Emitting message count ${count} to user ${userId}`);

// Error events
console.error('Failed to emit message count updates:', error);
```

### Health Checks
- Connection status monitoring
- Event delivery confirmation
- Performance metrics tracking

## Deployment Configuration

### Production Settings
```typescript
// Socket.IO configuration
cors: { origin: process.env.FRONTEND_URL },
transports: ['websocket', 'polling'],
pingTimeout: 60000,
pingInterval: 25000
```

### Environment Variables
- `WEBSOCKET_PORT`: WebSocket server port
- `JWT_SECRET`: Token validation secret
- `REDIS_URL`: Session store (if using Redis adapter)

## Future Enhancements

### Planned Features
- Message reactions real-time updates
- File upload progress indicators
- Voice/video call signaling
- Screen sharing coordination

### Scalability Improvements
- Redis adapter for multi-server deployment
- Message queue integration
- Horizontal scaling support
- Load balancing strategies

---

## Quick Reference

### Event Types
- **Messages**: `message:new`, `message:count`, `message:read`
- **Notifications**: `notification:new`, `notification:count`
- **User Status**: `user:online`, `user:offline`
- **Typing**: `typing:start`, `typing:stop`

### Room Patterns
- **User**: `user:${userId}`
- **Organization**: `org:${orgId}`
- **Conversation**: `conversation:${conversationId}`

### Key Files
- Backend Gateway: `backend/src/messages/messages.gateway.ts`
- Frontend Service: `frontend/src/app/services/websocket.service.ts`
- Global Handler: `frontend/src/app/app.ts`