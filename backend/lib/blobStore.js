const { put, get, del } = require("@vercel/blob");

// Fixed pathnames for the two small JSON "control documents". Reads use
// get()'s built-in CDN-cache-aware read (cheap Simple Operations, not the
// pricier list()-based Advanced Operations), plus a short in-memory cache
// below so a burst of page loads on one warm instance doesn't round-trip to
// Blob every time. Individual uploaded photos don't need a fixed pathname —
// they're always looked up indirectly through PHOTO_OVERRIDES_PATH's stored
// URL, so they get a random suffix and never collide.
const PRICING_PATH = "data/pricing.json";
const PHOTO_OVERRIDES_PATH = "data/photo-overrides.json";
const CONTACT_LOG_PATH = "data/contact-submissions.json";
const CONTACT_INFO_PATH = "data/contact-info.json";

const READ_CACHE_TTL_MS = 60 * 1000;
const readCache = new Map(); // pathname -> { data, expiresAt }

/** Reads a JSON control document by its fixed pathname. Returns null if it has never been written. */
async function readJson(pathname) {
  const cached = readCache.get(pathname);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const result = await get(pathname, { access: "public" });
  const data = result ? JSON.parse(await new Response(result.stream).text()) : null;

  readCache.set(pathname, { data, expiresAt: Date.now() + READ_CACHE_TTL_MS });
  return data;
}

/** Overwrites a JSON control document at its fixed pathname. */
async function writeJson(pathname, data) {
  await put(pathname, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  readCache.set(pathname, { data, expiresAt: Date.now() + READ_CACHE_TTL_MS });
}

/** Appends one entry to a JSON-array control document (read-modify-write; fine at this submission volume). */
async function appendJsonLine(pathname, entry) {
  const current = (await readJson(pathname)) || [];
  const next = [...current, entry];
  await writeJson(pathname, next);
  return next;
}

const EXTENSION_BY_CONTENT_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Uploads a photo file for a given slot with a random-suffixed pathname (never overwritten in place). Returns its public URL. */
async function putPhoto(slotKey, buffer, contentType) {
  const extension = EXTENSION_BY_CONTENT_TYPE[contentType] || "jpg";
  const result = await put(`photos/${slotKey}.${extension}`, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType,
  });
  return result.url;
}

/** Best-effort delete by URL or pathname — never throws (e.g. the blob may already be gone). */
async function deleteBlob(urlOrPathname) {
  if (!urlOrPathname) return;
  try {
    await del(urlOrPathname);
  } catch (err) {
    console.error("blobStore: failed to delete blob (ignored)", urlOrPathname, err);
  }
}

module.exports = {
  PRICING_PATH,
  PHOTO_OVERRIDES_PATH,
  CONTACT_LOG_PATH,
  CONTACT_INFO_PATH,
  readJson,
  writeJson,
  appendJsonLine,
  putPhoto,
  deleteBlob,
};
