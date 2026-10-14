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

export const fetchPackageModuleItems = createAsyncThunk(
  "packageModule/fetch",
  async ({ search, qrContext, overrides }, { signal }) => {
    const context = getPackageContext(search, qrContext, overrides || {});
    const items = await fetchPackageModuleItemsApi(context, { signal });
    return { moduleId: context.moduleId, items };
  },
  { condition: (_arg, { getState }) => getState().packageModule.status !== "loading" },
);

const packageModuleSlice = createSlice({
  name: "packageModule",
  initialState: { items: [], status: "idle", error: null, moduleId: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackageModuleItems.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPackageModuleItems.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.moduleId = action.payload.moduleId;
        state.status = "succeeded";
      })
      .addCase(fetchPackageModuleItems.rejected, (state, action) => {
        if (action.error.name === "AbortError") return;
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectPackageModule = (state) => state.packageModule;
export default packageModuleSlice.reducer;
