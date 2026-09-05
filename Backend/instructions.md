# CrewUp Full-Stack Development Instructions

> **How to use this file:** Paste this entire file into your AI (e.g., Gemini) along with the **full codebase** of the project before asking it to write ANY code. This document is the single source of truth for:
> - **Backend conventions** (file structure, models, controllers, routes, middleware) — sections 2-11, and
> - **How the frontend connects to the backend** (fetch layer, endpoints, cookies, wiring a UI page to an API) — section 13.
>
> Your AI MUST follow every rule below so both its backend and its frontend output match the existing code exactly.

---

## 1. The AI's Job Contract (read this first)

You are a full-stack expert working on the **CrewUp** project (React + Vite frontend, Node.js + Express + Mongoose backend). You will be asked to build or modify a specific **page / feature / function**. Before writing ANY code, you MUST:

1. Read and follow the backend file-structure conventions in **section 2**.
2. Read and follow the frontend-to-backend connection conventions in **section 13**.
3. Read the existing code in the same feature area and match its style exactly (backend: sections 3-11, frontend: section 13).
4. Only touch the files that are relevant to the requested feature. Do NOT rewrite or refactor unrelated files.
5. Output code that matches the existing style **identically** (naming, quotes, semicolons, error handling, responses, imports, etc.).
6. If the feature needs a NEW resource: add a **model**, a **controller**, a **route**, and **register it in `index.js`**, then if a frontend page consumes it, wire it through the `fetchJSON` API helper (section 13) with the correct endpoint and cookie handling.
7. Do not invent a different architecture. Follow the existing patterns shown below.

---

## 2. Backend File Structure (MUST follow exactly)

```
Backend/
├── index.js                         # Entry point: express app, DB connect, route mounting
├── model/                           # Mongoose schemas + models (one file per collection)
│   ├── user.js
│   ├── event.js
│   └── organization.js
├── controller/                      # Business logic / route handlers (one file per resource)
│   ├── authController.js
│   ├── eventController.js
│   ├── organizationController.js
│   └── useController.js             # NOTE: legitimately misspelled "useController"
├── routes/                          # Express routers (one file per resource)
│   ├── auth.js
│   ├── events.js
│   ├── organizations.js
│   └── users.js
├── middlewares/                     # Express middleware
│   ├── checkToken.js                # JWT cookie verification
│   └── logger.js                    # request logger
├── utils/                           # Shared helpers
│   ├── helpers.js                   # bcrypt password utils
│   └── validationSchemas.js         # express-validator schemas
├── seed.js
├── .env / .env.example
└── package.json                     # "type": "module" -> ES module imports
```

**Rules:**
- Everything uses **ES Modules** (`import ... from ...`), because `package.json` has `"type": "module"`. NEVER use `require()`.
- Paths between folders always use the relative form: `../model/user.js`, `../utils/helpers.js`, `../middlewares/checkToken.js` (note the explicit `.js` extension).
- One **model** per file. One **controller** per resource. One **route** per resource.

---

## 3. Models (Mongoose)

- File lives in `model/<name>.js` (singular, lowercase).
- Import Schema/model: `import { Schema, model } from "mongoose";`
- Variable + model naming: `const <name>Schema = new Schema({...});` then `const <Name> = model("<Name>", <name>Schema);` then `export default <Name>;` (PascalCase for the exported model name).
- Field conventions:
  - Use **snake_case** for field names (e.g. `start_time`, `image_url`, `participant_count`).
  - Short field: `fieldName: Schema.Types.Type` (e.g. `displayName: Schema.Types.String`).
  - Field with options: an object `{ type: Schema.Types.String, required: true, unique: true }`.
  - DEFAULTS: `default: false`, `default: 0`, `default: "volunteer"`.
  - ENUMS: `enum: ["volunteer", "organization"]`.
  - REFERENCES (populate): `{ type: Schema.Types.ObjectId, ref: "Organization" }`.
  - Arrays: `[Schema.Types.String]` or `[{ initials: Schema.Types.String }]` or `[{ icon, title, desc }]`.
- No `timestamps: true` is used in current models. Match the existing setup unless the feature explicitly needs timestamps.

