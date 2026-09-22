const { COOKIE_NAME, verifySessionCookieValue } = require("../lib/session");

/** Reads one cookie by name out of a raw Cookie header, without a cookie-parsing dependency. */
function readCookie(cookieHeader, name) {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const separatorIndex = part.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = part.slice(0, separatorIndex).trim();
    if (key === name) return decodeURIComponent(part.slice(separatorIndex + 1).trim());
  }
  return undefined;
}

function requireAdmin(req, res, next) {
  const token = readCookie(req.headers.cookie, COOKIE_NAME);
  if (!verifySessionCookieValue(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

module.exports = requireAdmin;
module.exports.readCookie = readCookie;
