# makeYourResume — AI-Powered Resume Builder

A full-stack web app that lets users build, enhance, and share professional resumes using AI. Supports Google OAuth, Razorpay payments, and PDF export.

---

## Features

- **AI Resume Builder** — Step-by-step editor for personal info, summary, experience, education, projects, and skills
- **AI Enhancements** — Gemini-powered rewriting for professional summaries and experience bullet points
- **Upload & Parse** — Upload an existing PDF/Word resume and extract content automatically
- **Multiple Templates** — Classic, Modern, Minimal, and Minimal-Image layouts with accent color picker
- **PDF Export** — Print-to-PDF with clean page formatting (Pro feature)
- **Public Resume Links** — Share a public URL for any resume
- **Google OAuth** — One-click sign-in with Google alongside email/password
- **Subscription Plans** — Free, Pro (monthly), and Elite (yearly) tiers via Razorpay

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, Redux Toolkit |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| AI | Google Gemini API (`gemini-2.5-flash` via `v1beta`) |
| Auth | JWT (7-day expiry), Google OAuth 2.0 |
| Payments | Razorpay Orders API + HMAC-SHA256 verification |
| File Storage | ImageKit (profile photo + background removal) |

---

## Installation

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay account
- Google Cloud OAuth 2.0 credentials
- Gemini API key
- ImageKit account

### Steps

```bash
git clone https://github.com/your-username/makeYourResume.git
cd makeYourResume

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

Run in development:

```bash
# Terminal 1 — backend (from /server)
npm run dev

# Terminal 2 — frontend (from /client)
npm run dev
```

---

## Environment Variables

### `server/.env`

```env
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id

RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_razorpay_secret

GEMINI_API_KEY=your_gemini_api_key

IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### `client/.env`

```env
VITE_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY=rzp_live_...
```

> `.env` files are excluded from git via `.gitignore`.

---

## Authentication

### Email / Password

- Passwords hashed with bcrypt (10 rounds)
- Login returns a signed JWT stored in `localStorage`
- Token sent via `Authorization` header on protected routes

### Google OAuth

- Client uses `@react-oauth/google` — returns a Google ID token directly via JS callback (no redirects)
- Backend verifies the token with `google-auth-library` (`OAuth2Client.verifyIdToken`)
- Finds or creates the user by `googleId` / `email`, then issues the same JWT as email login
- Existing email accounts are automatically linked to Google on first OAuth sign-in

**Google Cloud setup:**
1. Create an OAuth 2.0 Client ID (Web application)
2. Add your domain to **Authorized JavaScript Origins**
3. No redirect URIs needed

---

## Payments (Razorpay)

**Flow:**
1. `POST /api/payments/create-order` — backend creates a Razorpay order
2. Client opens the Razorpay checkout modal
3. On success, `POST /api/payments/verify-payment` with the three Razorpay response fields
4. Backend verifies HMAC-SHA256 signature, updates `user.plan` + `user.subscriptionStatus`
5. Updated user returned to client and stored in Redux

**Plans:**

| Plan | Price | Billing |
|------|-------|---------|
| Free | ₹0 | — |
| Pro | ₹99 | Monthly |
| Elite | ₹499 | Yearly |

---

## Folder Structure

```
makeYourResume/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── app/             # Redux store & auth slice
│       ├── assets/          # Resume templates, images
│       ├── components/      # Reusable UI components
│       │   └── home/        # Landing page sections (Hero, Feature, Footer)
│       ├── configs/         # Axios instance
│       ├── pages/           # Route-level pages
│       └── utils/           # Razorpay helpers
│
└── server/                  # Express backend
    ├── configs/             # MongoDB connection
    ├── controllers/         # Route handlers (user, resume, AI, payment)
    ├── middlewares/         # JWT auth middleware
    ├── models/              # Mongoose schemas (User, Resume)
    ├── routes/              # Express routers
    └── utils/               # Gemini client, ImageKit helpers
```

---

## Future Improvements

- [ ] Cover letter generator
- [ ] ATS score analyzer with keyword suggestions
- [ ] Resume version history
- [ ] LinkedIn profile import
- [ ] Dark mode
- [ ] Admin dashboard for user & subscription management
