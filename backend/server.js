const fs = require("node:fs/promises");
const path = require("node:path");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { validateContactPayload } = require("./validate");
const contentRoutes = require("./routes/content");
const adminAuthRoutes = require("./routes/adminAuth");
const adminContentRoutes = require("./routes/adminContent");
const blobStore = require("./lib/blobStore");
const { sendContactNotification } = require("./lib/mailer");

const PORT = process.env.PORT || 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const LOG_FILE = path.join(__dirname, "submissions.log");
const IS_PRODUCTION = Boolean(process.env.VERCEL);
// Mirrors frontend/src/content/content.js's `contact.email` default. Same
// intentional-duplication pattern as SUBJECT_OPTIONS in validate.js — the
// backend can't import the frontend's copy, so keep both in sync by hand.
const DEFAULT_CONTACT_EMAIL = "krutkev00@gmail.com";

const app = express();

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// 10kb was enough for contact-only; a pricing-array PUT body can approach it.
app.use(express.json({ limit: "50kb" }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Забагато запитів. Спробуйте пізніше." },
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  const result = validateContactPayload(req.body);

  if (!result.ok) {
    return res.status(400).json({ error: "Invalid submission", details: result.errors });
  }

  // Every submission is durably logged first — locally to a gitignored file
  // (easy to tail while developing), in production to Blob (Vercel's
  // production filesystem is read-only outside /tmp, so the local file
  // approach can't work there) — before any email is attempted, so a
  // mail-provider hiccup can never lose a submission.
  const entry = {
    receivedAt: new Date().toISOString(),
    ...result.data,
  };

  try {
    if (IS_PRODUCTION) {
      await blobStore.appendJsonLine(blobStore.CONTACT_LOG_PATH, entry);
    } else {
      await fs.appendFile(LOG_FILE, `${JSON.stringify(entry)}\n`);
      console.log("New contact submission:", entry);
    }
  } catch (err) {
    console.error("Failed to record submission:", err);
    return res.status(500).json({ error: "Could not record submission" });
  }

  const contactInfo = await blobStore.readJson(blobStore.CONTACT_INFO_PATH).catch(() => null);
  await sendContactNotification(entry, contactInfo?.email || DEFAULT_CONTACT_EMAIL);

  return res.status(200).json({ ok: true });
});

app.use("/api", contentRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminContentRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Sport&Company backend stub listening on http://localhost:${PORT}`);
    console.log(`Accepting requests from FRONTEND_ORIGIN=${FRONTEND_ORIGIN}`);
  });
}

module.exports = app;
