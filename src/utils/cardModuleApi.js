import { apiRequest } from "./apiClient";
import { API } from "../config/urls";

function unwrapCards(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["cards", "cardItems", "items", "data", "result", "records"]) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = unwrapCards(value);
      if (nested.length) return nested;
    }
  }
  return [];
}

function asText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function asList(value) {
  if (Array.isArray(value)) return value.map((v) => asText(v)).filter(Boolean);
  const text = asText(value);
  if (!text) return [];
  if (/[,;\n•-]/.test(text)) return text.split(/[,;\n•-]+/).map((s) => s.trim()).filter(Boolean);
  return [text];
}

function isCardActive(card) {
  if (card.bolIsActive === false || card.isActive === false) return false;
  const status = (card.strAvailabilityStatus || card.status || "").toString().toUpperCase();
  if (status && status !== "AVAILABLE" && status !== "ACTIVE" && status !== "IN_USE") return false;
  return true;
}

function formatPlayers(min, max) {
  const hasMin = typeof min === "number" && isFinite(min);
  const hasMax = typeof max === "number" && isFinite(max);
  if (hasMin && hasMax) {
    return min === max ? `${min} Player${min === 1 ? "" : "s"}` : `${min}-${max} Players`;
  }
  if (hasMin) return `${min}+ Players`;
  if (hasMax) return `1-${max} Players`;
  return "1-4 Players";
}

function formatDuration(min, max) {
  const hasMin = typeof min === "number" && isFinite(min);
  const hasMax = typeof max === "number" && isFinite(max);
  if (hasMin && hasMax) {
    return min === max ? `${min} min` : `${min}-${max} min`;
  }
  if (hasMin) return `From ${min} min`;
  if (hasMax) return `Up to ${max} min`;
  return "60 min";
}

export function normalizeCardModule(payload) {
  return unwrapCards(payload)
    .filter((card) => isCardActive(card))
    .map((card, index) => {
      const playersText = formatPlayers(card.intPlayersMin, card.intPlayersMax);
      const durationText =
        asText(card.strDuration) ||
        asText(card.duration) ||
        formatDuration(card.intDurationMin, card.intDurationMax);
      const difficulty =
        asText(card.strDifficulty) || asText(card.difficulty) || "Casual";
      const status = (card.strAvailabilityStatus || card.status || "ACTIVE").toString().toUpperCase();
      return {
        uidCardId: asText(
          card.uidCardItemId || card.uidCardId || card.cardId || card.id,
          `card-${index + 1}`,
        ),
        uidCategoryId: asText(card.uidCategoryId || card.categoryId),
        categoryName: asText(card.categoryName || card.category),
        name: asText(card.name || card.cardName || card.title, `Card ${index + 1}`),
        code: asText(card.code || card.cardCode),
        subtitle: asText(card.strTiming || card.subtitle || card.tagline),
        description: asText(card.strDescription || card.description || card.longDescription),
        playersMin: card.intPlayersMin,
        playersMax: card.intPlayersMax,
        durationMin: card.intDurationMin,
        durationMax: card.intDurationMax,
        difficulty,
        priceLabel: asText(card.strPriceLabel || card.priceLabel || card.displayPrice) || durationText,
        price:
          card.decPrice ??
          card.price ??
          card.amount ??
          card.priceValue ??
          (typeof card.decPrice === "number" ? card.decPrice : null),
        currency: asText(card.currency, "AED"),
        imageUrl: asText(card.strImagePath || card.imageUrl || card.image || card.thumbnail || card.icon).replace(
          /^Image\//,
         `${ import.meta.env.VITE_IMAGE_BASE_URL}/Image/`,
        ),
        status,
        statusOriginal: status,
        isAvailable: status === "AVAILABLE" || status === "ACTIVE",
        isInUse: status === "IN_USE",
        order:
          typeof card.intDisplayOrder === "number"
            ? card.intDisplayOrder
            : typeof card.order === "number"
            ? card.order
            : typeof card.sortOrder === "number"
            ? card.sortOrder
            : index,
        features: [playersText, durationText, difficulty],
      };
    })
    .sort((a, b) => a.order - b.order);
}

export async function fetchCardModule(context = {}, { signal } = {}) {
  if (!context.moduleId) {
    throw new Error("Card module ID is required.");
  }

  const params = {
    companyId: context.companyId,
    branchId: context.branchId,
    moduleId: context.moduleId,
    categoryId: context.categoryId || "",
    search: context.search || "",
    status: context.status || "",
  };

  const payload = await apiRequest(API.upstream.cardModule, {
    params,
    signal,
    includeEmptyParams: ["categoryId", "search", "status"],
  });
  return normalizeCardModule(payload);
}
