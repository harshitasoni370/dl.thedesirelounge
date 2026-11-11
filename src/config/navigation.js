import { URLS } from "./urls";
import {
  buildModulePageHref,
  getModuleContentType,
} from "../utils/moduleRouting";

export function getLoungeNavigation({
  menuAppUrl = URLS.app.menuApp,
  websiteHomeUrl = URLS.website.home,
  liveSportsUrl = URLS.website.liveSports,
  eventsUrl = URLS.website.events,
  reserveUrl = URLS.website.reserve,
  headerModules = [],
  search = "",
} = {}) {
  const primaryNavigation = headerModules.find(
    (header) =>
      header.headerCode?.toUpperCase() === "PRIMARY_NAVIGATION" &&
      header.status?.toUpperCase() === "ACTIVE",
  );
  const staticLabels = new Set([
    "digital lounge",
    "live sports",
    "events",
    "playstation",
    "board games",
    "menu",
    "exclusive offers",
    "sunday brunch",
    "birthday celebrations",
    "corporate bookings",
    "desire privilege",
    "make it your moment",
    "today's highlights",
    "reserve a table",
    "website",
  ]);
  const dynamicLinks = (Array.isArray(primaryNavigation?.modules) ? primaryNavigation.modules : [])
    .filter(
      (module) =>
        module.status?.toUpperCase() === "ACTIVE" &&
        module.moduleName?.trim() &&
        !staticLabels.has(module.moduleName.trim().toLowerCase()),
    )
    .map((module) => ({
      label: module.moduleName.trim(),
      href: module.moduleName.trim().toLowerCase() === "catering"
        ? module.url || `${websiteHomeUrl.replace(/\/+$/, "")}/catering`
        : ["card", "package"].includes(getModuleContentType(module.moduleType))
          ? buildModulePageHref(module, search)
          : module.url || buildModulePageHref(module, search),
    }));

  return {
    explore: [
      { label: "Digital Lounge", href: "/" },
      { label: "Live Sports", href: liveSportsUrl },
      { label: "Events", href: eventsUrl },
      { label: "PlayStation", href: "/playstation" },
      { label: "Board Games", href: "/board-games" },
      ...dynamicLinks,
      { label: "Menu", href: `${menuAppUrl.replace(/\/+$/, "")}/categories` },
      { label: "Exclusive Offers", href: "/exclusive-offers" },
      { label: "Sunday Brunch", href: "/sunday-brunch" },
      { label: "Birthday Celebrations", href: "/birthday-celebrations" },
      { label: "Corporate Bookings", href: "/corporate-bookings" },
      { label: "Desire Privilege", href: "/privilege-membership" },
      { label: "Make It Your Moment", href: "/make-it-your-moment" },
      { label: "Today's Highlights", href: "/#highlights" },
      { label: "Reserve a Table", href: reserveUrl },
      { label: "Website", href: websiteHomeUrl },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  };
}
