const QR_ENTRY_PARAMS = new Set([
  "type",
  "location",
  "name",
  "resturant",
  "restaurant",
  "tablecode",
  "tableid",
  "tablenumber",
  "tableno",
  "sessionid",
  "tablesessionid",
  "tid",
  "sid",
  "tn",
]);
const QR_ORIGIN_PARAMS = new Set(["type", "location", "name", "resturant", "restaurant", "tablecode"]);

export function isQrEntry(search) {
  const params = new URLSearchParams(search);
  return Array.from(params.entries()).some(([key, value]) => QR_ENTRY_PARAMS.has(key.toLowerCase()) && Boolean(value));
}

export function appendQrOriginParams(search, targetParams) {
  if (!isQrEntry(search)) return;

  new URLSearchParams(search).forEach((value, key) => {
    if (QR_ORIGIN_PARAMS.has(key.toLowerCase()) && value) targetParams.set(key, value);
  });
}
