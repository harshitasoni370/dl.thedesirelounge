import { useEffect, useRef } from "react";
import { pages } from "./pages";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQrContext,
  selectQrContext,
  selectQrContextStatus,
  selectDeviceId,
  selectReturningCustomer,
  selectIsReturningCustomer,
} from "./store/slices/qrContextSlice";
import { DEFAULT_CONTEXT } from "./utils/gamesApi";
import { DEFAULT_CUSTOM_MOMENT_CONTEXT } from "./utils/customMomentsApi";
import { fetchGames, selectGames } from "./store/slices/gamesSlice";
import { fetchCustomMoments, selectCustomMoments } from "./store/slices/customMomentsSlice";
import { fetchCelebrationPackages, selectCelebrationPackages } from "./store/slices/celebrationPackagesSlice";
import { fetchMembership, selectMembership } from "./store/slices/membershipSlice";
import { fetchReservationCategories, submitReservation } from "./store/slices/reservationSlice";
import { fetchHeaderModules, selectHeaderModules } from "./store/slices/modulesSlice";
import { fetchCardModule, selectCardModule } from "./store/slices/cardModuleSlice";
import { fetchPackageModuleItems, selectPackageModule } from "./store/slices/packageSlice";
import { MODULE_IDS, DEFAULT_COUNTRY_CODE } from "./config/urls";
import ExclusiveOffersPage from "./pages/ExclusiveOffersPage";
import { URLS } from "./config/urls";
import { getImageUrl } from "./utils/imageUrl";
import { notifyWhatsApp, buildReservationWhatsAppMessage } from "./utils/whatsapp";

const MENU_APP_URL = import.meta.env.VITE_MENU_APP_URL || "https://app.thedesirelounge.com";
const RESERVATION_URL = import.meta.env.VITE_RESERVATION_URL || "https://thedesirelounge.com/";
const LIVE_SPORTS_URL = import.meta.env.VITE_LIVE_SPORTS_URL || "https://thedesirelounge.com/live-sports";
const EVENTS_URL = import.meta.env.VITE_EVENTS_URL || "https://thedesirelounge.com/events";
const LOGO_URL = "https://restaurents-api.cylsys.com/Assets/theDesireLounge/Image/Logo/logo.webp";
const DEFAULT_RESERVATION_MODULE_ID = "3e340f23-d842-47f0-98e8-b0d458dc22dd";
const DEFAULT_CELEBRATION_MODULE_IDS = {
  birthday: "02861404-4450-4d04-8461-679f3e8e09e3",
  corporate: "02ea8929-ad23-47a0-b416-db1d0f33ec46",
};
const DEFAULT_MEMBERSHIP_MODULE_ID = "b38fa611-ea6c-4414-9398-fbe6ca1d314c";

