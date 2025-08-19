# Enhanced MCP Server for AI Agents

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start enhanced MCP server
npm run mcp:start

# Development with auto-restart
npm run mcp:dev

# Test the server
npm run mcp:test
```

## 🔧 What's Fixed

### Security Issues ✅
- **CORS Policy**: Restricted to trusted origins only
- **Input Validation**: All inputs sanitized before processing
- **Code Injection**: Eliminated unsafe page.evaluate calls

### Performance Optimizations ✅
- **Single DOM Query**: Combined multiple page.evaluate calls
- **Module Loading**: All imports moved to top level
- **Memory Management**: Proper browser lifecycle management

### MCP Protocol Compliance ✅
- **JSON-RPC 2.0**: Full protocol implementation
- **Tool Registry**: Complete tool discovery system
- **Error Handling**: Proper error codes and messages
- **WebSocket Support**: Real-time communication

## 🛠️ Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `screenshot` | Take page screenshot | None |
| `analyzeUI` | Analyze accessibility & theme | None |
| `click` | Click element | `selector` |
| `type` | Type text into element | `selector`, `text` |
| `navigate` | Navigate to URL | `url` |
| `wait` | Wait for element | `selector`, `timeout` |
| `scroll` | Scroll page | `direction`, `amount` |
| `getElements` | Get elements by selector | `selector` |

## 🌐 Endpoints

- **HTTP MCP**: `http://localhost:8931/mcp`
- **WebSocket**: `ws://localhost:8932`
- **Screenshot**: `http://localhost:8931/screenshot`
- **Analysis**: `http://localhost:8931/analyze`
- **Config**: `http://localhost:8931/config`

## 🤖 AI Agent Integration

### For Zencoder/Claude Desktop
```json
{
  "mcpServers": {
    "bhuri-sap": {
      "command": "node",
      "args": ["mcp-server-improved.js"],
      "cwd": "/path/to/Bhuri-SAP"
    }
  }
}
```

### Example JSON-RPC Call
```bash
curl -X POST http://localhost:8931/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "click",
      "arguments": {"selector": "button.login"}
    },
    "id": 1
  }'
```

## 🔒 Security Features

- Trusted CORS origins only
- Input sanitization for all parameters
- Rate limiting ready
- Secure WebSocket connections
- No code injection vulnerabilities

## 📊 Monitoring

The server logs all operations and provides detailed error messages for debugging AI agent interactions.