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

**Client ↔ server wiring:** `client/package.json` sets `"proxy": "http://localhost:8000/"`, so the client calls the API with relative `fetch` paths (`/profile`, `/feed`, `/lossEvent/...`) and doesn't set any CORS/base URL config. When you add a route, the client path and the Express mount path have to match exactly. Client routes (`client/src/App.js`, react-router v6) share some paths with API routes (e.g. `/profile`, `/feed`, `/post/:id`). Requests from the React page reach the API through the proxy.

**Server (`server.js` + `server/`)**: MVC layout with Express.
- Routes are mounted at `/` (`routes/main.js`: auth, profile, feed), `/post` (`routes/posts.js`), and `/lossEvent` (`routes/lossEvents.js`).
- Controllers return JSON via `res.send(...)`. `controllers/posts.js` is the legacy controller, now backed by the `LossEvent` model, and still names its response keys `posts`/`post`. `controllers/lossEvents.js` is the newer controller and uses `lossEvents`/`lossEvent`. Check which keys the client page expects before changing either one.
- Auth: Passport local strategy (`config/passport.js`) with sessions stored in Mongo (`connect-mongo`). `middleware/auth.js` `ensureAuth` protects routes. `controllers/auth.js` still contains EJS-era `res.render`/`res.redirect` calls, but there is no view engine configured.
- Uploads: `middleware/multer.js` accepts only .jpg/.jpeg/.png and writes to temp disk storage. The controller then uploads the file to Cloudinary and saves `image` (the secure URL) and `cloudinaryId` on the document. Deleting a document should also destroy its Cloudinary asset.
- DELETE/PUT requests from the client go through `method-override` (`?_method=DELETE`).
- Loss events are private to their owner. Controller functions that are mounted on a route scope their queries by `req.user.id` (e.g. `findOne({ _id, user: req.user.id })`) and return 404 when nothing matches. Hiding UI in the client is not enough on its own.
- Mongoose 5 / MongoDB driver 3 (legacy connect options, `Model.remove`).

**Client (`client/`)**: Create React App + React 18, React-Bootstrap, react-icons. `pages/` holds route-level components and `components/` holds reusable pieces, each as `<Name>/index.js`. State is local `useState`/`useEffect` with no global store. Multipart uploads are sent as `FormData` with the file under the field name `file`, which must match `upload.single("file")`.