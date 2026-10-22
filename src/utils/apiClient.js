const DEFAULT_TIMEOUT_MS = 20000;

export class ApiError extends Error {
  constructor(message, { status = 0, url = "", body = "" } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

function buildQuery(params, includeEmptyParams = []) {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      (value !== "" || includeEmptyParams.includes(key))
    ) {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

function withTimeout(signal, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error("Request timed out")), timeoutMs);
  if (signal) {
    if (signal.aborted) controller.abort(signal.reason);
    else signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
  }
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}

async function readJson(response, url) {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (!contentType.includes("json")) {
    const looksLikeHtml = /^\s*<(!doctype|html)/i.test(text);
    throw new ApiError(
      looksLikeHtml
        ? "API ne HTML return kiya (JSON nahi) — configured upstream URL check karein."
        : `API ne unexpected content-type return kiya: ${contentType || "unknown"}`,
      { status: response.status, url, body: text.slice(0, 200) },
    );
  }

  if (!response.ok) {
    const message = response.status === 415
      ? "Custom moments API request body maangti hai, lekin browser GET request me body nahi bhej sakta. Backend ko query parameters accept karne honge."
      : `Request failed (${response.status})`;
    throw new ApiError(message, {
      status: response.status,
      url,
      body: text.slice(0, 300),
    });
  }

  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError("API ne invalid JSON bheja", { status: response.status, url, body: text.slice(0, 200) });
  }
}

async function rawRequest(url, { method = "GET", params, headers, body, signal, timeoutMs, includeEmptyParams }) {
  const fullUrl = `${url}${buildQuery(params, includeEmptyParams)}`;
  const { signal: timedSignal, clear } = withTimeout(signal, timeoutMs || DEFAULT_TIMEOUT_MS);
  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: timedSignal,
      credentials: "omit",
    });
    if (response.status === 204) return null;
    return await readJson(response, fullUrl);
  } finally {
    clear();
  }
}

export function apiRequest(url, options = {}) {
  return rawRequest(url, options);
}
