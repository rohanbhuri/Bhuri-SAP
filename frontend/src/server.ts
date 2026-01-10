import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const browserDistFolder = join(import.meta.dirname, '../browser');
const indexPath = join(browserDistFolder, 'index.html');

const app = express();
let angularApp: AngularNodeAppEngine | null = null;

// Initialize Angular SSR with error handling
try {
  angularApp = new AngularNodeAppEngine();
  console.log('Angular SSR initialized successfully');
} catch (error) {
  console.warn(
    'Failed to initialize Angular SSR, falling back to static serving:',
    error instanceof Error ? error.message : String(error)
  );
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    ssr: angularApp ? 'available' : 'unavailable',
    timestamp: new Date().toISOString(),
  });
});

/**
 * SSR status endpoint
 */
app.get('/ssr-status', (req, res) => {
  res.json({
    ssr_enabled: !!angularApp,
    fallback_available: existsSync(indexPath),
  });
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 * Falls back to serving index.html if SSR fails or is unavailable.
 */
app.use((req, res, next) => {
  // If Angular SSR is not available, serve static files immediately
  if (!angularApp) {
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(500).send('Application not available');
    }
    return;
  }

  // Try SSR first
  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        // Fallback to client-side rendering
        if (existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send('Page not found');
        }
      }
    })
    .catch((error) => {
      console.warn(
        'SSR failed, falling back to client-side rendering:',
        error instanceof Error ? error.message : String(error)
      );
      // Serve the static index.html for client-side rendering
      if (existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res
          .status(500)
          .send('SSR Server unavailable - Please try refreshing the page');
      }
    });
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = Number(process.env['PORT']) || 4000;
  const host = process.env['HOST'] || '0.0.0.0';
  
  // Auto-detect environment and use appropriate binding
  const isProduction = process.env['NODE_ENV'] === 'production';
  const bindHost = isProduction ? '0.0.0.0' : 'localhost';
  
  app.listen(port, bindHost, (error) => {
    if (error) {
      throw error;
    }

    const displayHost = bindHost === '0.0.0.0' ? 'localhost' : bindHost;
    console.log(`🚀 Server running on http://${displayHost}:${port}`);
    console.log(`📁 Browser dir: ${browserDistFolder}`);
    console.log(`⚡ Prerender dir: ${browserDistFolder}`);
    console.log(`🔄 SSR fallback: http://${displayHost}:${port}`);
    
    if (isProduction) {
      console.log(`🌐 External access: Available on all network interfaces`);
    }
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

export default app;
