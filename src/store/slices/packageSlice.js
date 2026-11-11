import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchPackageModuleItems as fetchPackageModuleItemsApi, DEFAULT_PACKAGE_CONTEXT } from "../../utils/packageApi";

function getPackageContext(search, qrContext, overrides = {}) {
  const params = new URLSearchParams(search);
  const data = qrContext?.data || {};
  return {
    companyId: params.get("companyId") || params.get("cid") || data.companyId || "",
    branchId: params.get("branchId") || params.get("bid") || data.branchId || "",
    moduleId:
      params.get("packageModuleId") ||
      params.get("moduleId") ||
      overrides.moduleId ||
      DEFAULT_PACKAGE_CONTEXT.moduleId,
  };
}

function getRequestedModuleId(arg = {}) {
  const params = new URLSearchParams(arg.search || "");
  return (
    params.get("packageModuleId") ||
    params.get("moduleId") ||
    arg.overrides?.moduleId ||
    DEFAULT_PACKAGE_CONTEXT.moduleId
  );
}

export const fetchPackageModuleItems = createAsyncThunk(
  "packageModule/fetch",
  async ({ search, qrContext, overrides }, { signal }) => {
    const context = getPackageContext(search, qrContext, overrides || {});
    const items = await fetchPackageModuleItemsApi(context, { signal });
    return { moduleId: context.moduleId, items };
  },
  {
    condition: (arg, { getState }) => {
      const state = getState().packageModule;
      return state.status !== "loading" || state.moduleId !== getRequestedModuleId(arg);
    },
  },
);

const packageModuleSlice = createSlice({
  name: "packageModule",
  initialState: { items: [], status: "idle", error: null, moduleId: null, requestId: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackageModuleItems.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.moduleId = getRequestedModuleId(action.meta.arg);
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchPackageModuleItems.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.items = action.payload.items;
        state.moduleId = action.payload.moduleId;
        state.status = "succeeded";
        state.requestId = null;
      })
      .addCase(fetchPackageModuleItems.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        if (action.error.name === "AbortError") {
          state.status = "idle";
          state.requestId = null;
          return;
        }
        state.status = "failed";
        state.error = action.error.message;
        state.requestId = null;
      });
  },
});

export const selectPackageModule = (state) => state.packageModule;
export default packageModuleSlice.reducer;