function normalizePath(path) {
  if (!path || path === "/index.html" || path === "/index") return "/";
  if (path === "/events.html" || path === "/events") return "/sunday-brunch";
  if (path === "/live-sports.html" || path === "/live-sports") return "/";
  if (path === "/gallery.html" || path === "/gallery" || path === "/about.html" || path === "/about") return "/";
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

function buildMenuUrl(search, qrContext, pathname = "/", deviceId) {
  const inParams = new URLSearchParams(search);
  const data = qrContext?.data || {};
  const out = new URLSearchParams();

  const pick = ["companyId", "branchId", "tableId", "moduleId", "sessionId", "tableSessionId"];
  pick.forEach((key) => {
    const v = data[key] || inParams.get(key);
    if (v) out.set(key, v);
  });
  if (data.tableName || inParams.get("tableName")) out.set("tn", data.tableName || inParams.get("tableName"));
  if (inParams.get("category")) out.set("cat", inParams.get("category"));
  if (inParams.get("reservationCategory")) out.set("rc", inParams.get("reservationCategory"));
  if (inParams.get("reservationTitle")) out.set("rt", inParams.get("reservationTitle"));
  if (inParams.get("bookingType")) out.set("bt", inParams.get("bookingType"));
  if (inParams.get("step")) out.set("s", inParams.get("step"));
  if (inParams.get("hideSteps") === "true") out.set("hs", "1");
  if (inParams.get("hideCardIcon") === "true") out.set("hc", "1");
  if (inParams.get("gameId")) out.set("gid", inParams.get("gameId"));
  if (inParams.get("gameName")) out.set("gn", inParams.get("gameName"));
  if (inParams.get("categoryName")) out.set("cn", inParams.get("categoryName"));
  if (inParams.get("extraDetails")) out.set("xd", inParams.get("extraDetails"));
  if (inParams.get("price")) out.set("p", inParams.get("price"));
  if (inParams.get("momentId")) out.set("mid", inParams.get("momentId"));
  if (inParams.get("eventName")) out.set("en", inParams.get("eventName"));

  const dId = deviceId || qrContext?.deviceId || qrContext?.params?.deviceId || inParams.get("deviceId");
  if (dId) out.set("did", dId);

  const query = out.toString();
  return `${MENU_APP_URL}${pathname}${query ? `?${query}` : ""}`;
}

const SHORT_PARAM_ALIASES = {
  cid: "companyId",
  bid: "branchId",
  tid: "tableId",
  mid: "moduleId",
  mid_event: "momentId",
  sid: "sessionId",
  tn: "tableName",
  cat: "category",
  rc: "reservationCategory",
  rt: "reservationTitle",
  bt: "bookingType",
  s: "step",
  hs: "hideSteps",
  hc: "hideCardIcon",
  gid: "gameId",
  gn: "gameName",
  cn: "categoryName",
  xd: "extraDetails",
  p: "price",
  en: "eventName",
  did: "deviceId",
  cc: "countryCode",
  dob: "dateOfBirth",
  gc: "guestCount",
  gn_full: "guestName",
  sr: "specialRequest",
  mn: "mobile",
  em: "email",
  fn: "firstName",
  ln: "lastName",
  ir: "isReturning",
};

function resolveParam(search, key) {
  const params = new URLSearchParams(search);
  const long = params.get(key);
  if (long !== null && long !== undefined) return long;
  const shortKey = Object.entries(SHORT_PARAM_ALIASES).find(([, v]) => v === key)?.[0];
  if (shortKey) {
    const sv = params.get(shortKey);
    if (sv !== null && sv !== undefined) return sv;
  }
  if (SHORT_PARAM_ALIASES[key]) {
    const v = params.get(SHORT_PARAM_ALIASES[key]);
    if (v !== null && v !== undefined) return v;
  }
  return null;
}

function getExtraDetails(search) {
  const value = resolveParam(search, "extraDetails");
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
function getModuleIdByName(headers, moduleName) {
  if (!Array.isArray(headers) || !moduleName) return "";

  const normalizedName = moduleName.trim().toLowerCase();

  for (const header of headers) {
    const module = (header.modules || []).find(
      (item) =>
        item.moduleName?.trim().toLowerCase() === normalizedName &&
        item.status?.toUpperCase() === "ACTIVE"
    );

    if (module?.uidModuleId) {
      return module.uidModuleId;
    }
  }

  return "";
}

function buildGameMenuUrl(search, qrContext, type, game, deviceId, returningCustomer) {
  const ctx = getRequestContext(search, qrContext);
  const out = new URLSearchParams();
  if (ctx.companyId) out.set("cid", ctx.companyId);
  if (ctx.branchId) out.set("bid", ctx.branchId);
  if (ctx.tableId) out.set("tid", ctx.tableId);
  if (ctx.tableNumber) {
   out.set("tn", ctx.tableNumber);
}
  if (ctx.tableSessionId) out.set("sid", ctx.tableSessionId);
  out.set("mid", ctx.moduleId);
  out.set("cat", type === "playstation" ? "PLAYSTATION" : "BOARD_GAME");
  out.set("rc", "GAMING");
  out.set("rt", "Gaming");
  out.set("gid", game.id);
  out.set("gn", game.name);
  out.set("cn", type === "playstation" ? "PlayStation" : "Board Games");
  out.set("xd", JSON.stringify({ id: game.id, name: game.name }));
  out.set("s", "about-you");
  out.set("hs", "1");
  out.set("hc", "1");
  if (deviceId) out.set("did", deviceId);
  appendReturningParams(out, returningCustomer);
  return `${MENU_APP_URL}/checkout?${out.toString()}`;
}

function buildMomentMenuUrl(search, qrContext, moment, context, deviceId, returningCustomer) {
  const out = new URLSearchParams();
  if (context.companyId) out.set("cid", context.companyId);
  if (context.branchId) out.set("bid", context.branchId);
  if (context.tableSessionId) out.set("sid", context.tableSessionId);
  if (isGuid(context.tableId)) out.set("tid", context.tableId);
  if (context.tableNumber) {
   out.set("tn", context.tableNumber);
}
  out.set("mid", context.moduleId || "");
  out.set("cat", "EVENT");
  out.set("rc", "CUSTOM_MOMENT");
  out.set("rt", "Custom Moment");
  out.set("cn", "Custom Moments");
  out.set("en", moment.name);
  out.set("bt", "Custom Moment");
  if (moment.id) out.set("mid_event", moment.id);
  if (moment.price) out.set("p", moment.price);
  out.set("xd", JSON.stringify({
    id: moment.id,
    name: moment.name,
    price: moment.price || null,
  }));
  out.set("s", "about-you");
  out.set("hs", "1");
  out.set("hc", "1");
  if (deviceId) out.set("did", deviceId);
  appendReturningParams(out, returningCustomer);
  return `${MENU_APP_URL}/checkout?${out.toString()}`;
}

function buildPackageMenuUrl(search, qrContext, packageDetails, deviceId, returningCustomer) {
  const context = getRequestContext(search, qrContext);
  const price = String(packageDetails.price || "").match(/[\d.]+/)?.[0] || "";
  const extraDetails = {
    id: packageDetails.id || null,
    name: packageDetails.name,
    type: packageDetails.type,
    price: price || packageDetails.price || null,
  };
  const out = new URLSearchParams();
  const companyId = packageDetails.companyId || context.companyId;
  const branchId = packageDetails.branchId || context.branchId;
  const rawTableId = packageDetails.tableId || context.tableId;
  const tableSessionId = packageDetails.tableSessionId || context.tableSessionId;
  const tableNumber = packageDetails.tableNumber || context.tableNumber;
  if (companyId) out.set("cid", companyId);
  if (branchId) out.set("bid", branchId);
  if (isGuid(rawTableId)) out.set("tid", rawTableId);
  if (tableSessionId) out.set("sid", tableSessionId);
  if (tableNumber) out.set("tn", tableNumber);
  out.set("mid", packageDetails.moduleId || context.moduleId);
  out.set("cat", packageDetails.category);
  out.set("rc", packageDetails.category);
  out.set("rt", packageDetails.name);
  out.set("cn", packageDetails.categoryName);
  out.set("en", packageDetails.name);
  out.set("bt", packageDetails.bookingType);
  if (price) out.set("p", price);
  out.set("xd", JSON.stringify(extraDetails));
  out.set("s", "about-you");
  out.set("hs", "1");
  out.set("hc", "1");
  if (deviceId) out.set("did", deviceId);
  appendReturningParams(out, returningCustomer);
  return `${MENU_APP_URL}/checkout?${out.toString()}`;
}

function getPackageCheckoutDetails(href) {
  if (href.includes("book%20a%20Birthday%20Celebration")) {
    return {
      name: "Birthday Celebration Package",
      type: "birthday-package",
      categoryName: "Birthday Celebrations",
      category: "BIRTHDAY",
      bookingType: "Birthday Celebration",
    };
  }
  if (href.includes("enquire%20about%20Corporate%20Bookings")) {
    return {
      name: "Corporate Celebration Package",
      type: "corporate-package",
      categoryName: "Corporate Bookings",
      category: "CORPORATE",
      bookingType: "Corporate Booking",
    };
  }
  return null;
}

function getMembershipContext(search, qrContext, headerModules = []) {
  const context = getRequestContext(search, qrContext);
  const data = qrContext?.data || {};

  const membershipModuleId = getModuleIdByName(
    headerModules,
    "Desire Privilege Membership"
  );

  return {
    companyId:
      data.companyId ||
      resolveParam(search, "companyId") ||
      context.companyId ||
      "",

    branchId:
      data.branchId ||
      resolveParam(search, "branchId") ||
      context.branchId ||
      "",

    moduleId:
      membershipModuleId ||
      resolveParam(search, "moduleId") ||
      data.moduleId ||
      "",
  };
}

function hasMatchingParams(search, contextParams) {
  const currentParams = new URLSearchParams(search);
  return Object.entries(contextParams || {}).every(([key, value]) => currentParams.get(key) === value);
}

function getGameContext(search, qrContext) {
  const data = qrContext?.data || {};
  const companyId =
    data.companyId ||
    resolveParam(search, "companyId") ||
    resolveParam(search, "companyID");
  const branchId =
    data.branchId ||
    resolveParam(search, "branchId") ||
    resolveParam(search, "branchID");
  return companyId && branchId ? { companyId, branchId } : null;
}

function getRequestContext(search, qrContext) {
  const context = getGameContext(search, qrContext) || DEFAULT_CONTEXT;
  const data = qrContext?.data || {};
  return {
    ...context,
    tableId: data.tableId || resolveParam(search, "tableId") || "",
    moduleId: data.moduleId || resolveParam(search, "moduleId") || DEFAULT_RESERVATION_MODULE_ID,
    tableSessionId:
      data.tableSessionId ||
      data.sessionId ||
      resolveParam(search, "tableSessionId") ||
      resolveParam(search, "sessionId") ||
      "",
       tableNumber:
         data.tableNumber ||
         data.tableNo ||
         data.tableName ||
         resolveParam(search, "tableNumber") ||
         resolveParam(search, "tableNo") ||
         resolveParam(search, "tableName") ||
         "",
         
  };
}

function getCustomMomentContext(search, qrContext) {
  const data = qrContext?.data || {};
  return {
    companyId: data.companyId || resolveParam(search, "companyId") || DEFAULT_CUSTOM_MOMENT_CONTEXT.companyId,
    branchId: data.branchId || resolveParam(search, "branchId") || DEFAULT_CUSTOM_MOMENT_CONTEXT.branchId,
    typeId: data.typeId || resolveParam(search, "typeId") || DEFAULT_CUSTOM_MOMENT_CONTEXT.typeId,
    search: resolveParam(search, "momentSearch") || "",
    tableSessionId:
      data.tableSessionId ||
      data.sessionId ||
      resolveParam(search, "tableSessionId") ||
      resolveParam(search, "sessionId") ||
      DEFAULT_CUSTOM_MOMENT_CONTEXT.tableSessionId,
    tableId:
      data.tableId ||
      resolveParam(search, "tableId") ||
      data.tableNumber ||
      data.tableNo ||
      resolveParam(search, "tableNumber") ||
      resolveParam(search, "tableNo") ||
      "",
    moduleId: data.moduleId || resolveParam(search, "moduleId") || DEFAULT_CUSTOM_MOMENT_CONTEXT.moduleId,
  };
}

function isGuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || "");
}

function appendReturningParams(out, returningCustomer) {
  if (!returningCustomer) return;
  if (returningCustomer.firstName) out.set("fn", returningCustomer.firstName);
  if (returningCustomer.lastName) out.set("ln", returningCustomer.lastName);
  if (returningCustomer.guestName) out.set("gn_full", returningCustomer.guestName);
  if (returningCustomer.countryCode) out.set("cc", returningCustomer.countryCode);
  if (returningCustomer.mobile) out.set("mn", returningCustomer.mobile);
  if (returningCustomer.dateOfBirth) out.set("dob", returningCustomer.dateOfBirth);
  if (returningCustomer.email) out.set("em", returningCustomer.email);
  out.set("ir", "1");
}

