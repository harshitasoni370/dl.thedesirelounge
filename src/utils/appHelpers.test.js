import test from "node:test";
import assert from "node:assert/strict";
import { appendQrOriginParams, isQrEntry } from "./qrEntry.js";

test("recognizes compact table context returned from reservation checkout", () => {
  assert.equal(isQrEntry("?cid=company&bid=branch&tid=table&sid=session"), true);
  assert.equal(isQrEntry("?cid=company&bid=branch&tn=Table%201"), true);
});

test("does not treat venue-only context as a QR table entry", () => {
  assert.equal(isQrEntry("?cid=company&bid=branch"), false);
});

test("keeps QR source markers when building a reservation handoff", () => {
  const params = new URLSearchParams("cid=company&bid=branch&tid=table");
  appendQrOriginParams("?type=TABLE&location=Dubai&tableCode=T1", params);

  assert.equal(params.get("type"), "TABLE");
  assert.equal(params.get("location"), "Dubai");
  assert.equal(params.get("tableCode"), "T1");
});

test("does not copy arbitrary parameters as QR source markers", () => {
  const params = new URLSearchParams();
  appendQrOriginParams("?cid=company&bid=branch", params);

  assert.equal(params.size, 0);
});
