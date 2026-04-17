# Kado Bajo CRM

A full-stack mini CRM system for a souvenir business in Labuan Bajo, built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## Features

### 🛍️ Customer Landing Page (`/`)
- Branded hero section for Kado Bajo
- Lead capture form (Name, Email, WhatsApp)
- Submits to `/api/leads` → saves to Supabase
- Redirects to WhatsApp after submission
- Admin Login button (top-right)

### 🔐 Admin Auth (`/login`)
- Hardcoded credentials: `admin@kadobajo.com` / `123456`
- Sets `auth=true` cookie on success
- Middleware protects `/dashboard` and `/customers`

### 📊 CRM Dashboard (`/dashboard`)
- Stats: Total Customers, Deals, Lost, Revenue
- Pipeline bar chart by status
- Recent 5 customers

### 👥 Customers Table (`/customers`)
- Full table: Name, Phone, Email, Source, Tag, Status, Date
- Inline status update (StatusDropdown → PATCH /api/customers/[id])
- Search by name/phone/email
- Filter by status
- Export CSV

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (REST API, no SDK) |
| Auth | Cookie-based (middleware) |

---

## Setup

### 1. Clone & install

```bash
git clone <your-repo>
cd kadobajo-crm
npm install
```

### 2. Create Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Open **SQL Editor** and run the contents of `supabase-migration.sql`
3. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
kadobajo-crm/
├── app/
│   ├── page.tsx                    # Landing page (public)
│   ├── layout.tsx                  # Root layout
│   ├── globals.css
│   ├── login/
│   │   └── page.tsx               # Admin login
│   ├── api/
│   │   ├── auth/route.ts          # POST login / DELETE logout
│   │   ├── leads/route.ts         # POST lead capture
│   │   └── customers/[id]/route.ts # PATCH status update
│   └── (crm)/
│       ├── layout.tsx             # Sidebar layout
│       ├── dashboard/page.tsx     # Stats + pipeline
│       └── customers/
│           ├── page.tsx           # Server wrapper
│           └── CustomersClient.tsx # Client table + filter + export
├── components/
│   └── crm/
│       ├── StatusDropdown.tsx     # Inline status updater
│       └── LogoutButton.tsx       # Clears auth cookie
├── lib/
│   ├── customers.ts               # Data helpers
│   └── supabase/server.ts         # Raw REST client
├── types/
│   └── customer.ts                # TypeScript types
├── middleware.ts                  # Route protection
├── supabase-migration.sql         # DB schema
└── .env.local.example
```

---

## Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@kadobajo.com` |
| Password | `123456` |

> ⚠️ Change these for production — see `app/api/auth/route.ts`.

---

## Customization

### Change WhatsApp number
In `app/page.tsx`, update:
```ts
const WHATSAPP_NUMBER = '6281234567890';
```

### Add more admin users
Replace the hardcoded check in `app/api/auth/route.ts` with a database lookup.

### Use Supabase Auth
Swap the cookie-based auth in `middleware.ts` and `app/api/auth/route.ts` for `@supabase/ssr`.

---

## Deployment (Vercel)

```bash
vercel deploy
```

Add environment variables in the Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