**Example model (`model/event.js`) — use this as the template style:**
```js
import { Schema, model } from "mongoose";

const eventSchema = new Schema({
  id: {
    type: Schema.Types.Number,
    required: true,
    unique: true,
  },
  title: {
    type: Schema.Types.String,
    required: true,
  },
  start_time: Schema.Types.Date,
  end_time: Schema.Types.Date,
  location: Schema.Types.String,
  is_remote: {
    type: Schema.Types.Boolean,
    default: false,
  },
  status: Schema.Types.String,
  category: Schema.Types.String,
  image_url: Schema.Types.String,
  participant_count: {
    type: Schema.Types.Number,
    default: 0,
  },
  requirements: [
    {
      icon: Schema.Types.String,
      title: Schema.Types.String,
      desc: Schema.Types.String,
    },
  ],
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
});

const Event = model("Event", eventSchema);
export default Event;
```

---

## 4. Controllers

- File lives in `controller/<resource>Controller.js` (e.g. `eventController.js`).
- Import the model at the top: `import Event from "../model/event.js";` Also import helpers/middleware as needed.
- Each handler is an **exported named async function**: `export const getEvents = async (req, res) => { ... }`.
- Every handler that touches the DB is wrapped in `try { ... } catch (err) { ... }`.
- `catch` block ALWAYS returns: `return res.status(400).json(err);`
- Success responses:
  - List / single fetch: `return res.status(200).json(data);`
  - Create: `return res.status(201).json({ message: "..." });`
  - Deletion: `return res.status(200).json({ message: "..." });`
- "Not found" pattern: `if (!x) { return res.status(404).json({ error: "X not found" }); }`
- Errors only ever carry `{ error: "message" }` or `{ message: "text" }`.

**Naming for each CRUD action (match these exact names):**
- List → `get<Resource>s` (e.g. `getEvents`, `getOrganizations`, `getAllUsers`)
- Get one → `get<Resource>ById` (e.g. `getEventById`, `getOrganizationById`)
- Create → `createUser` / `createEvent` ...
- Update → `updatedUser` (note existing code uses the misnomer `updatedUser`, not `updateUser`)
- Delete one → `deleteUser` / `deleteEvent`
- Delete many → `deleteAllUsers`

**Example (list + get-by-id), from `controller/organizationController.js`:**
```js
import Organization from "../model/organization.js";

export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().select("-__v");
    return res.status(200).json(organizations);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id).select("-__v");
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    return res.status(200).json(organization);
  } catch (err) {
    return res.status(400).json(err);
  }
};
```

**Common query patterns used in this codebase (reuse these):**
- `.find().select("-__v")` to strip Mongoose's internal `__v`.
- `.find().select(["-password", "-__v"])` to strip sensitive fields.
- `.findOne({ username }).select(["-__v"])`.
- `.findOneAndUpdate({ _id: id }, update, { new: true }).select("-__v")`.
- `.populate("organizer")` on referenced fields.
- `.sort({ start_time: 1 })`.
- Read params with `req.params.id`, query with `req.query`, body with `req.body`.
- Read auth cookie with `const { token } = req.cookies;` and `jwt.verify(token, process.env.JWT_SECRET)`.
- Passwords are hashed with `hashPassword(password)` from `../utils/helpers.js` before save.

---

## 5. Routes

- File lives in `routes/<resource>.js` (lowercase, NO "Controller" suffix).
- Pattern:
  ```js
  import express from "express";
  import { handler1, handler2 } from "../controller/<resource>Controller.js";
  import checkToken from "../middlewares/checkToken.js";   // only if protected

  const router = express.Router();

  router.get("/", handler1);

  router.post("/", checkToken, handler2);

  export default router;
  ```
- Routes are **protected** by putting `checkToken` as middleware between the path and the handler.
- `export default router;` at the end.

**Full example (`routes/users.js`):**
```js
import express from "express";
import checkToken from "../middlewares/checkToken.js";
import {
  getAllUsers,
  getProfile,
  createUser,
  deleteUser,
  deleteAllUsers,
  updatedUser,
} from "../controller/useController.js";

const router = express.Router();

router.get("/", checkToken, getAllUsers);

router.get("/profile", checkToken, getProfile);

router.post("/", createUser);

router.put("/:id", checkToken, updatedUser);

router.delete("/:id", checkToken, deleteUser);

router.delete("/", checkToken, deleteAllUsers);

export default router;
```

---

## 6. Mounting routes in `index.js`

When you add a new route file, you MUST register it in `Backend/index.js`:

```js
import <resource>Routes from "./routes/<resource>.js";
// ...after app.use(log);

app.use("/api/<resource>", <resource>Routes);
```

Note: the auth router import is named `authRouter` (not `authRoutes`) — keep that one as-is. The rest use `<name>Routes`.

