# Telegram Clone

![image](https://github.com/DenysGarbuz/telegram-clone/assets/161141971/d5bfddc7-324e-40f2-8848-ce20d057223a)

A full-stack Telegram-inspired chat app: real-time direct messages and group
chats, message replies and edits, file / image attachments via S3, invite
links, role-based admin rights, and folder organization.

Built as a portfolio-scale project to exercise a real-time backend
(Express + Socket.IO + MongoDB) against a modern Next.js 14 frontend.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Project layout](#project-layout)
- [Scripts](#scripts)
- [Testing](#testing)
- [Security notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Features

- **Auth** — email/password register + login, JWT access + refresh tokens in
  httpOnly cookies, refresh endpoint.
- **Direct messages & group chats** — create, join via invite link, leave,
  delete (cascades members/messages).
- **Real-time messaging** — Socket.IO fan-out per chat room, with per-room
  authorization (only members receive / send).
- **Messages** — text, replies, inline edits, delete (self or admin),
  paginated cursor-based history.
- **File attachments** — images and arbitrary files uploaded directly to
  AWS S3; URLs stored on the message.
- **Roles & rights** — chat owner + admins with granular rights
  (`canAddMembers`, `canDeleteMessages`, `canBanUsers`, `canPinMessages`,
  `canAddNewAdmins`).
- **Invite links** — UUID-based invite codes; chat access can be `public` or
  `private`.
- **Folders** — group chats into named folders per user.

## Tech stack

### Backend (`backend/`)

- **Runtime:** Node.js ≥ 20 (see `.nvmrc`).
- **Server:** Express 4, Socket.IO 4.
- **Database:** MongoDB via Mongoose 7.
- **Auth:** JWT (`jsonwebtoken`) + bcrypt, cookie-based sessions.
- **File storage:** AWS S3 via `@aws-sdk/client-s3`, multipart via `multer`.
- **Validation:** Yup schemas + a central validation middleware.
- **Security:** `helmet`, `express-rate-limit`, origin-allowlist CORS.
- **Logging:** `pino` (pretty in dev, JSON in prod).
- **Tests:** Jest + supertest + `mongodb-memory-server`.
- **Lint/format:** ESLint + Prettier.

### Frontend (`frontend/`)

- **Framework:** Next.js 14 (App Router), React 18, TypeScript (strict).
- **State:** Redux Toolkit + React Redux; RTK Query for the refresh API.
- **Server state:** TanStack React Query (infinite message lists).
- **UI:** NextUI, Tailwind CSS, Framer Motion, `react-icons`.
- **Realtime:** `socket.io-client`.
- **Forms:** Formik + Yup.
- **Tests:** Vitest + @testing-library/react + jsdom.

## Architecture

```
┌────────────────┐       HTTPS (REST)        ┌──────────────────┐
│                │ ────────────────────────► │                  │
│  Next.js (14)  │                           │  Express API     │
│  React + RTK   │        WebSocket          │  + Socket.IO     │
│                │ ◄──────────────────────►  │                  │
└──────┬─────────┘                           └────────┬─────────┘
       │                                              │
       │ Direct upload URLs                           │ Mongoose
       ▼                                              ▼
┌────────────────┐                           ┌──────────────────┐
│   AWS S3       │                           │   MongoDB        │
│  (attachments) │                           │   (Atlas/local)  │
└────────────────┘                           └──────────────────┘
```

- HTTP requests hit `/api/*` on the backend. The `errorHandler` middleware
  guarantees every error response has the shape
  `{ error: { code, message, details? } }`.
- Socket.IO uses the same JWT in a handshake query; room joins are
  authorized against `Member` docs, so users can only receive messages
  from chats they've joined.
- Chat attachments are uploaded by the backend to S3 with server-side
  credentials; the frontend renders them via HTTPS URLs on the message.

## Prerequisites

- **Node.js 20+** (use `nvm use` if you have nvm).
- **MongoDB** — either [Atlas](https://www.mongodb.com/atlas) (easiest) or
  a local instance (`brew install mongodb-community` on macOS).
- **AWS S3 bucket** with:
  - an IAM user that has `s3:PutObject` and `s3:GetObject` on the bucket,
  - a CORS policy allowing `PUT`/`GET` from your frontend origin if you
    ever switch to client-side uploads (server-side uploads don't need
    this).
- **npm** (or pnpm / yarn, but examples below use npm).

## Quick start

```bash
# 1. Clone
git clone https://github.com/DenysGarbuz/telegram-clone.git
cd telegram-clone

# 2. Backend
cd backend
cp .env.example .env          # fill in every value — see below
npm install
npm run dev                   # http://localhost:3003

# 3. Frontend (in a second terminal)
cd ../frontend
cp .env.example .env.local
npm install
npm run dev                   # http://localhost:3000
```

Open <http://localhost:3000>, register a user, create a chat, send a
message. The backend logs to stdout via pino.

## Environment variables

### `backend/.env`

| Variable                | Required | Example                                      | Description                                                 |
| ----------------------- | -------- | -------------------------------------------- | ----------------------------------------------------------- |
| `NODE_ENV`              | no       | `development`                                | `development`, `production`, `test`                         |
| `PORT`                  | no       | `3003`                                       | HTTP + WebSocket port                                       |
| `MONGODB_URL`           | **yes**  | `mongodb+srv://u:p@cluster/app`              | Mongo connection string                                     |
| `JWT_PRIVATE_KEY`       | **yes**  | 64-byte hex                                  | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `FRONTEND_URL`          | **yes**  | `http://localhost:3000`                      | Comma-separated allowlist for CORS + Socket.IO              |
| `COOKIE_SECURE`         | no       | `false`                                      | Set `true` only in production over HTTPS                    |
| `AWS_ACCESS_KEY_ID`     | **yes**  | `AKIA…`                                      | IAM user key                                                |
| `AWS_SECRET_ACCESS_KEY` | **yes**  | `…`                                          | IAM user secret                                             |
| `AWS_REGION`            | **yes**  | `eu-north-1`                                 | Bucket region                                               |
| `AWS_BUCKET_NAME`       | **yes**  | `my-bucket`                                  | Bucket to upload attachments into                           |

Missing a required var will cause the backend to log
`[config] missing required env var: X` and exit at startup — by design.

### `frontend/.env.local`

| Variable                 | Required | Example                 | Description                         |
| ------------------------ | -------- | ----------------------- | ----------------------------------- |
| `NEXT_PUBLIC_SERVER_URL` | **yes**  | `http://localhost:3003` | Base URL of the backend (no slash). |

> You also need to tell Next.js which S3 hostname to accept for `<Image>`.
> Edit `frontend/next.config.js` and change the `hostname` entry to
> `<your-bucket>.s3.<region>.amazonaws.com`.

## Project layout

```
telegram-clone/
├── backend/
│   ├── config/env.js            # central env loader (validated)
│   ├── index.js                 # entry — wires server + db + sockets
│   ├── setup/
│   │   ├── server.js            # Express app + middleware
│   │   ├── db.js                # Mongoose connect
│   │   ├── socket.js            # Socket.IO + room auth
│   │   └── s3client.js          # S3 upload helpers
│   ├── routes/                  # auth, users, chats, messages, members, folders
│   ├── middleware/
│   │   ├── auth.js              # JWT auth
│   │   ├── validate.js          # id + body validation
│   │   └── errorHandler.js      # ApiError → JSON
│   ├── models/                  # Mongoose schemas
│   ├── utils/
│   │   ├── ApiError.js          # standard error class
│   │   ├── logger.js            # pino
│   │   └── cookies.js           # shared cookie options
│   └── __tests__/               # Jest + supertest
├── frontend/
│   ├── app/                     # Next.js App Router pages
│   ├── components/              # chat UI, modals, providers
│   ├── hooks/                   # useCurrentUser, useSocket, useChat…
│   ├── store/                   # Redux Toolkit slices + RTK Query
│   ├── utils/                   # axios, message helpers
│   ├── types.ts                 # shared types
│   └── __tests__/               # Vitest + RTL
├── .nvmrc                       # Node 20
└── README.md
```

## Scripts

### Backend

```bash
npm run dev       # node --watch (auto-reload)
npm start         # plain node
npm test          # jest
npm run lint      # eslint
npm run format    # prettier --write
```

### Frontend

```bash
npm run dev       # next dev
npm run build     # next build
npm start         # next start
npm test          # vitest run
npm run lint      # next lint
npm run typecheck # tsc --noEmit
npm run format    # prettier --write
```

## Testing

Backend tests use `mongodb-memory-server`, so no external DB is needed:

```bash
cd backend
npm test
```

Frontend tests run through Vitest + JSDOM:

```bash
cd frontend
npm test
```

Both suites are safe to run locally with nothing else set up.

## Security notes

- **Never commit `.env`** — both are in `.gitignore` and the project ships
  a `.env.example` in each package.
- **Rotate immediately** if a secret leaks: change the IAM key, the Mongo
  user's password, and regenerate `JWT_PRIVATE_KEY` (this logs everyone
  out — acceptable if you rotate anyway).
- **Cookies** are `httpOnly` and `sameSite=none`; set `COOKIE_SECURE=true`
  in production so the browser only sends them over HTTPS.
- **Rate limiting** is enabled globally (300 req / 15 min) and strictly on
  `/api/auth` and `/api/users` (10 req / 15 min).
- **CORS** is allowlist-based via `FRONTEND_URL` (comma-separated). Any
  request from an unlisted origin is rejected and logged.
- **Socket rooms** are authorized — users can only join chats they're a
  member of (or chats that are explicitly `public`).

## Troubleshooting

**`[config] missing required env var: X`** — you forgot a value in
`backend/.env`. Copy `.env.example` and fill everything in.

**`MongooseServerSelectionError`** — your `MONGODB_URL` is wrong or your
IP isn't allowlisted in Atlas (Network Access → Add IP).

**`Access-Control-Allow-Origin` errors in browser** — the frontend origin
isn't in `FRONTEND_URL`. Add it (comma-separated if you have multiple).

**Socket connects but `joining` never resolves** — your JWT cookie isn't
being sent, usually because `COOKIE_SECURE=true` is set over plain HTTP.
Set it to `false` in local dev.

**`next/image` won't render uploaded images** — add your bucket's hostname
to the `remotePatterns` list in `frontend/next.config.js`.

**`npm install` fails with ERESOLVE on the frontend** — there's a peer
dep conflict in the NextUI stack; use `npm install --legacy-peer-deps`.

## Contributing

This is primarily a personal portfolio project, but issues and PRs are
welcome. Please:

1. Run `npm run lint` and `npm test` in both packages before pushing.
2. Write new routes through `asyncHandler` + `ApiError` so error shapes
   stay consistent.
3. Put new config behind `backend/config/env.js` — never read
   `process.env` directly from route code.

## License

ISC — see `backend/package.json`.
