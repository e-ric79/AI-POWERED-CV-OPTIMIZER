# CV Optimizer KE 🇰🇪

> AI-powered CV optimization platform built for the Kenyan job market.
> Helps job seekers beat ATS systems and land more interviews.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-green)
![Groq](https://img.shields.io/badge/Groq-Llama3.3-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Live Demo

[https://ai-powered-cv-optimizer.vercel.app/](https://ai-powered-cv-optimizer.vercel.app/)

---

## 📌 Problem Statement

Over 75% of CVs submitted to Kenyan companies never reach a human recruiter.
They are automatically rejected by Applicant Tracking Systems (ATS) due to
missing keywords, poor formatting, or weak summaries. Most job seekers have
no idea this is happening.

CV Optimizer KE solves this by using AI to analyze a candidate's CV against
a specific job description and provide actionable feedback in under 30 seconds.

---

## ✨ Features

- 📄 **PDF CV upload** — upload your CV as a PDF
- 🤖 **AI analysis** — powered by Llama 3.3 70B via Groq
- 📊 **ATS Score** — see how likely your CV is to pass automated screening
- 🔑 **Missing keywords** — exact keywords you need to add
- ✍️ **Rewritten summary** — AI rewrites your professional summary for the role
- 🎯 **Interview tips** — tailored tips based on the job and your background
- 💳 **M-Pesa payments** — pay via STK Push (KES 200 per analysis)
- 🔐 **Auth** — secure signup/login via Supabase
- 📈 **Admin dashboard** — view users, analyses, and revenue
- 📚 **API documentation** — full REST API docs at /docs

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│         Next.js 15 App Router (React + TypeScript)      │
│   Landing │ Auth │ Dashboard │ Analyze │ Admin │ Docs   │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP requests
┌─────────────────────────▼───────────────────────────────┐
│                     API LAYER                           │
│              Next.js API Routes (Edge)                  │
│                                                         │
│  POST /api/analyze        → CV Analysis                 │
│  POST /api/mpesa/initiate → STK Push                    │
│  POST /api/mpesa/callback → Payment webhook             │
│  GET  /api/admin/stats    → Admin data                  │
└──────┬──────────────────────────┬───────────────────────┘
       │                          │
┌──────▼──────┐          ┌────────▼────────┐
│   GROQ AI   │          │    SUPABASE     │
│             │          │                 │
│ Llama 3.3   │          │ PostgreSQL DB   │
│ 70B model   │          │ Auth (JWT)      │
│             │          │ Row Level       │
│ CV Analysis │          │ Security        │
└─────────────┘          └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │  SAFARICOM      │
                         │  DARAJA API     │
                         │                 │
                         │ STK Push        │
                         │ M-Pesa payments │
                         └─────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE                       │
│                                                         │
│  GitHub Push → GitHub Actions → Run Tests → Build      │
│                                         → Deploy Vercel │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer       | Technology              |
| ----------- | ----------------------- |
| Framework   | Next.js 15 (App Router) |
| Language    | TypeScript              |
| Styling     | Tailwind CSS v4         |
| AI Model    | Llama 3.3 70B via Groq  |
| Database    | Supabase (PostgreSQL)   |
| Auth        | Supabase Auth           |
| Payments    | M-Pesa Daraja API       |
| PDF Parsing | unpdf                   |
| Hosting     | Vercel                  |
| CI/CD       | GitHub Actions          |
| Testing     | Jest + ts-jest          |

---

## 📁 Project Structure

```
cv-optimizer/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   └── users/[userId]/page.tsx
│   │   ├── analyze/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── docs/page.tsx
│   │   ├── api/
│   │   │   ├── analyze/route.ts
│   │   │   ├── admin/stats/route.ts
│   │   │   └── mpesa/
│   │   │       ├── initiate/route.ts
│   │   │       └── callback/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   └── mpesa.ts
│   └── components/
│       └── (shared components)
├── src/__tests__/
│   └── analyze.test.ts
├── .github/
│   └── workflows/
│       └── ci.yml
├── middleware.ts
├── .env.local
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- npm
- Supabase account
- Groq API key
- Safaricom Daraja account

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/cv-optimizer.git
cd cv-optimizer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your keys in .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔑 Environment Variables

Create a `.env.local` file in the root:

```env
# AI
GROQ_API_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# M-Pesa Daraja
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=

# App
NEXT_PUBLIC_APP_URL=
```

---

## 🧪 Running Tests

```bash
npm test
```

```
PASS src/__tests__/analyze.test.ts
  parseAnalysisResponse  ✓
  formatPhone            ✓
  scoreColor             ✓
  isFreeAnalysisAvailable ✓
  requiresPayment        ✓
  isValidCV              ✓

Tests: 19 passed
```

---

## 💰 Business Model

| Plan        | Price   | Features                      |
| ----------- | ------- | ----------------------------- |
| Free        | KES 0   | 1 analysis                    |
| Pay per use | KES 200 | Unlimited analyses via M-Pesa |

---

## 🗄️ Database Schema

```sql
-- User profiles
profiles (id, email, full_name, analyses_used, analyses_paid, is_admin, created_at)

-- CV analyses
analyses (id, user_id, job_title, ats_score, match_score, result, paid, created_at)

-- M-Pesa payments
payments (id, user_id, phone, amount, mpesa_receipt, status, created_at)
```

---

## 🔌 API Reference

Full API documentation available at [/docs](https://ai-powered-cv-optimizer.vercel.app/docs)

---

## 🚀 Deployment

The app is deployed on Vercel with automatic deployments on every push to `main`.

```
git push origin main → GitHub Actions runs tests → Vercel deploys
```

---

## 👨‍💻 Author

Eric

---

## 📄 License

MIT
