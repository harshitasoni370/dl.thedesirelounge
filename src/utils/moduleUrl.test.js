import test from "node:test";
import assert from "node:assert/strict";
import { getModuleUrl, normalizeModuleUrl } from "./moduleUrl.js";

test("reads external-link fields used by header module APIs", () => {
  assert.equal(getModuleUrl({ externalLink: "https://new-order.example" }), "https://new-order.example");
  assert.equal(getModuleUrl({ strExternalLink: "https://new-order.example" }), "https://new-order.example");
  assert.equal(getModuleUrl({ ExternalLink: "https://new-order.example" }), "https://new-order.example");
});

test("prefers explicit external links and ignores empty aliases", () => {
  assert.equal(
    getModuleUrl({ url: "https://old-order.example", externalLink: "https://new-order.example" }),
    "https://new-order.example",
  );
  assert.equal(getModuleUrl({ url: "", strExternalLink: "https://new-order.example" }), "https://new-order.example");
});

test("returns an empty link when no supported URL field is present", () => {
  assert.equal(getModuleUrl({ moduleName: "Talabat" }), "");
});

test("normalizes bare domains and keeps root-relative links", () => {
  assert.equal(normalizeModuleUrl("app.thedesirelounge.com"), "https://app.thedesirelounge.com/");
  assert.equal(normalizeModuleUrl("/categories"), "/categories");
});

test("rejects malformed or unsafe module URLs", () => {
  assert.throws(() => normalizeModuleUrl("a"), /invalid URL/i);
  assert.throws(() => normalizeModuleUrl("https"), /invalid URL/i);
  assert.throws(() => normalizeModuleUrl("javascript:alert(1)"), /HTTP\(S\)/i);
});
