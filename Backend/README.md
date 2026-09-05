# Node/Express CRUD API

A small REST API backing the [crud-app-react](../crud-app-react) frontend. It exposes user CRUD endpoints protected by JWT authentication, with the token delivered in an httpOnly cookie.

### Features

- JWT authentication via an httpOnly cookie
- Passwords hashed with bcrypt
- Full CRUD on users (list, read profile, register, update, delete one, delete all)
- CORS configured for a single credentialed frontend origin
- Request logging middleware

### Tech stack

| Concern       | Package                      |
| ------------- | ---------------------------- |
| HTTP server   | Express 5                    |
| Database      | MongoDB via Mongoose 9       |
| Auth          | jsonwebtoken + cookie-parser |
| Password hash | bcrypt                       |
| Config        | dotenv                       |
| Dev reload    | nodemon                      |

ES modules (`"type": "module"`) — use `import`, not `require`.

### Project structure

```
index.js                    app setup, DB connection, route mounting
controller/
  authController.js         login / logout
  useController.js          user CRUD
middlewares/
  checkToken.js             verifies the `token` cookie, 401 otherwise
  logger.js                 logs URL, method and timestamp per request
model/
  user.js                   Mongoose user schema
routes/
  auth.js                   /api/auth
  users.js                  /api/users
utils/
  helpers.js                hashPassword / comparePassword
  validationSchemas.js      currently unused
```

### User model

| Field         | Type   | Constraints           |
| ------------- | ------ | --------------------- |
| `username`    | string | required, unique      |
| `displayName` | string | optional              |
| `password`    | string | required, bcrypt hash |

---

## Getting started

**Prerequisites:** Node.js 18+ and a MongoDB instance (local or Atlas).

1. Clone the repository and go to this directory:
   ```bash
   cd crud-app/node-express-api
   ```
2. Install dependencies:
   ```bash
   npm i
   ```
3. Create a `.env` file, copy the keys from `.env.example`, and fill in the values (see below).
4. Start the server:
   ```bash
   npm run dev    # nodemon, reloads on change
   npm start      # plain node
   ```

The server listens on `PORT` (default `4000`) and logs `Connected to database` once Mongoose connects.

### Environment variables

| Variable         | Description                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`           | Port the API listens on. Defaults to `4000` if unset.                                                                                                                     |
| `DATABASE_URL`   | MongoDB connection string, e.g. `mongodb://127.0.0.1:27017/crud-app`.                                                                                                     |
| `JWT_SECRET`     | Long random string used to sign tokens. Keep it secret and out of version control.                                                                                        |
| `ALLOWED_ORIGIN` | The frontend URL allowed by CORS. For the Vite dev server that is `http://localhost:5173`. Must be an exact origin — a wildcard will not work with credentialed requests. |

`.env` is gitignored; only `.env.example` is committed.

---

## Authentication

`POST /api/auth/login` signs a JWT containing `{ id, username }` and sets it as a cookie:

| Property   | Value                    |
| ---------- | ------------------------ |
| Name       | `token`                  |
| `httpOnly` | `true`                   |
| `secure`   | `true`                   |
| `sameSite` | `none`                   |
| `path`     | `/`                      |
| Lifetime   | 1 hour (cookie `maxAge`) |

Because the cookie is `httpOnly`, the frontend cannot read it — the browser attaches it automatically as long as requests are credentialed:

```js
fetch("http://localhost:4000/api/users", { credentials: "include" });
// axios: { withCredentials: true }
```

`secure: true` with `sameSite: "none"` means the cookie is only stored over HTTPS. Browsers treat `localhost` as a secure origin, so local development over `http://localhost` works; any other deployment must be served over HTTPS.

Protected routes go through `checkToken`, which responds `401 { "error": "Invalid token" }` when the cookie is missing or fails verification (and clears the cookie in the latter case).

---

## API Documentation

Base URL: `http://localhost:4000` (or your configured `PORT`).

### Health check

| Method | Endpoint | Auth | Description                  |
| ------ | -------- | ---- | ---------------------------- |
| `GET`  | `/api`   | No   | Check if the API is running. |

**Response** `200 OK`

```json
{ "message": "API is working" }
```

---

### Auth

