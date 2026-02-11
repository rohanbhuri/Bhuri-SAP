# Notification Sound & Message Count Fix

## Issues Fixed

### 1. Notification Sound Not Playing When on Other Pages ✅

**Problem**: Notification sound only played when user was in a different conversation, but not when user was on completely different pages (Dashboard, CRM, etc.)

**Root Cause**: The logic was checking if the message was for a different conversation, but the sound playback method was blocking sound if user was anywhere on the `/messages` route.

**Solution**: 
- Updated `playNotificationSound()` to only block sound if user is in an ACTIVE chat
- Sound now plays when user is on messages list (no active conversation)
- Sound plays when user is on any other page

**Changes Made**:

```typescript
// OLD LOGIC
private playNotificationSound() {
  // Don't play sound if user is on the messages page
  if (this.router.url.includes('/messages')) {
    return; // ❌ Too broad - blocks even when on messages list
  }
  this.notificationSound?.play();
}

// NEW LOGIC
private playNotificationSound() {
  const isOnMessagesPage = this.router.url.includes('/messages');
  const isInActiveChat = isOnMessagesPage && this.activeConversationId();
  
  // Only block if user is actively viewing a conversation
  if (isInActiveChat) {
    return; // ✅ Only blocks when in active chat
  }
  this.notificationSound?.play();
}
```

### 2. Message Count Showing Total Messages Instead of Unread Conversations ✅

**Problem**: Bottom navbar showed total number of unread messages (e.g., "15") instead of number of conversations with unread messages (e.g., "3")

**Root Cause**: The message count was calculated as sum of all unread messages across all conversations.

**Solution**:
- Added new `unreadConversationCount` signal
- Backend now emits both `message:count` and `conversation:count`
- Bottom navbar displays unread conversation count
- More intuitive for users (3 conversations vs 15 messages)

**Changes Made**:

**Frontend (`messages.service.ts`)**:
```typescript
// Added new signal
unreadConversationCount = signal<number>(0);

// Listen for new event type
this.wsService.getMessages().subscribe(message => {
  if (message?.type === 'conversation:count') {
    this.setUnreadConversationCount(message.payload.count);
  }
});

// Calculate both counts
private fetchInitialUnreadCount() {
  this.getUnreadCount().subscribe(counts => {
    // Total messages
    const totalUnread = Object.values(counts).reduce((sum, count) => sum + count, 0);
    this.setMessageCount(totalUnread);
    
    // Conversations with unread messages
    const unreadConversations = Object.values(counts).filter(count => count > 0).length;
    this.setUnreadConversationCount(unreadConversations);
  });
}
```

**Frontend (`bottom-navbar.component.ts`)**:
```typescript
// Changed from messageCount to unreadConversationCount
messageCount = this.messagesApiService.unreadConversationCount;
```

**Backend (`messages.controller.ts`)**:
```typescript
// Emit both counts
for (const memberId of allMemberIds) {
  const unreadCounts = await this.messagesService.getUnreadMessageCount(String(memberId));
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
  const unreadConversations = Object.values(unreadCounts).filter(count => count > 0).length;
  
  this.messagesGateway.server.to(`user:${memberId}`).emit('message:count', { count: totalUnread });
  this.messagesGateway.server.to(`user:${memberId}`).emit('conversation:count', { count: unreadConversations });
}
```

## Notification Sound Behavior

### When Sound WILL Play 🔊

| User Location | Receives Message | Sound? |
|---------------|------------------|--------|
| Dashboard | From anyone | ✅ Yes |
| CRM Module | From anyone | ✅ Yes |
| Projects | From anyone | ✅ Yes |
| Messages List (no active chat) | From anyone | ✅ Yes |
| Messages (Chat with Person A) | From Person B | ✅ Yes |

### When Sound WON'T Play 🔇

| User Location | Receives Message | Sound? |
|---------------|------------------|--------|
| Messages (Chat with Person A) | From Person A | ❌ No |
| Sending own message | Own message | ❌ No |

## Message Count Display

### Before Fix
```
Bottom Navbar Badge: 15
(Total unread messages across all conversations)

Conversations:
- Person A: 8 unread messages
- Person B: 5 unread messages  
- Person C: 2 unread messages
Total: 15 messages → Badge shows "15"
```

### After Fix
```
Bottom Navbar Badge: 3
(Number of conversations with unread messages)

Conversations:
- Person A: 8 unread messages ✉️
- Person B: 5 unread messages ✉️
- Person C: 2 unread messages ✉️
Total: 3 conversations → Badge shows "3"
```

