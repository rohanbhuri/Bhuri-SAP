import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import { request } from "node:http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const browserDir = join(__dirname, "/");
const prerenderDir = join(__dirname, "/");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
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

const ssrPort = process.env["SSR_PORT"] || 4000;

const proxyToSSR = (req, res) => {
  const options = {
    hostname: "localhost",
    port: ssrPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxy = request(options, (ssrRes) => {
    res.writeHead(ssrRes.statusCode, ssrRes.headers);
    ssrRes.pipe(res);
  });

  proxy.on("error", () => {
    // Fallback to client-side app shell if SSR is unavailable
    try {
      const candidates = [
        join(__dirname, "../dist/beax-rm/browser/index.html"),
        join(__dirname, "../dist/beax-rm/browser/index.html"),
        join(__dirname, "index.html"),
      ];
      for (const p of candidates) {
        if (existsSync(p)) {
          const content = readFileSync(p);
          res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store",
          });
          return res.end(content);
        }
      }
    } catch (e) {
      // ignore and fall back to 500
    }
    res.writeHead(500);
    res.end("SSR Server unavailable");
  });

  req.pipe(proxy);
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

    // Check prerendered routes
    const prerenderPath = join(prerenderDir, url, "index.html");
    if (existsSync(prerenderPath)) {
      const content = readFileSync(prerenderPath);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.writeHead(200);
      return res.end(content);
    }

    // Fallback to SSR server for non-prerendered routes
    return proxyToSSR(req, res);
  } catch (error) {
    console.error("Server error:", error);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
});

const port = process.env["PORT"] || 4200;
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📁 Browser dir: ${browserDir}`);
  console.log(
    `⚡ Prerender dir: ${existsSync(prerenderDir) ? prerenderDir : "Not found"}`
  );
  console.log(`🔄 SSR fallback: http://localhost:${ssrPort}`);
});
