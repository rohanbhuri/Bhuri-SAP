# Messages Real-Time Fix - Implementation Summary

## Issues Fixed

### 1. **WebSocket Connection Not Persistent**
- **Problem**: WebSocket only connected once on app init, not reconnecting after auth changes
- **Solution**: Modified `app.ts` to connect WebSocket when user authenticates and disconnect on logout

### 2. **Message Count Not Updating Globally**
- **Problem**: Badge count in bottom navbar only updated when on `/messages` page
- **Solution**: 
  - Backend now emits `message:count` event to user's room on connection
  - Backend emits updated count to recipients after new messages
  - Frontend listens to `message:count` events globally via WebSocket
  - Message count decrements when messages are marked as read

### 3. **Online/Offline Status Not Tracked**
- **Problem**: No green dot indicator for online users
- **Solution**:
  - Added `isOnline` and `lastSeen` fields to User entity
  - Backend updates user status on WebSocket connect/disconnect
  - Backend broadcasts `user:online` and `user:offline` events to organization rooms
  - Frontend tracks online users in a signal and displays green dot indicator

## Changes Made

### Backend Changes

#### 1. `backend/src/entities/user.entity.ts`
- Added `isOnline: boolean` field (default: false)
- Added `lastSeen: Date` field for tracking last activity

#### 2. `backend/src/messages/messages.gateway.ts`
- Added `userRepo` reference for updating user status
- Modified `handleConnection()`:
  - Updates user online status in database
  - Broadcasts `user:online` event to organization rooms
  - Sends initial unread count to connected user
- Modified `handleDisconnect()`:
  - Updates user offline status in database
  - Broadcasts `user:offline` event to organization rooms
- Added `updateUserOnlineStatus()` helper method

### Frontend Changes

#### 1. `frontend/src/app/app.ts`
- Moved WebSocket initialization to auth subscription
- WebSocket connects when user is authenticated
- WebSocket disconnects when user logs out

#### 2. `frontend/src/app/services/messages.service.ts`
- Added `onlineUsers` signal to track online user IDs
- Enhanced `setupSocketListeners()`:
  - Handles `message:count` events
  - Handles `message:new` events (increments count)
  - Handles `user:online` events (adds to online users set)
  - Handles `user:offline` events (removes from online users set)
- Added `isUserOnline(userId)` method
- Modified `markAsRead()` to refresh message count after marking as read
- Removed duplicate `onlineUsers` BehaviorSubject declaration

#### 3. `frontend/src/app/pages/messages/messages.component.ts`
- Modified `setupNotificationIntegration()` to join organization rooms
- Updated template to use `isUserOnline(m.id)` instead of `m.isOnline`
- Added `isUserOnline()` method that delegates to service

#### 4. `frontend/src/app/components/bottom-navbar.component.ts`
- Already using `messageCount` signal from `MessagesApiService`
- Badge automatically updates when signal changes

## How It Works Now

### Message Count Updates
1. User connects → Backend sends initial unread count via `message:count` event
2. New message arrives → Backend emits `message:count` to all recipients
3. User marks messages as read → Frontend fetches updated count and updates badge
4. Badge count visible on all routes, not just `/messages`

### Online Status Tracking
1. User connects → Backend sets `isOnline = true`, broadcasts to org rooms
2. User disconnects → Backend sets `isOnline = false`, updates `lastSeen`, broadcasts to org rooms
3. Frontend receives events and updates `onlineUsers` signal
4. Green dot appears next to online users in messages list
5. "Online" text shows for online users, "Last seen" for offline users

### Real-Time Messaging
1. User joins conversation → WebSocket joins `conversation:${id}` room
2. User joins organization → WebSocket joins `org:${id}` room for status updates
3. New message → Broadcast to conversation room
4. Message count → Broadcast to user's personal room
5. Online status → Broadcast to organization rooms

## Testing Checklist

- [ ] Open app in two different browsers/tabs with different users
- [ ] Verify green dot appears when user is online
- [ ] Verify green dot disappears when user closes tab/logs out
- [ ] Send message from User A to User B
- [ ] Verify User B sees badge count update on any route (not just /messages)
- [ ] Open messages page and verify count decrements when viewing conversation
- [ ] Verify "Online" text shows for online users
- [ ] Verify "Last seen" shows for offline users
- [ ] Test on mobile view to ensure badge is visible

## Architecture Benefits

1. **Centralized WebSocket Management**: Single connection managed at app level
2. **Signal-Based Reactivity**: Automatic UI updates when online status or message count changes
3. **Room-Based Broadcasting**: Efficient message delivery to relevant users only
4. **Persistent Connection**: WebSocket reconnects automatically on auth changes
5. **Global State**: Message count and online status available throughout the app

## Future Enhancements

- Add typing indicators that work across routes
- Add "delivered" and "read" receipts
- Add push notifications for new messages
- Add sound notifications for new messages
- Add desktop notifications API integration
- Add message preview in badge tooltip
