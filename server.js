/**
 * Standalone production server (zero dependencies).
 *
 * Use karo jab hosting Vercel nahi hai — IIS + iisnode, Plesk, cPanel Node app,
 * Docker, ya koi bhi Node host. Ye dist/ serve karta hai aur SPA fallback deta hai.
 *
 *   npm run build:production
 *   node server.js            (ya: PORT=8080 node server.js)
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");
const PORT = Number(process.env.PORT || 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
};

function sendFile(res, filePath, { immutable = false } = {}) {
  const ext = path.extname(filePath).toLowerCase();
  res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
  res.setHeader(
    "Cache-Control",
    immutable ? "public, max-age=31536000, immutable" : "no-cache",
  );
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);

  // Health check (hosting/monitoring ke liye)
  if (pathname === "/healthz") {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        ok: true,
        build: "static",
      }),
    );
    return;
  }

  // Static files (path traversal se safe)
  const candidate = path.join(DIST, pathname);
  const safePath = path.normalize(candidate);
  if (safePath.startsWith(DIST) && fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    sendFile(res, safePath, { immutable: pathname.startsWith("/assets/") });
    return;
  }

  // SPA fallback
  const indexPath = path.join(DIST, "index.html");
  if (!fs.existsSync(indexPath)) {
    res.statusCode = 500;
    res.end("dist/index.html nahi mila. Pehle `npm run build:production` chalao.");
    return;
  }
  res.statusCode = 200;
  sendFile(res, indexPath);
});

server.listen(PORT, () => {
  console.log(`[The-desire-lounge] listening on http://localhost:${PORT}`);
  console.log("[The-desire-lounge] API handling : Redux direct upstream calls");
});