function getReservationCategory(path) {
  if (path === "/birthday-celebrations") return "BIRTHDAY";
  if (path === "/corporate-bookings") return "CORPORATE";
  if (path === "/sunday-brunch") return "EVENT";
  if (path === "/make-it-your-moment") return "CUSTOM_MOMENT";
  if (path === "/playstation" || path === "/board-games") return "GAMING";
  if (path === "/exclusive-offers") return "EXCLUSIVE_OFFER";
  return "TABLE_RESERVATION";
}

function getReservationTitle(category) {
  const titles = {
    TABLE_RESERVATION: "Table Reservation",
    EVENT: "Event",
    LIVE_SPORTS: "Live Sports",
    GAMING: "Gaming",
    BOARD_GAME: "Board Game",
    EXCLUSIVE_OFFER: "Exclusive Offer",
    BIRTHDAY: "Birthday",
    CORPORATE: "Corporate",
    CUSTOM_MOMENT: "Custom Moment",
  };
  return titles[category] || "Table Reservation";
}

function isReservationTrigger(element) {
  if (element.matches("[data-game-session-link]")) return false;
  if (element.closest("#reserve-form")) return false;
  const text = element.textContent?.trim() || "";
  const href = element.getAttribute("href") || "";
  if (href.includes("#reserve")) return true;
  if (element.tagName === "BUTTON") {
    return /\b(reserve|reservation|book|booking)\b|request\s+(session|game)/i.test(text);
  }
  if (href.startsWith("/") && !href.includes("#")) return false;
  return /\b(reserve|reservation|book|booking)\b/i.test(text);
}

function openReservation(
  search,
  path,
  qrContext,
  setOpen,
  deviceId,
  headerModules = [],
  returningCustomer = null
) {
  const ctx = getRequestContext(search, qrContext);

  const reservationModuleId = getModuleIdByName(
    headerModules,
    "Reserve a Table"
  );

  const cat = getReservationCategory(path);
  const title = getReservationTitle(cat);

  const out = new URLSearchParams();

  if (ctx.companyId) out.set("cid", ctx.companyId);
  if (ctx.branchId) out.set("bid", ctx.branchId);
  if (ctx.tableId) out.set("tid", ctx.tableId);

  if (ctx.tableNumber) {
    out.set("tn", ctx.tableNumber);
  }

  if (ctx.tableSessionId) {
    out.set("sid", ctx.tableSessionId);
  }

  out.set(
    "mid",
    reservationModuleId ||
      resolveParam(search, "moduleId") ||
      ctx.moduleId ||
      ""
  );

  out.set("cat", cat);
  out.set("rc", cat);
  out.set("rt", title);
  out.set("bt", title);
  out.set("s", "about-you");
  out.set("hs", "1");
  out.set("hc", "1");

  if (deviceId) {
    out.set("did", deviceId);
  }

  appendReturningParams(out, returningCustomer);

  console.log("RESERVE TABLE MODULE ID:", reservationModuleId);

  window.location.assign(
    `${MENU_APP_URL}/checkout?${out.toString()}`
  );

  setOpen(false);
}

function setInputValueByName(form, name, value) {
  if (!value || !form) return;
  const el = form.querySelector(`[name="${name}"]`);
  if (el && el.value !== undefined && !el.value) el.value = String(value);
}

