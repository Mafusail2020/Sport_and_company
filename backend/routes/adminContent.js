const crypto = require("node:crypto");
const express = require("express");
const multer = require("multer");
const requireAdmin = require("../middleware/requireAdmin");
const { validatePricingPackages, validatePhotoSlotKey, validateContactInfo } = require("../adminValidate");
const {
  readJson,
  writeJson,
  deleteBlob,
  putPhoto,
  putPartnerLogo,
  PRICING_PATH,
  PHOTO_OVERRIDES_PATH,
  CONTACT_INFO_PATH,
  PARTNER_LOGOS_PATH,
} = require("../lib/blobStore");

const router = express.Router();
router.use(requireAdmin);

const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // Vercel Node functions hard-cap request bodies at 4.5MB
const MAX_PARTNER_LOGOS = 20;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PHOTO_BYTES },
});

router.put("/pricing", async (req, res) => {
  const result = validatePricingPackages(req.body);
  if (!result.ok) {
    return res.status(400).json({ error: "Invalid pricing payload", details: result.errors });
  }

  try {
    await writeJson(PRICING_PATH, result.data);
    return res.json({ ok: true, packages: result.data });
  } catch (err) {
    console.error("PUT /api/admin/pricing failed:", err);
    return res.status(500).json({ error: "Could not save pricing" });
  }
});

router.delete("/pricing", async (req, res) => {
  try {
    await writeJson(PRICING_PATH, null);
    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/pricing failed:", err);
    return res.status(500).json({ error: "Could not revert pricing" });
  }
});

router.post("/photos/:slotKey", upload.single("photo"), async (req, res) => {
  const { slotKey } = req.params;

  if (!validatePhotoSlotKey(slotKey)) {
    return res.status(400).json({ error: "Unknown photo slot" });
  }
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded (expected field \"photo\")" });
  }
  if (!ALLOWED_PHOTO_TYPES.has(req.file.mimetype)) {
    return res.status(400).json({ error: "Only JPEG, PNG, or WebP images are allowed" });
  }

  try {
    const overrides = (await readJson(PHOTO_OVERRIDES_PATH)) || {};
    const previousUrl = overrides[slotKey];

    const url = await putPhoto(slotKey, req.file.buffer, req.file.mimetype);
    overrides[slotKey] = url;
    await writeJson(PHOTO_OVERRIDES_PATH, overrides);

    if (previousUrl) await deleteBlob(previousUrl);

    return res.json({ ok: true, slotKey, url });
  } catch (err) {
    console.error(`POST /api/admin/photos/${slotKey} failed:`, err);
    return res.status(500).json({ error: "Could not save photo" });
  }
});

router.delete("/photos/:slotKey", async (req, res) => {
  const { slotKey } = req.params;

  if (!validatePhotoSlotKey(slotKey)) {
    return res.status(400).json({ error: "Unknown photo slot" });
  }

  try {
    const overrides = (await readJson(PHOTO_OVERRIDES_PATH)) || {};
    const previousUrl = overrides[slotKey];
    delete overrides[slotKey];
    await writeJson(PHOTO_OVERRIDES_PATH, overrides);

    if (previousUrl) await deleteBlob(previousUrl);

    return res.json({ ok: true, slotKey });
  } catch (err) {
    console.error(`DELETE /api/admin/photos/${slotKey} failed:`, err);
    return res.status(500).json({ error: "Could not revert photo" });
  }
});

router.put("/contact-info", async (req, res) => {
  const result = validateContactInfo(req.body);
  if (!result.ok) {
    return res.status(400).json({ error: "Invalid contact info", details: result.errors });
  }

  try {
    await writeJson(CONTACT_INFO_PATH, result.data);
    return res.json({ ok: true, contactInfo: result.data });
  } catch (err) {
    console.error("PUT /api/admin/contact-info failed:", err);
    return res.status(500).json({ error: "Could not save contact info" });
  }
});

router.delete("/contact-info", async (req, res) => {
  try {
    await writeJson(CONTACT_INFO_PATH, null);
    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/contact-info failed:", err);
    return res.status(500).json({ error: "Could not revert contact info" });
  }
});

router.post("/partners", upload.single("logo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded (expected field \"logo\")" });
  }
  if (!ALLOWED_PHOTO_TYPES.has(req.file.mimetype)) {
    return res.status(400).json({ error: "Only JPEG, PNG, or WebP images are allowed" });
  }

  try {
    const logos = (await readJson(PARTNER_LOGOS_PATH)) || [];
    if (logos.length >= MAX_PARTNER_LOGOS) {
      return res.status(400).json({ error: `At most ${MAX_PARTNER_LOGOS} partner logos are allowed` });
    }

    const url = await putPartnerLogo(req.file.buffer, req.file.mimetype);
    const logo = { id: crypto.randomUUID(), url };
    const next = [...logos, logo];
    await writeJson(PARTNER_LOGOS_PATH, next);

    return res.json({ ok: true, logo });
  } catch (err) {
    console.error("POST /api/admin/partners failed:", err);
    return res.status(500).json({ error: "Could not save partner logo" });
  }
});

router.delete("/partners/:logoId", async (req, res) => {
  const { logoId } = req.params;

  try {
    const logos = (await readJson(PARTNER_LOGOS_PATH)) || [];
    const removed = logos.find((logo) => logo.id === logoId);
    const next = logos.filter((logo) => logo.id !== logoId);
    await writeJson(PARTNER_LOGOS_PATH, next);

    if (removed) await deleteBlob(removed.url);

    return res.json({ ok: true });
  } catch (err) {
    console.error(`DELETE /api/admin/partners/${logoId} failed:`, err);
    return res.status(500).json({ error: "Could not remove partner logo" });
  }
});

// multer surfaces file-too-large etc. by calling next(err) — this must be a
// 4-arg error middleware, mounted after the routes above, to catch it.
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  return next(err);
});

module.exports = router;
