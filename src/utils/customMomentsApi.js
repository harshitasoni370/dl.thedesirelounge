import { ApiError, apiRequest } from "./apiClient";
import { API } from "../config/urls";

export const DEFAULT_CUSTOM_MOMENT_CONTEXT = {
  companyId: "0ffbe39e-abf8-4827-9107-1a04b39f3416",
  branchId: "f4fb1d76-83a0-4965-86b5-63da28249dae",
  typeId: "0880be65-3086-4edf-ad56-877b5e5c97f7",
  tableSessionId: "ee81986f-feac-483d-bebc-adcf8422ff26",
  moduleId: "3e340f23-d842-47f0-98e8-b0d458dc22dd",
};

function unwrapMoments(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["data", "items", "moments", "result", "records"]) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = unwrapMoments(value);
      if (nested.length) return nested;
    }
  }
  return [];
}

function text(value, fallback = "") {
  return value === null || value === undefined ? fallback : String(value);
}

export function normalizeCustomMoments(payload) {
  return unwrapMoments(payload).map((moment, index) => ({
    ...moment,
    id: text(moment.id || moment.momentId || moment.customMomentId || moment.code, `moment-${index + 1}`),
    name: text(moment.name || moment.momentName || moment.title, `Moment ${index + 1}`),
    description: text(moment.description || moment.details || moment.shortDescription),
    category: text(moment.category || moment.categoryName || moment.type || moment.typeName, "all")
      .toLowerCase()
      .replace(/\s+/g, "-"),
    price: text(moment.price || moment.amount || moment.rate),
    image: text(moment.image || moment.imageUrl || moment.imagePath),
    available: moment.isAvailable !== false && moment.available !== false,
  }));
}

export async function fetchCustomMoments(context = {}, { signal } = {}) {
  const {
    companyId = DEFAULT_CUSTOM_MOMENT_CONTEXT.companyId,
    branchId = DEFAULT_CUSTOM_MOMENT_CONTEXT.branchId,
    search = "",
    typeId = DEFAULT_CUSTOM_MOMENT_CONTEXT.typeId,
    tableSessionId = "",
  } = context;

  const params = { companyId, branchId, search, typeId };
  const headers = tableSessionId ? { "Table-Session-Id": tableSessionId } : {};

  let payload;
  try {
    payload = await apiRequest(API.upstream.customMoments, {
      params,
      headers,
      signal,
    });
  } catch (error) {
    const isUnsupportedBrowserRequest = error instanceof ApiError && error.status === 415;
    const isCorsOrNetworkFailure = error instanceof TypeError;
    if (!isUnsupportedBrowserRequest && !isCorsOrNetworkFailure) throw error;

    // The live endpoint currently requires a GET body, which browsers cannot send.
    // Keep the page usable until the backend accepts the same values from query params.
    const fallbackResponse = await fetch("/assets/data/custom-moments.json", { signal });
    if (!fallbackResponse.ok) throw error;
    payload = await fallbackResponse.json();
  }
  return normalizeCustomMoments(payload);
}