| Method | Endpoint           | Auth | Description              |
| ------ | ------------------ | ---- | ------------------------ |
| `POST` | `/api/auth/login`  | No   | Log in and get JWT       |
| `POST` | `/api/auth/logout` | Yes  | Log out and clear cookie |

#### `POST /api/auth/login`

**Request body** (JSON)

| Field      | Type   | Required | Description   |
| ---------- | ------ | -------- | ------------- |
| `username` | string | Yes      | User login    |
| `password` | string | Yes      | User password |

**Success** `200 OK`
Sets the `token` cookie and returns the user document without `__v`. Note that the hashed password is part of this response.

```json
{
  "_id": "...",
  "username": "john",
  "displayName": "John Doe",
  "password": "$2b$10$..."
}
```

**Errors**

- `404` — `{ "error": "User not found" }`
- `400` — `{ "error": "Wrong password" }`

#### `POST /api/auth/logout`

Requires a valid `token` cookie.

**Success** `200 OK`

```json
{ "message": "Logout successful" }
```

**Error** `401` — `{ "error": "Invalid token" }`

---

### Users

| Method   | Endpoint             | Auth | Description         |
| -------- | -------------------- | ---- | ------------------- |
| `GET`    | `/api/users`         | Yes  | List all users      |
| `GET`    | `/api/users/profile` | Yes  | Get current user    |
| `POST`   | `/api/users`         | No   | Register a new user |
| `PUT`    | `/api/users/:id`     | Yes  | Update a user by ID |
| `DELETE` | `/api/users/:id`     | Yes  | Delete a user by ID |
| `DELETE` | `/api/users`         | Yes  | Delete all users    |

#### `GET /api/users`

Returns all users with `password` and `__v` omitted.

**Success** `200 OK`

```json
[
  { "_id": "...", "username": "john", "displayName": "John Doe" },
  { "_id": "...", "username": "jane", "displayName": "Jane Roe" }
]
```

**Errors**

- `401` — `{ "error": "Invalid token" }`
- `400` — raw database error payload

#### `GET /api/users/profile`

Returns the user identified by the `id` claim in the `token` cookie.

**Success** `200 OK`
User document without `__v` (includes the hashed password).

**Errors**

- `401` — `{ "error": "Invalid token" }`
- `400` — raw error payload

#### `POST /api/users` (Register)

Public — no token required.

**Request body** (JSON)

| Field         | Type   | Required | Description     |
| ------------- | ------ | -------- | --------------- |
| `username`    | string | Yes      | Unique username |
| `displayName` | string | No       | Display name    |
| `password`    | string | Yes      | Plain password  |

**Success** `201 Created`

```json
{ "message": "New user added successfully" }
```

**Errors**

- `400` — `{ "error": "Username already in use" }`
- `400` — Mongoose validation error payload (e.g. missing `username`)

#### `PUT /api/users/:id`

Replaces `username`, `displayName` and `password` on the user with the given `id`. The password is re-hashed on every call, so it must be sent each time.

**URL parameters**

| Name | Type   | Description        |
| ---- | ------ | ------------------ |
| `id` | string | User MongoDB `_id` |

**Request body** (JSON)

| Field         | Type   | Required | Description        |
| ------------- | ------ | -------- | ------------------ |
| `username`    | string | Yes      | New username       |
| `displayName` | string | No       | New display name   |
| `password`    | string | Yes      | New plain password |

**Success** `200 OK`
Updated user document without `__v`.

**Errors**

- `400` — `{ "error": "Username already in use" }` (username belongs to a different user)
- `401` — `{ "error": "Invalid token" }`
- `400` — Mongoose error payload (e.g. malformed `id`)

#### `DELETE /api/users/:id`

**URL parameters**

| Name | Type   | Description        |
| ---- | ------ | ------------------ |
| `id` | string | User MongoDB `_id` |

**Success** `200 OK`

```json
{ "message": "User deleted" }
```

A well-formed `id` that matches no user also returns `200` — the response does not indicate whether anything was deleted.

**Errors**

- `401` — `{ "error": "Invalid token" }`
- `400` — Mongoose `CastError` payload for a malformed `id`

#### `DELETE /api/users`

Deletes every user in the collection.

**Success** `200 OK`

```json
{ "message": "All users deleted" }
```

**Error** `401` — `{ "error": "Invalid token" }`
