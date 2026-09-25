const express = require("express");
const {
  readJson,
  PRICING_PATH,
  PHOTO_OVERRIDES_PATH,
  CONTACT_INFO_PATH,
  PARTNER_LOGOS_PATH,
} = require("../lib/blobStore");

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

router.get("/contact-info", async (req, res) => {
  try {
    const contactInfo = await readJson(CONTACT_INFO_PATH);
    res.json({ contactInfo: contactInfo || null });
  } catch (err) {
    console.error("GET /api/contact-info failed:", err);
    res.json({ contactInfo: null });
  }
});

router.get("/partners", async (req, res) => {
  try {
    const logos = await readJson(PARTNER_LOGOS_PATH);
    res.json({ logos: logos || [] });
  } catch (err) {
    console.error("GET /api/partners failed:", err);
    res.json({ logos: [] });
  }
});

module.exports = router;
