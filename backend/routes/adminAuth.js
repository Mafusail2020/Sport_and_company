const crypto = require("node:crypto");
const express = require("express");
const rateLimit = require("express-rate-limit");
const { COOKIE_NAME, SESSION_TTL_MS, createSessionCookieValue } = require("../lib/session");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Забагато спроб входу. Спробуйте пізніше." },
});

const cookieOptions = {
  httpOnly: true,
  secure: Boolean(process.env.VERCEL),
  sameSite: "strict",
  path: "/",
  maxAge: SESSION_TTL_MS,
};

/** Constant-time password comparison, tolerant of length mismatches. */
function passwordsMatch(candidate, expected) {
  if (typeof candidate !== "string" || !expected) return false;
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  if (candidateBuffer.length !== expectedBuffer.length) {
    // Still run a comparison of equal-length buffers so failure timing
    // doesn't leak the real password's length either.
    crypto.timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }
  return crypto.timingSafeEqual(candidateBuffer, expectedBuffer);
}

router.post("/login", loginLimiter, (req, res) => {
  const password = req.body && req.body.password;

  if (!passwordsMatch(password, process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Невірний пароль" });
  }

  res.cookie(COOKIE_NAME, createSessionCookieValue(), cookieOptions);
  return res.json({ ok: true });
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

router.get("/session", requireAdmin, (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
