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
error state on submit — everything else on the page works standalone.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — oxlint
