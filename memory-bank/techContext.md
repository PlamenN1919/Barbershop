# Tech Context

## Technologies
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS 3.4 with custom theme
- **Animations:** Framer Motion 11
- **Icons:** Lucide React
- **Forms:** React Hook Form + @hookform/resolvers + Zod
- **Date Utils:** date-fns
- **Backend (prepared):** @supabase/supabase-js

## Development Setup
1. `npm install` — install dependencies
2. `npm run dev` — start dev server at localhost:3000
3. Visit `/` for landing page, `/admin` for dashboard

## Color System
- Background: `#0A0A0A`
- Surface: `#1A1A1A`
- Surface Light: `#2A2A2A`
- Gold: `#C8A97E` (light: `#D4BC94`, dark: `#B8956A`)
- Accent: `#FFFFFF`

## Typography
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)

## Supabase Integration (when ready)
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars
- Run SQL schema from `src/lib/supabase.ts` comments
- Replace mock data in constants.ts with Supabase queries
