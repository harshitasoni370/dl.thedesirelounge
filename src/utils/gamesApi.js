import { apiRequest } from "./apiClient";
import { API } from "../config/urls";
import { getImageUrl } from "./imageUrl";

function unwrapGames(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["games", "items", "data", "result", "records"]) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = unwrapGames(value);
      if (nested.length) return nested;
    }
  }
  return [];
}

function asText(value, fallback = "") {
  if (Array.isArray(value)) return value.join(", ");
  return value === null || value === undefined ? fallback : String(value);
}

export function normalizeGames(payload) {
  return unwrapGames(payload).map((game, index) => {
    const name = asText(game.name || game.gameName || game.title, `Game ${index + 1}`);
    const categories = game.categories || game.category || game.genre || game.categoryName || [];
    const imagePath = game.image || game.imageUrl || game.imagePath || game.coverImage || "";
    return {
      ...game,
      id: asText(game.id || game.gameId || game.code, `game-${index + 1}`),
      name,
      players: asText(
        game.players || game.playerCount || game.noOfPlayers || (game.playersMin && `${game.playersMin} - ${game.playersMax}`),
        "Ask staff",
      ),
      duration: asText(
        game.duration || game.playTime || game.time || (game.durationMin && `${game.durationMin} - ${game.durationMax} min`),
        "Available on request",
      ),
      difficulty: asText(game.difficulty || game.level, "All levels"),
      status: game.isAvailable === false ? "in-use" : asText(game.status || game.availability, "available").toLowerCase(),
      categories: (Array.isArray(categories) ? categories : [categories])
        .filter(Boolean)
        .map((category) => asText(category).toLowerCase().replace(/\s+/g, "-")),
      cover: asText(game.cover || game.imageName || game.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), "default"),
      image: getImageUrl(imagePath),
      howToPlay: asText(game.howToPlay || game.description, "Ask a team member how to play."),
    };
  });
}

export async function fetchGames(type, context = {}, { signal } = {}) {
  const directUrl = type === "playstation" ? API.upstream.playstationGames : API.upstream.boardGames;

  let payload;
  try {
    payload = await apiRequest(directUrl, {
      params: { type, companyId: context.companyId, branchId: context.branchId },
      signal,
    });
  } catch (error) {
    const isBrowserContractFailure = error?.status === 415 || error instanceof TypeError;
    if (!isBrowserContractFailure) throw error;

    const fallbackPath = type === "playstation"
      ? "/assets/data/playstation.json"
      : "/assets/data/board-games.json";
    const fallbackResponse = await fetch(fallbackPath, { signal });
    if (!fallbackResponse.ok) throw error;
    payload = await fallbackResponse.json();
  }
  return normalizeGames(payload);
}

