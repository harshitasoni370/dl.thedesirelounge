import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchHeaderModules as fetchHeaderModulesApi } from "../../utils/modulesApi";

function getHeaderModulesContext(search, qrContext) {
  const params = new URLSearchParams(search);
  const data = qrContext?.data || {};
  return {
    companyId: params.get("companyId") || params.get("cid") || data.companyId || "",
    branchId: params.get("branchId") || params.get("bid") || data.branchId || "",
  };
}

export const fetchHeaderModules = createAsyncThunk(
  "headerModules/fetch",
  async ({ search, qrContext }, { signal }) => {
    const context = getHeaderModulesContext(search, qrContext);
    return fetchHeaderModulesApi(context, { signal });
  },
  { condition: (_arg, { getState }) => getState().headerModules.status !== "loading" },
);

const headerModulesSlice = createSlice({
  name: "headerModules",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeaderModules.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHeaderModules.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchHeaderModules.rejected, (state, action) => {
        if (action.error.name === "AbortError") return;
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectHeaderModules = (state) => state.headerModules;
export default headerModulesSlice.reducer;
