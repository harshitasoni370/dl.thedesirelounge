const currentHost = typeof window !== "undefined" ? window.location.hostname : "";
const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
const tenantDomain = currentHost.replace(/^(dl|www)\./i, "");
const isLocalHost = !tenantDomain || tenantDomain === "localhost" || /^127\./.test(tenantDomain);
const defaultMenuAppUrl = isLocalHost
  ? "https://app.thedesirelounge.com"
  : `https://app.${tenantDomain}`;
const externalBaseUrl = (
  import.meta.env.VITE_WEBSITE_URL || currentOrigin || "https://thedesirelounge.com"
).replace(/\/+$/, "");
const menuAppUrl = import.meta.env.VITE_MENU_APP_URL || defaultMenuAppUrl;
const environment =
  import.meta.env.VITE_APP_ENV || (import.meta.env.MODE === "production" ? "production" : "uat");

/**
 * UPSTREAM_BASE -> browser se directly call hone wali .NET API.
 * API calls Redux thunks se isi configured base URL par jaati hain; same-origin
 * server-side API route ki zaroorat nahi hai.
 */
const CONFIGURED_API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "https://restaurents-api.cylsys.com/api"
).replace(/\/+$/, "");
const DOMAIN_API_PROXY_BASE = "/domain-api";
const UPSTREAM_BASE = import.meta.env.DEV
  ? (import.meta.env.VITE_API_PROXY_BASE || "/api").replace(/\/+$/, "")
  : CONFIGURED_API_BASE;
const WAITER_API_BASE = import.meta.env.DEV
  ? (import.meta.env.VITE_WAITER_API_PROXY_BASE || "/waiter-api").replace(/\/+$/, "")
  : CONFIGURED_API_BASE;

export const API = {
  upstreamBase: UPSTREAM_BASE,
  waiterBase: WAITER_API_BASE,
  upstream: {
    websiteByDomain: `${DOMAIN_API_PROXY_BASE}/WebsiteUrl/by-domain`,
    qrContext: `${DOMAIN_API_PROXY_BASE}/QR/qrcontext`,
    qrCheckDevice: `${UPSTREAM_BASE}/QR/checkDevice`,
    playstationGames: `${UPSTREAM_BASE}/Playstation/Playstationgamelist`,
    boardGames: `${UPSTREAM_BASE}/BoardGame/Boardgamelist`,
    customMoments: `${UPSTREAM_BASE}/CustomMoment/GetCustomMoments`,
    birthdayPackages: `${UPSTREAM_BASE}/Birthday/GetBirthdayPageData`,
    corporatePackages: `${UPSTREAM_BASE}/Corporate/GetCorporatePageData`,
    membership: `${UPSTREAM_BASE}/Membership/GetMembershipPageData`,
    reservationCategories: `${UPSTREAM_BASE}/Reservation/getReservationCategories`,
    createReservation: `${UPSTREAM_BASE}/Reservation/CraeteReservation`,
    headerModules: `${UPSTREAM_BASE}/Modules/GetHeadreModules`,
    cardModule: `${UPSTREAM_BASE}/CardModule/GetCardModule`,
    packageModuleItems: `${UPSTREAM_BASE}/Package/GetPackageModuleItems`,
  },
  waiter: {
    types: `${WAITER_API_BASE}/Waiter/Types`,
    create: `${WAITER_API_BASE}/Waiter/Create`,
    tables: `${WAITER_API_BASE}/Table/GetTableList`,
  },
};

export const MODULE_IDS = {
  birthday: "02861404-4450-4d04-8461-679f3e8e09e3",
  corporate: "02ea8929-ad23-47a0-b416-db1d0f33ec46",
  membership: "b38fa611-ea6c-4414-9398-fbe6ca1d314c",
  reservation: "3e340f23-d842-47f0-98e8-b0d458dc22dd",
  packages: "34636e48-b3d7-4961-bd91-6a73a2f8a85a",
  exclusiveOffers: "34636e48-b3d7-4961-bd91-6a73a2f8a85a",
  birthdayPackages: "34636e48-b3d7-4961-bd91-6a73a2f8a85a",
  corporatePackages: "34636e48-b3d7-4961-bd91-6a73a2f8a85a",
};

export const URLS = {
  api: {
    qrContext:API.upstream.qrContext,
    games: API.upstream.playstationGames,
    reservationCategories: API.upstream.reservationCategories,
    createReservation: API.upstream.createReservation,
    customMoments: API.upstream.customMoments,
    celebrationPackages: API.upstream.birthdayPackages,
    membership: API.upstream.membership,
  },
  app: {
    menu: import.meta.env.VITE_MENU_URL || "/menu",
    menuApp: menuAppUrl,
    categories: import.meta.env.VITE_CATEGORIES_URL || `${menuAppUrl}/categories`,
  },
  website: {
    home: externalBaseUrl,
    reserve: `${externalBaseUrl}/#reserve`,
    liveSports: import.meta.env.VITE_LIVE_SPORTS_URL || `${externalBaseUrl}/live-sports`,
    events: import.meta.env.VITE_EVENTS_URL || `${externalBaseUrl}/events`,
  },
  contact: {
    phone: "+971509002202",
    whatsapp: "https://wa.me/971509002202",
    whatsappBooking: (message) => `https://wa.me/971509002202?text=${encodeURIComponent(message)}`,
  },
  social: {
    instagram: "https://www.instagram.com/desire_lounge_dubai",
    facebook: "https://www.facebook.com/desiresheeshalounge",
    tiktok: "https://www.tiktok.com/@desiresheshalounge",
    googleReviews: "https://g.page/r/CTqZiSxwUeXCEBM/review",
    maps: "https://maps.app.goo.gl/ZEzx6gWvyT3cqzB7",
  },
  delivery: {
    talabat: "https://www.talabat.com/uae/fumes-and-flavours",
    noon: "https://food.noon.com/en-ae/outlet/FMSNDF5UDU",
    keeta: "https://url-eu.mykeeta.com/utfRzGMz",
    smiles: "https://smiles.ae/",
    deliveroo: "https://deliveroo.ae/",
    careem: "https://www.careem.com/",
  },
  assets: {
    menu: "/assets/data/menu.json",
    boardGames: "/assets/data/board-games.json",
    imageBase: (
      import.meta.env.VITE_IMAGE_BASE_URL || "https://restaurents-api.cylsys.com"
    ).replace(/\/+$/, ""),
  },
  environment,
};

export const QR_CONTEXT_PARAMS = [
  "tableCode",
  "type",
  "location",
  "name",
  "resturant",
  "restaurant",
  "companyId",
  "branchId",
  "tableId",
  "sessionId",
  "deviceId",
];
export const QR_CONTEXT_STORAGE_KEY = "desire_qr_context";
export const DEVICE_ID_STORAGE_KEY = "desire_device_id";
export const DEVICE_ID_FINGERPRINT_STORAGE_KEY = "desire_device_fp";
export const DEVICE_ID_PARAM = "deviceId";
export const DEFAULT_COUNTRY_CODE = "+91";
