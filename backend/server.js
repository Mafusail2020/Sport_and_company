const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { validateContactPayload } = require("./validate");
const contentRoutes = require("./routes/content");
const adminAuthRoutes = require("./routes/adminAuth");
const adminContentRoutes = require("./routes/adminContent");
const blobStore = require("./lib/blobStore");

const PORT = process.env.PORT || 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const LOG_FILE = path.join(__dirname, "submissions.log");
const IS_PRODUCTION = Boolean(process.env.VERCEL);

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

  // Stub backend: no real email is sent (see backend/README.md). Every
  // submission is logged so it can be reviewed manually — locally to a
  // gitignored file (easy to tail while developing), in production to Blob
  // (Vercel's production filesystem is read-only outside /tmp, so the local
  // file approach can't work there).
  const entry = {
    receivedAt: new Date().toISOString(),
    ...result.data,
  };

  if (IS_PRODUCTION) {
    try {
      await blobStore.appendJsonLine(blobStore.CONTACT_LOG_PATH, entry);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Failed to record submission to Blob:", err);
      return res.status(500).json({ error: "Could not record submission" });
    }
  }

  fs.appendFile(LOG_FILE, `${JSON.stringify(entry)}\n`, (err) => {
    if (err) {
      console.error("Failed to write submission log:", err);
      return res.status(500).json({ error: "Could not record submission" });
    }
    console.log("New contact submission:", entry);
    return res.status(200).json({ ok: true });
  });
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
