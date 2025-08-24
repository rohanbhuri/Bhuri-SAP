const http = require('http');
const { WebSocketServer } = require('ws');
const { firefox } = require('playwright');
const { v4: uuidv4 } = require('uuid');

const PORT = 8931;
const WS_PORT = 8932;
const MIN_FOCUSABLE_ELEMENTS = 5;

// Trusted origins for CORS
const TRUSTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:4200', 
  'http://localhost:4201',
  'http://13.126.228.247:3000',
  'http://13.126.228.247:4200',
  'http://13.126.228.247:4201'
];

let browser = null;
let page = null;
let wsServer = null;

// MCP Tools Registry
const MCP_TOOLS = {
  screenshot: { description: 'Take screenshot of current page' },
  analyzeUI: { description: 'Analyze UI accessibility and theme' },
  click: { description: 'Click element by selector', parameters: { selector: 'string' } },
  type: { description: 'Type text into element', parameters: { selector: 'string', text: 'string' } },
  navigate: { description: 'Navigate to URL', parameters: { url: 'string' } },
  wait: { description: 'Wait for element or condition', parameters: { selector: 'string', timeout: 'number' } },
  scroll: { description: 'Scroll page', parameters: { direction: 'string', amount: 'number' } },
  getElements: { description: 'Get elements by selector', parameters: { selector: 'string' } }
};

// Input validation
function validateInput(input, type = 'string') {
  if (type === 'string') {
    return typeof input === 'string' ? input.replace(/[<>\"'&]/g, '') : '';
  }
  if (type === 'number') {
    return typeof input === 'number' && !isNaN(input) ? input : 0;
  }
  return input;
}

// CORS helper
function setCORSHeaders(res, origin) {
  const allowedOrigin = TRUSTED_ORIGINS.includes(origin) ? origin : TRUSTED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// JSON-RPC 2.0 response helper
function createJSONRPCResponse(id, result = null, error = null) {
  const response = { jsonrpc: '2.0', id };
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  return response;
}

// Get request body
async function getRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
  });
}

// Initialize browser
async function initBrowser() {
  if (browser) return;
  
  browser = await firefox.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  
  page = await browser.newPage({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.3"
  });
  
  // Navigate to app
  const port = process.env.APP_PORT || '4200';
  const host = process.env.NODE_ENV === 'production' ? '13.126.228.247' : 'localhost';
  const url = `http://${host}:${port}`;
  
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
    console.log('Browser initialized and navigated to:', url);
  } catch (error) {
    console.log('Frontend not ready, browser initialized without navigation');
  }
}

