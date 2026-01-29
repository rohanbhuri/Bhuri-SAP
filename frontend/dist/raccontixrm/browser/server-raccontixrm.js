import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const browserDir = join(__dirname, "/");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
};

const server = createServer((req, res) => {
  const url = req.url || "/";

  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  try {
    // Handle static assets
    const staticPath = join(browserDir, url);
    if (existsSync(staticPath) && statSync(staticPath).isFile()) {
      const ext = extname(staticPath).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";
      const content = readFileSync(staticPath);

      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=31536000");
      res.writeHead(200);
      return res.end(content);
    }

    // Fallback to index.html for SPA routing
    // Only return index.html for requests that don't look like static assets
    const isStaticAsset = url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|webmanifest)$/) || url.includes('/config/assets/');

    if (!isStaticAsset) {
      const indexPath = join(browserDir, "index.html");
      if (existsSync(indexPath)) {
        const content = readFileSync(indexPath);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.writeHead(200);
        return res.end(content);
      }
    }

    res.writeHead(404);
    res.end("Not Found");
  } catch (error) {
    console.error("Server error:", error);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
});

const port = process.env["PORT"] || 4202;
server.listen(port, () => {
  console.log(`🚀 RaccontiXRM Server running on http://localhost:${port}`);
  console.log(`📁 Browser dir: ${browserDir}`);
});
