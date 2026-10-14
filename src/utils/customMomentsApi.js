import { ApiError, apiRequest } from "./apiClient";
import { API } from "../config/urls";

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
    companyId,
    branchId,
    search = "",
    typeId,
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
