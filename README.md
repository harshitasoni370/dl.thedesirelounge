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

The slices own loading, success, error, duplicate-request guards, and reservation submission state. Feature API helpers in `src/utils/` normalize responses and use the shared client in `src/utils/apiClient.js`. Feature requests use `VITE_API_BASE_URL`. Website and QR context lookups use the same-origin `/domain-api/` proxy because that API host does not expose browser CORS headers.

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

The app reads the feature API base URL from `VITE_API_BASE_URL`. The production default is:

```env
VITE_API_BASE_URL=https://restaurents-api.cylsys.com/api
```

For UAT, point that variable at the UAT API before starting the app or building it.

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

The server serves `dist/`, provides SPA fallback, and proxies the website/QR context endpoints to the domain API.

## Deployment

Vercel uses `npm run build` and serves the generated `dist/` directory; its rewrites proxy the website/QR context endpoints. The packaged Node server provides the same proxy. IIS deployments need URL Rewrite and ARR reverse proxy enabled for the `Domain API proxy` rule; other static hosts need an equivalent same-origin proxy. Other API requests continue to go directly to `VITE_API_BASE_URL`, whose CORS configuration must allow the deployed website origin.

Create a release archive with:

```bash
npm run package
```

## Environment variables

- `VITE_API_BASE_URL`: upstream API base URL, including `/api`.
- `VITE_DOMAIN_API_BASE_URL`: domain/QR API base used by the Vite development proxy (defaults to the UAT API).
- `VITE_WEBSITE_DOMAIN`: optional domain override for local preview; otherwise website details are loaded for the current hostname.
- `DOMAIN_API_BASE_URL`: optional runtime override for the packaged Node server's domain/QR API proxy.
- `VITE_APP_ENV`: optional environment label shown in build metadata.
- `VITE_IMAGE_BASE_URL`: optional image host override.
- `VITE_MENU_APP_URL`, `VITE_WEBSITE_URL`, `VITE_CATEGORIES_URL`: optional external links.
- Website API `domainsJson` entries for `APP` and `WEBSITE` determine navigation destinations; the configured menu/website URLs remain fallbacks.
