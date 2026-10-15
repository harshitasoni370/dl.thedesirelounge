import { apiRequest } from "./apiClient";
import { API } from "../config/urls";
import {
  getOrCreateDeviceId as resolveDeviceId,
  getOrCreateDeviceIdSync as resolveDeviceIdSync,
} from "./deviceId";
import { getWebsiteDomain } from "./domainUrls";

export { persistDeviceId, readUrlDeviceId } from "./deviceId";

export function getOrCreateDeviceIdSync(search) {
  return resolveDeviceIdSync(search);
}

export async function getOrCreateDeviceId(search) {
  return resolveDeviceId(search);
}

export async function fetchQrContextApi(
  params,
  { signal } = {}
) {
  return apiRequest(API.upstream.qrContext, {
    params: {
      domain: params.domain || getWebsiteDomain(),
      tableCode: params.tableCode,
      ...(params.sessionId ? { sessionId: params.sessionId } : {}),
    },
    signal,
  });
}

export async function fetchWebsiteByDomainApi(domain, { signal } = {}) {
  return apiRequest(API.upstream.websiteByDomain, {
    params: { domain },
    signal,
  });
}

export async function checkDeviceApi(
  { deviceId, companyId },
  { signal } = {}
) {
  return apiRequest(API.upstream.qrCheckDevice, {
    method: "POST",
    body: {
      deviceId,
      companyId,
    },
    signal,
  });
}