**Current `index.js` structure (do not disturb):**
```js
import express from "express";
import userRoutes from "./routes/users.js";
import authRouter from "./routes/auth.js";
import organizationRoutes from "./routes/organizations.js";
import eventRoutes from "./routes/events.js";
import log from "./middlewares/logger.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to database");
  } catch (err) {
    console.log(`Error connecting to database ${err}`);
    process.exit(1);
  }
};

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.ALLOWED_ORIGIN }));
app.use(log);

app.get("/api", (req, res) => res.json({ message: "API is working" }));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRouter);
app.use("/api/organizations", organizationRoutes);
app.use("/api/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export default app;
```

---

## 7. Middleware

**`checkToken.js`** — the standard auth guard. Reuse it verbatim; add `checkToken` to any protected route:
```js
import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Invalid token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
    if (err) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      return res.status(401).json({ error: "Invalid token" });
    }
    next();
  });
};

export default checkToken;
```

If the feature needs a NEW middleware, put it in `middlewares/` as a default-exported function `(req, res, next) => { ... next(); }` in the same style.

---

## 8. Utils

- Shared logic goes in `utils/`.
- `helpers.js` — holds reusable functions as **named exports**:
  ```js
  import bcrypt from "bcrypt";
  const saltRounds = 10;
  export const hashPassword = async (password) => { ... };
  export const comparePassword = async (password, hashedPassword) => { ... };
  ```
- `validationSchemas.js` — uses `express-validator` (`import { body, validationResult } from "express-validator";`) and exports arrays of validators as **named exports**. Only add validators here if the feature explicitly needs input validation with `express-validator`; otherwise follow the existing manual validation style in controllers (checking `if (otherUser)` etc.).

---

## 9. Authentication / Sessions style

- Auth is **JWT stored in an httpOnly cookie** named `token`.
- Login (`authController.js`) signs a JWT with payload `{ id, username }`, secret `process.env.JWT_SECRET`, expiry `lifetime = "3600000"`, and sets cookie with options:
  ```js
  res.cookie("token", token, {
    maxAge: lifetime,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  ```
- Logout clears the cookie with the SAME options.
- Protected routes use the `checkToken` middleware which reads `req.cookies.token`.
- Never return the password: always strip it via `.select` or destructure `const { password: _, ...rest } = user.toObject();`.

---

## 10. Hard Style Rules (match these EXACTLY)

- **Semicolons:** ALWAYS used at end of statements.
- **Quotes:** Double quotes `"..."` everywhere (imports, strings, object keys optional). Templates use backticks where needed.
- **Imports:** `import x from "..."` and `import { a, b } from "..."`. Relative imports include the **`.js` extension** (`../model/user.js`).
- **Naming:** Controller files camelCase+Pascal (`authController.js`); model files lowercase (`user.js`); route files lowercase (`users.js`).
- **Indentation:** 2 spaces.
- **Ordering inside a file:** imports at top → constants → helper functions (non-exported) → exported handlers.
- **Response shape:** `{ error: "..." }` for failures, `{ message: "..." }` for success side-effects, raw data / arrays for fetches.
- **Don't** add comments unless the existing code in that exact spot has them. Keep comments minimal, matching existing style.
- **Don't** introduce TypeScript, new dependencies, or new libraries not already in `package.json`, unless the user explicitly asks.
- **Don't** change the existing `"useController.js"` filename or `updatedUser` function name — they are intentional (even if misspelled).

---

## 11. Important Gotchas / Known Quirks

1. **`useController.js` is intentionally misspelled** (it should be `userController.js`). Keep referencing it as `../controller/useController.js` in `routes/users.js`. Do NOT rename it.
2. **`updatedUser`** is the exported name of the update handler (not `updateUser`). Keep it.
3. The events route with `/profile`-style routes: for `users`, `router.get("/profile", ...)` is defined BEFORE `router.get("/:id", ...)` so it isn't shadowed. Use the same ordering when mixing fixed and `:id` paths.
4. `Event` uses a numeric `id` field (queried with `Number(req.params.id)`), while `User`/`Organization` use Mongo's automatic `_id` (queried with `req.params.id` / `findById`). Follow whichever convention the resource you're editing already uses.
5. `process.exit(1)` on DB connect failure in `index.js`.
6. Cookie options `{ httpOnly: true, secure: true, sameSite: "none", path: "/" }` are repeated in several places — reuse this exact block.

---

## 12. HOW THE FRONTEND CONNECTS TO THE BACKEND (React → API)

This is how existing React pages call the backend. If you build a frontend page/feature that needs data, you MUST follow this exact connection pattern.

### 12.1 The single API helper: `src/utils/api.js`

