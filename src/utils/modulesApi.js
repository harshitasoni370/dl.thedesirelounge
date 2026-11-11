import { apiRequest } from "./apiClient";
import { API } from "../config/urls";

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

function asUrl(value) {
  const url = asText(value).trim();
  if (!url) return "";
  if (url.startsWith("/") && !url.startsWith("//")) return url;

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (error) {
    throw new Error("Header module contains an invalid URL.", { cause: error });
  }
  if (!["http:", "https:"].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password) {
    throw new Error("Header module URLs must use HTTP(S) and cannot include credentials.");
  }
  return parsedUrl.toString();
}

export function normalizeHeaderModules(payload) {
  return unwrapHeaders(payload).map((header) => {
    const modules = Array.isArray(header.modules)
      ? header.modules.map((mod) => ({
          uidModuleId: asText(
            mod.uidModuleId || mod.uidHeaderModuleId || mod.moduleId || mod.id,
          ),
          moduleName: asText(mod.moduleName || mod.strModuleName || mod.name),
          moduleType: asText(mod.moduleType || mod.strModuleType || mod.type),
          subtitle: getModuleSubtitle(mod),
          url: asUrl(mod.url),
          icon: asText(mod.icon),
          status: asText(mod.status, "ACTIVE"),
        }))
      : [];
    return {
      uidHeaderId: asText(header.uidHeaderId || header.headerId || header.id),
      headerName: asText(header.headerName || header.name),
      headerCode: asText(header.headerCode || header.code),
      status: asText(header.status, "ACTIVE"),
      modules,
    };
  });
}

export async function fetchHeaderModules(context = {}, { signal } = {}) {
  const payload = await apiRequest(API.upstream.headerModules, {
    params: { companyId: context.companyId, branchId: context.branchId },
    signal,
  });

  return normalizeHeaderModules(payload);
}
