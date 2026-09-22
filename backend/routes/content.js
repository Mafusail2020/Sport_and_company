const express = require("express");
const { readJson, PRICING_PATH, PHOTO_OVERRIDES_PATH } = require("../lib/blobStore");

const router = express.Router();

// Public, unauthenticated: the site fetches these on every page load. Both
// fail open to "no override" (null / {}) on read errors, since the public
// page always falls back to its shipped static content in that case — this
// route existing at all should never be able to break the page.
router.get("/pricing", async (req, res) => {
  try {
    const packages = await readJson(PRICING_PATH);
    res.json({ packages: packages || null });
  } catch (err) {
    console.error("GET /api/pricing failed:", err);
    res.json({ packages: null });
  }
});

router.get("/photos", async (req, res) => {
  try {
    const overrides = await readJson(PHOTO_OVERRIDES_PATH);
    res.json({ overrides: overrides || {} });
  } catch (err) {
    console.error("GET /api/photos failed:", err);
    res.json({ overrides: {} });
  }
});

module.exports = router;
