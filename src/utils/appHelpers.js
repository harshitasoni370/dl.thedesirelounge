import { DEFAULT_COUNTRY_CODE, URLS } from "../config/urls";
import { getStaticModulePath } from "./moduleRouting";
import { notifyWhatsApp, buildReservationWhatsAppMessage } from "./whatsapp";

const MENU_APP_URL = URLS.app.menuApp;
const DEFAULT_CELEBRATION_MODULE_IDS = {
  birthday: "02861404-4450-4d04-8461-679f3e8e09e3",
  corporate: "02ea8929-ad23-47a0-b416-db1d0f33ec46",
};
const DEFAULT_MEMBERSHIP_MODULE_ID = "b38fa611-ea6c-4414-9398-fbe6ca1d314c";
export function normalizePath(path) {
  if (!path || path === "/index.html" || path === "/index") return "/";
  if (path === "/events.html" || path === "/events") return "/sunday-brunch";
  if (path === "/live-sports.html" || path === "/live-sports") return "/";
  if (path === "/gallery.html" || path === "/gallery" || path === "/about.html" || path === "/about") return "/";
  const normalizedPath = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
  const moduleRoute = normalizedPath.match(/^\/module\/(?:detail|card|package)\/([^/]+)$/);
  if (moduleRoute) {
    const staticPath = getStaticModulePath(moduleRoute[1].replace(/-/g, " "));
    if (staticPath) return staticPath;
  }
  return normalizedPath;
}

