const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { validateContactPayload } = require("./validate");

const PORT = process.env.PORT || 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const LOG_FILE = path.join(__dirname, "submissions.log");

const app = express();

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["POST"],
  })
);
app.use(express.json({ limit: "10kb" }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Забагато запитів. Спробуйте пізніше." },
});

app.post("/api/contact", contactLimiter, (req, res) => {
  const result = validateContactPayload(req.body);

  if (!result.ok) {
    return res.status(400).json({ error: "Invalid submission", details: result.errors });
  }

  // Stub backend: no real email is sent (see backend/README.md). Every
  // submission is logged locally so it can be reviewed manually.
  const entry = {
    receivedAt: new Date().toISOString(),
    ...result.data,
  };

  fs.appendFile(LOG_FILE, `${JSON.stringify(entry)}\n`, (err) => {
    if (err) {
      console.error("Failed to write submission log:", err);
      return res.status(500).json({ error: "Could not record submission" });
    }
    console.log("New contact submission:", entry);
    return res.status(200).json({ ok: true });
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Sport&Company backend stub listening on http://localhost:${PORT}`);
  console.log(`Accepting requests from FRONTEND_ORIGIN=${FRONTEND_ORIGIN}`);
});
