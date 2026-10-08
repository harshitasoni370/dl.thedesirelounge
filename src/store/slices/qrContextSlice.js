import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { QR_CONTEXT_PARAMS, QR_CONTEXT_STORAGE_KEY } from "../../config/urls";
import {
  fetchQrContextApi,
  checkDeviceApi,
  getOrCreateDeviceId,
  getOrCreateDeviceIdSync,
} from "../../utils/qrApi";

function safeSessionSet(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / storage full — context memory me hi rahega */
  }
}

function readPersistedContext() {
  try {
    return JSON.parse(sessionStorage.getItem(QR_CONTEXT_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function publishContext(context) {
  safeSessionSet(QR_CONTEXT_STORAGE_KEY, context);
  window.qrContext = context;
}

function pickValue(source, keys) {
  if (!source || typeof source !== "object") return "";
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value);
    }
  }
  return "";
}

function flattenQrData(raw) {
  if (!raw || typeof raw !== "object") return raw;
  const nested = raw.data && typeof raw.data === "object" && !Array.isArray(raw.data) ? raw.data : null;
  return nested ? { ...raw, ...nested } : raw;
}

function generateTableSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `qr-session-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function getQrSessionStorageKey(data, params) {
  const identity = [
    readCompanyId(data, params),
    pickValue(data, ["branchId"]),
    pickValue(data, ["tableId"]),
    pickValue(params, ["branchId"]),
    pickValue(params, ["tableId"]),
  ]
    .filter(Boolean)
    .join(":");

  return identity ? `desire_qr_session:${identity}` : "desire_qr_session:default";
}

function ensureQrSessionId(data, params) {
  const dataCompanyId = pickValue(data, ["companyId", "companyID", "uidCompanyId", "CompanyId"]);
  const paramsCompanyId = pickValue(params, ["companyId", "companyID", "uidCompanyId", "cid"]);
  const dataBranchId = pickValue(data, ["branchId"]);
  const paramsBranchId = pickValue(params, ["branchId"]);
  const dataTableId = pickValue(data, ["tableId"]);
  const paramsTableId = pickValue(params, ["tableId"]);

  const matchesQrIdentity =
    (!dataCompanyId || !paramsCompanyId || dataCompanyId === paramsCompanyId) &&
    (!dataBranchId || !paramsBranchId || dataBranchId === paramsBranchId) &&
    (!dataTableId || !paramsTableId || dataTableId === paramsTableId);

  const existing =
    pickValue(params, ["tableSessionId", "sessionId", "tableSessionID", "sessionID"]) ||
    (matchesQrIdentity ? pickValue(data, ["tableSessionId", "sessionId", "tableSessionID", "sessionID"]) : "");

  if (existing) {
    params.sessionId = params.sessionId || existing;
    params.tableSessionId = params.tableSessionId || existing;
    if (data && typeof data === "object") {
      data.sessionId = data.sessionId || existing;
      data.tableSessionId = data.tableSessionId || existing;
    }
    return existing;
  }

  const storageKey = getQrSessionStorageKey(data, params);
  let nextSessionId = null;

  try {
    nextSessionId = sessionStorage.getItem(storageKey) || sessionStorage.getItem("desire_qr_session:default");
  } catch {
    // ignore storage restrictions
  }

  if (!nextSessionId) {
    nextSessionId = generateTableSessionId();
  }

  try {
    sessionStorage.setItem(storageKey, nextSessionId);
  } catch {
    // ignore storage restrictions
  }

  params.sessionId = params.sessionId || nextSessionId;
  params.tableSessionId = params.tableSessionId || nextSessionId;
  if (data && typeof data === "object") {
    data.sessionId = data.sessionId || nextSessionId;
    data.tableSessionId = data.tableSessionId || nextSessionId;
  }

  return nextSessionId;
}

function readCompanyId(data, params) {
  return (
    pickValue(data, ["companyId", "companyID", "uidCompanyId", "CompanyId"]) ||
    pickValue(params, ["companyId", "companyID", "uidCompanyId", "cid"])
  );
}

function expandShortParams(params) {
  const aliases = {
    cid: "companyId",
    bid: "branchId",
    tid: "tableId",
    sid: "sessionId",
    did: "deviceId",
  };
  const next = { ...params };
  Object.entries(aliases).forEach(([shortKey, longKey]) => {
    if (!next[longKey] && next[shortKey]) next[longKey] = next[shortKey];
  });
  return next;
}

export const fetchQrContext = createAsyncThunk(
  "qrContext/fetch",
  async (search, { signal, rejectWithValue, dispatch, getState }) => {
    const searchParams = new URLSearchParams(search);
    const params = expandShortParams(Object.fromEntries(searchParams.entries()));
    const hasQrContext = QR_CONTEXT_PARAMS.some((key) => key !== "deviceId" && params[key]);

    const deviceId = params.deviceId || (await getOrCreateDeviceId(search));
    if (!params.deviceId) params.deviceId = deviceId;

    dispatch(setDeviceId(deviceId));

    if (!hasQrContext) {
      const currentData = getState().qrContext.context?.data || null;
      return { params, data: currentData, fetchedAt: null, deviceId };
    }

    ensureQrSessionId(getState().qrContext.context?.data || {}, params);

    publishContext({ params, data: null, fetchedAt: null, deviceId });

    const directContextKeys = ["companyId", "branchId", "tableId", "sessionId"];
    if (directContextKeys.every((key) => params[key])) {
      const data = Object.fromEntries(
        [...directContextKeys, "companyName", "branchName", "tableName", "tableNumber", "tableNo"]
          .filter((key) => params[key])
          .map((key) => [key, params[key]]),
      );
      const resolvedContext = { params, data, fetchedAt: new Date().toISOString(), deviceId };
      publishContext(resolvedContext);
      window.dispatchEvent(new CustomEvent("qr-context-ready", { detail: resolvedContext }));

      const companyId = readCompanyId(data, params);
      if (companyId) {
        dispatch(checkDevice({ deviceId, companyId })).catch(() => {});
      }

      return resolvedContext;
    }

    try {
      const data = flattenQrData(await fetchQrContextApi(params, { signal }));

      const resolvedContext = { params, data, fetchedAt: new Date().toISOString(), deviceId };
      publishContext(resolvedContext);
      window.dispatchEvent(new CustomEvent("qr-context-ready", { detail: resolvedContext }));

      const companyId = readCompanyId(data, params);
      if (companyId) {
        dispatch(checkDevice({ deviceId, companyId })).catch(() => {});
      }

      return resolvedContext;
    } catch (error) {
      if (error.name === "AbortError") throw error;
      return rejectWithValue(error.message);
    }
  },
);

export const checkDevice = createAsyncThunk(
  "qrContext/checkDevice",
  async ({ deviceId, companyId }, { signal, rejectWithValue }) => {
    try {
      return await checkDeviceApi({ deviceId, companyId }, { signal });
    } catch (error) {
      if (error.name === "AbortError") throw error;
      return rejectWithValue(error.message);
    }
  },
);

const qrContextSlice = createSlice({
  name: "qrContext",
  initialState: {
    context: readPersistedContext(),
    status: "idle",
    error: null,
    deviceId: (() => {
      try {
        return getOrCreateDeviceIdSync();
      } catch {
        return null;
      }
    })(),
    device: {
      data: null,
      status: "idle",
      error: null,
    },
  },
  reducers: {
    setDeviceId(state, action) {
      state.deviceId = action.payload;
      if (state.context) {
        state.context.deviceId = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQrContext.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQrContext.fulfilled, (state, action) => {
        if (action.payload) state.context = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchQrContext.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(checkDevice.pending, (state) => {
        state.device.status = "loading";
        state.device.error = null;
      })
      .addCase(checkDevice.fulfilled, (state, action) => {
        state.device.data = action.payload;
        state.device.status = "succeeded";
      })
      .addCase(checkDevice.rejected, (state, action) => {
        state.device.status = "failed";
        state.device.error = action.payload || action.error.message;
      });
  },
});

function normalizeDob(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : s.split(" ")[0] || null;
}

function extractDevicePayload(state) {
  const device = state.qrContext?.device;
  const raw = device?.data;
  if (!raw || typeof raw !== "object") return null;
  const inner = raw.data && typeof raw.data === "object" ? raw.data : raw;
  if (!inner || typeof inner !== "object") return null;
  return {
    ...inner,
    isReturning: Boolean(inner.isReturning ?? inner.IsReturning),
    customerId: inner.customerId || inner.CustomerId || null,
    firstName: inner.firstName || inner.FirstName || "",
    lastName: inner.lastName || inner.LastName || "",
    countryCode: inner.countryCode || inner.CountryCode || null,
    mobile: inner.mobile || inner.Mobile || null,
    dob: inner.dob || inner.Dob || inner.dateOfBirth || inner.DateOfBirth || null,
  };
}

export const { setDeviceId } = qrContextSlice.actions;
export const selectQrContext = (state) => state.qrContext.context;
export const selectQrContextStatus = (state) => state.qrContext.status;
export const selectQrContextError = (state) => state.qrContext.error;
export const selectDeviceId = (state) => state.qrContext.deviceId;
export const selectCheckDevice = (state) => state.qrContext.device;
export const selectIsReturningCustomer = (state) => {
  const payload = extractDevicePayload(state);
  return Boolean(payload?.isReturning);
};
export const selectReturningCustomer = (state) => {
  const payload = extractDevicePayload(state);
  if (!payload || !payload.isReturning) return null;
  const firstName = payload.firstName || "";
  const lastName = payload.lastName || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return {
    customerId: payload.customerId || null,
    firstName,
    lastName,
    guestName: fullName || null,
    countryCode: payload.countryCode || null,
    mobile: payload.mobile || null,
    dateOfBirth: normalizeDob(payload.dob),
  };
};
export default qrContextSlice.reducer;
