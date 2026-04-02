# Frontend Deployment Context Guide

## Project Overview

This is a React + Vite frontend for a Leave Management System (VJTI).
It is being deployed on **Vercel** (free tier).

The backend is a Spring Boot app deployed on **Render**:
- Backend Render URL: `https://leave-management-backend.onrender.com`
  *(replace with the actual URL shown on the Render dashboard after deployment)*

---

## Tech Stack

- React 18, Vite, Tailwind CSS
- Axios for most API calls (`src/services/facultyAPI.js`, `src/services/adminAPI.js`)
- Native `fetch` used in `src/components/faculty/LeaveReportPDFContainer.jsx`
- Native `fetch` used in `src/components/Dash_hod/sidebar.jsx`

---

## Critical Problem to Fix Before Deploying

### 1. Vite Proxy Does NOT Work in Production

In development, `vite.config.js` proxies `/api/*` → `http://localhost:8089`.
**On Vercel this proxy is gone.** All relative `/api/...` calls will 404.

**Fix: add a `vercel.json` at the project root** to make Vercel proxy `/api/*`
to the Render backend. This requires zero changes to API call code.

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://leave-management-backend.onrender.com/api/:path*"
    }
  ]
}
```

Replace the destination URL with your actual Render backend URL.

---

### 2. Hardcoded `localhost:8089` in sidebar.jsx

File: `src/components/Dash_hod/sidebar.jsx` — around line 106

```js
fetch(`http://localhost:8089/api/notifications/unread?email=...`)
```

This is an **absolute URL** — `vercel.json` rewrites won't catch it.
It must be changed to a relative URL so Vercel can proxy it:

```js
fetch(`/api/notifications/unread?email=...`)
```

---

### 3. `.env` File — Update for Production

Current `.env`:
```
VITE_BACKEND_URL=http://localhost:8089
```

On Vercel, set this environment variable to the Render URL:
```
VITE_BACKEND_URL=https://leave-management-backend.onrender.com
```

---

## Summary of Changes Needed

| File | Change |
|------|--------|
| `vercel.json` (create new) | Add rewrite rule: `/api/*` → Render backend URL |
| `src/components/Dash_hod/sidebar.jsx` ~line 106 | Change absolute `http://localhost:8089/api/...` to relative `/api/...` |
| Vercel dashboard → Environment Variables | Set `VITE_BACKEND_URL` to Render backend URL |

---

## Vercel Deployment Steps

1. Push the frontend folder to a GitHub repo (separate from the backend repo)

2. Go to vercel.com → New Project → Import that GitHub repo

3. Framework Preset: **Vite**

4. Root Directory: leave as `.` (the root of this folder)

5. Build settings (Vercel auto-detects these from `package.json`, but verify):
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. Environment Variables — add before deploying:
   - `VITE_BACKEND_URL` = `https://leave-management-backend.onrender.com`

7. Click Deploy

---

## After Deploying Both

Once Vercel gives you a frontend URL (e.g. `https://your-app.vercel.app`):

1. Go to the **Render dashboard** → your backend service → Environment
2. Update `FRONTEND_URL` = `https://your-app.vercel.app`
3. Render will redeploy automatically — this allows CORS from your Vercel domain

---

## Known Backend Endpoints (Render)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/emergencyleave/balance` | Leave balance (requires Bearer token) |
| GET | `/api/facultyroutes/leave-history` | Leave history (requires Bearer token) |
| GET | `/api/faculty/leave-report?facultyId=&month=` | PDF report data (requires Bearer token) |
| GET | `/api/notifications/unread?email=&role=&department=` | Unread notifications (no auth needed) |
| GET | `/api/users` | All users (requires Bearer token) |

---

## Notes

- The backend free tier on Render **spins down after 15 min of inactivity**.
  First request after idle takes ~30–60 seconds. This is normal on the free tier.
- JWT token is stored in `localStorage` under the key `token`.
- All authenticated requests must include `Authorization: Bearer <token>` header.
