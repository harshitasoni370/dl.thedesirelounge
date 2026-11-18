import { useEffect } from "react";
import { fetchHeaderModules } from "../store/slices/modulesSlice";
import { fetchCardModule } from "../store/slices/cardModuleSlice";
import { fetchPackageModuleItems } from "../store/slices/packageSlice";
import { getModuleIdByName, resolveParam } from "../utils/appHelpers";
import { getImageUrl } from "../utils/imageUrl";
import { isSocialHeader } from "../utils/moduleHeaderKind";
import {
  buildModulePageHref,
  getModuleContentType,
  getStaticModulePath,
} from "../utils/moduleRouting";

const HEADER_MODULES_REFRESH_INTERVAL_MS = 15_000;

export function useHeaderModulesEffects({
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
}) {
  useEffect(() => {
    if (
      !resolveParam(searchWithDevice, "companyId") ||
      !resolveParam(searchWithDevice, "branchId")
    ) return;
    const fetchModules = () => {
      const scrollY = window.scrollY;
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      headerModulesRefreshPositionRef.current = {
        scrollY,
        wasAtBottom: documentHeight - (scrollY + window.innerHeight) <= 8,
      };
      return dispatch(fetchHeaderModules({ search: searchWithDevice, qrContext }));
    };
    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") fetchModules();
    };

    fetchModules();
    const intervalId = window.setInterval(
      refreshIfVisible,
      HEADER_MODULES_REFRESH_INTERVAL_MS,
    );
    window.addEventListener("focus", refreshIfVisible);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshIfVisible);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [path, searchWithDevice, qrContext, dispatch]);

  useEffect(() => {
    let overrides = null;
    const cardModuleNameByPath = {
      "/playstation": "Playstation",
      "/board-games": "Board Games",
      "/make-it-your-moment": "Make It Your Moment",
      "/birthday-celebrations": "Birthday Packages",
      "/corporate-bookings": "Corporate",
    };
    const cardModuleName = cardModuleNameByPath[path];
    if (cardModuleName) {
      if (headerModulesState.status === "failed") {
        console.error("Unable to load header modules", headerModulesState.error);
        return undefined;
      }
      if (headerModulesState.status !== "succeeded") return undefined;
      const moduleId = getModuleIdByName(headerModulesState.items, cardModuleName);
      if (!moduleId) {
        console.error(`Active ${cardModuleName} module was not found in header modules.`);
        return undefined;
      }
      overrides = { moduleId };
    }
    if (
      !overrides ||
      websiteConfigStatus !== "succeeded" ||
      !websiteInfo?.companyId ||
      !websiteInfo?.branchId
    ) return undefined;
    dispatch(fetchCardModule({ search: searchWithDevice, qrContext, overrides }));
    return undefined;
  }, [path, searchWithDevice, qrContext, websiteConfigStatus, websiteInfo?.companyId, websiteInfo?.branchId, headerModulesState, dispatch]);

  useEffect(() => {
    const urlModuleId = new URLSearchParams(searchWithDevice).get("moduleId");
    let overrides = null;
    if (path === "/exclusive-offers") {
      overrides = { moduleId: urlModuleId || MODULE_IDS.exclusiveOffers };
    } else if (path === "/birthday-celebrations" || path === "/corporate-bookings") {
      overrides = { moduleId: urlModuleId || MODULE_IDS.packages };
    }

    if (
      !overrides ||
      websiteConfigStatus !== "succeeded" ||
      !websiteInfo?.companyId ||
      !websiteInfo?.branchId
    ) return undefined;
    dispatch(fetchPackageModuleItems({ search: searchWithDevice, qrContext, overrides }));
    return undefined;
  }, [path, searchWithDevice, qrContext, websiteConfigStatus, websiteInfo?.companyId, websiteInfo?.branchId, dispatch]);

  useEffect(() => {
    if (path !== "/") {
      renderedHeaderModulesRef.current = null;
      return undefined;
    }

    const root = rootRef.current;
    if (!root) return undefined;

    const { items: headers, status, error } = headerModulesState;
    if (status === "loading" || status === "idle") return undefined;
    if (status === "failed") {
      console.error("Unable to load header modules", error);
      return undefined;
    }

    const headerModulesSignature = JSON.stringify(headers);
    if (
      renderedHeaderModulesRef.current?.root === root &&
      renderedHeaderModulesRef.current.signature === headerModulesSignature
    ) {
      headerModulesRefreshPositionRef.current = null;
      return undefined;
    }
    const refreshPosition = headerModulesRefreshPositionRef.current;
    const scrollY = refreshPosition?.scrollY ?? window.scrollY;
    const wasAtBottom = refreshPosition
      ? refreshPosition.wasAtBottom
      : Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) -
          (scrollY + window.innerHeight) <=
        8;

    const isDashboard = root.classList.contains("home-dashboard");
    const sectionConfigs = {
      MAIN_SECTION: { selector: "#services", kind: "service" },
      ORDER_ONLINE: { selector: "#order-online", kind: "service" },
      DINING: { kind: "service" },
    };
    if (!isDashboard) {
      root
        .querySelectorAll("#services, #order-online, #connect-social, [data-module-header-section]")
        .forEach((section) => {
          section.hidden = true;
        });
    }

    const normalizeName = (value) =>
      String(value || "").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\s+/g, " ").trim().toLowerCase();
    const isActive = (value) => String(value || "").toUpperCase() === "ACTIVE";
    const moduleAliases = { "noon food": "noon" };
    const dashboardAliases = {
      menus: "smart food menu",
      menu: "smart food menu",
      playstations: "playstation",
      corporate: "corporate bookings",
    };
    const loyaltyModuleNames = new Set([
      "desire privilege membership",
      "privilege membership",
      "loyalty & rewards",
      "loyalty rewards",
      "loyalty program",
      "layotly program",
    ]);
    const dashboardGroups = [
      {
        selector: "#discover .dashboard-grid",
        names: new Set(["menus", "exclusive offers", "reserve a table", "events"]),
      },
      {
        selector: "#celebrate .dashboard-grid",
        names: new Set([
          "birthday packages",
          "corporate",
          "make it your moment",
          "loyalty & rewards",
        ]),
      },
      {
        selector: "#services .dashboard-grid",
        names: new Set([
          "free wi-fi",
          "live sports",
          "playstation",
          "playstations",
          "board games",
          "call waiter",
        ]),
      },
    ];
    if (isDashboard) {
      root
        .querySelectorAll('[data-module-header-section], section[id^="module-header-"]')
        .forEach((section) => section.remove());
      ["#discover", "#celebrate", "#services", "#order-online", "#connect-social"].forEach(
        (selector) => {
          const section = root.querySelector(selector);
          if (section) section.hidden = true;
        },
      );
      root
        .querySelectorAll(
          "#discover .dashboard-card, #celebrate .dashboard-card, #services .dashboard-card, .dashboard-partners a, .dashboard-social a",
        )
        .forEach((module) => {
          module.hidden = true;
        });
    }
    const setSectionModuleDestination = (link, url) => {
      if (!url) return;
      link.href = url;
      link.dataset.moduleDestination = "true";
      if (/^https?:\/\//i.test(url)) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        link.removeAttribute("target");
        link.removeAttribute("rel");
      }
    };
    const setDashboardFallbackIcon = (icon) => {
      const svgNamespace = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNamespace, "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("aria-hidden", "true");
      [
        [3, 3],
        [13, 3],
        [3, 13],
        [13, 13],
      ].forEach(([x, y]) => {
        const tile = document.createElementNS(svgNamespace, "rect");
        tile.setAttribute("x", x);
        tile.setAttribute("y", y);
        tile.setAttribute("width", "8");
        tile.setAttribute("height", "8");
        tile.setAttribute("rx", "1.5");
        svg.append(tile);
      });
      icon.replaceChildren(svg);
    };
    const renderDashboardCard = (module, card) => {
      const moduleName = module.moduleName || "";
      const contentType = getModuleContentType(module.moduleType);
      const existingHref = card.getAttribute("href") || "";
      const hasStaticPage = Boolean(getStaticModulePath(moduleName));
      const isLiveSportsModule = normalizeName(moduleName) === "live sports";
      const isCateringModule = normalizeName(moduleName) === "catering";
      const shouldOpenModulePage =
        isLiveSportsModule ||
        isCateringModule ||
        hasStaticPage ||
        contentType !== "detail" ||
        !existingHref;
      if (module.url) {
        setSectionModuleDestination(card, module.url);
      } else if (shouldOpenModulePage) {
        card.href = isLiveSportsModule
          ? liveSportsUrl
          : isCateringModule
            ? module.url || `${websiteHomeUrl.replace(/\/+$/, "")}/catering`
            : buildModulePageHref(module, searchWithDevice);
        card.removeAttribute("target");
        card.removeAttribute("rel");
        delete card.dataset.moduleDestination;
      } else {
        delete card.dataset.moduleDestination;
      }

      card.classList.add("lounge-card", "dashboard-card");
      card.hidden = Boolean(module.status) && module.status.toUpperCase() !== "ACTIVE";
      if (module.uidModuleId) {
        card.dataset.uidModuleId = module.uidModuleId;
        card.dataset.moduleId = module.uidModuleId;
      }
      if (module.moduleType) card.dataset.moduleType = module.moduleType;

      let icon = card.querySelector(":scope > .dashboard-card__icon");
      if (!icon) {
        icon = document.createElement("span");
        icon.className = "dashboard-card__icon";
        icon.setAttribute("aria-hidden", "true");
        card.prepend(icon);
      }
      if (module.icon) {
        const image = document.createElement("img");
        image.src = getImageUrl(module.icon);
        image.alt = "";
        image.loading = "lazy";
        icon.replaceChildren(image);
      } else if (!icon.childElementCount) {
        setDashboardFallbackIcon(icon);
      }

      let title = card.querySelector(":scope > strong");
      if (!title) {
        title = document.createElement("strong");
        card.append(title);
      }
      title.textContent = moduleName;

      let subtitle = card.querySelector(":scope > small");
      if (!subtitle) {
        subtitle = document.createElement("small");
        card.append(subtitle);
      }
      subtitle.textContent = module.subtitle || "";
      subtitle.hidden = !module.subtitle;

      if (!card.querySelector(":scope > .dashboard-card__go")) {
        const go = document.createElement("span");
        go.className = "dashboard-card__go";
        go.setAttribute("aria-hidden", "true");
        go.textContent = "›";
        card.append(go);
      }
    };
    const renderDashboardMainSection = (header, defaultGroup = dashboardGroups[0]) => {
      const usedCards = new Set();
      (header.modules || []).forEach((module) => {
        const name = normalizeName(module.moduleName);
        if (loyaltyModuleNames.has(name)) {
          const loyaltyCard = [...root.querySelectorAll("#celebrate .dashboard-card")].find(
            (card) =>
              loyaltyModuleNames.has(
                normalizeName(card.querySelector(":scope > strong")?.textContent),
              ),
          );
          if (loyaltyCard) loyaltyCard.hidden = !isActive(module.status);
          return;
        }
        const canonicalName = dashboardAliases[name] || name;
        const group =
          dashboardGroups.find((candidate) => candidate.names.has(name)) ||
          dashboardGroups.find((candidate) => candidate.names.has(canonicalName)) ||
          defaultGroup;
        const grid = root.querySelector(group.selector);
        if (!grid) return;

        const matchingCard = [...grid.querySelectorAll(".dashboard-card")].find((candidate) => {
          const label = normalizeName(candidate.querySelector(":scope > strong")?.textContent);
          return !usedCards.has(candidate) && (label === canonicalName || label === name);
        });
        const card = matchingCard || document.createElement("a");
        if (!matchingCard) {
          card.className = "lounge-card dashboard-card";
          card.href = "#";
          grid.append(card);
        }
        usedCards.add(card);
        renderDashboardCard(module, card);
      });
    };
    const renderDashboardPartnerModules = (header) => {
      const grid = root.querySelector(".dashboard-partners");
      if (!grid) return;

      (header.modules || []).forEach((module) => {
        const name = normalizeName(module.moduleName);
        const canonicalName = moduleAliases[name] || name;
        const matchingLink = [...grid.querySelectorAll("a")].find((link) => {
          const label = normalizeName(
            link.getAttribute("aria-label") ||
              link.querySelector("img")?.alt ||
              link.textContent,
          )
            .replace(/^order (on|with) /, "")
            .replace(/^find us on /, "");
          return label === canonicalName;
        });
        const link = matchingLink || document.createElement("a");
        if (!matchingLink) {
          grid.append(link);
        }
        if (module.moduleName) {
          link.setAttribute("aria-label", `Order with ${module.moduleName}`);
        }
        if (module.url) setSectionModuleDestination(link, module.url);
        const image = link.querySelector(":scope > img");
        if (module.icon) {
          const logo = image || document.createElement("img");
          logo.src = getImageUrl(module.icon);
          logo.alt = module.moduleName || "";
          logo.loading = "lazy";
          if (!image) link.replaceChildren(logo);
        } else if (image && module.moduleName) {
          image.alt = module.moduleName;
        } else if (!matchingLink && module.moduleName) {
          link.textContent = module.moduleName;
        }
        link.hidden = !isActive(module.status);
        if (module.uidModuleId) link.dataset.uidModuleId = module.uidModuleId;
        if (module.moduleType) link.dataset.moduleType = module.moduleType;
      });
    };
    const renderDashboardSocialModules = (header) => {
      const section = root.querySelector("#connect-social");
      const grid = section?.querySelector(".dashboard-social");
      if (!section || !grid) return;

      (header.modules || []).forEach((module) => {
        const name = normalizeName(module.moduleName);
        const matchingLink = [...grid.querySelectorAll("a")].find(
          (link) => normalizeName(link.querySelector("strong")?.textContent) === name,
        );
        const link = matchingLink || document.createElement("a");
        if (!matchingLink) {
          const icon = document.createElement("span");
          icon.className = "dashboard-social__icon";
          icon.textContent = module.moduleName?.trim().charAt(0).toUpperCase() || "";
          const title = document.createElement("strong");
          title.textContent = module.moduleName || "";
          link.append(icon, title);
          grid.append(link);
        }
        const title = link.querySelector(":scope > strong");
        if (title && module.moduleName) title.textContent = module.moduleName;
        const icon = link.querySelector(":scope > .dashboard-social__icon");
        if (icon && module.icon) {
          const image = document.createElement("img");
          image.src = getImageUrl(module.icon);
          image.alt = "";
          image.loading = "lazy";
          icon.replaceChildren(image);
        }
        setSectionModuleDestination(link, module.url);
        link.hidden = !isActive(module.status);
        if (module.uidModuleId) link.dataset.uidModuleId = module.uidModuleId;
        if (module.moduleType) link.dataset.moduleType = module.moduleType;
      });
      const heading = section.querySelector(".dashboard-section__title h2");
      if (heading) heading.textContent = header.headerName || "Stay Connected";
    };
    const renderDashboardHeaderSection = (header) => {
      const modules = (header.modules || []).filter((module) => isActive(module.status));
      if (!isActive(header.status) || modules.length === 0) return;

      const section = document.createElement("section");
      section.className = "dashboard-section";
      section.id = `module-header-${header.headerCode.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`;
      section.dataset.moduleHeaderSection = "true";
      section.dataset.headerCode = header.headerCode;

      const heading = document.createElement("h2");
      heading.className = "dashboard-section__title";
      heading.textContent = header.headerName || header.headerCode;

      const grid = document.createElement("div");
      grid.className = "dashboard-grid";
      modules.forEach((module) => {
        const card = document.createElement("a");
        card.className = "lounge-card dashboard-card";
        card.href = "#";
        renderDashboardCard(module, card);
        grid.append(card);
      });

      section.append(heading, grid);
      const socialSection = root.querySelector("#connect-social");
      const main = root.querySelector("#main");
      if (socialSection) {
        socialSection.before(section);
      } else {
        main?.append(section);
      }
    };
    const orderedHeaders = [
      ...headers.filter((header) => header.headerCode === "MAIN_SECTION"),
      ...headers.filter(
        (header) =>
          header.headerCode !== "MAIN_SECTION" && !isSocialHeader(header),
      ),
      ...headers.filter(isSocialHeader),
    ];
    const makeSection = (header, kind) => {
      const section = document.createElement("section");
      section.className = kind === "social"
        ? "lounge-panel"
        : "lounge-panel lounge-panel--borderless";
      section.id = `module-header-${header.headerCode.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`;
      section.dataset.moduleHeaderSection = "true";
      section.dataset.headerCode = header.headerCode;

      const heading = document.createElement("div");
      heading.className = "lounge-panel__head";
      const leftRule = document.createElement("span");
      leftRule.className = "lounge-panel__rule";
      leftRule.setAttribute("aria-hidden", "true");
      const title = document.createElement("h2");
      const rightRule = leftRule.cloneNode();
      heading.append(leftRule, title, rightRule);
      section.append(heading);

      const content = document.createElement("div");
      content.className = kind === "social" ? "lounge-social" : "lounge-services";
      if (kind !== "social") {
        const grid = document.createElement("div");
        grid.className = "lounge-services__grid";
        content.append(grid);
      }
      section.append(content);
      root.querySelector("#main")?.append(section);
      return section;
    };

    orderedHeaders.forEach((header) => {
      if (!header.headerCode) return;
      const headerCode = header.headerCode.toUpperCase();
      if (headerCode === "PRIMARY_NAVIGATION") return;
      if (isDashboard && headerCode === "MAIN_SECTION") {
        if (isActive(header.status)) renderDashboardMainSection(header);
        return;
      }
      if (isDashboard && (headerCode === "ORDER_ONLINE" || headerCode === "DINING")) {
        if (isActive(header.status)) {
          if (headerCode === "ORDER_ONLINE") {
            renderDashboardPartnerModules(header);
          } else {
            renderDashboardHeaderSection(header);
          }
        }
        return;
      }
      if (isDashboard && isSocialHeader(header)) {
        if (isActive(header.status)) renderDashboardSocialModules(header);
        return;
      }
      if (isDashboard) {
        renderDashboardHeaderSection(header);
        return;
      }
      const config = isSocialHeader(header)
        ? { selector: "#connect-social", kind: "social" }
        : sectionConfigs[header.headerCode] || { kind: "service" };
      let section = config.selector ? root.querySelector(config.selector) : null;
      if (!section) {
        section = [...root.querySelectorAll("[data-header-code]")].find(
          (candidate) => candidate.dataset.headerCode === header.headerCode,
        );
      }
      if (!section) section = makeSection(header, config.kind);
      section.hidden = !isActive(header.status);

      let heading = section.querySelector(":scope > .lounge-panel__head");
      if (!heading) {
        heading = document.createElement("div");
        heading.className = "lounge-panel__head";
        const leftRule = document.createElement("span");
        leftRule.className = "lounge-panel__rule";
        leftRule.setAttribute("aria-hidden", "true");
        const title = document.createElement("h2");
        const rightRule = leftRule.cloneNode();
        heading.append(leftRule, title, rightRule);
        section.insertBefore(heading, section.firstChild);
      }
      const headingTitle = heading.querySelector("h2");
      if (headingTitle) headingTitle.textContent = header.headerName;
      root.querySelector("#main")?.append(section);

      const kind = config.kind;
      const grid = kind === "social"
        ? section.querySelector(":scope .lounge-social")
        : section.querySelector(":scope .lounge-services__grid");
      if (!grid) {
        section.hidden = true;
        return;
      }

      const templates = new Map();
      [...grid.children].forEach((card) => {
        const title = card.querySelector(kind === "social" ? ":scope > strong" : ":scope > h2");
        const key = normalizeName(title?.textContent);
        if (key) templates.set(key, card);
      });

      grid.replaceChildren();
      const usedTemplates = new Set();
      (header.modules || []).forEach((module) => {
        const moduleName = module.moduleName || "";
        const key = normalizeName(moduleName);
        const templateKey = moduleAliases[key] || key;
        const template = templates.get(key) || templates.get(templateKey);
        let card = template && !usedTemplates.has(template)
          ? template
          : template?.cloneNode(true) || document.createElement("div");
        const contentType = getModuleContentType(module.moduleType);
        const existingHref = card.tagName === "A" ? card.getAttribute("href") : "";
        const hasStaticPage = Boolean(getStaticModulePath(moduleName));
        const isLiveSportsModule = key === "live sports";
        const isCateringModule = key === "catering";
        const shouldOpenModulePage =
          isLiveSportsModule ||
          isCateringModule ||
          hasStaticPage ||
          contentType !== "detail" ||
          !template ||
          !existingHref;
        if (module.url && card.tagName !== "A") {
          const link = document.createElement("a");
          link.className = card.className;
          link.replaceChildren(...card.childNodes);
          card = link;
        }
        if (module.url) {
          setSectionModuleDestination(card, module.url);
        } else if (shouldOpenModulePage) {
          if (card.tagName !== "A") {
            const link = document.createElement("a");
            link.className = card.className;
            link.replaceChildren(...card.childNodes);
            card = link;
          }
          card.href = isLiveSportsModule
            ? liveSportsUrl
            : isCateringModule
             ? module.url || `${websiteHomeUrl.replace(/\/+$/, "")}/catering`
             : buildModulePageHref(module, searchWithDevice);
          card.removeAttribute("target");
          card.removeAttribute("rel");
          delete card.dataset.moduleDestination;
        } else {
          delete card.dataset.moduleDestination;
        }
        if (template) usedTemplates.add(template);
        card.classList.add(kind === "social" ? "lounge-social__item" : "lounge-card");
        card.hidden = !isActive(module.status);
        if (module.uidModuleId) {
          card.dataset.uidModuleId = module.uidModuleId;
          card.dataset.moduleId = module.uidModuleId;
        }
        if (module.moduleType) card.dataset.moduleType = module.moduleType;

        let title = card.querySelector(kind === "social" ? ":scope > strong" : ":scope > h2");
        if (!title) {
          title = document.createElement(kind === "social" ? "strong" : "h2");
          card.append(title);
        }
        title.textContent = moduleName;

        const subtitleSelector = kind === "social"
          ? ":scope > span:not(.lounge-social__icon)"
          : ":scope > p";
        let subtitle = card.querySelector(subtitleSelector);
        if (!subtitle) {
          subtitle = document.createElement(kind === "social" ? "span" : "p");
          card.append(subtitle);
        }
        subtitle.textContent = module.subtitle || "";
        subtitle.hidden = !module.subtitle;

        if (module.icon || !template) {
          const iconClass = kind === "social" ? "lounge-social__icon" : "lounge-card__icon";
          let icon = card.querySelector(`:scope > .${iconClass}`);
          if (!icon) {
            icon = document.createElement("span");
            icon.className = iconClass;
            icon.setAttribute("aria-hidden", "true");
            card.prepend(icon);
          }
          if (module.icon) {
            const image = document.createElement("img");
            image.src = getImageUrl(module.icon);
            image.alt = "";
            image.loading = "lazy";
            icon.replaceChildren(image);
          } else {
            icon.textContent = moduleName.trim().charAt(0).toUpperCase();
          }
        }
        grid.append(card);
      });
      section.hidden =
        !isActive(header.status) ||
        ![...grid.children].some((card) => !card.hidden);
    });

    if (isDashboard) {
      ["#discover", "#celebrate", "#services"].forEach((selector) => {
        const section = root.querySelector(selector);
        if (!section) return;
        const hasVisibleModules = [...section.querySelectorAll(".dashboard-card")].some(
          (card) => !card.hidden,
        );
        section.hidden = !hasVisibleModules;
      });
      const partnerSection = root.querySelector("#order-online");
      const partnerLinks = root.querySelectorAll(".dashboard-partners a");
      if (partnerSection) {
        partnerSection.hidden = ![...partnerLinks].some((link) => !link.hidden);
      }
      const socialSection = root.querySelector("#connect-social");
      const socialLinks = root.querySelectorAll(".dashboard-social a");
      if (socialSection) {
        socialSection.hidden = ![...socialLinks].some((link) => !link.hidden);
      }
    }

    renderedHeaderModulesRef.current = {
      root,
      signature: headerModulesSignature,
    };
    const updatedDocumentHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    );
    const preservedScrollY = wasAtBottom
      ? Math.max(0, updatedDocumentHeight - window.innerHeight)
      : scrollY;
    if (Math.abs(window.scrollY - preservedScrollY) > 1) {
      window.scrollTo({ top: preservedScrollY, behavior: "instant" });
    }
    headerModulesRefreshPositionRef.current = null;

    return undefined;
  }, [path, searchWithDevice, headerModulesState, liveSportsUrl, websiteHomeUrl]);
}
