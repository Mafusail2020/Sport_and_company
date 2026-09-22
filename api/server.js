// Vercel only auto-detects Functions inside a root-level /api directory.
// The real Express app lives in backend/server.js (a separate npm project,
// per CLAUDE.md); this just re-exports it so Vercel can run it as one
// serverless function.
module.exports = require("../backend/server.js");
