const MODULE_URL_FIELDS = [
  "externalLink",
  "strExternalLink",
  "externalUrl",
  "strExternalUrl",
  "moduleExternalLink",
  "strModuleExternalLink",
  "url",
  "moduleUrl",
  "strModuleUrl",
  "strUrl",
];

export function getModuleUrl(module) {
  if (!module || typeof module !== "object") return "";

  const keysByLowercase = new Map(
    Object.keys(module).map((key) => [key.toLowerCase(), key]),
  );
  for (const field of MODULE_URL_FIELDS) {
    const key = keysByLowercase.get(field.toLowerCase());
    const value = key ? module[key] : undefined;
    if (value !== null && value !== undefined && String(value).trim()) {
      return Array.isArray(value) ? value.join(", ") : String(value);
    }
  }

  return "";
}

export function normalizeModuleUrl(value) {
  const url = String(value ?? "").trim();
  if (!url) return "";
  if (url.startsWith("/") && !url.startsWith("//")) return url;

  const candidate =
    !/^[a-z][a-z\d+.-]*:/i.test(url) &&
    /^[a-z\d-]+(?:\.[a-z\d-]+)+(?:[/:?#].*)?$/i.test(url)
      ? `https://${url}`
      : url;

  let parsedUrl;
  try {
    parsedUrl = new URL(candidate);
  } catch (error) {
    throw new Error("Header module contains an invalid URL.", { cause: error });
  }
  if (!["http:", "https:"].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password) {
    throw new Error("Header module URLs must use HTTP(S) and cannot include credentials.");
  }
  return parsedUrl.toString();
}
