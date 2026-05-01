# Celebration.com - Premium Catering & Event Management

A professional, dynamic, and highly user-friendly website for celebration.com - an end-to-end event management company based in Purnia, Bihar, India.

## Features

- **Build Your Plate** - Interactive food customization with real-time pricing
- **Event Categories** - Weddings, Corporate, Private Parties, Catering
- **Pre-Built Packages** - Silver, Gold, Platinum tiers
- **Quote System** - Lead capture with inquiry forms
- **Admin Panel** - Full CRUD for menu, categories, packages, leads, banners
- **Role-Based Access** - Super Admin and Menu Manager roles
- **WhatsApp Integration** - Quick contact button
- **Responsive Design** - Mobile-first, luxury aesthetic

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with RBAC
- **State**: Zustand (plate builder)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account
- Vercel account

### 1. Clone the Repository

```bash
git clone https://github.com/paradiseaitech/celebration_web.git
cd celebration_web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project
3. Go to **SQL Editor**
4. Copy and paste the entire contents of `supabase-setup.sql`
5. Click **Run** to execute all SQL commands

### 4. Create Admin User

1. In Supabase Dashboard, go to **Authentication → Users**
2. Click **Add User** → **Create new user**
3. Email: `admin@celebration.com`
4. Set a strong password
5. After creating, run this SQL to set super_admin role:

```sql
update public.users 
set role = 'super_admin' 
where id = (select id from auth.users where email = 'admin@celebration.com');
```

### 5. Set Up Environment Variables

Create `.env.local` in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://himmakzooolttnqlkllg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get your keys from **Supabase Dashboard → Settings → API**.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 7. Admin Panel

Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in with the admin credentials.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy

### Custom Domain

1. In Vercel, go to your project settings
2. Navigate to **Domains**
3. Add `celebration.com`
4. Follow DNS configuration instructions

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Homepage (server component)
│   ├── globals.css             # Global styles + design tokens
│   ├── api/                    # API routes
│   │   ├── categories/route.ts
│   │   ├── menu-items/route.ts
│   │   ├── packages/route.ts
│   │   ├── leads/route.ts
│   │   └── newsletter/route.ts
│   └── admin/                  # Admin panel (protected)
│       ├── layout.tsx
│       ├── login/page.tsx
│       ├── dashboard/page.tsx
│       ├── menu-items/page.tsx
│       ├── categories/page.tsx
│       ├── packages/page.tsx
│       ├── leads/page.tsx
│       ├── banners/page.tsx
│       └── settings/page.tsx
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── whatsapp-button.tsx
│   ├── layout/                 # Layout components
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── sections/               # Page sections
│       ├── hero.tsx
│       ├── event-categories.tsx
│       ├── plate-builder.tsx
│       ├── packages.tsx
│       ├── testimonials.tsx
│       ├── gallery.tsx
│       ├── about.tsx
│       └── quote-form.tsx
├── lib/
│   ├── utils.ts                # Utility functions
│   └── constants.ts            # App constants
├── store/
│   └── plateStore.ts           # Zustand plate builder state
└── utils/
    └── supabase/               # Supabase client utilities
        ├── client.ts
        ├── server.ts
        └── middleware.ts
```

## Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Navy | `#0A1628` | Primary dark backgrounds |
| Navy Light | `#142240` | Secondary dark backgrounds |
| Gold | `#D4A853` | Primary accent, CTAs |
| Gold Hover | `#E0BC6A` | Hover states |
| Gold Dark | `#B8912E` | Text on gold backgrounds |
| Cream | `#FAF7F2` | Light section backgrounds |
| Charcoal | `#1A1A1A` | Primary text color |

### Typography

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

Tables:
- `users` - Admin users with roles
- `categories` - Menu categories (Starters, Main Course, etc.)
- `menu_items` - Individual menu items with pricing
- `packages` - Pre-built packages (Silver, Gold, Platinum)
- `package_items` - Junction table for package contents
- `leads` - Inquiry submissions
- `banners` - Promotional banners
- `newsletter_subscribers` - Newsletter signups

## Future Enhancements

- [ ] Online payment integration (Razorpay)
- [ ] AI-based menu recommendations
- [ ] Calendar availability check
- [ ] Multi-city pricing
- [ ] Email notifications on lead submission
- [ ] Hindi language support
- [ ] PWA support
- [ ] Advanced analytics dashboard

## License

All rights reserved. © Celebration.com
