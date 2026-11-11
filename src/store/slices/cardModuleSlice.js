import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCardModule as fetchCardModuleApi } from "../../utils/cardModuleApi";

function getCardContext(search, qrContext, overrides = {}) {
  const params = new URLSearchParams(search);
  const data = qrContext?.data || {};
  return {
    companyId: params.get("companyId") || params.get("cid") || data.companyId || "",
    branchId: params.get("branchId") || params.get("bid") || data.branchId || "",
    moduleId: overrides.moduleId || params.get("moduleId") || "",
    categoryId: overrides.categoryId || params.get("categoryId") || "",
    search: overrides.search || params.get("cardSearch") || "",
    status: overrides.status || "",
  };
}

function getRequestedModuleId(arg = {}) {
  const params = new URLSearchParams(arg.search || "");
  return arg.overrides?.moduleId || params.get("moduleId") || "";
}

const MODULE_CACHE_KEY = (c) =>
  `${c.companyId}__${c.branchId}__${c.moduleId}__${c.categoryId || "all"}__${c.search || ""}__${c.status || ""}`;

export const fetchCardModule = createAsyncThunk(
  "cardModule/fetch",
  async ({ search, qrContext, overrides }, { signal }) => {
    const context = getCardContext(search, qrContext, overrides || {});
    const items = await fetchCardModuleApi(context, { signal });
    return { key: MODULE_CACHE_KEY(context), moduleId: context.moduleId, items };
  },
  {
    condition: (arg, { getState }) => {
      const state = getState().cardModule;
      return state.status !== "loading" || state.moduleId !== getRequestedModuleId(arg);
    },
  },
);

const cardModuleSlice = createSlice({
  name: "cardModule",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    key: null,
    moduleId: null,
    requestId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardModule.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.moduleId = getRequestedModuleId(action.meta.arg);
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchCardModule.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.items = action.payload.items;
        state.key = action.payload.key;
        state.moduleId = action.payload.moduleId;
        state.status = "succeeded";
        state.requestId = null;
      })
      .addCase(fetchCardModule.rejected, (state, action) => {
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

export const selectCardModule = (state) => state.cardModule;
export default cardModuleSlice.reducer;