// MCP Tool implementations
async function executeTool(name, params = {}) {
  if (!page) await initBrowser();
  
  const safeParams = Object.keys(params).reduce((acc, key) => {
    acc[key] = validateInput(params[key], typeof params[key]);
    return acc;
  }, {});
  
  switch (name) {
    case 'screenshot':
      return await page.screenshot({ type: 'png', fullPage: true });
      
    case 'analyzeUI':
      return await analyzeUI();
      
    case 'click':
      if (!safeParams.selector) throw new Error('Selector required');
      await page.click(safeParams.selector);
      return { success: true, action: 'clicked', selector: safeParams.selector };
      
    case 'type':
      if (!safeParams.selector || !safeParams.text) throw new Error('Selector and text required');
      await page.fill(safeParams.selector, safeParams.text);
      return { success: true, action: 'typed', selector: safeParams.selector, text: safeParams.text };
      
    case 'navigate':
      if (!safeParams.url) throw new Error('URL required');
      await page.goto(safeParams.url, { waitUntil: 'networkidle' });
      return { success: true, action: 'navigated', url: safeParams.url };
      
    case 'wait':
      if (!safeParams.selector) throw new Error('Selector required');
      const timeout = safeParams.timeout || 5000;
      await page.waitForSelector(safeParams.selector, { timeout });
      return { success: true, action: 'waited', selector: safeParams.selector };
      
    case 'scroll':
      const direction = safeParams.direction || 'down';
      const amount = safeParams.amount || 500;
      await page.evaluate(({ direction, amount }) => {
        const scrollAmount = direction === 'up' ? -amount : amount;
        window.scrollBy(0, scrollAmount);
      }, { direction, amount });
      return { success: true, action: 'scrolled', direction, amount };
      
    case 'getElements':
      if (!safeParams.selector) throw new Error('Selector required');
      const elements = await page.evaluate((selector) => {
        const els = Array.from(document.querySelectorAll(selector));
        return els.map(el => ({
          tagName: el.tagName,
          textContent: el.textContent?.trim(),
          className: el.className,
          id: el.id
        }));
      }, safeParams.selector);
      return { elements, count: elements.length };
      
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Optimized UI analysis - single page.evaluate call
async function analyzeUI() {
  if (!page) return { error: 'Browser not initialized' };
  
  try {
    const analysis = await page.evaluate(() => {
      // Theme detection
      const body = document.body;
      const theme = {
        current: body.classList.contains('dark-theme') ? 'dark' : 
                 body.classList.contains('light-theme') ? 'light' : 'auto',
        systemPreference: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      };
      
      // Accessibility check
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const accessibility = {
        focusableElementsCount: focusableElements.length,
        colorContrast: {
          background: getComputedStyle(document.body).backgroundColor,
          color: getComputedStyle(document.body).color
        },
        hasSkipLinks: !!document.querySelector('[href="#main"], [href="#content"]'),
        hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0
      };
      
      // UI elements
      const uiElements = {
        cards: document.querySelectorAll('.mat-mdc-card').length,
        buttons: document.querySelectorAll('button').length,
        navigation: !!document.querySelector('mat-toolbar'),
        hasLogo: !!document.querySelector('.logo'),
        forms: document.querySelectorAll('form').length,
        inputs: document.querySelectorAll('input').length
      };
      
      return { theme, accessibility, uiElements };
    });
    
    // Add recommendations
    const recommendations = [];
    if (!analysis.accessibility.hasSkipLinks) {
      recommendations.push('Add skip links for better keyboard navigation');
    }
    if (analysis.accessibility.focusableElementsCount < MIN_FOCUSABLE_ELEMENTS) {
      recommendations.push('Ensure all interactive elements are keyboard accessible');
    }
    
    return {
      timestamp: new Date().toISOString(),
      ...analysis,
      recommendations
    };
    
  } catch (error) {
    return { error: error.message };
  }
}

// Handle MCP JSON-RPC requests
async function handleMCPRequest(request) {
  const { id, method, params } = request;
  
  try {
    switch (method) {
      case 'initialize':
        return createJSONRPCResponse(id, {
          protocolVersion: '2024-11-05',
          capabilities: { tools: MCP_TOOLS },
          serverInfo: { name: 'Bhuri-SAP MCP Server', version: '2.0.0' }
        });
        
      case 'tools/list':
        return createJSONRPCResponse(id, { tools: Object.keys(MCP_TOOLS).map(name => ({ name, ...MCP_TOOLS[name] })) });
        
      case 'tools/call':
        const { name, arguments: args } = params;
        const result = await executeTool(name, args);
        return createJSONRPCResponse(id, result);
        
      default:
        return createJSONRPCResponse(id, null, { code: -32601, message: 'Method not found' });
    }
  } catch (error) {
    return createJSONRPCResponse(id, null, { code: -32603, message: error.message });
  }
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  setCORSHeaders(res, origin);
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/mcp' && req.method === 'POST') {
    try {
      const body = await getRequestBody(req);
      const request = JSON.parse(body);
      const response = await handleMCPRequest(request);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(createJSONRPCResponse(null, null, { code: -32700, message: 'Parse error' })));
    }
  } else if (req.url === '/screenshot' && req.method === 'GET') {
    try {
      const screenshot = await executeTool('screenshot');
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(screenshot);
    } catch (error) {
      res.writeHead(500);
      res.end('Screenshot failed');
    }
  } else if (req.url === '/analyze' && req.method === 'GET') {
    try {
      const analysis = await executeTool('analyzeUI');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(analysis, null, 2));
    } catch (error) {
      res.writeHead(500);
      res.end('Analysis failed');
    }
  } else if (req.url === '/config' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      name: 'Bhuri-SAP MCP Server',
      version: '2.0.0',
      endpoints: {
        mcp: `http://localhost:${PORT}/mcp`,
        ws: `ws://localhost:${WS_PORT}`,
        screenshot: `http://localhost:${PORT}/screenshot`,
        analyze: `http://localhost:${PORT}/analyze`
      },
      tools: Object.keys(MCP_TOOLS)
    }, null, 2));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// WebSocket Server for real-time communication
wsServer = new WebSocketServer({ port: WS_PORT });

wsServer.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', async (data) => {
    try {
      const request = JSON.parse(data.toString());
      const response = await handleMCPRequest(request);
      ws.send(JSON.stringify(response));
    } catch (error) {
      ws.send(JSON.stringify(createJSONRPCResponse(null, null, { code: -32700, message: 'Parse error' })));
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Start servers
server.listen(PORT, async () => {
  const host = process.env.NODE_ENV === 'production' ? '13.126.228.247' : 'localhost';
  console.log(`🚀 Enhanced MCP Server running:`);
  console.log(`   HTTP: http://${host}:${PORT}/mcp`);
  console.log(`   WebSocket: ws://${host}:${WS_PORT}`);
  console.log(`   Screenshot: http://${host}:${PORT}/screenshot`);
  console.log(`   Analysis: http://${host}:${PORT}/analyze`);
  console.log(`   Config: http://${host}:${PORT}/config`);
  console.log(`\n🤖 AI Agent Tools: ${Object.keys(MCP_TOOLS).join(', ')}`);
  
  // Initialize browser
  await initBrowser();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down MCP server...');
  if (browser) await browser.close();
  if (wsServer) wsServer.close();
  server.close();
  process.exit();
});