/** Reservation categories fetch aur reservation submit — dono ab Redux thunks (`dispatch(...).unwrap()`) se jaate hain. */
function initReservation(root, context, dispatch, deviceId, returningCustomer) {
  const form = root.querySelector("#reserve-form");
  if (!form) return () => {};

  const categoryField = document.createElement("input");
  categoryField.type = "hidden";
  categoryField.name = "reservationCategory";
  categoryField.value =
    resolveParam(window.location.search, "reservationCategory") || "TABLE_RESERVATION";
  form.appendChild(categoryField);

  if (returningCustomer) {
    setInputValueByName(form, "name", returningCustomer.guestName);
    setInputValueByName(form, "phone", returningCustomer.mobile);
    setInputValueByName(form, "countryCode", returningCustomer.countryCode);
    setInputValueByName(form, "dateOfBirth", returningCustomer.dateOfBirth);
    const marker = form.querySelector("[data-returning-badge]") || document.createElement("span");
    if (!marker.getAttribute("data-returning-badge")) {
      marker.setAttribute("data-returning-badge", "1");
      marker.textContent = "• Welcome back!";
      marker.style.cssText =
        "display:inline-block;margin-left:8px;color:#b8894f;font-weight:600;font-size:12px;";
      const header =
        form.querySelector("h2, h3, legend") || form.querySelector("button[type='submit']");
      if (header && header.parentNode) header.parentNode.insertBefore(marker, header.nextSibling);
    }
  }

  const note = form.querySelector("#reserve-note");
  const preferredCategory = resolveParam(window.location.search, "reservationCategory");
  const modalTitle = root.querySelector("#reserve-modal-title");
  const updateTitle = (category) => {
    if (modalTitle) modalTitle.textContent = getReservationTitle(category);
  };
  updateTitle(preferredCategory || "TABLE_RESERVATION");

  const onSubmit = async (event) => {
    if (!form.checkValidity()) return;
    event.preventDefault();
    const formData = new FormData(form);
    const reservationDateTime = `${formData.get("date")}T${formData.get("time")}:00`;
    const queryExtraDetails = getExtraDetails(window.location.search);
    const gameId = resolveParam(window.location.search, "gameId");
    const gameName = resolveParam(window.location.search, "gameName");
    const extraDetails =
      queryExtraDetails ||
      (gameId || gameName ? { id: gameId, name: gameName } : null);

    const tableId = resolveParam(window.location.search, "tableId") || context.tableId || "";
    const moduleId = resolveParam(window.location.search, "moduleId") || context.moduleId || "";
    const countryCode =
      (formData.get("countryCode") || "").toString().trim() ||
      returningCustomer?.countryCode ||
      DEFAULT_COUNTRY_CODE;
    const guestName =
      (formData.get("name") || "").toString().trim() || returningCustomer?.guestName || "";
    const mobile =
      (formData.get("phone") || "").toString().trim() || returningCustomer?.mobile || "";
    const email = (formData.get("email") || "").toString().trim();
    const dateOfBirth =
      (formData.get("dateOfBirth") || "").toString().trim() ||
      returningCustomer?.dateOfBirth ||
      null;

    try {
      await dispatch(
        submitReservation({
          payload: {
            companyId: context.companyId,
            branchId: context.branchId,
            moduleId,
            guestName,
            countryCode,
            mobile,
            email,
            dateOfBirth,
            guestCount: Number(formData.get("guests") || 1),
            reservationDateTime,
            reservationTitle: formData.get("reservationCategory") || "TABLE_RESERVATION",
            tableId,
            specialRequest: (formData.get("notes") || "").toString().trim(),
            extraDetails,
          },
          tableSessionId: context.tableSessionId,
          deviceId,
        }),
      ).unwrap();
      if (note) note.textContent = "Reservation request received. We'll confirm shortly.";

      notifyWhatsApp(
        buildReservationWhatsAppMessage({
          reservationTitle: formData.get("reservationCategory") || "TABLE_RESERVATION",
          guestName,
          mobile,
          countryCode,
          reservationDateTime,
          table: tableId,
          guestCount: formData.get("guests"),
        }),
      );

      form.reset();
    } catch (error) {
      console.error(error);
      if (note) note.textContent = "Unable to submit reservation. Please try again.";
    }
  };
  form.addEventListener("submit", onSubmit);
  return () => {
    form.removeEventListener("submit", onSubmit);
    categoryField.remove();
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderGameCards(games, type, search, qrContext, deviceId, returningCustomer) {
  const imageFolder = type === "playstation" ? "ps" : "games";
  return games.map((game) => {
    const image = game.image || `/assets/images/${imageFolder}/${game.cover}.webp`;
    const available = game.status === "available";
    return `<article class="bg-card" data-categories="${escapeHtml(game.categories.join(" "))}" data-name="${escapeHtml(game.name.toLowerCase())}" data-id="${escapeHtml(game.id)}">
      <div class="bg-card__media bg-card__media--${escapeHtml(game.cover)}">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(game.name)}" width="640" height="400" loading="lazy" decoding="async" />
      </div>
      <div class="bg-card__body">
        <h3 class="bg-card__title">${escapeHtml(game.name)}</h3>
        <ul class="bg-card__meta">
          <li>Players: ${escapeHtml(game.players)}</li>
          <li>Duration: ${escapeHtml(game.duration)}</li>
          <li>Difficulty: ${escapeHtml(game.difficulty)}</li>
        </ul>
        <div class="bg-card__availability-row">
          <div class="bg-card__status bg-card__status--${available ? "available" : "busy"}">
            <span class="bg-card__status-dot" aria-hidden="true"></span>
            <span>${available ? "Available" : "In Use"}</span>
          </div>
          ${available ? `<div class="bg-card__actions bg-card__actions--single"><a class="bg-card__btn bg-card__btn--solid bg-card__btn--status" data-game-session-link href="${escapeHtml(buildGameMenuUrl(search, qrContext, type, game, deviceId, returningCustomer))}">Reserve Session</a></div>` : ""}
        </div>
      </div>
    </article>`;
  }).join("");
}

/**
 * Sirf rendering + filter/search UI. Data ab yahan fetch nahi hota — ye
 * Redux state (games slice) se aata hai aur is function ko already-loaded
 * form me milta hai.
 */
function renderGamesGrid(root, type, gameState, search, qrContext, deviceId, returningCustomer) {
  const prefix = type === "playstation" ? "ps" : "bg";
  const grid = root.querySelector(`#${prefix}-grid`);
  const empty = root.querySelector(`#${prefix}-empty`);
  const count = root.querySelector(`#${prefix}-count`);
  const filters = root.querySelector(`#${prefix}-filters`);
  const searchInput = root.querySelector(`#${prefix}-search`);
  if (!grid || !filters) return () => {};

  const { items: games, status, error } = gameState;
  let activeCategory = "all";
  let query = "";

  const render = () => {
    if (status === "loading" || status === "idle") {
      grid.innerHTML = '<p class="bg-loading">Loading games...</p>';
      grid.hidden = false;
      if (empty) empty.hidden = true;
      if (count) count.textContent = "";
      return;
    }
    if (status === "failed") {
      console.error(error);
      grid.innerHTML = "";
      grid.hidden = true;
      if (empty) {
        empty.hidden = false;
        const message = empty.querySelector("p");
        if (message) message.textContent = "Unable to load games right now.";
      }
      return;
    }
    const normalizedQuery = query.trim().toLowerCase();
    const visible = games.filter((game) => {
      const categoryMatches = activeCategory === "all" || game.categories.includes(activeCategory);
      const searchMatches = !normalizedQuery || `${game.name} ${game.difficulty} ${game.categories.join(" ")}`.toLowerCase().includes(normalizedQuery);
      return categoryMatches && searchMatches;
    });
    grid.innerHTML = renderGameCards(visible, type, search, qrContext, deviceId, returningCustomer);
    grid.hidden = visible.length === 0;
    if (empty) empty.hidden = visible.length > 0;
    if (count) count.textContent = `${visible.length} game${visible.length === 1 ? "" : "s"}`;
  };

  const onFilter = (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeCategory = button.dataset.filter || "all";
    filters.querySelectorAll("[data-filter]").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    render();
  };
  const onSearch = () => {
    query = searchInput.value;
    render();
  };

  filters.addEventListener("click", onFilter);
  searchInput?.addEventListener("input", onSearch);
  render();

  return () => {
    filters.removeEventListener("click", onFilter);
    searchInput?.removeEventListener("input", onSearch);
  };
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const qrContext = useSelector(selectQrContext);
  const qrContextStatus = useSelector(selectQrContextStatus);
  const deviceId = useSelector(selectDeviceId);
  const returningCustomer = useSelector(selectReturningCustomer);
  const gamesByType = useSelector(selectGames);
  const customMomentsState = useSelector(selectCustomMoments);
  const celebrationPackagesByType = useSelector(selectCelebrationPackages);
  const membershipState = useSelector(selectMembership);
  const headerModulesState = useSelector(selectHeaderModules);
  const cardModuleState = useSelector(selectCardModule);
  const packageModuleState = useSelector(selectPackageModule);
  const rootRef = useRef(null);
  const path = normalizePath(location.pathname);

  const searchWithDevice = (() => {
    if (!deviceId) return location.search;
    const params = new URLSearchParams(location.search);
    params.set("deviceId", deviceId);
    return `?${params.toString()}`;
  })();
  const html = (pages[path] ?? pages["/"]).replace(
    'src="assets/images/careem.avif"',
    'src="/assets/images/careem.avif"',
  ).replaceAll("assets/images/logo.webp?v=20260821", LOGO_URL)
    .replaceAll('href="https://thedesirelounge.com/events.html"', `href="${EVENTS_URL}"`)
    .replaceAll('href="https://thedesirelounge.com/live-sports.html"', `href="${LIVE_SPORTS_URL}"`);
  useEffect(() => {
    dispatch(fetchQrContext(location.search));
  }, [location.search]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    root.querySelectorAll('.hero-anim').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    const toggle = root.querySelector("#nav-toggle");
    const drawer = root.querySelector("#lounge-drawer");
    const backdrop = root.querySelector("#drawer-backdrop");
    const reservationModal = root.querySelector("#reserve-modal");

    const setOpen = (open) => {
      if (!toggle || !drawer) return;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      drawer.hidden = !open;
      if (backdrop) backdrop.hidden = !open;
      document.body.classList.toggle("lounge-drawer-open", open);
    };

    const onToggle = () => setOpen(toggle.getAttribute("aria-expanded") !== "true");
    const onBackdrop = () => setOpen(false);
    const setReservationOpen = (open) => {
      if (!reservationModal) return;
      reservationModal.hidden = !open;
      reservationModal.classList.toggle("is-inline", open);
      if (open) reservationModal.querySelector("input, select, textarea")?.focus();
    };
    const onReservationClose = () => {
      setReservationOpen(false);
      navigate(`${location.pathname}${searchWithDevice}`);
    };
    toggle?.addEventListener("click", onToggle);
    backdrop?.addEventListener("click", onBackdrop);
    reservationModal?.querySelectorAll("[data-reserve-close]").forEach((element) => {
      element.addEventListener("click", onReservationClose);
    });
    if (location.hash === "#reserve") setReservationOpen(true);

    const links = [...root.querySelectorAll("a")];
    const onLink = (e) => {
      const link = e.currentTarget;
      let href = link.getAttribute("href");
      if (link.matches("[data-package-book]") && link.dataset.packageDetails) {
        e.preventDefault();
        const packageDetails = JSON.parse(link.dataset.packageDetails);
        window.location.assign(buildPackageMenuUrl(searchWithDevice, qrContext, packageDetails, deviceId, returningCustomer));
        return;
      }
      const packageDetails = getPackageCheckoutDetails(href || "");
      if (packageDetails) {
        e.preventDefault();
        window.location.assign(buildPackageMenuUrl(searchWithDevice, qrContext, packageDetails, deviceId, returningCustomer));
        return;
      }
      if (isReservationTrigger(link)) {
        e.preventDefault();
        openReservation(
  searchWithDevice,
  path,
  qrContext,
  setOpen,
  deviceId,
  headerModulesState.items,
  returningCustomer
);
        return;
      }
      if (href === LIVE_SPORTS_URL || href === EVENTS_URL) {
        e.preventDefault();
        const targetUrl = new URL(href, window.location.origin);
        const currentParams = new URLSearchParams(searchWithDevice);
        currentParams.forEach((value, key) => {
          if (!targetUrl.searchParams.has(key)) targetUrl.searchParams.set(key, value);
        });
        window.location.assign(targetUrl.toString());
        return;
      }
      if (href?.startsWith(MENU_APP_URL)) {
        e.preventDefault();
        const targetUrl = new URL(href);
        const targetPath = targetUrl.pathname;
        const merged = new URLSearchParams(targetUrl.search || "");
        const sourceParams = new URLSearchParams(searchWithDevice);
        sourceParams.forEach((value, key) => {
          if (!merged.has(key)) merged.set(key, value);
        });
        if (targetPath === "/checkout") {
  window.location.replace(targetUrl.toString());
  return;
}
        const targetSearch = merged.toString();

        if (qrContextStatus === "loading" || qrContextStatus === "idle") {
          const onContextReady = (event) => {
            window.location.replace(buildMenuUrl(targetSearch, event.detail, targetPath, deviceId));
          };
          window.addEventListener("qr-context-ready", onContextReady, { once: true });
          window.setTimeout(() => {
            window.removeEventListener("qr-context-ready", onContextReady);
            if (document.visibilityState === "visible") {
              window.location.replace(buildMenuUrl(targetSearch, qrContext, targetPath, deviceId));
            }
          }, 8000);
          return;
        }

        window.location.replace(buildMenuUrl(targetSearch, qrContext, targetPath, deviceId));
        return;
      }
      const isInternalPath = typeof href === "string" && href.startsWith("/") && !href.startsWith("//");

      if (isInternalPath) {
        e.preventDefault();
        const target = new URL(href, window.location.origin);
        const sourceParams = new URLSearchParams(searchWithDevice);
        sourceParams.forEach((value, key) => {
          if (!target.searchParams.has(key)) target.searchParams.set(key, value);
        });
        const clickedModuleId =
          link.dataset.moduleId ||
          link.closest("[data-module-id]")?.dataset?.moduleId ||
          link.closest("[data-uid-module-id]")?.dataset?.uidModuleId;
        if (clickedModuleId && !target.searchParams.has("moduleId")) {
          target.searchParams.set("moduleId", clickedModuleId);
        }
        const finalHref = `${target.pathname}${target.search}${target.hash}`;
        navigate(finalHref);
        setOpen(false);
      }
    };
    links.forEach(a => a.addEventListener("click", onLink));
    const buttons = [...root.querySelectorAll("button")];
    const onButton = (e) => {
      if (path === "/make-it-your-moment") {
        const button = e.currentTarget;
        const card = button.closest(".bg-card");
        if (card && button.matches("[data-action='book']")) {
          e.preventDefault();
          const name = card.querySelector(".bg-card__title")?.textContent?.trim() || "Custom Moment";
          const id = card.dataset.id || "custom-moment";
          const priceText = card.querySelector(".bg-card__meta li span")?.textContent || "";
          const price = priceText.match(/[\d.]+/)?.[0] || "";
          window.location.assign(buildMomentMenuUrl(
            searchWithDevice,
            qrContext,
            { id, name, price },
            getCustomMomentContext(searchWithDevice, qrContext),
            deviceId,
            returningCustomer,
          ));
          return;
        }
      }
      if (isReservationTrigger(e.currentTarget)) {
        e.preventDefault();
       openReservation(
  searchWithDevice,
  path,
  qrContext,
  setOpen,
  deviceId,
  headerModulesState.items,
  returningCustomer
);
      }
    };
    buttons.forEach((button) => button.addEventListener("click", onButton));

    // Lightweight reservation feedback for the original static form.
    const forms = [...root.querySelectorAll("form")];
    const onSubmit = (e) => {
      const form = e.currentTarget;
      if (!form.checkValidity()) return;
      if (form.id === "reserve-form" && path !== "/make-it-your-moment") {
        e.preventDefault();
        const note = form.querySelector("#reserve-note");
        if (note) note.textContent = "Reservation request received. We’ll confirm shortly.";
        form.reset();
      }
    };
    forms.forEach(f => f.addEventListener("submit", onSubmit));
    const cleanupReservation = initReservation(
      root,
      getRequestContext(searchWithDevice, qrContext),
      dispatch,
      deviceId,
      returningCustomer,
    );

    // Keep hash navigation working after React route changes.
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        setTimeout(() => root.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({behavior:"smooth", block:"start"}), 50);
      });
    } else {
      window.scrollTo({top:0, behavior:"instant"});
    }

    return () => {
      toggle?.removeEventListener("click", onToggle);
      backdrop?.removeEventListener("click", onBackdrop);
      links.forEach(a => a.removeEventListener("click", onLink));
      buttons.forEach((button) => button.removeEventListener("click", onButton));
      reservationModal?.querySelectorAll("[data-reserve-close]").forEach((element) => {
        element.removeEventListener("click", onReservationClose);
      });
      forms.forEach(f => f.removeEventListener("submit", onSubmit));
      cleanupReservation();
      document.body.classList.remove("lounge-drawer-open");
    };
  }, [[
  path,
  location.hash,
  location.search,
  qrContext,
  qrContextStatus,
  deviceId,
  returningCustomer,
  searchWithDevice,
  headerModulesState.items,
  navigate,
  dispatch
]]);

  const gamesType = path === "/board-games" ? "board-games" : null;
  const isPlaystationPage = path === "/playstation";
  const isBoardGamesPage = path === "/board-games";
  const usesCardModuleGrid = isPlaystationPage || isBoardGamesPage;

  // 1. Board-games data fetching — Card Module API se ab aata hai; old fetchGames ko skip karo.
  useEffect(() => {
    if (!gamesType) return;
    return undefined;
  }, [gamesType]);

  // Old board-games render hook bhi disable karo — card module grid hook ab render karega.
  useEffect(() => {
    if (!gamesType) return undefined;
    return undefined;
  }, [gamesType]);

  // Card Module Grid renderer — Playstation aur Board Games dono ke liye same flow.
  useEffect(() => {
    if (!usesCardModuleGrid) return undefined;

    const pageMode = isPlaystationPage ? "playstation" : "board-games";
    const prefix = isPlaystationPage ? "ps" : "bg";
    const fallbackCategory = isPlaystationPage ? "Playstation" : "Board Game";
    const loadingText = isPlaystationPage ? "Loading Playstation sessions..." : "Loading Board Games...";
    const errorText = "Unable to load sessions right now.";
    const fallbackImgPath = isPlaystationPage ? "/assets/images/ps/" : "/assets/images/board-games/";

    const grid = rootRef.current?.querySelector(`#${prefix}-grid`);
    const empty = rootRef.current?.querySelector(`#${prefix}-empty`);
    const count = rootRef.current?.querySelector(`#${prefix}-count`);
    const filters = rootRef.current?.querySelector(`#${prefix}-filters`);
    const searchInput = rootRef.current?.querySelector(`#${prefix}-search`);
    if (!grid || !filters) return undefined;

    const { items: cards, status, error } = cardModuleState;
    const mappedCards = cards.map((card, index) => {
      const categories = card.categoryName ? [card.categoryName] : [fallbackCategory];
      const players = card.features?.[0] || "1-4 Players";
      const duration = card.features?.[1] || card.priceLabel || "60 min";
      const difficulty = card.features?.[2] || card.subtitle || "Casual";
      const rawStatus = (card.status || "").toUpperCase();
      let gameStatus = "available";
      if (rawStatus === "IN_USE") gameStatus = "in-use";
      else if (rawStatus !== "AVAILABLE" && rawStatus !== "ACTIVE") gameStatus = "unavailable";
      return {
        id: card.uidCardId || `${prefix}-card-${index + 1}`,
        name: card.name,
        categories,
        cover:
          card.code ||
          card.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
          `card-${index + 1}`,
        image: card.imageUrl
          ? getImageUrl(card.imageUrl)
          : `${fallbackImgPath}${card.code || "placeholder"}.webp`,
        players,
        duration,
        difficulty,
        status: gameStatus,
      };
    });

    let activeCategory = "all";
    let query = "";

    const render = () => {
      if (status === "loading" || status === "idle") {
        grid.innerHTML = `<p class="bg-loading">${loadingText}</p>`;
        grid.hidden = false;
        if (empty) empty.hidden = true;
        if (count) count.textContent = "";
        return;
      }
      if (status === "failed") {
        console.error(`Unable to load ${pageMode} cards`, error);
        grid.innerHTML = "";
        grid.hidden = true;
        if (empty) {
          empty.hidden = false;
          const message = empty.querySelector("p");
          if (message) message.textContent = errorText;
        }
        return;
      }
      const normalizedQuery = query.trim().toLowerCase();
      const visible = mappedCards.filter((game) => {
        const categoryMatches = activeCategory === "all" || game.categories.includes(activeCategory);
        const searchMatches =
          !normalizedQuery ||
          `${game.name} ${game.difficulty} ${game.categories.join(" ")} ${game.players} ${game.duration}`
            .toLowerCase()
            .includes(normalizedQuery);
        return categoryMatches && searchMatches;
      });
      grid.innerHTML = renderGameCards(visible, pageMode, searchWithDevice, qrContext, deviceId, returningCustomer);
      grid.hidden = visible.length === 0;
      if (empty) empty.hidden = visible.length > 0;
      if (count) count.textContent = `${visible.length} session${visible.length === 1 ? "" : "s"}`;
    };

    const onFilter = (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      activeCategory = button.dataset.filter || "all";
      filters.querySelectorAll("[data-filter]").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      render();
    };
    const onSearch = () => {
      query = searchInput.value;
      render();
    };

    filters.addEventListener("click", onFilter);
    searchInput?.addEventListener("input", onSearch);
    render();

    return () => {
      filters.removeEventListener("click", onFilter);
      searchInput?.removeEventListener("input", onSearch);
    };
  }, [usesCardModuleGrid, isPlaystationPage, isBoardGamesPage, cardModuleState, searchWithDevice, qrContext, deviceId, returningCustomer]);

  const isMakeMomentPage = path === "/make-it-your-moment";
  const usesMomentCardGrid = isMakeMomentPage;

  // 1. Make-It-Your-Moment: OLD customMoments API + render disabled. Ab Card Module use karo.
  useEffect(() => {
    if (!isMakeMomentPage) return;
    return undefined;
  }, [isMakeMomentPage]);

  useEffect(() => {
    if (!isMakeMomentPage) return undefined;
    return undefined;
  }, [isMakeMomentPage]);

  // Make-It-Your-Moment Card Module renderer.
  useEffect(() => {
    if (!usesMomentCardGrid) return undefined;

    const prefix = "moment";
    const fallbackCategory = "Moment";
    const fallbackImgPath = "/assets/images/moments/";

    const grid = rootRef.current?.querySelector(`#${prefix}-grid`);
    if (!grid) return undefined;

    const count = rootRef.current?.querySelector(`#${prefix}-count`);
    const cards = [...grid.querySelectorAll(".bg-card")];
    let loading = grid.querySelector(":scope > .bg-loading");
    if (!loading) {
      loading = document.createElement("p");
      loading.className = "bg-loading";
      loading.setAttribute("role", "status");
      grid.prepend(loading);
    }

    const { items: momentCards, status, error } = cardModuleState;

    if (status === "loading" || status === "idle") {
      loading.textContent = "Loading moments...";
      loading.hidden = false;
      cards.forEach((card) => { card.hidden = true; });
      if (count) count.textContent = "";
      return undefined;
    }
    if (status === "failed") {
      console.error("Unable to load moments", error);
      loading.textContent = "Unable to load moments right now.";
      loading.hidden = false;
      cards.forEach((card) => { card.hidden = true; });
      if (count) count.textContent = "";
      return undefined;
    }

    loading.remove();
    const visibleCards = momentCards.filter((c) => c.isAvailable !== false);
    cards.forEach((card) => { card.hidden = true; });
    visibleCards.forEach((moment, index) => {
      const card = cards[index];
      if (!card) return;
      card.hidden = false;
      const category = moment.categoryName || fallbackCategory;
      card.dataset.name = moment.name.toLowerCase();
      card.dataset.categories = category.toLowerCase().replace(/\s+/g, "-");
      card.dataset.id = moment.uidCardId;
      const bookButton = card.querySelector("[data-action='book']");
      if (bookButton) bookButton.dataset.id = moment.uidCardId;
      const title = card.querySelector(".bg-card__title");
      const description = card.querySelector(".bg-card__desc");
      const price = card.querySelector(".bg-card__meta li span");
      const momentStatus = card.querySelector(".bg-card__status span:last-child");
      const image = card.querySelector(".bg-card__media img");
      if (title) title.textContent = moment.name;
      if (description && moment.description) description.textContent = moment.description;
      if (price) price.textContent = moment.priceLabel || (moment.price ? `AED ${moment.price}` : "Custom");
      if (momentStatus) {
        if (moment.isInUse) momentStatus.textContent = "In Use";
        else if (moment.isAvailable) momentStatus.textContent = "Available";
        else momentStatus.textContent = "Unavailable";
      }
      if (image) image.src = moment.imageUrl ? getImageUrl(moment.imageUrl) : `${fallbackImgPath}placeholder.webp`;
    });
    const availableCount = visibleCards.length;
    if (count) count.textContent = `${availableCount} moment${availableCount === 1 ? "" : "s"}`;
    if (!availableCount) {
      const empty = document.createElement("p");
      empty.className = "bg-loading";
      empty.textContent = "No moments are available right now.";
      grid.append(empty);
      return () => empty.remove();
    }
    return undefined;
  }, [usesMomentCardGrid, isMakeMomentPage, cardModuleState, searchWithDevice, qrContext, deviceId]);

  const celebrationType = path === "/birthday-celebrations" ? "birthday" : path === "/corporate-bookings" ? "corporate" : null;

  // 1. OLD celebration packages API disabled. Ab PackageModule items use hote hain.
  useEffect(() => {
    if (!celebrationType) return;
    return undefined;
  }, [celebrationType]);

  // 2. Rendering + selection UI — PackageModule Redux items (children flatten karke).
  useEffect(() => {
    if (!celebrationType) return undefined;

    const packageGrid = rootRef.current?.querySelector(".offer-packages");
    const bookingLink = rootRef.current?.querySelector(".offer-sheet__cta");
    if (!packageGrid || !bookingLink) return undefined;

    const defaultModuleId = MODULE_IDS[`${celebrationType}Packages`] || MODULE_IDS.packages;
    const celebrationContext = getRequestContext(searchWithDevice, qrContext);

    const cards = [...packageGrid.querySelectorAll(".offer-package")];
    let loading = packageGrid.querySelector(":scope > .bg-loading");
    if (!loading) {
      loading = document.createElement("p");
      loading.className = "bg-loading";
      loading.setAttribute("role", "status");
      packageGrid.prepend(loading);
    }
    bookingLink.dataset.packageBook = "true";
    bookingLink.href = "#book-package";
    bookingLink.setAttribute("aria-disabled", "true");

    const onSelect = (event) => {
      const selectedCard = event.target.closest(".offer-package[data-package-details]");
      if (!selectedCard || !packageGrid.contains(selectedCard)) return;
      const packageDetails = selectedCard.dataset.packageDetails;
      cards.forEach((card) => card.classList.toggle("is-selected", card === selectedCard));
      bookingLink.dataset.packageDetails = packageDetails;
      try {
        bookingLink.textContent = `Book ${JSON.parse(packageDetails).name}`;
      } catch {
        bookingLink.textContent = "Book selected package";
      }
      bookingLink.removeAttribute("aria-disabled");
    };
    const onKeyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onSelect(event);
    };
    packageGrid.addEventListener("click", onSelect);
    packageGrid.addEventListener("keydown", onKeyDown);

    const { items: rawPackages, status, error } = packageModuleState;

    // Flatten: parent packages render first, then each child also becomes a selectable card.
    const packages = [];
    rawPackages.forEach((pkg) => {
      packages.push(pkg);
      if (Array.isArray(pkg.children) && pkg.children.length > 0) {
        pkg.children.forEach((child) => packages.push({ ...child, parentName: pkg.name }));
      }
    });

    if (status === "loading" || status === "idle") {
      loading.textContent = "Loading packages...";
      loading.hidden = false;
      cards.forEach((card) => { card.hidden = true; });
      bookingLink.textContent = "Select a package first";
    } else if (status === "failed") {
      console.error(`Unable to load ${celebrationType} packages`, error);
      loading.textContent = "Unable to load packages right now.";
      loading.hidden = false;
      cards.forEach((card) => { card.hidden = true; });
      bookingLink.textContent = "Select a package first";
    } else {
      loading.remove();
      cards.forEach((card) => { card.hidden = true; });
      packages.forEach((item, index) => {
        const card = cards[index];
        if (!card) return;
        card.hidden = false;
        let title = card.querySelector("h2");
        if (!title) {
          title = document.createElement("h2");
          card.prepend(title);
        }
        let description = card.querySelector(":scope > p");
        let meta = card.querySelector(".offer-package__meta");
        let parentLabel = card.querySelector(".offer-package__parent-label");
        if (item.parentName && !parentLabel) {
          parentLabel = document.createElement("p");
          parentLabel.className = "offer-package__parent-label";
          card.insertBefore(parentLabel, title);
        }
        if ((item.timing || item.subtitle) && !meta) {
          meta = document.createElement("p");
          meta.className = "offer-package__meta";
          card.insertBefore(meta, description || title.nextSibling);
        }
        if (!description) {
          description = document.createElement("p");
          card.append(description);
        }
        const priceText = item.priceLabel || (item.price ? `AED ${item.price}` : "");
        if (title) title.textContent = `${item.name}${priceText ? ` — ${priceText}` : ""}`;
        if (item.timing || item.subtitle) {
          if (meta) meta.textContent = item.timing || item.subtitle;
        }
        if (item.parentName && parentLabel) {
          parentLabel.textContent = `Part of — ${item.parentName}`;
          parentLabel.hidden = false;
          card.classList.add("offer-package--child");
        } else if (parentLabel) {
          parentLabel.textContent = "";
          parentLabel.hidden = true;
          card.classList.remove("offer-package--child");
        }
        if (description) description.textContent = item.description || item.parentName || "";
        const details = JSON.stringify({
          id: item.uidPackageId || item.id,
          uidPackageItemId: item.uidPackageId,
          uidParentPackageItemId: item.uidParentPackageItemId || "",
          name: item.name,
          price: priceText,
          priceLabel: item.priceLabel,
          priceValue: item.price,
          description: item.description || "",
          moduleId: item.moduleId || defaultModuleId,
          uidHeaderModuleId: item.moduleId || defaultModuleId,
          type: `${celebrationType}-package`,
          categoryName: celebrationType === "birthday" ? "Birthday Celebrations" : "Corporate Bookings",
          category: celebrationType === "birthday" ? "BIRTHDAY" : "CORPORATE",
          bookingType: celebrationType === "birthday" ? "Birthday Celebration" : "Corporate Booking",
          parentName: item.parentName || "",
          companyId: celebrationContext.companyId || "",
          branchId: celebrationContext.branchId || "",
          tableSessionId: celebrationContext.tableSessionId || "",
          tableId: celebrationContext.tableId || "",
          tableNumber: celebrationContext.tableNumber || "",
        });
        card.dataset.packageDetails = details;
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `Select ${item.name}`);
      });
      if (!packages.length) {
        loading.textContent = "No packages are available right now.";
        packageGrid.append(loading);
      }
      bookingLink.textContent = "Select a package first";
    }

    return () => {
      packageGrid.removeEventListener("click", onSelect);
      packageGrid.removeEventListener("keydown", onKeyDown);
    };
  }, [celebrationType, packageModuleState, qrContext, searchWithDevice]);

  // 1. Data fetching — Redux thunk.
  useEffect(() => {
  if (path !== "/privilege-membership") return;

  const membershipContext = getMembershipContext(
    searchWithDevice,
    qrContext,
    headerModulesState.items
  );

  console.log("MEMBERSHIP MODULE CONTEXT:", membershipContext);

  dispatch(fetchMembership(membershipContext));
}, [
  path,
  searchWithDevice,
  qrContext,
  headerModulesState.items,
  dispatch,
]);

  // 2. Rendering — Redux state (membership slice) se.
  useEffect(() => {
    if (path !== "/privilege-membership") return undefined;

    const panel = rootRef.current?.querySelector(".offer-sheet__panel");
    const bookingLink = panel?.querySelector(".offer-sheet__cta");
    if (!panel || !bookingLink) return undefined;

    const context = getMembershipContext(searchWithDevice, qrContext);
    let loading = panel.querySelector(":scope > .bg-loading");
    if (!loading) {
      loading = document.createElement("p");
      loading.className = "bg-loading";
      loading.setAttribute("role", "status");
      panel.append(loading);
    }
    bookingLink.dataset.packageBook = "true";
    bookingLink.href = "#join-membership";
    bookingLink.setAttribute("aria-disabled", "true");

    const { data: membership, status, error } = membershipState;

    if (status === "loading" || status === "idle") {
      loading.textContent = "Loading membership...";
      loading.hidden = false;
      bookingLink.textContent = "Loading membership...";
      return undefined;
    }
    if (status === "failed" || !membership) {
      console.error("Unable to load membership", error);
      loading.textContent = "Unable to load membership right now.";
      loading.hidden = false;
      bookingLink.textContent = "Membership unavailable";
      return undefined;
    }

    loading.remove();
    const name = membership.name || membership.membershipName || "Desire Privilege Membership";
    const price = membership.priceLabel || membership.price || "";
    const description = membership.subtitle || "";
    const details = JSON.stringify({
      id: membership.id || membership.membershipId || context.moduleId,
      name,
      price,
      description,
      terms: membership.terms || "",
      features: membership.features || [],
      type: "membership",
      categoryName: "Desire Privilege Membership",
      category: "MEMBERSHIP",
      bookingType: "Membership",
      moduleId: context.moduleId,
      companyId: context.companyId || "",
      branchId: context.branchId || "",
      tableSessionId: context.tableSessionId || "",
      tableId: context.tableId || "",
      tableNumber: context.tableNumber || "",
    });
    let summary = panel.querySelector(".offer-sheet__membership-summary");
    if (!summary) {
      summary = document.createElement("p");
      summary.className = "offer-sheet__membership-summary";
      panel.append(summary);
    }
    summary.textContent = `${name}${price ? ` — ${price}` : ""}${description ? ` · ${description}` : ""}`;
    bookingLink.dataset.packageDetails = details;
    bookingLink.textContent = `Join ${name}`;
    bookingLink.removeAttribute("aria-disabled");
    const terms = panel.querySelector(".offer-sheet__terms");
    if (terms && membership.terms) terms.textContent = membership.terms;

    return () => {
      summary?.remove();
    };
  }, [path, membershipState, searchWithDevice, qrContext]);

  useEffect(() => {
    if (path !== "/exclusive-offers") return undefined;

    const panel = rootRef.current?.querySelector(".offer-sheet__panel");
    const offerGrid = panel?.querySelector(".offer-packages");
    const bookingLink = panel?.querySelector(":scope > .offer-sheet__cta");
    if (!offerGrid || !bookingLink) return undefined;

    const cards = [...offerGrid.querySelectorAll(".offer-package")];
    const originalHref = bookingLink.href;
    const offerContext = getRequestContext(searchWithDevice, qrContext);
    bookingLink.dataset.packageBook = "true";
    bookingLink.href = "#book-offer";
    bookingLink.textContent = "Select an offer first";
    bookingLink.setAttribute("aria-disabled", "true");

    const selectCard = (card) => {
      const title = card.querySelector("h2")?.textContent?.trim() || "Exclusive Offer";
      const description = [...card.querySelectorAll("p, li")]
        .map((element) => element.textContent.trim())
        .filter(Boolean)
        .join(" ");
      const price = title.match(/AED\s*[\d.]+|\d+%|Complimentary/i)?.[0] || "";
      const details = {
        id: card.dataset.offerId || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        name: title,
        price,
        description,
        type: "exclusive-offer",
        categoryName: "Exclusive Offers",
        category: "EXCLUSIVE_OFFER",
        bookingType: "Exclusive Offer",
        moduleId: offerContext.moduleId,
        companyId: offerContext.companyId || "",
        branchId: offerContext.branchId || "",
        tableSessionId: offerContext.tableSessionId || "",
        tableId: offerContext.tableId || "",
        tableNumber: offerContext.tableNumber || "",
      };
      cards.forEach((item) => item.classList.toggle("is-selected", item === card));
      bookingLink.dataset.packageDetails = JSON.stringify(details);
      bookingLink.textContent = `Book ${title}`;
      bookingLink.removeAttribute("aria-disabled");
    };
    const onClick = (event) => {
      const card = event.target.closest(".offer-package");
      if (!card || !offerGrid.contains(card) || event.target.closest("a")) return;
      selectCard(card);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".offer-package");
      if (!card) return;
      event.preventDefault();
      selectCard(card);
    };
    cards.forEach((card) => {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `Select ${card.querySelector("h2")?.textContent?.trim() || "exclusive offer"}`);
    });
    offerGrid.addEventListener("click", onClick);
    offerGrid.addEventListener("keydown", onKeyDown);

    return () => {
      offerGrid.removeEventListener("click", onClick);
      offerGrid.removeEventListener("keydown", onKeyDown);
      bookingLink.href = originalHref;
      delete bookingLink.dataset.packageBook;
      delete bookingLink.dataset.packageDetails;
      bookingLink.textContent = "Ask About Offers";
      bookingLink.removeAttribute("aria-disabled");
      cards.forEach((card) => {
        card.removeAttribute("role");
        card.removeAttribute("tabindex");
        card.removeAttribute("aria-label");
        card.classList.remove("is-selected");
      });
    };
  }, [path, searchWithDevice, qrContext]);

  useEffect(() => {
    if (path !== "/") return;
    dispatch(fetchHeaderModules({ search: searchWithDevice, qrContext }));
  }, [path, searchWithDevice, qrContext, dispatch]);

  useEffect(() => {
    const urlModuleId = new URLSearchParams(searchWithDevice).get("moduleId");
    let overrides = null;
    if (path === "/playstation") {
      overrides = { moduleId: urlModuleId || MODULE_IDS.playstationCard };
    } else if (path === "/board-games") {
      overrides = { moduleId: urlModuleId || MODULE_IDS.boardGamesCard };
    } else if (path === "/make-it-your-moment") {
      overrides = { moduleId: urlModuleId || MODULE_IDS.customMomentsCard };
    } else if (path === "/birthday-celebrations") {
      overrides = { moduleId: urlModuleId || MODULE_IDS.birthdayCard };
    } else if (path === "/corporate-bookings") {
      overrides = { moduleId: urlModuleId || MODULE_IDS.corporateCard };
    }
    if (!overrides) return undefined;
    dispatch(fetchCardModule({ search: searchWithDevice, qrContext, overrides }));
    return undefined;
  }, [path, searchWithDevice, qrContext, dispatch]);

  useEffect(() => {
    const urlModuleId = new URLSearchParams(searchWithDevice).get("moduleId");
    let overrides = null;
    if (path === "/exclusive-offers") {
      overrides = { moduleId: urlModuleId || MODULE_IDS.exclusiveOffers };
    } else if (path === "/birthday-celebrations" || path === "/corporate-bookings") {
      overrides = { moduleId: urlModuleId || MODULE_IDS.packages };
    }
    if (!overrides) return undefined;
    dispatch(fetchPackageModuleItems({ search: searchWithDevice, qrContext, overrides }));
    return undefined;
  }, [path, searchWithDevice, qrContext, dispatch]);

  useEffect(() => {
    if (path !== "/") return undefined;

    const root = rootRef.current;
    if (!root) return undefined;

    const { items: headers, status, error } = headerModulesState;
    if (status === "loading" || status === "idle") return undefined;
    if (status === "failed") {
      console.error("Unable to load header modules", error);
      return undefined;
    }

    const findHeader = (code) => headers.find((h) => h.headerCode === code);
    const mainHeader = findHeader("MAIN_SECTION");
    const orderHeader = findHeader("ORDER_ONLINE");
    const stayHeader = findHeader("STAY_CONNECTED");

    const updateServiceCards = (selector, modules) => {
      if (!modules || !modules.length) return;
      const section = root.querySelector(selector);
      if (!section) return;
      const grid = section.querySelector(":scope .lounge-services__grid");
      if (!grid) return;
      const cards = [...grid.querySelectorAll(":scope > .lounge-card")];
      modules.forEach((mod, index) => {
        const card = cards[index];
        if (!card) return;
        const hidden = mod.status && mod.status.toUpperCase() !== "ACTIVE";
        card.hidden = hidden;
        if (mod.uidModuleId) {
          card.dataset.uidModuleId = mod.uidModuleId;
          card.dataset.moduleId = mod.uidModuleId;
        }
        if (mod.moduleType) {
          card.dataset.moduleType = mod.moduleType;
        }
        const h2 = card.querySelector(":scope > h2");
        if (h2 && mod.moduleName) {
          const words = mod.moduleName.trim().split(/\s+/);
          if (index === 5 && words.length >= 3) {
            h2.innerHTML = `${words.slice(0, 2).join(" ")}<br />${words.slice(2).join(" ")}`;
          } else if (index === 11 && words.length >= 4) {
            h2.innerHTML = `${words.slice(0, 3).join(" ")}<br />${words.slice(3).join(" ")}`;
          } else {
            h2.textContent = mod.moduleName;
          }
        }
        const p = card.querySelector(":scope > p");
        if (p && mod.subtitle) p.textContent = mod.subtitle;
      });
    };

    const updateSocialCards = (selector, modules) => {
      if (!modules || !modules.length) return;
      const section = root.querySelector(selector);
      if (!section) return;
      const grid = section.querySelector(":scope .lounge-social");
      if (!grid) return;
      const cards = [...grid.querySelectorAll(":scope > .lounge-social__item")];
      modules.forEach((mod, index) => {
        const card = cards[index];
        if (!card) return;
        const hidden = mod.status && mod.status.toUpperCase() !== "ACTIVE";
        card.hidden = hidden;
        if (mod.uidModuleId) {
          card.dataset.uidModuleId = mod.uidModuleId;
          card.dataset.moduleId = mod.uidModuleId;
        }
        if (!mod.moduleName) return;
        [...card.childNodes].forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            node.textContent = ` ${mod.moduleName} `;
          }
        });
        const strong = card.querySelector(":scope > strong");
        if (strong) strong.textContent = mod.moduleName;
        const span = card.querySelector(":scope > span:not(.lounge-social__icon)");
        if (span && !span.querySelector("svg")) span.textContent = mod.moduleName;
      });
    };

    if (mainHeader) updateServiceCards("#services", mainHeader.modules);
    if (orderHeader) updateServiceCards("#order-online", orderHeader.modules);
    if (stayHeader) updateSocialCards("#connect-social", stayHeader.modules);
    const diningHeader = findHeader("DINING");
    if (diningHeader) updateServiceCards("#dining", diningHeader.modules);

    return undefined;
  }, [path, headerModulesState]);

  useEffect(() => {
    if (path !== "/menu") return;
    const hasFreshContext = qrContext?.data && hasMatchingParams(searchWithDevice, qrContext.params);
    const canRedirect = !location.search || hasFreshContext || qrContextStatus === "failed";
    if (canRedirect) window.location.replace(buildMenuUrl(searchWithDevice, qrContext, "/", deviceId));
  }, [path, searchWithDevice, location.search, qrContext, qrContextStatus, deviceId]);

  if (path === "/exclusive-offers") return <ExclusiveOffersPage />;

  if (path === "/menu") {
    return (
      <div className="lounge-page lounge-page--redirect" role="status" aria-live="polite">
        <p className="bg-loading">Opening menu...</p>
      </div>
    );
  }

  return <div ref={rootRef} className="lounge-page" dangerouslySetInnerHTML={{ __html: html }} />;
}