export function buildMenuUrl(search, qrContext, pathname = "/", deviceId, menuAppUrl = MENU_APP_URL) {
  const inParams = new URLSearchParams(search);
  const data = getActiveQrData(search, qrContext);
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
  return `${menuAppUrl}${pathname}${query ? `?${query}` : ""}`;
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

export function resolveParam(search, key) {
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

export function isQrEntry(search) {
  const params = new URLSearchParams(search);
  const qrKeys = new Set(["type", "location", "name", "resturant", "restaurant", "tablecode", "tableid", "sessionid", "tablesessionid"]);
  return Array.from(params.entries()).some(([key, value]) => qrKeys.has(key.toLowerCase()) && Boolean(value));
}

export function getActiveQrData(search, qrContext) {
  return isQrEntry(search) ? qrContext?.data || {} : {};
}

export function getExtraDetails(search) {
  const value = resolveParam(search, "extraDetails");
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
export function getModuleIdByName(headers, moduleName) {
  if (!Array.isArray(headers) || !moduleName) return "";

  const normalizeModuleName = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  const requestedName = normalizeModuleName(moduleName);

  for (const header of headers) {
    const module = (header.modules || []).find(
      (item) => {
        const apiName = normalizeModuleName(item.moduleName);
        const matchesName =
          apiName === requestedName ||
          `${apiName}s` === requestedName ||
          `${requestedName}s` === apiName;
        return matchesName && item.status?.toUpperCase() === "ACTIVE";
      },
    );

    if (module?.uidModuleId) {
      return module.uidModuleId;
    }
  }

  return "";
}

export function buildGameMenuUrl(
  search,
  qrContext,
  type,
  game,
  deviceId,
  returningCustomer,
  menuAppUrl = MENU_APP_URL,
  moduleId = "",
) {
  const ctx = getRequestContext(search, qrContext);
  const out = new URLSearchParams();
  if (ctx.companyId) out.set("cid", ctx.companyId);
  if (ctx.branchId) out.set("bid", ctx.branchId);
  if (ctx.tableId) out.set("tid", ctx.tableId);
  if (ctx.tableNumber) {
   out.set("tn", ctx.tableNumber);
}
  if (ctx.tableSessionId) out.set("sid", ctx.tableSessionId);
  out.set("mid", moduleId || ctx.moduleId);
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
  return `${menuAppUrl}/checkout?${out.toString()}`;
}

export function buildMomentMenuUrl(search, qrContext, moment, context, deviceId, returningCustomer, menuAppUrl = MENU_APP_URL) {
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
  return `${menuAppUrl}/checkout?${out.toString()}`;
}

export function buildPackageMenuUrl(search, qrContext, packageDetails, deviceId, returningCustomer, menuAppUrl = MENU_APP_URL) {
  const context = getRequestContext(search, qrContext);
  const preserveTableContext = isQrEntry(search);
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
  const rawTableId = preserveTableContext ? packageDetails.tableId || context.tableId : "";
  const tableSessionId = preserveTableContext ? packageDetails.tableSessionId || context.tableSessionId : "";
  const tableNumber = preserveTableContext ? packageDetails.tableNumber || context.tableNumber : "";
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
  return `${menuAppUrl}/checkout?${out.toString()}`;
}

export function getPackageCheckoutDetails(href) {
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

export function getMembershipContext(search, qrContext, headerModules = []) {
  const context = getRequestContext(search, qrContext);
  const data = qrContext?.data || {};

  const membershipModuleId = getModuleIdByName(
    headerModules,
    "Desire Privilege Membership"
  );

  return {
    companyId:
      resolveParam(search, "companyId") ||
      data.companyId ||
      context.companyId ||
      "",

    branchId:
      resolveParam(search, "branchId") ||
      data.branchId ||
      context.branchId ||
      "",

    moduleId:
      membershipModuleId ||
      resolveParam(search, "moduleId") ||
      data.moduleId ||
      "",
  };
}

export function hasMatchingParams(search, contextParams) {
  const currentParams = new URLSearchParams(search);
  return Object.entries(contextParams || {}).every(([key, value]) => currentParams.get(key) === value);
}

export function getGameContext(search, qrContext) {
  const data = getActiveQrData(search, qrContext);
  const companyId =
    resolveParam(search, "companyId") ||
    data.companyId ||
    resolveParam(search, "companyID");
  const branchId =
    resolveParam(search, "branchId") ||
    data.branchId ||
    resolveParam(search, "branchID");
  return companyId && branchId ? { companyId, branchId } : null;
}

export function getRequestContext(search, qrContext) {
  const context = getGameContext(search, qrContext) || {};
  const data = getActiveQrData(search, qrContext);
  return {
    ...context,
    tableId: data.tableId || resolveParam(search, "tableId") || "",
    moduleId: resolveParam(search, "moduleId") || data.moduleId || "",
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

export function getCustomMomentContext(search, qrContext) {
  const data = getActiveQrData(search, qrContext);
  return {
    companyId: resolveParam(search, "companyId") || data.companyId || "",
    branchId: resolveParam(search, "branchId") || data.branchId || "",
    typeId: resolveParam(search, "typeId") || data.typeId || "",
    search: resolveParam(search, "momentSearch") || "",
    tableSessionId:
      data.tableSessionId ||
      data.sessionId ||
      resolveParam(search, "tableSessionId") ||
      resolveParam(search, "sessionId") ||
      "",
    tableId:
      data.tableId ||
      resolveParam(search, "tableId") ||
      data.tableNumber ||
      data.tableNo ||
      resolveParam(search, "tableNumber") ||
      resolveParam(search, "tableNo") ||
      "",
    moduleId: resolveParam(search, "moduleId") || data.moduleId || "",
  };
}

export function isGuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || "");
}

export function appendReturningParams(out, returningCustomer) {
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

export function getReservationCategory(path) {
  if (path === "/birthday-celebrations") return "BIRTHDAY";
  if (path === "/corporate-bookings") return "CORPORATE";
  if (path === "/sunday-brunch") return "EVENT";
  if (path === "/make-it-your-moment") return "CUSTOM_MOMENT";
  if (path === "/playstation" || path === "/board-games") return "GAMING";
  if (path === "/exclusive-offers") return "EXCLUSIVE_OFFER";
  return "TABLE_RESERVATION";
}

export function getReservationTitle(category) {
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

export function isReservationTrigger(element) {
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

export function openReservation(
  search,
  path,
  qrContext,
  setOpen,
  deviceId,
  headerModules = [],
  returningCustomer = null,
  menuAppUrl = MENU_APP_URL,
  specialRequest = "",
  reservationTitle = "",
  reservationDetails = null,
) {
  const ctx = getRequestContext(search, qrContext);

  const reservationModuleId = getModuleIdByName(
    headerModules,
    "Reserve a Table"
  );

  const cat = reservationDetails?.category || getReservationCategory(path);
  const title = reservationTitle.trim() || getReservationTitle(cat);

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

  if (cat !== "CALL_WAITER") {
    out.set(
      "mid",
      reservationModuleId ||
        resolveParam(search, "moduleId") ||
        ctx.moduleId ||
        ""
    );
  }

  out.set("cat", cat);
  out.set("rc", cat);
  out.set("rt", title);
  out.set("bt", title);
  if (reservationDetails?.selectedItem?.id) {
    out.set("gid", reservationDetails.selectedItem.id);
  }
  if (reservationDetails?.selectedItem?.name) {
    out.set("gn", reservationDetails.selectedItem.name);
  }
  if (reservationDetails?.categoryName) {
    out.set("cn", reservationDetails.categoryName);
  }
  if (reservationDetails) {
    out.set("xd", JSON.stringify(reservationDetails));
  }
  out.set("s", "about-you");
  out.set("hs", "1");
  out.set("hc", "1");

  if (deviceId) {
    out.set("did", deviceId);
  }

  if (specialRequest.trim()) {
    out.set("sr", specialRequest.trim());
  }

  appendReturningParams(out, returningCustomer);

  console.log("RESERVE TABLE MODULE ID:", reservationModuleId);

  window.location.assign(
    `${menuAppUrl}/checkout?${out.toString()}`
  );

  setOpen(false);
}

export function redirectToReservationPage(
  search,
  path,
  qrContext,
  deviceId,
  headerModules,
  returningCustomer,
  menuAppUrl,
  specialRequest,
  reservationTitle,
  reservationDetails,
) {
  openReservation(
    search,
    path,
    qrContext,
    () => {},
    deviceId,
    headerModules,
    returningCustomer,
    menuAppUrl,
    specialRequest,
    reservationTitle,
    reservationDetails,
  );
}

export function setInputValueByName(form, name, value) {
  if (!value || !form) return;
  const el = form.querySelector(`[name="${name}"]`);
  if (el && el.value !== undefined && !el.value) el.value = String(value);
}

/** Reservation categories fetch aur reservation submit — dono ab Redux thunks (`dispatch(...).unwrap()`) se jaate hain. */
export function initReservation(root, context, dispatch, deviceId, returningCustomer, websiteInfo, whatsappPhone) {
  const form = root.querySelector("#reserve-form");
  if (!form) return () => {};

  const categoryField = document.createElement("input");
  categoryField.type = "hidden";
  categoryField.name = "reservationCategory";
  categoryField.value =
    resolveParam(window.location.search, "reservationCategory") || "TABLE_RESERVATION";
  form.appendChild(categoryField);

  if (!returningCustomer && websiteInfo?.countryCode) {
    setInputValueByName(form, "countryCode", websiteInfo.countryCode);
  }

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
      websiteInfo?.countryCode ||
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
        whatsappPhone,
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

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function normalizeCategory(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function renderGameCards(
  games,
  type,
  search,
  qrContext,
  deviceId,
  returningCustomer,
  menuAppUrl = MENU_APP_URL,
  moduleId = "",
) {
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
          ${available ? `<div class="bg-card__actions bg-card__actions--single"><a class="bg-card__btn bg-card__btn--solid bg-card__btn--status" data-game-session-link href="${escapeHtml(buildGameMenuUrl(search, qrContext, type, game, deviceId, returningCustomer, menuAppUrl, moduleId))}">Reserve Session</a></div>` : ""}
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
export function renderGamesGrid(root, type, gameState, search, qrContext, deviceId, returningCustomer, menuAppUrl = MENU_APP_URL) {
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
    grid.innerHTML = renderGameCards(visible, type, search, qrContext, deviceId, returningCustomer, menuAppUrl);
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
