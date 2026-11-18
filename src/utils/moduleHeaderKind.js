function normalizeHeaderName(value) {
  return String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function isSocialHeader(header) {
  const identity = `${normalizeHeaderName(header?.headerCode)} ${normalizeHeaderName(
    header?.headerName,
  )}`;
  return /\b(?:social|connect(?:ed|ion)?)\b/.test(identity);
}
