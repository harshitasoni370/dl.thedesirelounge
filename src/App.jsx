import { useEffect, useMemo, useRef, useState } from "react";
import { pages, pageClasses } from "./pages";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CallWaiterFab from "./components/CallWaiterFab";
import {
  fetchQrContext,
  selectQrContext,
  selectQrContextStatus,
  selectQrContextError,
  TABLE_OCCUPIED_ERROR,
  QR_SESSION_DEVICE_MISMATCH_ERROR,
  selectDeviceId,
  checkDevice,
  selectCheckDevice,
  selectIsReturningCustomer,
  selectReturningCustomer,
} from "./store/slices/qrContextSlice";
import { selectMembership } from "./store/slices/membershipSlice";
import { selectHeaderModules } from "./store/slices/modulesSlice";
import { selectCardModule } from "./store/slices/cardModuleSlice";
import { selectPackageModule } from "./store/slices/packageSlice";
import ExclusiveOffersPage from "./pages/ExclusiveOffersPage";
import FreeWifiPage from "./pages/FreeWifiPage";
import CallWaiterPage from "./pages/CallWaiterPage";
import LiveStreamPage from "./pages/LiveStreamPage";
import { URLS } from "./config/urls";
import { getImageUrl } from "./utils/imageUrl";
import { fetchWebsiteByDomainApi } from "./utils/qrApi";
import { getDomainUrl, getWebsiteDomain } from "./utils/domainUrls";
import { getLoungeNavigation } from "./config/navigation";
import { getModuleContentType } from "./utils/moduleRouting";
import DynamicModulePage from "./pages/DynamicModulePage";
import {
  buildMenuUrl,
  buildMomentMenuUrl,
  buildPackageMenuUrl,
  escapeHtml,
  getActiveQrData,
  getCustomMomentContext,
  getPackageCheckoutDetails,
  getRequestContext,
  hasMatchingParams,
  initReservation,
  isReservationTrigger,
  normalizePath,
  openReservation,
  redirectToReservationPage,
  resolveParam,
} from "./utils/appHelpers";
import { useHeaderModulesEffects } from "./hooks/useHeaderModulesEffects";
import { usePageModuleEffects } from "./hooks/usePageModuleEffects";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const qrContext = useSelector(selectQrContext);
  const qrContextStatus = useSelector(selectQrContextStatus);
  const qrContextError = useSelector(selectQrContextError);
  const qrContextBlocked = [TABLE_OCCUPIED_ERROR, QR_SESSION_DEVICE_MISMATCH_ERROR].includes(qrContextError);
  const deviceId = useSelector(selectDeviceId);
  const deviceCheck = useSelector(selectCheckDevice);
  const isRegisteredCustomer = useSelector(selectIsReturningCustomer);
  const returningCustomer = useSelector(selectReturningCustomer);
  const membershipState = useSelector(selectMembership);
  const headerModulesState = useSelector(selectHeaderModules);
  const cardModuleState = useSelector(selectCardModule);
  const packageModuleState = useSelector(selectPackageModule);
  const rootRef = useRef(null);
  const renderedHeaderModulesRef = useRef(null);
  const headerModulesRefreshPositionRef = useRef(null);
  const themeVariablesRef = useRef([]);
  const pendingWifiNavigation = useRef(null);
  const wifiCheckKey = useRef(null);
  const wifiCheckInFlight = useRef(false);
  const [websiteInfo, setWebsiteInfo] = useState(null);
  const [websiteConfigStatus, setWebsiteConfigStatus] = useState("loading");
  const [websiteConfigError, setWebsiteConfigError] = useState("");
  const [websiteConfigRetry, setWebsiteConfigRetry] = useState(0);
  const [websiteConfigDomain, setWebsiteConfigDomain] = useState("");
  const path = normalizePath(location.pathname);
  const isDynamicModulePage = path.startsWith("/module/");
  const moduleRouteType = isDynamicModulePage ? path.split("/")[2] : "";
  const moduleQuery = new URLSearchParams(location.search);
  const moduleContentType = ["card", "package"].includes(moduleRouteType)
    ? moduleRouteType
    : getModuleContentType(moduleQuery.get("moduleType"));
  const dynamicModuleId =
    moduleQuery.get("packageModuleId") ||
    moduleQuery.get("moduleId") ||
    "";
  const dynamicModuleName = moduleQuery.get("moduleName") || "";
  const dynamicModuleSubtitle = moduleQuery.get("moduleSubtitle") || "";
  const menuAppUrl = useMemo(
    () => getDomainUrl(websiteInfo, "APP", URLS.app.menuApp),
    [websiteInfo],
  );
  const websiteHomeUrl = useMemo(
    () => getDomainUrl(websiteInfo, "WEBSITE", URLS.website.home),
    [websiteInfo],
  );
  const liveSportsUrl = import.meta.env.VITE_LIVE_SPORTS_URL || `${websiteHomeUrl}/live-sports`;
  const eventsUrl = import.meta.env.VITE_EVENTS_URL || `${websiteHomeUrl}/events`;
  const websiteDomain = getWebsiteDomain();
  const hasWebsiteConfig = websiteConfigDomain === websiteDomain;
  const siteName = websiteInfo?.siteName?.trim();
  const logoUrl = websiteInfo?.logoUrl ? getImageUrl(websiteInfo.logoUrl) : "";
  const escapedSiteName = escapeHtml(siteName || "");
  const tenantPhone = String(websiteInfo?.phone || "").replace(/\D/g, "");
  const countryDigits = String(websiteInfo?.countryCode || "").replace(/\D/g, "");
  const whatsappPhone = tenantPhone
    ? `${countryDigits}${tenantPhone.replace(new RegExp(`^${countryDigits}`), "").replace(/^0+/, "")}`
    : "";
  const displayPhone = [websiteInfo?.countryCode, websiteInfo?.phone].filter(Boolean).join(" ");
  const heroNameParts = siteName?.replace(/\s+/g, " ").trim().toUpperCase().split(" ") || [];
  const logoMainName = escapeHtml(heroNameParts[0] || "");
  const logoTagName = escapeHtml(heroNameParts.slice(1).join(" "));
  const heroHeading = heroNameParts.length
    ? `<h1 id="hero-heading" class="lounge-hero__title hero-anim">${escapeHtml(heroNameParts[0])}${heroNameParts.length > 1 ? `<br /><span class="lounge-hero__subbrand">${escapeHtml(heroNameParts.slice(1).join(" "))}</span>` : ""}</h1>`
    : '<h1 id="hero-heading" class="lounge-hero__title hero-anim"></h1>';

  const searchWithDevice = (() => {
    const params = new URLSearchParams(location.search);
    const qrData = getActiveQrData(location.search, qrContext);
    const companyId =
      qrData.companyId || websiteInfo?.companyId || params.get("companyId") || params.get("cid");
    const branchId =
      qrData.branchId || websiteInfo?.branchId || params.get("branchId") || params.get("bid");
    params.delete("cid");
    params.delete("bid");
    if (companyId) params.set("companyId", companyId);
    if (branchId) params.set("branchId", branchId);
    if (deviceId) params.set("deviceId", deviceId);
    return `?${params.toString()}`;
  })();
  const wifiCompanyId =
    websiteInfo?.companyId ||
    qrContext?.data?.companyId ||
    resolveParam(searchWithDevice, "companyId");
  const wifiDemoMode = new URLSearchParams(location.search).get("wifiDemo") || "";
  const wifiReservationDetails = {
    id: "free-wifi",
    name: "Free Wi-Fi",
    type: "free-wifi",
    categoryName: "Free Wi-Fi",
    category: "FREE_WIFI",
    bookingType: "Free Wi-Fi",
  };
  const hasTenantContext = Boolean(
    resolveParam(searchWithDevice, "companyId") && resolveParam(searchWithDevice, "branchId"),
  );
  const html = (pages[path] ?? pages["/"]).replace(
    'src="assets/images/careem.avif"',
    'src="/assets/images/careem.avif"',
  ).replaceAll("assets/images/logo.webp?v=20260821", escapeHtml(logoUrl))
    .replace(
      '<h1 id="hero-heading" class="lounge-hero__title hero-anim">DESIRE<br /><span class="lounge-hero__subbrand">SHEESHA LOUNGE</span></h1>',
      heroHeading,
    )
    .replaceAll("971509002202", whatsappPhone)
    .replaceAll("+971 50 900 2202", displayPhone)
    .replaceAll("DESIRE SHEESHA LOUNGE", escapedSiteName)
    .replaceAll("Desire Sheesha Lounge", escapedSiteName)
    .replaceAll("THE DESIRE LOUNGE", escapedSiteName)
    .replaceAll("The Desire Lounge", escapedSiteName)
    .replaceAll('<span class="logo__text">DESIRE</span>', `<span class="logo__text">${logoMainName}</span>`)
    .replaceAll(
      '<span class="logo__tag">SHEESHA LOUNGE</span>',
      logoTagName ? `<span class="logo__tag">${logoTagName}</span>` : "",
    )
    .replaceAll('href="https://thedesirelounge.com/events.html"', `href="${eventsUrl}"`)
    .replaceAll('href="https://thedesirelounge.com/live-sports.html"', `href="${liveSportsUrl}"`)
    .replaceAll("https://app.thedesirelounge.com", menuAppUrl)
    .replaceAll("https://thedesirelounge.com", websiteHomeUrl);

  useEffect(() => {
    if (path !== "/") return undefined;

    const carousel = rootRef.current?.querySelector(".dashboard-offer");
    if (!carousel) return undefined;

    const slides = [...carousel.querySelectorAll(".dashboard-offer__slide")];
    const dots = [...carousel.querySelectorAll(".dashboard-offer__dots button")];
    const previous = carousel.querySelector("[data-offer-prev]");
    const next = carousel.querySelector("[data-offer-next]");
    if (slides.length < 2 || dots.length !== slides.length) return undefined;

    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let timer;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const showSlide = (index) => {
      slides[activeIndex].classList.remove("is-active");
      slides[activeIndex].setAttribute("aria-hidden", "true");
      dots[activeIndex].classList.remove("is-active");
      dots[activeIndex].removeAttribute("aria-current");

      activeIndex = (index + slides.length) % slides.length;
      slides[activeIndex].classList.add("is-active");
      slides[activeIndex].setAttribute("aria-hidden", "false");
      dots[activeIndex].classList.add("is-active");
      dots[activeIndex].setAttribute("aria-current", "true");

      if (!reducedMotion) {
        window.clearInterval(timer);
        timer = window.setInterval(() => showSlide(activeIndex + 1), 6500);
      }
    };
    const onPrevious = () => showSlide(activeIndex - 1);
    const onNext = () => showSlide(activeIndex + 1);
    const onDotClick = (event) => {
      const dotIndex = dots.indexOf(event.currentTarget);
      if (dotIndex >= 0) showSlide(dotIndex);
    };

    previous?.addEventListener("click", onPrevious);
    next?.addEventListener("click", onNext);
    dots.forEach((dot) => dot.addEventListener("click", onDotClick));
    if (!reducedMotion) timer = window.setInterval(() => showSlide(activeIndex + 1), 6500);

    return () => {
      previous?.removeEventListener("click", onPrevious);
      next?.removeEventListener("click", onNext);
      dots.forEach((dot) => dot.removeEventListener("click", onDotClick));
      window.clearInterval(timer);
    };
  }, [path, websiteConfigStatus]);

  useEffect(() => {
    dispatch(fetchQrContext(location.search));
  }, [location.search]);

  useEffect(() => {
    if (wifiDemoMode === "credentials") {
      wifiCheckInFlight.current = false;
      return;
    }
    if (!wifiCompanyId || !deviceId) return;

    if (path === "/free-wifi") {
      const requestKey = `${deviceId}:${wifiCompanyId}`;
      if (wifiCheckKey.current === requestKey || deviceCheck.status === "loading") return;
      wifiCheckKey.current = requestKey;
      wifiCheckInFlight.current = true;
      dispatch(checkDevice({ deviceId, companyId: wifiCompanyId }));
      return;
    }

    wifiCheckKey.current = null;
    if (deviceCheck.status !== "idle") return;
    dispatch(checkDevice({ deviceId, companyId: wifiCompanyId }));
  }, [deviceCheck.status, deviceId, dispatch, path, wifiCompanyId, wifiDemoMode]);

  useEffect(() => {
    if (
      path === "/free-wifi" &&
      deviceCheck.status !== "loading" &&
      wifiCheckInFlight.current
    ) {
      wifiCheckInFlight.current = false;
    }
  }, [deviceCheck.status, path]);

  useEffect(() => {
    if (
      path !== "/free-wifi" ||
      wifiDemoMode === "credentials" ||
      wifiDemoMode === "qr" ||
      pendingWifiNavigation.current ||
      wifiCheckInFlight.current ||
      deviceCheck.status !== "succeeded" ||
      isRegisteredCustomer
    ) {
      return;
    }

    redirectToReservationPage(
      searchWithDevice,
      path,
      qrContext,
      deviceId,
      headerModulesState.items,
      returningCustomer,
      menuAppUrl,
      "Free Wi-Fi access requested.",
      "Free Wi-Fi",
      wifiReservationDetails,
    );
  }, [
    deviceCheck.status,
    deviceId,
    headerModulesState.items,
    isRegisteredCustomer,
    menuAppUrl,
    path,
    qrContext,
    returningCustomer,
    searchWithDevice,
    wifiDemoMode,
  ]);

  useEffect(() => {
    const pending = pendingWifiNavigation.current;
    if (!pending || deviceCheck.status === "idle" || deviceCheck.status === "loading") return;

    pendingWifiNavigation.current = null;
    const shouldShowWifiPage =
      deviceCheck.status === "succeeded" &&
      isRegisteredCustomer;

    if (deviceCheck.status === "failed") {
      console.error("Unable to verify guest Wi-Fi requirements:", deviceCheck.error);
    }

    if (shouldShowWifiPage) {
      pending.tab?.close();
      navigate(`/free-wifi${searchWithDevice}`);
      return;
    }

    if (deviceCheck.status === "succeeded") {
      pending.tab?.close();
      redirectToReservationPage(
        searchWithDevice,
        path,
        qrContext,
        deviceId,
        headerModulesState.items,
        returningCustomer,
        menuAppUrl,
        "Free Wi-Fi access requested.",
        "Free Wi-Fi",
        wifiReservationDetails,
      );
      return;
    }

    if (pending.tab && !pending.tab.closed) {
      pending.tab.location.replace(pending.href);
      return;
    }

    window.location.assign(pending.href);
  }, [
    deviceCheck,
    deviceId,
    headerModulesState.items,
    isRegisteredCustomer,
    menuAppUrl,
    navigate,
    path,
    qrContext,
    returningCustomer,
    searchWithDevice,
  ]);

  useEffect(() => {
    const controller = new AbortController();
    setWebsiteInfo(null);
    setWebsiteConfigDomain(websiteDomain);
    setWebsiteConfigStatus("loading");
    setWebsiteConfigError("");

    fetchWebsiteByDomainApi(websiteDomain, { signal: controller.signal })
      .then((response) => {
        const data = response?.data && typeof response.data === "object" ? response.data : response;
        if (!data || typeof data !== "object" || Array.isArray(data)) {
          throw new Error("Website configuration API returned an invalid response.");
        }
        setWebsiteInfo(data);
        setWebsiteConfigStatus("succeeded");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        console.error(`Unable to load website configuration for ${websiteDomain}:`, error);
        setWebsiteConfigError(error.message || "Unable to load website configuration.");
        setWebsiteConfigStatus("failed");
      });

    return () => controller.abort();
  }, [websiteDomain, websiteConfigRetry]);

  useEffect(() => {
    const root = document.documentElement;
    themeVariablesRef.current.forEach((key) => root.style.removeProperty(key));
    themeVariablesRef.current = [];
    if (!websiteInfo?.themeJson) return;

    let theme = websiteInfo.themeJson;
    if (typeof theme === "string") {
      try {
        theme = JSON.parse(theme);
      } catch (error) {
        console.error("Website themeJson is not valid JSON:", error);
        return;
      }
    }
    if (!theme || typeof theme !== "object" || Array.isArray(theme)) {
      console.error("Website themeJson must be a JSON object.");
      return;
    }

    Object.entries(theme).forEach(([key, value]) => {
      if (!/^--[a-z0-9-]+$/i.test(key) || !["string", "number"].includes(typeof value)) return;
      root.style.setProperty(key, String(value));
      themeVariablesRef.current.push(key);
    });
  }, [websiteInfo]);

  useEffect(() => {
    document.title = siteName || "Digital Lounge";
    let favicon = document.querySelector('link[rel~="icon"]');
    if (logoUrl) {
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = logoUrl;
    } else {
      favicon?.remove();
    }
  }, [websiteInfo, siteName, logoUrl]);

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
    const drawerPanel = drawer?.querySelector(".lounge-drawer__panel");
    if (drawerPanel) {
      const navigation = getLoungeNavigation({
        menuAppUrl,
        websiteHomeUrl,
        liveSportsUrl,
        eventsUrl,
        reserveUrl: URLS.website.reserve.replace(URLS.website.home, websiteHomeUrl),
        headerModules: headerModulesState.items,
        search: searchWithDevice,
      });
      drawerPanel.replaceChildren();
      [
        { title: "Explore", links: navigation.explore },
        { title: "Legal", links: navigation.legal },
      ].forEach(({ title, links }) => {
        const heading = document.createElement("p");
        heading.className = "lounge-drawer__title";
        heading.textContent = title;
        drawerPanel.append(heading);
        links.forEach(({ label, href, direct }) => {
          const link = document.createElement("a");
          link.href = href;
          link.textContent = label;
          if (direct) {
            link.dataset.moduleDestination = "true";
            if (/^https?:\/\//i.test(href)) {
              link.target = "_blank";
              link.rel = "noopener noreferrer";
            }
          }
          drawerPanel.append(link);
        });
      });
    }

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
      const href = link.getAttribute("href");
      if (link.dataset.moduleDestination === "true") return;
      if (link.closest("#order-online, #connect-social")) return;
      const isWifiLink =
        link.querySelector("h2")?.textContent?.trim().toLowerCase() === "free wi-fi";
      if (isWifiLink && href?.startsWith("https://wa.me/")) {
        e.preventDefault();
        if (!wifiCompanyId || !deviceId) {
          window.location.assign(href);
          return;
        }

        const tab = window.open("about:blank", "_blank");
        if (tab) tab.opener = null;
        pendingWifiNavigation.current = { tab, href };
        if (deviceCheck.status !== "loading") {
          wifiCheckKey.current = `${deviceId}:${wifiCompanyId}`;
          wifiCheckInFlight.current = true;
          dispatch(checkDevice({ deviceId, companyId: wifiCompanyId }));
        }
        return;
      }
      if (link.matches("[data-package-book]") && !link.dataset.packageDetails) {
        e.preventDefault();
        return;
      }
      if (link.matches("[data-package-book]") && link.dataset.packageDetails) {
        e.preventDefault();
        const packageDetails = JSON.parse(link.dataset.packageDetails);
        window.location.assign(buildPackageMenuUrl(searchWithDevice, qrContext, packageDetails, deviceId, returningCustomer, menuAppUrl));
        return;
      }
      const packageDetails = getPackageCheckoutDetails(href || "");
      if (packageDetails) {
        e.preventDefault();
        window.location.assign(buildPackageMenuUrl(searchWithDevice, qrContext, packageDetails, deviceId, returningCustomer, menuAppUrl));
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
  returningCustomer,
  menuAppUrl
);
        return;
      }
      if (href === liveSportsUrl || href === eventsUrl) {
        e.preventDefault();
        const targetUrl = new URL(href, window.location.origin);
        const currentParams = new URLSearchParams(searchWithDevice);
        currentParams.forEach((value, key) => {
          if (!targetUrl.searchParams.has(key)) targetUrl.searchParams.set(key, value);
        });
        window.location.assign(targetUrl.toString());
        return;
      }
      if (href?.startsWith(menuAppUrl)) {
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
            window.location.replace(buildMenuUrl(targetSearch, event.detail, targetPath, deviceId, menuAppUrl));
          };
          window.addEventListener("qr-context-ready", onContextReady, { once: true });
          window.setTimeout(() => {
            window.removeEventListener("qr-context-ready", onContextReady);
            if (document.visibilityState === "visible") {
              window.location.replace(buildMenuUrl(targetSearch, qrContext, targetPath, deviceId, menuAppUrl));
            }
          }, 8000);
          return;
        }

        window.location.replace(buildMenuUrl(targetSearch, qrContext, targetPath, deviceId, menuAppUrl));
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
            menuAppUrl,
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
  returningCustomer,
  menuAppUrl
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
      websiteInfo,
      whatsappPhone,
    );

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
  }, [
  path,
  location.hash,
  location.search,
  qrContext,
  qrContextStatus,
  deviceId,
  deviceCheck,
  wifiCompanyId,
  returningCustomer,
  searchWithDevice,
  headerModulesState.items,
  menuAppUrl,
  liveSportsUrl,
  eventsUrl,
  navigate,
  dispatch
]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        setTimeout(
          () =>
            rootRef.current
              ?.querySelector(`#${CSS.escape(id)}`)
              ?.scrollIntoView({ behavior: "smooth", block: "start" }),
          50,
        );
      });
      return undefined;
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    return undefined;
  }, [path, location.hash, location.search, searchWithDevice]);

  usePageModuleEffects({
    path,
    rootRef,
    cardModuleState,
    searchWithDevice,
    qrContext,
    deviceId,
    returningCustomer,
    menuAppUrl,
    headerModulesState,
    packageModuleState,
    membershipState,
    dispatch,
  });

  useHeaderModulesEffects({
    path,
    searchWithDevice,
    qrContext,
    dispatch,
    headerModulesState,
    websiteConfigStatus,
    websiteInfo,
    rootRef,
    renderedHeaderModulesRef,
    headerModulesRefreshPositionRef,
    liveSportsUrl,
    websiteHomeUrl,
  });

  useEffect(() => {
    if (path !== "/menu") return;
    if (qrContextBlocked) return;
    const hasFreshContext = qrContext?.data && hasMatchingParams(searchWithDevice, qrContext.params);
    const canRedirect = !location.search || hasFreshContext || qrContextStatus === "failed";
    if (canRedirect) window.location.replace(buildMenuUrl(searchWithDevice, qrContext, "/", deviceId, menuAppUrl));
  }, [path, searchWithDevice, location.search, qrContext, qrContextStatus, qrContextBlocked, deviceId, menuAppUrl]);

  if (path === "/screen-recording") {
    return (
      <LiveStreamPage
        siteName={siteName}
        logoUrl={logoUrl}
        homeHref={`/${searchWithDevice}`}
        streamConfig={websiteInfo?.liveStream}
      />
    );
  }

  if (qrContextBlocked) {
    return (
      <div className="lounge-page lounge-page--redirect" role="alert">
        <p>{qrContextError}</p>
      </div>
    );
  }

  if (path === "/free-wifi") {
    return (
      <FreeWifiPage
        siteName={siteName}
        logoUrl={logoUrl}
        deviceCheck={deviceCheck}
        companyId={wifiCompanyId}
        demoMode={wifiDemoMode}
        isRegisteredCustomer={isRegisteredCustomer}
      />
    );
  }

  if (!hasWebsiteConfig || websiteConfigStatus === "loading") {
    return (
      <div className="lounge-page lounge-page--redirect" role="status" aria-live="polite">
        <p className="bg-loading">Loading venue...</p>
      </div>
    );
  }

  if (websiteConfigStatus === "failed") {
    return (
      <div className="lounge-page lounge-page--redirect" role="alert">
        <p>Could not load venue information for {websiteDomain}.</p>
        <p>{websiteConfigError}</p>
        <button type="button" onClick={() => setWebsiteConfigRetry((attempt) => attempt + 1)}>
          Try again
        </button>
      </div>
    );
  }

  if (path === "/call-waiter") {
    const requestContext = getRequestContext(searchWithDevice, qrContext);
    return (
      <CallWaiterPage
        siteName={siteName}
        logoUrl={logoUrl}
        companyId={requestContext.companyId || websiteInfo?.companyId || ""}
        branchId={requestContext.branchId || websiteInfo?.branchId || ""}
        homeHref={`/${searchWithDevice}`}
        onContinue={({ specialRequest, reservationTitle, reservationDetails }) =>
          redirectToReservationPage(
            searchWithDevice,
            path,
            qrContext,
            deviceId,
            headerModulesState.items,
            returningCustomer,
            menuAppUrl,
            specialRequest,
            reservationTitle,
            reservationDetails,
          )
        }
      />
    );
  }



  if (isDynamicModulePage) {
    const isLoyaltyModule = /loyalty|reward/i.test(dynamicModuleName);
    const moduleReservationCategory =
      dynamicModuleName.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_") ||
      "TABLE_RESERVATION";
    const bookDynamicModuleItem = (item, itemType) => {
      const bookingUrl = buildPackageMenuUrl(
        searchWithDevice,
        qrContext,
        {
          id: item.uidPackageId || item.uidCardId,
          name: item.name,
          type: itemType,
          price: item.price,
          category: moduleReservationCategory,
          categoryName: dynamicModuleName || "Lounge Module",
          bookingType: dynamicModuleName || "Lounge Module",
          moduleId: dynamicModuleId,
        },
        deviceId,
        returningCustomer,
        menuAppUrl,
      );
      window.location.assign(bookingUrl);
    };
    const loyaltyRegistrationHref = isLoyaltyModule
      ? buildPackageMenuUrl(
          searchWithDevice,
          qrContext,
          {
            id: dynamicModuleId,
            name: dynamicModuleName || "Loyalty Program",
            type: "membership",
            categoryName: dynamicModuleName || "Loyalty Program",
            category: "MEMBERSHIP",
            bookingType: "Membership",
            moduleId: dynamicModuleId,
          },
          deviceId,
          returningCustomer,
          menuAppUrl,
        )
      : "";

    return (
      <DynamicModulePage
        contentType={moduleContentType}
        moduleId={dynamicModuleId}
        moduleName={dynamicModuleName}
        moduleSubtitle={dynamicModuleSubtitle}
        search={searchWithDevice}
        qrContext={qrContext}
        siteName={siteName}
        logoUrl={logoUrl}
        registrationHref={loyaltyRegistrationHref}
        onBook={bookDynamicModuleItem}
      />
    );
  }

  if (path === "/exclusive-offers") {
    return (
      <ExclusiveOffersPage
        siteName={siteName}
        logoUrl={logoUrl}
        websiteInfo={websiteInfo}
        menuAppUrl={menuAppUrl}
      />
    );
  }

  if (path === "/menu") {
    return (
      <div className="lounge-page lounge-page--redirect" role="status" aria-live="polite">
        <p className="bg-loading">Opening menu...</p>
      </div>
    );
  }

  const tenantInfo = [
    websiteInfo?.branchName && `<strong>${escapeHtml(websiteInfo.branchName)}</strong>`,
    websiteInfo?.address && `<address>${escapeHtml(websiteInfo.address)}</address>`,
    displayPhone &&
      `<a href="tel:${escapeHtml(`${websiteInfo.countryCode || ""}${websiteInfo.phone || ""}`)}">${escapeHtml(displayPhone)}</a>`,
    websiteInfo?.timezone && `<span>Local timezone: ${escapeHtml(websiteInfo.timezone)}</span>`,
  ].filter(Boolean).join("");
  const pageHtml = `${html}${tenantInfo ? `<footer class="tenant-info">${tenantInfo}</footer>` : ""}`;

  return (
    <>
      <div
        ref={rootRef}
        className={pageClasses[path] || "font-body lounge-page"}
        data-website-url-id={websiteInfo?.websiteUrlId || ""}
        data-company-id={websiteInfo?.companyId || ""}
        data-branch-id={websiteInfo?.branchId || ""}
        data-branch-name={websiteInfo?.branchName || ""}
        data-timezone={websiteInfo?.timezone || ""}
        dangerouslySetInnerHTML={{ __html: pageHtml }}
      />
    </>
  );
}

export default function App() {
  return (
    <>
      <AppContent />
      <CallWaiterFab />
    </>
  );
}