All read/fetch calls from pages go through ONE shared helper. Do not inline `fetch` for GET calls — reuse this:

```js
export default async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}
```

Import it at the top of the page: `import fetchJSON from '../../utils/api';` (adjust the relative path to your file's depth).

### 12.2 How the Vite proxy forwards `/api`

The frontend runs on a different port than the backend. `vite.config.js` proxies any URL starting with `/api` to the backend at `http://localhost:4000`:

```js
server: {
  proxy: {
    '/api': { target: 'http://localhost:4000', changeOrigin: true },
  },
},
```

**Consequence:** Frontend pages use **relative `/api/...` paths** (e.g. `/api/events`) for regular GET fetches — they do NOT hardcode `http://localhost:4000`. The backend `index.js` mounts routers under `/api/<resource>`, and the renderer mounts pages under `/events`, `/organizations`, etc.

### 12.3 Two styles of calling the API

There are **two** established patterns in this codebase. READ CAREFULLY and use the one that matches your feature:

**A) Relative-path GET via `fetchJSON` helper** — used for public, read-only data (events list, event details, organizations list).
```js
// Example: Events list (uses query params) — see src/pages/main/ExploreEvents.jsx
const params = new URLSearchParams();
if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
if (dateFilter !== 'Any Date') params.set('date', dateFilter);
if (city.trim()) params.set('city', city.trim());
if (search.trim()) params.set('q', search.trim());
const query = params.toString();

fetchJSON(`/api/events${query ? `?${query}` : ''}`)
  .then((data) => { setEvents(data); setLoading(false); })
  .catch((err) => { setError(err.message); setLoading(false); });
```

**B) Direct `fetch` with full URL + `credentials: 'include'`** — used for **mutations and anything auth-related** (login, register). These use `http://localhost:4000/api/...` and the JSON `Content-Type` header.
```js
// Example: Login — see src/pages/auth/VolunteerLogin.jsx
const response = await fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',          // REQUIRED so the auth cookie is sent/saved
  body: JSON.stringify({ username: formData.email, password: formData.password }),
});
const data = await response.json();
if (!response.ok) {
  throw new Error(data.error || 'Login failed');
}
```

