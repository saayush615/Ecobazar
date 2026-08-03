# AGENTS.md

Full-stack MERN e-commerce. Two independent npm packages: `backend/` (Express 5 + Mongoose) and `frontend/` (React 19 + Vite). No root `package.json`; **no tests** in either package.

## Commands
- Backend: `cd backend && npm run dev` (nodemon; `npm start` runs plain node). No lint/build/test scripts.
- Frontend: `cd frontend && npm run dev`, `npm run lint` (eslint), `npm run build` (→ `dist/`).
- Setup: each package needs its own `.env` (both gitignored). Backend needs `MONGODB_URI`, `secret`, OAuth/Razorpay/Cloudinary keys; frontend needs only `VITE_API_URL`.

## Backend
- ESM (`"type": "module"`): relative imports MUST include `.js` (e.g. `'./config/database.js'`) — missing extensions throw at runtime.
- JWT secret env var is literally lowercase `secret` (`services/auth.js`), not `SECRET`.
- Auth: JWT in httpOnly cookie `uid`. Global `checkAuthentication` sets `req.user` (or leaves `null`). Role guards `buyerOnly`/`sellerOnly` are mounted per-router in `index.js` (`/cart`, `/fav`, `/order` buyer-only; `/seller` seller-only).
- Errors: use `next(error)` with `AppError` + `utils/ErrorFactory.js` helpers (`createNotFoundError`, `createValidationError`, ...). Global handler registered last in `index.js`.
- Zod: schemas in `backend/schema/*.schema.js`, applied via `validateBody(schema)` in routes (parsed data replaces `req.body`).
- Uploads: Multer saves to `uploads/products/` (disk) then the seller controller pushes to Cloudinary; DB stores the URL/path. Frontend must send `multipart/form-data`, field name `image` (matches `upload.single('image')`).
- Mongoose: optional-unique fields need `sparse: true`; password has `select: false` so login must `.select('+password')`; never use arrow functions in schema validators (`this` = document).
- CORS origins are hardcoded in `index.js` — add any new frontend origin there.
- Express 5: `app.use('*')` is invalid.

## Frontend
- JSX only (no TS). `@/*` aliases `src/*`. shadcn/ui in JSX mode, components in `src/components/ui/` (some use barrel `index.js` re-exports).
- Tailwind v4 is CSS-first — no `tailwind.config.js`; theme tokens live in `src/index.css` (`@theme`). Dark mode toggles a `.dark` class on `<html>` via `contexts/ThemeContext.jsx` — always add `dark:` variants.
- **TanStack Query migration in progress** (branch `feature/tanstack-query-migration`). Use hooks `useAuth`/`useCart`/`useWishlist` (query keys `['user']`, `['cart']`, `['wishlist']`) and `src/lib/api/*` wrappers on the shared axios instance (`withCredentials`). Legacy Redux slices in `src/store/slices/` are being phased out — don't add new logic there.
- Dashboard route is `/dashbord` → `pages/Dashbord.jsx` (misspelled).
- OAuth login (Google/Facebook) is a full-page redirect to `VITE_API_URL/oauth/...`, not an AJAX call.

## Git / CI
- Conventional commits (`feat:`, `fix:`, `refactor:`) with `feature/*`, `fix/*`, `refactor/*` branch names. CI deploys on push to `main` only.
- GitHub Actions: backend → Azure App Service (path-filtered `backend/**`); frontend → Azure Static Web Apps (path-filtered `frontend/**`, also runs on PRs). `.env` is generated from repo secrets in CI. Note: the backend workflow health-checks `/health`, which the server doesn't define — a "Health check failed" warning in deploy is expected.

## Docs
- `backend/Notes.md` and `frontend/Notes.md` contain useful gotchas (Mongoose, OAuth flow, Express 5, uploads). README's project-structure section is stale (e.g. `AppError.js` is in `utils/`, not `middlewares/`; missing `schema/`, `store/`, `lib/api/`).
