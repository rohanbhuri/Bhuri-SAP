# Message Notification Sound Feature

## Overview
The messaging system now includes audio notifications to alert users when they receive new messages while working in other modules of the XRM application.

## How It Works

### Sound Playback Rules
1. **Sound WILL play** when:
   - User receives a message from another user
   - User is NOT currently on the messages page (`/messages`)
   - User is working in any other module (CRM, Projects, HR, etc.)

2. **Sound WILL NOT play** when:
   - User is actively viewing the messages page
   - User is chatting with someone in the messages component
   - Message is sent by the current user (own messages)

### Technical Implementation

#### Frontend Changes
**File**: `frontend/src/app/pages/messages/messages.component.ts`

1. **Audio Initialization**:
   - Audio file is loaded on component initialization
   - Volume is set to 50% for a pleasant notification experience
   - Sound URL: `{API_URL}/system-audio/mixkit-message-pop-alert-2354.mp3`

2. **Smart Notification Logic**:
   - `handleNewMessage()` method checks if the message is from another user
   - If message is for a different conversation (not currently active), sound plays
   - Router URL is checked to determine if user is on messages page

3. **Key Methods**:
   ```typescript
   initializeNotificationSound() // Loads the audio file
   playNotificationSound()       // Plays sound with route checking
   ```

#### Backend Changes
**File**: `backend/src/main.ts`

- Added static file serving for `/system-audio/` directory
- Audio file is now accessible via HTTP at: `{API_URL}/system-audio/mixkit-message-pop-alert-2354.mp3`

#### Audio File
**Location**: `backend/system-audio/mixkit-message-pop-alert-2354.mp3`
- Size: 46KB
- Format: MP3
- Duration: ~1 second
- Pleasant, non-intrusive notification sound

## User Experience

### Scenario 1: Working in Another Module
```
User is in CRM module → Receives message → Sound plays → User notices notification
```

### Scenario 2: Active Chat
```
User is chatting in Messages → Receives message in same chat → No sound → Message appears in list
```

### Scenario 3: Different Conversation
```
User is chatting with Person A → Receives message from Person B → Sound plays → User notices new conversation
```

## Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires user interaction before first sound play (browser autoplay policy)
- Falls back gracefully if audio fails to load

## Configuration
The notification sound can be customized by:
1. Replacing the MP3 file in `backend/system-audio/`
2. Adjusting volume in `initializeNotificationSound()` method (currently 0.5 = 50%)

## Testing
To test the notification sound:
1. Open XRM in two browser windows/tabs
2. Log in as different users in each
3. In Window 1: Navigate to any module (not Messages)
4. In Window 2: Send a message to User 1
5. Window 1 should play the notification sound

## Future Enhancements
Potential improvements:
- User preference to enable/disable sounds
- Different sounds for different notification types
- Volume control in user settings
- Desktop notifications integration
- Sound for mentions/important messages only
