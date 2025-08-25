# Messages Module Testing Guide

## Backend Testing

### 1. Start the Backend Server
```bash
cd backend
npm run start:dev
```

### 2. Seed Sample Data (Optional)
```bash
cd backend
npm run seed:messages
```

### 3. Test API Endpoints

#### Get Organizations with Members
```bash
curl -X GET "http://localhost:3000/api/messages/org-members" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create/Get DM Conversation
```bash
curl -X POST "http://localhost:3000/api/messages/dm/ORG_ID/OTHER_USER_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### Send Message
```bash
curl -X POST "http://localhost:3000/api/messages/chat/CONVERSATION_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, this is a test message!"}'
```

#### Get Messages
```bash
curl -X GET "http://localhost:3000/api/messages/chat/CONVERSATION_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Frontend Testing

### 1. Start the Frontend Server
```bash
cd frontend
npm start
```

### 2. Navigate to Messages
- Open browser to `http://localhost:4201/messages`
- Login with valid credentials
- You should see the messages interface

### 3. Test Features

#### Basic Messaging
1. Click on a user from the sidebar
2. Type a message in the composer
3. Press Enter or click Send
4. Message should appear in the chat

#### Real-time Features
1. Open two browser windows/tabs
2. Login as different users
3. Start a conversation
4. Messages should appear in real-time
5. Test typing indicators

#### Search
1. Use the search box to filter users
2. Search should work in real-time

#### Reactions (if implemented)
1. Right-click on a message
2. Add emoji reactions
3. Reactions should appear below messages

## WebSocket Testing

### Connection Test
```javascript
// In browser console
const ws = new WebSocket('ws://localhost:3000');
ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Message:', e.data);
ws.send(JSON.stringify({type: 'join', payload: {room: 'user:USER_ID'}}));
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend URL
2. **WebSocket Connection Failed**: Check if WebSocket gateway is properly configured
3. **Messages Not Loading**: Verify JWT token and user permissions
4. **Real-time Not Working**: Check WebSocket connection and room joining

### Debug Steps

1. Check browser console for errors
2. Check backend logs for API errors
3. Verify database connections
4. Test API endpoints directly with curl/Postman

## Expected Behavior

### Sidebar
- Shows organizations with member lists
- Search filters members in real-time
- Online indicators (simulated)
- Unread message badges

### Chat Pane
- Shows conversation history
- Real-time message updates
- Typing indicators
- Message status indicators
- Emoji reactions
- File attachments (UI ready)

### Performance
- Messages load quickly
- Real-time updates are instant
- Search is responsive
- UI remains smooth during interactions