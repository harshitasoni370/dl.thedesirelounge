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
const DOMAIN_API_BASE = (
  process.env.DOMAIN_API_BASE_URL ||
  process.env.VITE_DOMAIN_API_BASE_URL ||
  "https://restaurents-api.cylsys.com/api"
).replace(/\/+$/, "");
const API_BASE = (
  process.env.API_BASE_URL ||
  DOMAIN_API_BASE
).replace(/\/+$/, "");

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

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);

  const domainApiRoutes = new Map([
    ["/domain-api/WebsiteUrl/by-domain", "/WebsiteUrl/by-domain"],
    ["/domain-api/QR/qrcontext", "/QR/qrcontext"],
    ["/domain-api/QR/checkDevice", "/QR/checkDevice"],
  ]);
  const domainApiPath = domainApiRoutes.get(pathname);
  if (domainApiPath) {
    const allowedMethods = domainApiPath === "/QR/checkDevice" ? ["POST"] : ["GET"];
    if (!allowedMethods.includes(req.method)) {
      res.statusCode = 405;
      res.setHeader("Allow", allowedMethods.join(", "));
      res.end("Method not allowed");
      return;
    }

    try {
      const apiBase = domainApiPath === "/QR/checkDevice" ? API_BASE : DOMAIN_API_BASE;
      const upstreamUrl = new URL(`${apiBase}${domainApiPath}`);
      upstreamUrl.search = url.search;
      const body = req.method === "POST" ? await readRequestBody(req) : undefined;
      const upstreamResponse = await fetch(upstreamUrl, {
        method: req.method,
        headers: {
          Accept: "application/json",
          ...(req.headers["content-type"]
            ? { "Content-Type": req.headers["content-type"] }
            : {}),
        },
        body,
      });
      res.statusCode = upstreamResponse.status;
      res.setHeader(
        "Content-Type",
        upstreamResponse.headers.get("content-type") || "application/json",
      );
      const cacheControl = upstreamResponse.headers.get("cache-control");
      if (cacheControl) res.setHeader("Cache-Control", cacheControl);
      res.end(Buffer.from(await upstreamResponse.arrayBuffer()));
    } catch (error) {
      console.error(`[The-desire-lounge] domain API proxy failed: ${error.message}`);
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "Domain API is unavailable." }));
    }
    return;
  }

  if (pathname.startsWith("/domain-api/")) {
    res.statusCode = 404;
    res.end("Domain API route not found");
    return;
  }

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
