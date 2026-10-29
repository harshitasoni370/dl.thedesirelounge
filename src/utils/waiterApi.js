import { API } from "../config/urls";
import { apiRequest } from "./apiClient";

const REQUEST_TYPE_HINTS = {
  "ready to order": "Food, drinks or shisha",
  "water / refill": "Drinks or ice",
  "shisha assistance": "Coals, flavour or setup",
  "request the bill": "Ready to pay",
  "clean table / ashtray": "Tidying up",
  "need assistance": "General help",
  other: "Tell us below",
};

function unwrapRequestTypes(payload) {
  const layers = [];
  let current = payload;

  while (current && typeof current === "object" && !layers.includes(current)) {
    layers.push(current);
    current = current.data || current.Data;
  }

  for (const layer of layers) {
    if (Array.isArray(layer)) return layer;
    for (const key of ["items", "requestTypes", "types", "result", "records"]) {
      if (Array.isArray(layer[key])) return layer[key];
    }
  }

  return [];
}

function getApiMessage(payload) {
  const message = payload?.message || payload?.Message || payload?.error || payload?.Error;
  return typeof message === "string" ? message : "";
}

export async function fetchWaiterTypes({ companyId, branchId, signal }) {
  const payload = await apiRequest(API.waiter.types, {
    params: { companyId, branchId },
    signal,
  });

  if (payload?.success === false || payload?.Success === false) {
    throw new Error(getApiMessage(payload) || "Unable to load waiter request types.");
  }

  return unwrapRequestTypes(payload)
    .map((item) => {
      const name = String(item.requestType || item.RequestType || item.name || item.Name || "");
      return {
        id: String(item.requestTypeId || item.RequestTypeId || item.id || item.Id || ""),
        name,
        description:
          String(item.description || item.Description || "") ||
          REQUEST_TYPE_HINTS[name.trim().toLowerCase()] ||
          "",
        displayOrder: Number(item.displayOrder ?? item.DisplayOrder ?? 0),
      };
    })
    .filter((item) => item.id && item.name)
    .sort((left, right) => left.displayOrder - right.displayOrder);
}

function unwrapTables(payload) {
  const queue = [payload];
  const visited = new Set();
  const arrayKeys = ["data", "Data", "result", "Result", "tables", "Tables", "table", "Table", "items", "Items", "list", "List"];

  while (queue.length) {
    const current = queue.shift();
    if (Array.isArray(current)) return current;
    if (!current || typeof current !== "object" || visited.has(current)) continue;
    visited.add(current);

    for (const key of arrayKeys) {
      if (Array.isArray(current[key])) return current[key];
    }
    for (const key of arrayKeys) {
      if (current[key] && typeof current[key] === "object") queue.push(current[key]);
    }
  }

  return [];
}

export async function fetchTables({ branchId, signal }) {
  const payload = await apiRequest(API.waiter.tables, {
    params: { branchId },
    signal,
  });

  if (payload?.success === false || payload?.Success === false) {
    throw new Error(getApiMessage(payload) || "Unable to load tables.");
  }

  return unwrapTables(payload)
    .map((record) => {
      if (!record || typeof record !== "object") return null;
      const id = String(
        record.tableId ||
        record.TableId ||
        record.uidTableId ||
        record.UidTableId ||
        record.UIDTableId ||
        record.id ||
        record.Id ||
        "",
      );
      const code = String(
        record.tableCode ||
        record.TableCode ||
        record.tableNo ||
        record.TableNo ||
        record.tableNumber ||
        record.TableNumber ||
        "",
      );
      const name = String(
        record.tableName ||
        record.TableName ||
        record.strTableName ||
        record.StrTableName ||
        (code ? `Table ${code}` : ""),
      );
      return { id, code, name };
    })
    .filter((table) => table && table.id && table.name);
}

export async function createWaiterRequest(body, { signal } = {}) {
  const payload = await apiRequest(API.waiter.create, {
    method: "POST",
    body,
    signal,
  });

  if (payload?.success === false || payload?.Success === false) {
    throw new Error(getApiMessage(payload) || "Unable to call the waiter. Please try again.");
  }

  return payload;
}
