# Message Notification Sound - Testing Guide

## Prerequisites
- Backend server running
- Frontend application running
- Two different user accounts
- Two browser windows/tabs or different browsers

## Test Scenarios

### Test 1: Sound Plays When Working in Other Modules
**Expected**: Sound should play

1. **Window 1** (User A):
   - Log in as User A
   - Navigate to Dashboard or any module (NOT Messages)
   - Keep window visible

2. **Window 2** (User B):
   - Log in as User B
   - Navigate to Messages
   - Start a conversation with User A
   - Send a message

3. **Verify**:
   - ✅ Window 1 should play notification sound
   - ✅ Message count badge should update in Window 1
   - ✅ No sound in Window 2 (sender)

---

### Test 2: No Sound When Actively Chatting
**Expected**: No sound should play

1. **Window 1** (User A):
   - Log in as User A
   - Navigate to Messages
   - Open conversation with User B
   - Keep chat window open

2. **Window 2** (User B):
   - Log in as User B
   - Navigate to Messages
   - Open conversation with User A
   - Send a message

3. **Verify**:
   - ❌ No sound should play in Window 1
   - ✅ Message appears immediately in chat
   - ✅ Message marked as read automatically

---

### Test 3: Sound Plays for Different Conversation
**Expected**: Sound should play

1. **Window 1** (User A):
   - Log in as User A
   - Navigate to Messages
   - Open conversation with User B
   - Keep this conversation active

2. **Window 2** (User C):
   - Log in as User C
   - Navigate to Messages
   - Start a conversation with User A
   - Send a message

3. **Verify**:
   - ✅ Window 1 should play notification sound
   - ✅ User C appears in conversation list with unread indicator
   - ✅ User A is still viewing conversation with User B

---

### Test 4: No Sound for Own Messages
**Expected**: No sound should play

1. **Single Window** (User A):
   - Log in as User A
   - Navigate to Messages
   - Open any conversation
   - Send a message

2. **Verify**:
   - ❌ No sound should play
   - ✅ Message appears in chat
   - ✅ Message shows as "sent"

---

### Test 5: Sound Plays When Messages Page Not Active
**Expected**: Sound should play

1. **Window 1** (User A):
   - Log in as User A
   - Navigate to Messages
   - View conversation list (no active conversation)
   - Navigate to another module (CRM, Projects, etc.)

2. **Window 2** (User B):
   - Log in as User B
   - Navigate to Messages
   - Send a message to User A

3. **Verify**:
   - ✅ Window 1 should play notification sound
   - ✅ Message count badge updates

---

## Audio File Verification

### Check Audio File Accessibility
```bash
# From project root
ls -lh backend/system-audio/mixkit-message-pop-alert-2354.mp3

# Should show: 46KB MP3 file
```

### Test Audio URL
Open in browser:
```
http://localhost:3000/system-audio/mixkit-message-pop-alert-2354.mp3
```
Should download or play the audio file.

---

## Troubleshooting

### Sound Not Playing
1. **Check browser console** for errors
2. **Verify audio file** is accessible via URL
3. **Check browser autoplay policy** - may need user interaction first
4. **Verify volume** is not muted in browser/system
5. **Check backend logs** for static file serving

### Sound Playing When It Shouldn't
1. **Check router URL** detection logic
2. **Verify activeConversationId** is set correctly
3. **Check console logs** for debugging info

### Audio File Not Found (404)
1. **Verify backend static file serving** in `main.ts`
2. **Check file path** in `system-audio` directory
3. **Restart backend server** after changes

---

## Browser Console Commands

### Check if sound is initialized
```javascript
// In browser console on Messages page
console.log('Notification sound loaded:', !!this.notificationSound);
```

### Manually test sound
```javascript
// Create and play test sound
const audio = new Audio('http://localhost:3000/system-audio/mixkit-message-pop-alert-2354.mp3');
audio.volume = 0.5;
audio.play();
```

---

## Expected Behavior Summary

| Scenario | User Location | Sound Plays? | Message Behavior |
|----------|---------------|--------------|------------------|
| New message in active chat | Messages (active chat) | ❌ No | Appears immediately, marked read |
| New message in different chat | Messages (different chat) | ✅ Yes | Unread indicator shown |
| New message | Other module | ✅ Yes | Badge count updates |
| New message | Messages list (no active chat) | ✅ Yes | Unread indicator shown |
| Own message | Any location | ❌ No | Normal send behavior |

---

## Performance Notes
- Audio file is loaded once on component initialization
- File size: 46KB (minimal impact)
- Sound duration: ~1 second
- Volume: 50% (configurable)
- No network request per notification (cached)

---

## Future Testing
- Test with multiple simultaneous messages
- Test with slow network connections
- Test with browser tab in background
- Test with system notifications enabled
- Test across different browsers (Chrome, Firefox, Safari, Edge)
