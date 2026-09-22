const crypto = require("node:crypto");

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2h

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

/** Builds a signed `${expiryMs}.${hmac}` session cookie value. */
function createSessionCookieValue() {
  const expiresAt = String(Date.now() + SESSION_TTL_MS);
  return `${expiresAt}.${sign(expiresAt)}`;
}

/** Verifies a cookie value's signature and expiry. Returns true/false. */
function verifySessionCookieValue(value) {
  if (typeof value !== "string") return false;

  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature) return false;
  if (!/^\d+$/.test(expiresAt)) return false;
  if (Date.now() > Number(expiresAt)) return false;

  const expectedSignature = sign(expiresAt);
  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  const actualBuffer = Buffer.from(signature, "hex");
  if (expectedBuffer.length !== actualBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

module.exports = { createSessionCookieValue, verifySessionCookieValue, COOKIE_NAME, SESSION_TTL_MS };
