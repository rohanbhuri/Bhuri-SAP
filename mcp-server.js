const http = require('http');
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PORT = 8931;
let browser = null;
let page = null;

const server = http.createServer(async (req, res) => {
  if (req.url === '/mcp' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    // Initialize browser if not already done
    if (!browser) {
      browser = await chromium.launch({ headless: false });
      page = await browser.newPage();
      
      // Wait for the frontend to be ready
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      try {
        const port = process.env.APP_PORT || '4200';
        const url = `http://localhost:${port}`;
        await page.goto(url, { waitUntil: 'networkidle' });
        console.log('Browser launched and navigated to UI at', url);
        
        // Take initial screenshot and analyze
        await analyzeUI();
      } catch (error) {
        console.log('Frontend not ready yet, will retry...');
      }
    }

    const response = {
      jsonrpc: '2.0',
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {
            analyzeUI: { description: 'Analyze UI accessibility and theme' },
            screenshot: { description: 'Take screenshot' }
          }
        }
      }
    };
    
    res.write(`data: ${JSON.stringify(response)}\n\n`);
    
    req.on('close', () => {
      res.end();
    });
  } else if (req.url === '/screenshot' && req.method === 'GET') {
    if (page) {
      const screenshot = await page.screenshot({ type: 'png', fullPage: true });
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(screenshot);
    } else {
      res.writeHead(404);
      res.end('Browser not initialized');
    }
  } else if (req.url === '/analyze' && req.method === 'GET') {
    if (page) {
      const analysis = await analyzeUI();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(analysis, null, 2));
    } else {
      res.writeHead(404);
      res.end('Browser not initialized');
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

async function analyzeUI() {
  if (!page) return null;
  
  try {
    // Check theme
    const theme = await page.evaluate(() => {
      const body = document.body;
      const isDark = body.classList.contains('dark-theme');
      const isLight = body.classList.contains('light-theme');
      return {
        current: isDark ? 'dark' : isLight ? 'light' : 'auto',
        systemPreference: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      };
    });
    
    // Check accessibility
    const accessibility = await page.evaluate(() => {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const colorContrast = {
        background: getComputedStyle(document.body).backgroundColor,
        color: getComputedStyle(document.body).color
      };
      
      return {
        focusableElementsCount: focusableElements.length,
        colorContrast,
        hasSkipLinks: !!document.querySelector('[href="#main"], [href="#content"]'),
        hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0
      };
    });
    
    // Check UI elements
    const uiElements = await page.evaluate(() => {
      return {
        cards: document.querySelectorAll('.mat-mdc-card').length,
        buttons: document.querySelectorAll('button').length,
        navigation: !!document.querySelector('mat-toolbar'),
        hasLogo: !!document.querySelector('.logo')
      };
    });
    
    const analysis = {
      timestamp: new Date().toISOString(),
      theme,
      accessibility,
      uiElements,
      recommendations: []
    };
    
    // Add recommendations
    if (!accessibility.hasSkipLinks) {
      analysis.recommendations.push('Add skip links for better keyboard navigation');
    }
    
    if (accessibility.focusableElementsCount < 5) {
      analysis.recommendations.push('Ensure all interactive elements are keyboard accessible');
    }
    
    console.log('UI Analysis:', JSON.stringify(analysis, null, 2));
    return analysis;
    
  } catch (error) {
    console.error('Analysis error:', error);
    return { error: error.message };
  }
}

server.listen(PORT, () => {
  console.log(`MCP Server running on http://localhost:${PORT}/mcp`);
  console.log(`Screenshot endpoint: http://localhost:${PORT}/screenshot`);
  console.log(`Analysis endpoint: http://localhost:${PORT}/analyze`);
});

process.on('SIGINT', async () => {
  if (browser) {
    await browser.close();
  }
  server.close();
  process.exit();
});