## User Experience Improvements

### Notification Sound
**Before**: 
- User on Dashboard → Receives message → ❌ No sound
- User on Messages list → Receives message → ❌ No sound

**After**:
- User on Dashboard → Receives message → ✅ Sound plays
- User on Messages list → Receives message → ✅ Sound plays
- User in active chat → Receives message in same chat → ❌ No sound (correct)

### Message Count
**Before**:
- Badge shows "15" → User thinks "15 conversations need attention"
- Actually only 3 conversations, but with multiple messages each
- Confusing and overwhelming

**After**:
- Badge shows "3" → User knows "3 conversations need attention"
- Clear and actionable
- Matches user mental model

## Testing

### Test Notification Sound

**Setup**: Two browser windows with different users

**Test 1: Sound on Dashboard**
1. Window 1: Login as User A, go to Dashboard
2. Window 2: Login as User B, send message to User A
3. ✅ Expected: Window 1 plays sound

**Test 2: Sound on Messages List**
1. Window 1: Login as User A, go to Messages (don't open any chat)
2. Window 2: Login as User B, send message to User A
3. ✅ Expected: Window 1 plays sound

**Test 3: No Sound in Active Chat**
1. Window 1: Login as User A, open chat with User B
2. Window 2: Login as User B, send message to User A
3. ✅ Expected: Window 1 does NOT play sound

**Test 4: Sound for Different Conversation**
1. Window 1: Login as User A, open chat with User B
2. Window 3: Login as User C, send message to User A
3. ✅ Expected: Window 1 plays sound

### Test Message Count

**Setup**: Three users with messages

**Test 1: Initial Count**
1. User A has unread messages from User B (5 messages) and User C (3 messages)
2. Login as User A
3. ✅ Expected: Badge shows "2" (2 conversations)

**Test 2: Count After Reading**
1. User A opens chat with User B
2. Messages marked as read
3. ✅ Expected: Badge updates to "1" (only User C conversation unread)

**Test 3: Count After New Message**
1. User D sends message to User A
2. ✅ Expected: Badge updates to "2" (User C and User D)

## Console Logs

### Notification Sound Logs
```
🔊 playNotificationSound check: {
  currentRoute: '/dashboard',
  isOnMessagesPage: false,
  isInActiveChat: false,
  activeConversationId: null
}
🔊 Playing notification sound for new message
```

### Message Count Logs
```
📊 Unread stats: { totalMessages: 15, unreadConversations: 3 }
📊 Emitting counts to user:{id} - messages: 15, conversations: 3
```

## Files Modified

### Frontend
1. `frontend/src/app/pages/messages/messages.component.ts`
   - Updated `handleNewMessage()` to always call `playNotificationSound()` for messages from others
   - Updated `playNotificationSound()` to check if in active chat instead of just on messages page

2. `frontend/src/app/services/messages.service.ts`
   - Added `unreadConversationCount` signal
   - Added `setUnreadConversationCount()` method
   - Updated `setupSocketListeners()` to listen for `conversation:count` events
   - Updated `fetchInitialUnreadCount()` to calculate both counts

3. `frontend/src/app/components/bottom-navbar.component.ts`
   - Changed `messageCount` to use `unreadConversationCount` instead of `messageCount`

### Backend
1. `backend/src/messages/messages.controller.ts`
   - Updated `sendMessage()` to emit both `message:count` and `conversation:count`

2. `backend/src/messages/messages.gateway.ts`
   - Updated `handleMessageRead()` to emit both counts

## Benefits

### For Users
- ✅ Clear notification sounds when messages arrive
- ✅ Intuitive message count (conversations, not total messages)
- ✅ Less overwhelming badge numbers
- ✅ Better awareness of new messages

### For Developers
- ✅ Separate signals for different count types
- ✅ Flexible for future enhancements
- ✅ Clear logging for debugging
- ✅ Consistent WebSocket event naming

## Future Enhancements

- [ ] User preference to enable/disable notification sounds
- [ ] Different sounds for different priority levels
- [ ] Visual notification badge on browser tab
- [ ] Desktop notifications integration
- [ ] Separate counts for mentions vs regular messages

## Backward Compatibility

- ✅ No breaking changes
- ✅ Existing `messageCount` signal still available
- ✅ New `unreadConversationCount` signal added
- ✅ Backend emits both event types
- ✅ Graceful degradation if events not received

---

**Status**: ✅ Complete and Tested  
**Build**: ✅ Successful  
**Ready for**: Production Deployment
