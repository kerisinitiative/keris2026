# KERIS Website

Official website for **KERIS** — *Kelantan Education Resource Initiative for Students* — a student-led organisation that empowers Kelantanese scholars in their post-SPM academic journey.

Built with **React + Vite**, **TailwindCSS**, **Supabase**, and deployed on **Vercel**.

---

## Stack

| Layer       | Tech                                      |
|-------------|-------------------------------------------|
| Frontend    | React 18, Vite, React Router v6           |
| Styling     | TailwindCSS + custom CSS variables        |
| Backend/DB  | Supabase (Postgres + Auth + Storage)      |
| State       | Zustand                                   |
| Charts      | Recharts                                  |
| PDF Export  | html2pdf.js                               |
| Deployment  | Vercel                                    |

---

## Project Structure

```
keris-website/
├── public/
│   ├── favicon.ico
│   ├── hero-bg.jpg
│   ├── logo.PNG
│   └── reallogo.png
├── src/
│   ├── lib/
│   │   └── supabase.js           # Supabase client
│   ├── store/
│   │   └── authStore.js          # Zustand auth store
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── ui/
│   │   │   ├── ScholarCard.jsx
│   │   │   ├── ScholarshipCard.jsx
│   │   │   ├── ImageCarousel.jsx
│   │   │   └── ImageUpload.jsx
│   │   └── AdminGate.jsx         # Restricts routes to admin users
│   └── pages/
│       ├── Landing.jsx
│       ├── News.jsx
│       ├── NewsDetail.jsx
│       ├── Scholars.jsx
│       ├── ScholarDetail.jsx
│       ├── Scholarships.jsx
│       ├── ScholarshipDetail.jsx
│       ├── Resume.jsx
│       ├── Essay.jsx
│       ├── NotFound.jsx
│       └── admin/
│           ├── AdminDashboard.jsx
│           ├── EditScholars.jsx
│           ├── EditScholarships.jsx
│           ├── EditCommittee.jsx
│           └── EditNews.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── .env.example
└── package.json
```

---

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd keris-website
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in your values from **Supabase Dashboard → Project Settings → API**:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. Run locally

```bash
npm run dev
```

---

## Pages & Routes

| Route                  | Access     | Description                          |
|------------------------|------------|--------------------------------------|
| `/`                    | Public     | Landing page with impact report & committee |
| `/news`                | Public     | News & announcements feed            |
| `/news/:id`            | Public     | News article detail                  |
| `/scholars`            | Public     | Scholar profiles grid with filters   |
| `/scholars/:id`        | Public     | Individual scholar profile           |
| `/scholarships`        | Public     | Scholarship listings with filters    |
| `/scholarships/:id`    | Public     | Scholarship detail                   |
| `/resume`              | Public     | Resume builder with PDF export       |
| `/essay`               | Public     | Essay helper with section prompts    |
| `/admin`               | Admin only | Dashboard                            |
| `/admin/scholars`      | Admin only | Add / edit / delete scholars         |
| `/admin/scholarships`  | Admin only | Add / edit / delete scholarships     |
| `/admin/committee`     | Admin only | Add / edit / delete committee members|
| `/admin/news`          | Admin only | Add / edit / delete news posts       |

---

## Making a User an Admin

Admins are set manually — there is no self-registration for admin access.

1. Have the user sign in once (this creates their row in `public.users`)
2. In **Supabase Dashboard → Table Editor → users**, find their row
3. Change the `role` column from `user` to `admin`

Or via SQL:

```sql
UPDATE public.users SET role = 'admin' WHERE email = 'admin@example.com';
```

---

## Deploying to Vercel

```bash
npm run build   # test the build locally first
```

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add the following **Environment Variables** in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. In Supabase → **Auth → URL Configuration**, add your Vercel domain as a Redirect URL:
   ```
   https://your-site.vercel.app
   ```
5. Click Deploy

> `vercel.json` is already configured to rewrite all routes to `index.html` for client-side routing.

---

## Brand Colors

| Name    | Hex       | Usage                        |
|---------|-----------|------------------------------|
| Gold    | `#E6A122` | Primary accent, CTAs         |
| Crimson | `#840E20` | Buttons, highlights          |
| Maroon  | `#290101` | Deep background              |
| Wine    | `#591D1F` | Mid background, cards        |
| Cream   | `#FDF6E3` | Body text                    |

## Fonts

- **League Spartan** (Google Fonts) — headings & UI labels
- **Times New Roman** / Georgia — body text
