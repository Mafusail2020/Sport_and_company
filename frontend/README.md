# Sport&Company — frontend

React + Vite one-pager. Plain CSS (custom properties + CSS Modules), no UI
framework, no state-management library. See `../CLAUDE.md` for the full
project context and `../docs/` for the design spec and asset inventory.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
```

The dev server proxies `/api/*` to `http://localhost:3001` (see
`vite.config.js`), so run `../backend` alongside this for the contact form
to work end-to-end. Without the backend running, the form will show its
error state on submit — everything else on the page works standalone,
including pricing and photos, which fall back to their shipped static
content whenever `/api/pricing` or `/api/photos` can't be reached.

## Admin area

Visit `/admin` for a password-gated editor (pricing packages, photo slots).
There's no router — `main.jsx` picks `App.jsx` or `AdminApp.jsx` based on
`window.location.pathname`, so the admin bundle never ships to public
visitors. Needs `../backend` running with `ADMIN_PASSWORD` and
`ADMIN_SESSION_SECRET` set (see `../backend/.env.example`) to log in, and a
real `BLOB_READ_WRITE_TOKEN` for saves/uploads to actually persist — see
`../CLAUDE.md`'s "Deploying" section for how to get one.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — oxlint
