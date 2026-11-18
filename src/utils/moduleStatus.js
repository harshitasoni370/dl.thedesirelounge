const ACTIVE_FLAG_FIELDS = ["isActive", "bolIsActive", "active"];

function toActiveStatus(value) {
  if (typeof value === "boolean") return value ? "ACTIVE" : "INACTIVE";
  if (value === 1) return "ACTIVE";
  if (value === 0) return "INACTIVE";

  const status = String(value ?? "").trim().toUpperCase();
  if (status === "TRUE") return "ACTIVE";
  if (status === "FALSE") return "INACTIVE";
  return status;
}

export function normalizeActiveStatus(record) {
  for (const field of ACTIVE_FLAG_FIELDS) {
    const value = record?.[field];
    if (value !== undefined && value !== null) {
      const status = toActiveStatus(value);
      if (status === "ACTIVE" || status === "INACTIVE") return status;
    }
  }

  return toActiveStatus(record?.status ?? record?.strStatus ?? record?.moduleStatus) || "ACTIVE";
}
