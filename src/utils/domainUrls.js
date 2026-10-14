export function getDomainUrl(websiteInfo, appType, fallbackUrl) {
  const domainsJson = websiteInfo?.domainsJson;
  if (!domainsJson) return fallbackUrl;

  let domains;
  try {
    domains = typeof domainsJson === "string" ? JSON.parse(domainsJson) : domainsJson;
  } catch (error) {
    console.error("Website domainsJson is not valid JSON:", error);
    return fallbackUrl;
  }

  if (!Array.isArray(domains)) {
    console.error("Website domainsJson must be a JSON array.");
    return fallbackUrl;
  }

  const domain = domains.find(
    (entry) =>
      typeof entry?.appType === "string" &&
      entry.appType.toUpperCase() === appType.toUpperCase(),
  );
  if (!domain) return fallbackUrl;

  const candidate = domain.url || (domain.domain ? `https://${domain.domain}` : "");
  try {
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
      throw new Error("Domain URL must use HTTP(S) and cannot include credentials.");
    }
    return url.toString().replace(/\/+$/, "");
  } catch (error) {
    console.error(`Website domain URL for ${appType} is invalid:`, error);
    return fallbackUrl;
  }
}