> **IMPORTANT RULE:** For any request that needs the session cookie (read the user's profile, update a user, delete, or any route protected by `checkToken`), you MUST send `credentials: 'include'`. Requests that just fetch public lists can use the relative `fetchJSON('/api/...')` form.

### 12.4 The standard data-loading pattern in a page (GET)

Every page that loads data from the API uses this exact React pattern (see `ExploreEvents.jsx`, `EventDetails.jsx`, `Organizations.jsx`):

1. State: `const [data, setData] = useState([]);` `const [loading, setLoading] = useState(true);` `const [error, setError] = useState(null);`
2. A `useEffect` that:
   - Reads URL/route params or filter state.
   - Sets a `cancelled` flag for cleanup.
   - Calls `fetchJSON(...)`, then on success `setData(...)`/`setLoading(false)`, on failure `setError(...)`/`setLoading(false)`.
   - Returns a cleanup that sets `cancelled = true`.
3. Render the three states: `loading` → "Loading..." UI; `error` → error UI; empty data → empty state; else → the grid/list.
4. When reading a route param, use `const { id } = useParams();` from `react-router-dom` and pass it into the URL: `fetchJSON(\`/api/events/${id}\`)`.

### 12.5 The standard form-submit pattern (POST/PUT/DELETE)

Follow `VolunteerLogin.jsx` / `VolunteerRegister.jsx`:
```js
const [formData, setFormData] = useState({ field: '' });
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();   // from react-router-dom

const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null); setLoading(true);
  try {
    const response = await fetch('http://localhost:4000/api/<resource>', {
      method: 'POST',                                  // POST / PUT / DELETE
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',                          // include when auth needed
      body: JSON.stringify({ ...formData }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed');
    navigate('/somewhere');                            // redirect on success
  } catch (err) { setError(err.message); }
  finally { setLoading(false); }
};
```
- Use common form components: `Input` (`src/components/common/Input.jsx`) and `Button` (`src/components/common/Button.jsx`). Use `<Button type="submit" variant="primary" disabled={loading}>`.
- Show errors in a red alert box: `<div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-200 text-sm">{error}</div>`.

### 12.6 The backend API surface (keep the frontend calls in sync)

| Method | Endpoint (full) | Purpose | Request | Response | Auth |
|---|---|---|---|---|---|
| GET | `/api/events` | list events (query: `categories,date,city,q`) | – | array of events | – |
| GET | `/api/events/:id` | one event (numerid `id`) | – | event object | – |
| GET | `/api/organizations` | list orgs | – | array of orgs | – |
| GET | `/api/organizations/:id` | one org | – | org object | – |
| GET | `/api/users` | all users | – | array (no password) | `checkToken` |
| GET | `/api/users/profile` | current user from cookie | – | user object | `checkToken` |
| POST | `/api/users` | register | `{username, displayName, password, role}` | `{message}` | – |
| PUT | `/api/users/:id` | update user | `{username, displayName, password}` | user object | `checkToken` |
| DELETE | `/api/users/:id` | delete user | – | `{message}` | `checkToken` |
| DELETE | `/api/users` | delete all | – | `{message}` | `checkToken` |
| POST | `/api/auth/login` | login | `{username, password}` | user object (no password) + sets cookie | – |
| POST | `/api/auth/logout` | logout | – | `{message}` + clears cookie | `checkToken` |

Matching note: `POST /api/users` maps to the register forms (`VolunteerRegister.jsx`), `POST /api/auth/login` maps to the login forms (`VolunteerLogin.jsx`).

### 12.7 Auth: what the cookie does on the frontend

- The backend sets an **httpOnly cookie named `token`** on login. `httpOnly` means JS can't read it — the browser sends it automatically.
- The frontend **never stores the token**; it just relies on sending `credentials: 'include'` so the cookie goes along.
- To see who's logged in, call `GET /api/users/profile` (with `credentials: 'include'`) or check the `role` returned by login.
- On login, the page checks the role: volunteers login via the volunteer portal, organizations via the org portal (see `VolunteerLogin.jsx` line: `if (data.role && data.role !== 'volunteer') throw new Error(...)`).

### 12.8 Where routes/pages live on the frontend

- **Pages** live in `src/pages/` (grouped: `main/`, `auth/`, `organizer_portal/`, `admin_portal/`, `legal/`).
- **Reusable components** live in `src/components/` (`common/` for shared UI: `Button`, `Input`, `Card`, `Navbar`, `Layout`, `Footer`; plus feature components like `EventCard.jsx`, `OrgCard.jsx`, `FilterSidebar.jsx`).
- **Routing** is declared in `src/App.jsx` with `react-router-dom`. New pages MUST be added to `App.jsx` inside the `<Routes>` block, and wrapped in `<Layout />` if they need the shared navbar/footer.
- If you create a new page, add its route in `App.jsx` following the existing path style (e.g. `<Route path="events/:id" element={<EventDetails />} />`).

### 12.9 Static mock data vs live API

- There is a static file `src/data/eventsData.js` used only for hardcoded/placeholder content (e.g. some components). 
- **Live pages that show DB data use the API** (`ExploreEvents.jsx`, `EventDetails.jsx`, `Organizations.jsx`).
- If a feature is supposed to show real data, wire it to the API — do NOT just read from mock data.

---

## 13. How to respond when asked for a new feature

When the human gives you a feature/function to build, your reply MUST:

1. List the exact files you will create or modify using the structures in section 2 (backend) and section 12 (frontend).
2. Show the code for each file, matching every convention in sections 3-11 (backend) and section 12 (frontend connection).
3. If it's a new resource: create `model/<x>.js`, `controller/<x>Controller.js`, `routes/<x>.js`, and register the route in `index.js` under `/api/<x>`.
4. If it needs a frontend page: create the page in `src/pages/`, add its route to `src/App.jsx`, and call the backend through the `fetchJSON` helper (`/api/...`) with `credentials: 'include'` for anything auth-related.
5. Tell the human what to run to test (e.g. `npm run dev` in the frontend root + `npm run dev` in `Backend/`) and, if applicable, any `.env` variables needed.

**Example workflow for a new resource "tasks":**
- Backend: `model/task.js` → `controller/taskController.js` → `routes/tasks.js` → register `taskRoutes` under `app.use("/api/tasks", taskRoutes)` in `index.js`. Follow `eventController.js` + `routes/events.js` as the closest backend template.
- Frontend (if a page needs it): create `src/pages/main/MyTasks.jsx`, add `<Route path="my-tasks" element={<MyTasks />} />` in `App.jsx`, and load data with `fetchJSON('/api/tasks')` following `ExploreEvents.jsx`.
- For anything that needs the logged-in user or writes data, include `credentials: 'include'` and hit the route with `checkToken` protection.

---

*This file is the source of truth for backend AND frontend-to-backend conventions on the CrewUp project. Any code your AI produces that does not match the patterns above will be rejected and must be rewritten to match.*
