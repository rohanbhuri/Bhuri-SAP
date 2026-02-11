# Message Notification Sound - Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User A (Receiver)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ Dashboard  │  │    CRM     │  │  Messages  │                │
│  └────────────┘  └────────────┘  └────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ WebSocket Connection
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Server                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  WebSocket Gateway                                        │  │
│  │  - Receives message from User B                          │  │
│  │  - Broadcasts to User A                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Static File Server                                       │  │
│  │  - Serves: /system-audio/mixkit-message-pop-alert.mp3   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │ WebSocket Connection
                            │
┌─────────────────────────────────────────────────────────────────┐
│                         User B (Sender)                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Messages Component                         │    │
│  │  - Composes message                                    │    │
│  │  - Sends via HTTP POST                                 │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Message Flow with Sound Notification

### Scenario 1: User A in Dashboard (Sound Plays)

```
User B                Backend              User A (Dashboard)
  │                     │                         │
  │  Send Message       │                         │
  ├────────────────────>│                         │
  │                     │                         │
  │                     │  WebSocket: message:new │
  │                     ├────────────────────────>│
  │                     │                         │
  │                     │                    ┌────┴────┐
  │                     │                    │ Receive │
  │                     │                    │ Message │
  │                     │                    └────┬────┘
  │                     │                         │
  │                     │                    ┌────▼────────────┐
  │                     │                    │ Check Location  │
  │                     │                    │ NOT /messages   │
  │                     │                    └────┬────────────┘
  │                     │                         │
  │                     │                    ┌────▼────────────┐
  │                     │                    │ Play Sound 🔊   │
  │                     │                    │ Show Badge      │
  │                     │                    └─────────────────┘
```

### Scenario 2: User A in Active Chat (No Sound)

```
User B                Backend              User A (Messages - Active Chat)
  │                     │                         │
  │  Send Message       │                         │
  ├────────────────────>│                         │
  │                     │                         │
  │                     │  WebSocket: message:new │
  │                     ├────────────────────────>│
  │                     │                         │
  │                     │                    ┌────┴────┐
  │                     │                    │ Receive │
  │                     │                    │ Message │
  │                     │                    └────┬────┘
  │                     │                         │
  │                     │                    ┌────▼────────────┐
  │                     │                    │ Check Location  │
  │                     │                    │ IS /messages    │
  │                     │                    └────┬────────────┘
  │                     │                         │
  │                     │                    ┌────▼────────────┐
  │                     │                    │ Skip Sound 🔇   │
  │                     │                    │ Show Message    │
  │                     │                    │ Mark as Read    │
  │                     │                    └─────────────────┘
```

### Scenario 3: User A in Different Chat (Sound Plays)

```
User C                Backend              User A (Messages - Chat with User B)
  │                     │                         │
  │  Send Message       │                         │
  ├────────────────────>│                         │
  │                     │                         │
  │                     │  WebSocket: message:new │
  │                     ├────────────────────────>│
  │                     │                         │
  │                     │                    ┌────┴────┐
  │                     │                    │ Receive │
  │                     │                    │ Message │
  │                     │                    └────┬────┘
  │                     │                         │
  │                     │                    ┌────▼────────────────┐
  │                     │                    │ Check Conversation  │
  │                     │                    │ Different Conv ID   │
  │                     │                    └────┬────────────────┘
  │                     │                         │
  │                     │                    ┌────▼────────────┐
  │                     │                    │ Play Sound 🔊   │
  │                     │                    │ Show Unread     │
  │                     │                    └─────────────────┘
```

## Decision Tree

```
                    ┌─────────────────────┐
                    │  New Message        │
                    │  Received           │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Is from self?      │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  YES → NO SOUND     │
                    │  NO  → Continue     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────────────┐
                    │  Is for active conversation?│
                    └──────────┬──────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
         ┌──────▼──────┐              ┌──────▼──────┐
         │  YES        │              │  NO         │
         └──────┬──────┘              └──────┬──────┘
                │                             │
    ┌───────────▼───────────┐     ┌──────────▼──────────┐
    │ User on /messages?    │     │ Play Sound 🔊       │
    └───────────┬───────────┘     │ Show Unread Badge   │
                │                 └─────────────────────┘
    ┌───────────┴───────────┐
    │                       │
┌───▼────┐          ┌───────▼────┐
│  YES   │          │  NO        │
└───┬────┘          └───┬────────┘
    │                   │
┌───▼────────┐    ┌─────▼──────┐
│ NO SOUND   │    │ Play Sound │
│ Show Msg   │    │ Show Badge │
│ Mark Read  │    └────────────┘
└────────────┘
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────────┐
│              Messages Component                              │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ngOnInit()                                         │    │
│  │  - Initialize notification sound                   │    │
│  │  - Setup WebSocket listeners                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  handleNewMessage(message)                         │    │
│  │  1. Extract senderId                               │    │
│  │  2. Check if from self                             │    │
│  │  3. Check conversation ID                          │    │
│  │  4. Decide: play sound or not                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  playNotificationSound()                           │    │
│  │  1. Check router URL                               │    │
│  │  2. If NOT /messages → play sound                  │    │
│  │  3. If /messages → skip sound                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Audio Loading

```
Component Init
     │
     ▼
┌─────────────────────────────────────┐
│ initializeNotificationSound()       │
│                                     │
│ 1. Get API URL from BrandConfig    │
│ 2. Construct audio URL             │
│ 3. Create Audio object             │
│ 4. Set volume to 50%               │
│ 5. Cache in component              │
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ Audio Ready                         │
│ - Cached in browser                 │
│ - No network request per play       │
│ - Instant playback                  │
└─────────────────────────────────────┘
```

## State Management

```
┌──────────────────────────────────────────────────────────┐
│                    Component State                        │
│                                                           │
│  notificationSound: HTMLAudioElement | undefined         │
│  activeConversationId: Signal<string | null>             │
│  messages: Signal<Message[]>                             │
│  unreadMessages: Signal<{[userId: string]: boolean}>     │
│                                                           │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│                  Service Integration                      │
│                                                           │
│  WebSocketService → Real-time messages                   │
│  MessagesApiService → Unread tracking                    │
│  Router → Location detection                             │
│  BrandConfigService → API URL                            │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Error Handling

```
┌─────────────────────────────────────┐
│  Audio Initialization               │
└─────────────────┬───────────────────┘
                  │
    ┌─────────────▼─────────────┐
    │  Try to load audio        │
    └─────────────┬─────────────┘
                  │
    ┌─────────────▼─────────────┐
    │  Success?                 │
    └─────────────┬─────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
    ┌───▼────┐        ┌─────▼─────┐
    │  YES   │        │    NO     │
    └───┬────┘        └─────┬─────┘
        │                   │
        │            ┌──────▼──────┐
        │            │ Log Error   │
        │            │ Continue    │
        │            │ (Graceful)  │
        │            └─────────────┘
        │
┌───────▼────────┐
│ Audio Ready    │
│ Log Success    │
└────────────────┘
```

## Performance Considerations

```
┌─────────────────────────────────────────────────────────┐
│                    Performance                           │
│                                                          │
│  Audio File:                                            │
│  - Size: 46KB                                           │
│  - Loaded once on component init                        │
│  - Cached by browser                                    │
│  - No network overhead per notification                 │
│                                                          │
│  Playback:                                              │
│  - Async (non-blocking)                                 │
│  - Duration: ~1 second                                  │
│  - Reset to start before each play                      │
│                                                          │
│  Memory:                                                │
│  - Single Audio object                                  │
│  - Reused for all notifications                         │
│  - Cleaned up on component destroy                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```
