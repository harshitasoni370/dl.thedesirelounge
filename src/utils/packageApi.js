import { apiRequest } from "./apiClient";
import { API, MODULE_IDS } from "../config/urls";

export const DEFAULT_PACKAGE_CONTEXT = {
  moduleId: MODULE_IDS.packages || "34636e48-b3d7-4961-bd91-6a73a2f8a85a",
};

function unwrapPackages(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["packages", "packageItems", "items", "data", "result", "records"]) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = unwrapPackages(value);
      if (nested.length) return nested;
    }
  }
  return [];
}

function asText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function asList(value) {
  if (Array.isArray(value)) return value.map((v) => asText(v)).filter(Boolean);
  const text = asText(value);
  if (!text) return [];
  if (/[,;\n•-]/.test(text)) return text.split(/[,;\n•-]+/).map((s) => s.trim()).filter(Boolean);
  return [text];
}

function isActive(pkg) {
  if (pkg.packageIsActive === false || pkg.isActive === false) return false;
  const status = (pkg.strAvailabilityStatus || pkg.status || pkg.availabilityStatus || "").toString().toUpperCase();
  if (status && status !== "AVAILABLE" && status !== "ACTIVE") return false;
  return true;
}

function normalizeSinglePackage(pkg, index, parentPackage = null) {
  const base = {
    uidPackageId: asText(
      pkg.uidPackageItemId || pkg.uidPackageId || pkg.packageId || pkg.id,
      `package-${index + 1}`,
    ),
    moduleId: asText(
      pkg.uidHeaderModuleId || pkg.moduleId || pkg.uidModuleId || (parentPackage ? parentPackage.moduleId : ""),
    ),
    uidParentPackageItemId: asText(pkg.uidParentPackageItemId || pkg.parentId || ""),
    parentName: parentPackage ? parentPackage.name : "",
    uidPackageTypeId: asText(pkg.uidPackageTypeId || pkg.packageTypeId || pkg.typeId || ""),
    packageTypeName: asText(
      pkg.packageTypeName || pkg.typeName || pkg.category || (parentPackage ? "Sub-Package" : ""),
    ),
    name: asText(
      pkg.name || pkg.packageName || pkg.title,
      `Package ${index + 1}`,
    ),
    code: asText(pkg.code || pkg.packageCode || ""),
    subtitle: asText(pkg.strTiming || pkg.subtitle || pkg.tagline || pkg.shortDescription || ""),
    timing: asText(pkg.strTiming || pkg.timing || ""),
    description: asText(
      pkg.strDescription || pkg.description || pkg.longDescription || "",
    ),
    priceLabel: asText(pkg.strPriceLabel || pkg.priceLabel || pkg.displayPrice || pkg.priceText || ""),
    price:
      pkg.decPrice ??
      pkg.price ??
      pkg.amount ??
      pkg.priceValue ??
      (typeof pkg.decPrice === "number" ? pkg.decPrice : null),
    currency: asText(pkg.currency, "AED"),
    imageUrl: asText(pkg.strImagePath || pkg.imageUrl || pkg.image || pkg.thumbnail || pkg.banner || ""),
    status: asText(pkg.strAvailabilityStatus || pkg.status, "AVAILABLE"),
    availabilityStatus: asText(pkg.strAvailabilityStatus || pkg.availabilityStatus || "AVAILABLE"),
    featured: Boolean(pkg.featured || pkg.isFeatured || pkg.highlight),
    order:
      typeof pkg.intDisplayOrder === "number"
        ? pkg.intDisplayOrder
        : typeof pkg.order === "number"
        ? pkg.order
        : typeof pkg.sortOrder === "number"
        ? pkg.sortOrder
        : index,
    inclusions: asList(pkg.strIncludedBullets || pkg.inclusions || pkg.includes || pkg.features || pkg.benefits || pkg.items),
    terms: asList(pkg.strTermsBullets || pkg.terms || pkg.conditions || pkg.termsAndConditions),
    packageIsActive: isActive(pkg),
    children: [],
  };
  if (Array.isArray(pkg.children) && pkg.children.length > 0) {
    base.children = pkg.children
      .map((child, childIndex) => normalizeSinglePackage(child, childIndex, base))
      .filter((child) => child.packageIsActive)
      .sort((a, b) => a.order - b.order);
  }
  return base;
}

export function normalizePackageModule(payload) {
  const raw = unwrapPackages(payload);
  const normalized = raw
    .map((pkg, index) => normalizeSinglePackage(pkg, index))
    .filter((pkg) => pkg.packageIsActive)
    .sort((a, b) => a.order - b.order);
  return normalized;
}

export async function fetchPackageModuleItems(context = {}, { signal } = {}) {
  const params = {
    companyId: context.companyId,
    branchId: context.branchId,
    moduleId: context.moduleId || DEFAULT_PACKAGE_CONTEXT.moduleId,
  };

  const payload = await apiRequest(API.upstream.packageModuleItems, { params, signal });
  return normalizePackageModule(payload);
}
