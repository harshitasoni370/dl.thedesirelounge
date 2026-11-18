import { apiRequest } from "./apiClient";
import { API } from "../config/urls";
import { getModuleUrl, normalizeModuleUrl } from "./moduleUrl";
import { normalizeActiveStatus } from "./moduleStatus";

function unwrapHeaders(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["headers", "items", "data", "result", "records"]) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = unwrapHeaders(value);
      if (nested.length) return nested;
    }
  }
  return [];
}

function asText(value, fallback = "") {
  if (Array.isArray(value)) return value.join(", ");
  return value === null || value === undefined ? fallback : String(value);
}

function getModuleSubtitle(module) {
  const subtitle = [
    module.moduleSubtitle,
    module.strModuleSubtitle,
    module.strModuleDescription,
    module.strModuleDesc,
    module.moduleDescription,
    module.moduleDesc,
    module.strSubtitle,
    module.subtitle,
    module.strDescription,
    module.description,
    module.strModuleShortDescription,
    module.strShortDescription,
    module.shortDescription,
  ].find((value) => asText(value).trim());

  return asText(subtitle).trim();
}

function getNormalizedModuleUrl(module, moduleName) {
  const value = getModuleUrl(module);
  if (!value) return "";

  try {
    return normalizeModuleUrl(value);
  } catch (error) {
    console.warn(`Ignoring invalid URL for header module "${moduleName}":`, error);
    return "";
  }
}

export function normalizeHeaderModules(payload) {
  return unwrapHeaders(payload).map((header) => {
    const modules = Array.isArray(header.modules)
      ? header.modules.map((mod) => {
          const moduleName = asText(mod.moduleName || mod.strModuleName || mod.name);
          return {
            uidModuleId: asText(
              mod.uidModuleId || mod.uidHeaderModuleId || mod.moduleId || mod.id,
            ),
            moduleName,
            moduleType: asText(mod.moduleType || mod.strModuleType || mod.type),
            subtitle: getModuleSubtitle(mod),
            url: getNormalizedModuleUrl(mod, moduleName),
            icon: asText(
              mod.logo ||
                mod.logoUrl ||
                mod.strLogo ||
                mod.strLogoUrl ||
                mod.icon ||
                mod.imageUrl ||
                mod.image ||
                mod.strImagePath ||
                mod.thumbnail,
            ),
            status: normalizeActiveStatus(mod),
          };
        })
      : [];
    return {
      uidHeaderId: asText(header.uidHeaderId || header.headerId || header.id),
      headerName: asText(header.headerName || header.name),
      headerCode: asText(header.headerCode || header.code),
      status: normalizeActiveStatus(header),
      modules,
    };
  });
}

export async function fetchHeaderModules(context = {}, { signal } = {}) {
  const payload = await apiRequest(API.upstream.headerModules, {
    params: { companyId: context.companyId, branchId: context.branchId },
    signal,
    cache: "no-store",
  });

  return normalizeHeaderModules(payload);
}
