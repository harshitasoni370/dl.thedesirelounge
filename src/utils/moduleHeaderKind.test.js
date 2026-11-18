import test from "node:test";
import assert from "node:assert/strict";
import { isSocialHeader } from "./moduleHeaderKind.js";

test("recognizes social headers when their names or codes vary", () => {
  assert.equal(isSocialHeader({ headerCode: "STAY_CONNECTED", headerName: "Stay Connected" }), true);
  assert.equal(isSocialHeader({ headerCode: "SOCIAL_CONNECT", headerName: "Social Connect" }), true);
  assert.equal(isSocialHeader({ headerCode: "SOCIAL_CONNECTED", headerName: "Social Connected" }), true);
  assert.equal(isSocialHeader({ headerName: "Connect With Us" }), true);
});

test("does not classify unrelated headers as social", () => {
  assert.equal(isSocialHeader({ headerCode: "ORDER_ONLINE", headerName: "Order Online" }), false);
  assert.equal(isSocialHeader({ headerName: "Contact Us" }), false);
});
