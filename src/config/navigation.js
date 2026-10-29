import { URLS } from "./urls";

export function getLoungeNavigation({
  menuAppUrl = URLS.app.menuApp,
  websiteHomeUrl = URLS.website.home,
  liveSportsUrl = URLS.website.liveSports,
  eventsUrl = URLS.website.events,
  reserveUrl = URLS.website.reserve,
} = {}) {
  return {
    explore: [
      { label: "Digital Lounge", href: "/" },
      { label: "Live Sports", href: liveSportsUrl },
      { label: "Events", href: eventsUrl },
      { label: "PlayStation", href: "/playstation" },
      { label: "Board Games", href: "/board-games" },
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
