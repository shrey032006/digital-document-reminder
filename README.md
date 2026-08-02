# Digital Document Reminder System

A full-stack app that stores your important documents (Aadhaar, PAN, Passport,
Driving License, Insurance, Vehicle Registration, Educational Certificates, etc.)
and flags them as they approach their expiry date.

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Multer file uploads
- **Frontend:** React (JSX, via Vite), React Router, Axios

```
digital-document-reminder/
├── backend/     Express API + MongoDB models
└── frontend/    React (Vite) client
```

## 1. Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI
- npm

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env if needed (MONGO_URI, JWT_SECRET, etc.)
npm run dev        # starts on http://localhost:5000
```

If you don't have MongoDB installed locally, either:
- install it (https://www.mongodb.com/try/download/community) and run `mongod`, or
- create a free cluster on MongoDB Atlas and paste its connection string into
  `MONGO_URI` in `backend/.env`.

## 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev         # starts on http://localhost:5173
```

Visit **http://localhost:5173**, create an account, and start adding documents.
The dev server proxies `/api` and `/uploads` requests to the backend on port 5000,
so both must be running at the same time.

## 4. What's included

- Register / login with hashed passwords (bcrypt) and JWT sessions
- Add, edit, delete documents, each with an optional PDF/image attachment
- Automatic status per document: **valid**, **expiring soon** (≤30 days),
  **urgent** (≤7 days), **expired** — shown as a stamp-style badge
- Dashboard with live counts, click-to-filter tiles, search by name, and sort
  by expiry date or name
- Profile page to update your name or password

## 5. Production build

```bash
cd frontend
npm run build        # outputs static files to frontend/dist
```

Serve `frontend/dist` with any static host (or from the Express app) and point
`VITE_API_URL` at your deployed backend URL before building.

## 6. Notes on the original spec

This implementation follows the mini-project brief (User Auth, Dashboard,
Document Management, Reminder Module, Search & Filter, Profile Management).
Email/SMS reminders, OCR auto-fill, and calendar integration are listed as
future enhancements in the brief and are not implemented here — the app
currently surfaces reminders in-app via the dashboard and status stamps.
