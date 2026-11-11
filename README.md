# The desire Lounge

Vite + React SPA for The desire Lounge. All application API requests are managed by Redux Toolkit async thunks. There is no local `api/` proxy folder.

## API architecture 

Each feature has a Redux slice under `src/store/slices/`:

- `qrContextSlice.js`
- `gamesSlice.js`
- `customMomentsSlice.js`
- `celebrationPackagesSlice.js`
- `membershipSlice.js`
- `reservationSlice.js`
- `menuSlice.js`

The slices own loading, success, error, duplicate-request guards, and reservation submission state. Feature API helpers in `src/utils/` normalize responses and use the shared client in `src/utils/apiClient.js`. Feature requests use `VITE_API_BASE_URL`. Website and QR context use the same-origin `/domain-api/` proxy. `QR/checkDevice` uses the configured `/api/` Vite proxy in development and `/domain-api/` in production, avoiding browser CORS in both environments.

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

The app reads the feature API base URL from `VITE_API_BASE_URL`. In development, QR `checkDevice` requests use Vite's same-origin `/api/` proxy to that base URL. The production default is:

```env
VITE_API_BASE_URL=https://restaurents-api.cylsys.com/api
```

For UAT, point that variable at the UAT API before starting the app or building it.

When `QR/checkDevice` returns `isReturning: true`, the Free Wi-Fi page shows a QR code. Scanning it opens sample Wi-Fi credentials; configure `VITE_WIFI_DEMO_QR_BASE_URL` when local QR scans need a LAN or public URL instead of localhost.

## Build and preview

```bash
npm run build
npm run preview
```

`npm run build` only builds the static app. It does not start a background server or require a local API folder.

For a Node static server:

```bash
npm run build
npm run serve
```

The server serves `dist/`, provides SPA fallback, and proxies the website and QR endpoints to the domain API.

## Deployment

Vercel uses `npm run build` and serves the generated `dist/` directory; its rewrites proxy the website and QR endpoints to production. The packaged Node server provides the same proxy; set `API_BASE_URL` at runtime to point `checkDevice` at UAT or another API. IIS deployments need URL Rewrite and ARR reverse proxy enabled for the `Domain API proxy` rule; update its upstream for non-production deployments. Other API requests continue to go directly to `VITE_API_BASE_URL`, whose CORS configuration must allow the deployed website origin.

Create a release archive with:

```bash
npm run package
```

## Environment variables

- `VITE_API_BASE_URL`: upstream API base URL, including `/api`.
- `API_BASE_URL`: optional runtime override for the packaged Node server's `QR/checkDevice` proxy.
- Call-waiter endpoints use `VITE_API_BASE_URL`, so UAT/production switches apply to them too.
- `VITE_DOMAIN_API_BASE_URL`: domain/QR API base used by the Vite development proxy (defaults to the UAT API).
- `VITE_WEBSITE_DOMAIN`: domain used to resolve tenant/company context on localhost; the example config points to the UAT tenant. Live deployments always use the current hostname so multiple domains can share the same build.
- `DOMAIN_API_BASE_URL`: optional runtime override for the packaged Node server's domain/QR API proxy.
- `VITE_APP_ENV`: optional environment label shown in build metadata.
- `VITE_IMAGE_BASE_URL`: optional image host override.
- `VITE_MENU_APP_URL`, `VITE_WEBSITE_URL`, `VITE_CATEGORIES_URL`: optional external links.
- Website API `domainsJson` entries for `APP` and `WEBSITE` determine navigation destinations; the configured menu/website URLs remain fallbacks.
- Add active modules under an active `PRIMARY_NAVIGATION` header group in `Modules/GetHeadreModules` to show additional links in the lounge drawer. Each module should include its ID, name, type, active status, and optional `url`; without a URL, the app builds an internal module page from its ID and type. Module links retain the current QR/session query context. Fixed built-in links remain available.
- PlayStation and Board Games cards are loaded from `CardModule/GetCardModule`, using active `Playstation` and `Board Games` header modules to resolve their module IDs. Keep each card's active status and display order accurate in the admin panel.
- Game-page copy, instructions, rules, and the featured/game-of-the-week footer panels are currently static page content; making those admin-editable needs a page-content API keyed by page and section, with content, links, active status, and display order.
