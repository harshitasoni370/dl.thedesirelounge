import test from "node:test";
import assert from "node:assert/strict";
import { normalizeActiveStatus } from "./moduleStatus.js";

test("normalizes boolean module activity flags", () => {
  assert.equal(normalizeActiveStatus({ isActive: true }), "ACTIVE");
  assert.equal(normalizeActiveStatus({ isActive: false, status: "ACTIVE" }), "INACTIVE");
  assert.equal(normalizeActiveStatus({ bolIsActive: false }), "INACTIVE");
  assert.equal(normalizeActiveStatus({ active: "true" }), "ACTIVE");
});

test("normalizes boolean status values and defaults missing status to active", () => {
  assert.equal(normalizeActiveStatus({ status: true }), "ACTIVE");
  assert.equal(normalizeActiveStatus({ status: false }), "INACTIVE");
  assert.equal(normalizeActiveStatus({ status: "inactive" }), "INACTIVE");
  assert.equal(normalizeActiveStatus({}), "ACTIVE");
});
