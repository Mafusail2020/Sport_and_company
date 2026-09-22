# Sport&Company

One-page marketing site for a youth sports-events community in Kyiv,
Ukraine — event formats, pricing, FAQ, gallery, partners, and a contact
form. No e-commerce, no accounts.

```
frontend/   React + Vite site, plus a password-gated /admin area — npm install && npm run dev
backend/    Express API: contact form + admin auth/pricing/photo routes — npm install && npm start
api/        One-line wrapper so Vercel finds backend/server.js as a Function
assets/     Read-only source assets (design reference, brand files, photos)
docs/       Asset inventory + design spec written from auditing assets/
vercel.json Frontend + backend deployed together as one Vercel project
CLAUDE.md   Full project context, constraints, and decisions log
```

See `CLAUDE.md` for the complete picture — stack choices, design tokens,
the admin area, deployment, and the running log of assumptions made where
the source design left something ambiguous.
