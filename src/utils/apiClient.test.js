import test from "node:test";
import assert from "node:assert/strict";
import { apiRequest } from "./apiClient.js";

test("forwards the requested cache mode to fetch", async () => {
  const originalFetch = globalThis.fetch;
  let requestOptions;
  globalThis.fetch = async (_url, options) => {
    requestOptions = options;
    return new Response("[]", {
      headers: { "content-type": "application/json" },
    });
  };

  try {
    await apiRequest("https://example.test/modules", { cache: "no-store" });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(requestOptions.cache, "no-store");
});
