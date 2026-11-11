function normalizeName(value) {
  return String(value || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

export function getModuleContentType(value) {
  const type = String(value || "").trim().toLowerCase();
  if (type.includes("package")) return "package";
  if (type.includes("card")) return "card";
  return "detail";
}

const STATIC_MODULE_PATHS = {
  "playstation": "/playstation",
  "play station": "/playstation",
  "playstations": "/playstation",
  "board games": "/board-games",
  "make it your moment": "/make-it-your-moment",
  "birthday": "/birthday-celebrations",
  "birthday celebration": "/birthday-celebrations",
  "birthday celebrations": "/birthday-celebrations",
  "birthday packages": "/birthday-celebrations",
  "corporate": "/corporate-bookings",
  "corporate booking": "/corporate-bookings",
  "corporate bookings": "/corporate-bookings",
  "exclusive offer": "/exclusive-offers",
  "exclusive offers": "/exclusive-offers",
  "privilege membership": "/privilege-membership",
  "sunday brunch": "/sunday-brunch",
};

function slugify(value) {
  return normalizeName(value).replace(/\s+/g, "-") || "module";
}

export function getStaticModulePath(moduleName) {
  return STATIC_MODULE_PATHS[normalizeName(moduleName)] || "";
}

export function buildModulePageHref(module, search = "") {
  const moduleName = String(module?.moduleName || "").trim();
  const moduleId = String(module?.uidModuleId || "").trim();
  const contentType = getModuleContentType(module?.moduleType);
  const staticPath = getStaticModulePath(moduleName);
  const pathname =
    staticPath || `/module/${contentType}/${slugify(moduleName || moduleId)}`;
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);

  params.delete("packageModuleId");
  params.delete("moduleId");
  if (moduleId) params.set("moduleId", moduleId);
  if (module?.moduleType) params.set("moduleType", module.moduleType);
  if (moduleName) params.set("moduleName", moduleName);
  if (module?.subtitle) params.set("moduleSubtitle", module.subtitle);

  const query = params.toString();
  return `${pathname}${query ? `?${query}` : ""}`;
}
