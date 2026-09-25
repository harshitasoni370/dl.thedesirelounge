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

The slices own loading, success, error, duplicate-request guards, and reservation submission state. Feature API helpers in `src/utils/` normalize responses and use the shared direct client in `src/utils/apiClient.js`. Requests go directly to `VITE_API_BASE_URL`; the upstream API must allow the deployed website origin through CORS.

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

The app reads the API base URL from `VITE_API_BASE_URL`. The production default is:

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

The server serves `dist/` and provides SPA fallback. API traffic still goes directly from the browser to the configured upstream API.

## Deployment

Vercel uses `npm run build` and serves the generated `dist/` directory. Static hosts can deploy `dist/` directly. Make sure the upstream API CORS configuration allows the deployed website origin and permits the GET/POST headers used by reservations.

Create a release archive with:

```bash
npm run package
```

## Environment variables

- `VITE_API_BASE_URL`: upstream API base URL, including `/api`.
- `VITE_APP_ENV`: optional environment label shown in build metadata.
- `VITE_IMAGE_BASE_URL`: optional image host override.
- `VITE_MENU_APP_URL`, `VITE_WEBSITE_URL`, `VITE_CATEGORIES_URL`: optional external links.
