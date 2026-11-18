import homePage from "./templates/index.html?raw";
import birthdayPage from "./templates/birthday-celebrations.html?raw";
import boardGamesPage from "./templates/board-games.html?raw";
import corporatePage from "./templates/corporate-bookings.html?raw";
import offersPage from "./templates/exclusive-offers.html?raw";
import momentPage from "./templates/make-it-your-moment.html?raw";
import playstationPage from "./templates/playstation.html?raw";
import privacyPage from "./templates/privacy.html?raw";
import membershipPage from "./templates/privilege-membership.html?raw";
import loyaltyProgramPage from "./templates/loyalty-program.html?raw";
import brunchPage from "./templates/sunday-brunch.html?raw";
import termsPage from "./templates/terms.html?raw";
import reservationModal from "./templates/reservation-modal.html?raw";

const templates = {
  "/": homePage,
  "/birthday-celebrations": birthdayPage,
  "/board-games": boardGamesPage,
  "/corporate-bookings": corporatePage,
  "/exclusive-offers": offersPage,
  "/make-it-your-moment": momentPage,
  "/playstation": playstationPage,
  "/privacy": privacyPage,
  "/privilege-membership": membershipPage,
  "/loyalty-program": loyaltyProgramPage,
  "/sunday-brunch": brunchPage,
  "/terms": termsPage,
};

const htmlPageRoutes = {
  "index.html": "/",
  "loyalty-program.html": "/loyalty-program",
  "birthday-celebrations.html": "/birthday-celebrations",
  "board-games.html": "/board-games",
  "call-waiter.html": "/call-waiter",
  "corporate-bookings.html": "/corporate-bookings",
  "exclusive-offers.html": "/exclusive-offers",
  "make-it-your-moment.html": "/make-it-your-moment",
  "playstation.html": "/playstation",
  "privacy.html": "/privacy",
  "privilege-membership.html": "/privilege-membership",
  "sunday-brunch.html": "/sunday-brunch",
  "terms.html": "/terms",
};

function getBodyMarkup(template, route) {
  const body = template.match(/<body\b[^>]*>([\s\S]*?)<\/body\s*>/i);
  if (!body) {
    throw new Error(`Page template for "${route}" is missing its body.`);
  }

  const markup = body[1]
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/\bhref=(["'])([^"']+)\1/gi, (attribute, quote, href) => {
      const [file, ...hashParts] = href.split("#");
      const routePath = htmlPageRoutes[file];
      if (!routePath) return attribute;
      const hash = hashParts.length ? `#${hashParts.join("#")}` : "";
      return `href=${quote}${routePath}${hash}${quote}`;
    });

  return route === "/" ? `${markup}${reservationModal}` : markup;
}

export const pages = Object.fromEntries(
  Object.entries(templates).map(([route, template]) => [
    route,
    getBodyMarkup(template, route),
  ]),
);

export const pageClasses = Object.fromEntries(
  Object.entries(templates).map(([route, template]) => {
    const bodyClass = template.match(/<body\b[^>]*\bclass=["']([^"']*)["']/i)?.[1];
    return [route, bodyClass || "font-body lounge-page"];
  }),
);
