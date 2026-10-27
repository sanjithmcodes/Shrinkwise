# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A MERN app forked from the 100Devs `binary-upload-boom` template (EJS → React). The domain has since moved from "posts" to **loss events** (shrinkage tracking: type, category, cost, quantity, date, optional image). Server and client are separate apps in one repo and run on separate ports.

## Commands

Dependencies are installed separately for each app: `npm install` at the root, then `cd client && npm install`.

- `npm start` (root): in dev, runs `nodemon` for the server (ignores `client/*`) and the CRA dev server on :3000 together via `concurrently`. In the output, `[0]` is the server and `[1]` is the client. If `NODE_ENV=production`, it runs only `node server.js`.
- `npm run client`: client only.
- `cd client && npm run build`: production build of the client.
- `cd client && npm test`: CRA/Jest (`react-scripts test`). Run a single test with `npm test -- <pattern>`. No tests exist yet, and the root `npm test` is a placeholder that always fails.
- No linter is configured beyond CRA's built-in ESLint warnings.

## Environment

The server loads env vars from `server/config/.env` (not the root): `PORT` (must not be 3000, and should be 8000 to match the client proxy), `DB_STRING`, `CLOUD_NAME`, `API_KEY`, `API_SECRET`.

## Architecture

**Client ↔ server wiring:** `client/package.json` sets `"proxy": "http://localhost:8000/"`, so the client calls the API with relative `fetch` paths (`/profile`, `/feed`, `/lossEvent/...`) and doesn't set any CORS/base URL config. When you add a route, the client path and the Express mount path have to match exactly. Client routes (`client/src/App.js`, react-router v6) share some paths with API routes (e.g. `/feed`, `/post/:id`; the Log a loss page is at `/logloss` but still loads its data from the `/profile` API). Requests from the React page reach the API through the proxy.

**Server (`server.js` + `server/`)**: MVC layout with Express.
- Routes are mounted at `/` (`routes/main.js`: auth, profile, feed), `/post` (`routes/posts.js`), and `/lossEvent` (`routes/lossEvents.js`).
- Controllers return JSON via `res.send(...)`. `controllers/posts.js` is the legacy controller, now backed by the `LossEvent` model, and still names its response keys `posts`/`post`. `controllers/lossEvents.js` is the newer controller and uses `lossEvents`/`lossEvent`. Check which keys the client page expects before changing either one.
- Auth: Passport local strategy (`config/passport.js`) with sessions stored in Mongo (`connect-mongo`). `middleware/auth.js` `ensureAuth` protects routes. `controllers/auth.js` still contains EJS-era `res.render`/`res.redirect` calls, but there is no view engine configured.
- Uploads: `middleware/multer.js` accepts only .jpg/.jpeg/.png and writes to temp disk storage. The controller then uploads the file to Cloudinary and saves `image` (the secure URL) and `cloudinaryId` on the document. Deleting a document should also destroy its Cloudinary asset.
- DELETE/PUT requests from the client go through `method-override` (`?_method=DELETE`).
- Loss events are private to their owner. Controller functions that are mounted on a route scope their queries by `req.user.id` (e.g. `findOne({ _id, user: req.user.id })`) and return 404 when nothing matches. Hiding UI in the client is not enough on its own.
- Mongoose 5 / MongoDB driver 3 (legacy connect options, `Model.remove`).

**Client (`client/`)**: Create React App + React 18, React-Bootstrap, react-icons. `pages/` holds route-level components and `components/` holds reusable pieces, each as `<Name>/index.js`. State is local `useState`/`useEffect` with no global store. Multipart uploads are sent as `FormData` with the file under the field name `file`, which must match `upload.single("file")`. Display labels for `type`/`category` values and the money/date formatting (`formatMoney`, `formatDate`, `lossTotal`) live in `src/lossFormat.js`. Use them instead of formatting inline.

## Design system

The client is branded **Shrinkwise** and has a warm, friendly look aimed at shop staff. All styling is in `client/src/styles.css`, and every custom class uses the `sw-` prefix. Bootstrap 5.3 is imported from npm in `src/index.js`. Don't add Bootstrap, Tailwind or Font Awesome back via CDN. Use `react-icons/fi` (Feather) for icons.

- **Theme:** light/dark follows the OS. An inline script in `public/index.html` sets `data-bs-theme` on `<html>`. Colors are `--sw-*` tokens defined for both themes at the top of `styles.css` and mapped onto Bootstrap's `--bs-*` variables. Use the tokens and never hard-code hex values in components. Each new color needs a light and a dark value.
- **Palette:** sage paper background, aubergine ink, pine (`--sw-pine`) for primary actions and links, marigold (`--sw-marigold`) only for loss amounts, raspberry for destructive actions. Type chips use `.sw-chip.is-<type>` (`waste`/`discrepancy`/`unaccounted`).
- **Type:** Gabarito (headings, numbers via `.sw-num` with tabular figures) and Atkinson Hyperlegible (body), loaded from Google Fonts.
- **Signature element:** loss amounts are price-gun stickers. Use `.sw-sticker` inline and `.sw-tag` (tag shape with a hole) for headline totals. Keep marigold reserved for money lost so it stays meaningful. The Overview total "stamps" in via `.is-stamped`, keyed by period. That is the only ambient animation, and it respects `prefers-reduced-motion`.
- **Shapes:** pill buttons (`border-radius: 999px`), 0.75rem inputs, 1.25rem panels (`.sw-panel`). Borders rather than drop shadows. Only the `.sw-tag` has an offset shadow.
- **Layout:** pages are `<main className="container sw-page">` with an `.sw-page-head` (h1 + controls). Use CSS grid with `minmax(0, 1fr)` columns that collapse to one column on small screens. The Feed shows a table at `md`+ and stacked `.sw-card`s below it. Check new views at 390px width.
- **Copy:** sentence case, no all-caps labels, plain verbs. Buttons say what happens ("Save loss", "Delete loss", "Log a loss"). Empty states tell the user what to do next. Errors use `.sw-alert` with `role="alert"`.
- **Accessibility:** icon-only buttons (`.sw-icon-btn`) need an `aria-label`, focus rings are visible (`:focus-visible`), and toggle groups use `aria-pressed`.