import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCardModule as fetchCardModuleApi, DEFAULT_CARD_CONTEXT } from "../../utils/cardModuleApi";

function getCardContext(search, qrContext, overrides = {}) {
  const params = new URLSearchParams(search);
  const data = qrContext?.data || {};
  return {
    companyId: params.get("companyId") || params.get("cid") || data.companyId || "",
    branchId: params.get("branchId") || params.get("bid") || data.branchId || "",
    moduleId: params.get("moduleId") || overrides.moduleId || DEFAULT_CARD_CONTEXT.moduleId,
    categoryId: overrides.categoryId || params.get("categoryId") || "",
    search: overrides.search || params.get("cardSearch") || "",
    status: overrides.status || "",
  };
}

const MODULE_CACHE_KEY = (c) =>
  `${c.companyId}__${c.branchId}__${c.moduleId}__${c.categoryId || "all"}__${c.search || ""}__${c.status || ""}`;

export const fetchCardModule = createAsyncThunk(
  "cardModule/fetch",
  async ({ search, qrContext, overrides }, { signal }) => {
    const context = getCardContext(search, qrContext, overrides || {});
    const items = await fetchCardModuleApi(context, { signal });
    return { key: MODULE_CACHE_KEY(context), items };
  },
  { condition: (arg, { getState }) => getState().cardModule.status !== "loading" },
);

const cardModuleSlice = createSlice({
  name: "cardModule",
  initialState: { items: [], status: "idle", error: null, key: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardModule.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCardModule.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.key = action.payload.key;
        state.status = "succeeded";
      })
      .addCase(fetchCardModule.rejected, (state, action) => {
        if (action.error.name === "AbortError") return;
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectCardModule = (state) => state.cardModule;
export default cardModuleSlice.reducer;
