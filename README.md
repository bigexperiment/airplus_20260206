# Trekking in Nepal - Frontend

Angular frontend application for the Trekking in Nepal website with Admin CRM & Visual Site Editor.

## Tech Stack

- **Angular 16+** (TypeScript)
- **Angular Material** (UI Components)
- **Angular Router** (Navigation)
- **Supabase** (Database, Auth, Edge Functions)
- **Google OAuth 2.0** (Admin authentication via Supabase Auth)
- **Google Gemini AI** (Chatbot assistant via Supabase Edge Function)

## Project Structure

```
/src/app
    /core          - Core services and guards
        /guards    - AuthGuard, AdminGuard (Supabase Auth-based)
        /interceptors - HTTP error interceptor
    /shared        - Shared components and modules
    /models        - TypeScript interfaces (trek, user, booking, category, site-content, media-asset)
    /services      - API services (trek, booking, user, category, auth, supabase, site-content, chatbot, media)
    /public        - Public-facing pages
        /home
        /trek-list
        /trek-detail
        /about
        /contact
    /admin         - Admin CRM pages
        /login           - Google OAuth login page
        /auth-callback   - OAuth callback handler
        /dashboard
        /site-content    - Visual content editor
        /media-manager   - Media asset manager (upload, organize, replace images)
        /treks
        /categories
        /bookings
        /users
```

## Routes

### Public Routes
- `/` - Home page (content driven by SiteContentService)
- `/treks` - Trek listing
- `/treks/:id` - Trek details
- `/about` - About page
- `/contact` - Contact page

### Admin Routes (Protected by AuthGuard + AdminGuard)
- `/admin/login` - Google OAuth login page
- `/admin/auth-callback` - OAuth redirect handler
- `/admin/dashboard` - Dashboard with stats overview & quick actions
- `/admin/content` - **Visual Site Content Editor** (edit all homepage sections)
- `/admin/media` - **Media Manager** (upload, organize, replace, delete images with Supabase Storage)
- `/admin/treks` - Trek management
- `/admin/treks/new` - Create new trek
- `/admin/treks/:id/edit` - Edit trek
- `/admin/categories` - Category management
- `/admin/bookings` - Booking management
- `/admin/users` - User management

## Installation

```bash
npm install
```

## Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`

## Build

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

## Configuration

Supabase connection is configured in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your-anon-key'
};
```

## Authentication (Google OAuth + Email Whitelist)

The application uses **Supabase Auth with Google OAuth** for secure admin access:

### How it works:
1. Admin clicks **"Sign in with Google"** on the login page
2. Redirected to Google's OAuth consent screen
3. After signing in, redirected back to `/admin/auth-callback`
4. The app checks if the user's email exists in the `allowed_admins` table
5. **If allowed** → user is granted admin access to the CRM
6. **If not allowed** → user is signed out and shown "Access Denied"

### Adding authorized admins:
Add emails to the `allowed_admins` table in Supabase:

```sql
INSERT INTO allowed_admins (email, role) VALUES ('newemail@gmail.com', 'ADMIN');
```

### Current authorized emails:
- `ownerskymats@gmail.com` (ADMIN)

### Security layers:
- **Google OAuth** — only real Google accounts can attempt login
- **Email whitelist** — only emails in `allowed_admins` table get access
- **RLS policies** — database enforces that only authenticated allowed admins can write data
- **AuthGuard + AdminGuard** — Angular route guards prevent unauthorized navigation
- **Supabase session** — tokens are managed by Supabase, auto-refreshed, and stored securely

### Google OAuth Setup (Required):
To enable Google Sign-In, you must configure:

1. **Google Cloud Console** (https://console.cloud.google.com):
   - Create OAuth 2.0 credentials (Web Application)
   - Add authorized redirect URI: `https://ynsvkaskkewrgtkoaeyr.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret

2. **Supabase Dashboard** → Authentication → Providers → Google:
   - Enable Google provider
   - Paste Client ID and Client Secret
   - Set redirect URL to: `https://your-domain.com/admin/auth-callback`

## Features

### Public Website
- **Homepage**: Full hero section with stats, services grid, **AI Agent showcase section**, featured treks, cultural tours, testimonials, photo gallery, FAQ accordion, **How It Works steps**, **Trust & Partners logos**, and CTA — all in a clean bright cyan/teal theme
- All homepage content is dynamically driven by `SiteContentService` (editable via admin)
- **Trek List**: Premium filter chips by category, **grid/list view toggle**, sorting options (price, duration, difficulty, name), animated card layouts with responsive design
- **Trek Detail**: Full hero banner, day-by-day **itinerary timeline**, visual **difficulty indicator**, **what's included/excluded** sections, related treks carousel, and booking sidebar
- **About Page**: Company story, animated **team member cards**, interactive **company timeline** with milestones, and **certification badges**
- **Responsive Header**: Desktop + mobile hamburger menu with smooth animations, logged-in user avatar display
- Submit contact/booking enquiries
- Responsive design with Angular Material
- WhatsApp floating chat button
- **Yeti AI Chatbot**: Cute floating AI assistant powered by Google Gemini — answers visitor questions about treks, tours, company info, and travel tips with a friendly mountain personality
- Footer displays editable company info from SiteContentService

### Admin CRM (Google OAuth Protected)
- **Login**: Clean Google OAuth sign-in page with access-restricted messaging
- **Dashboard**: Overview cards for treks, bookings, categories, and users with quick actions
- **Visual Site Content Editor** (9 tabbed sections):
  - Hero (badge, title, subtitle, background image with preview)
  - Stats (add/edit/delete stat numbers)
  - Services (icon picker, color, description)
  - Testimonials (quote, author, trip name + rating score)
  - FAQ (question & answer CRUD)
  - Gallery (image URL with preview, grid layout)
  - Cultural Tours (name, days, image, description)
  - CTA / Call to Action (title, message, director signoff)
  - Company Info (phone, email, WhatsApp, address, registration details)
- **Trek Management**: CRUD operations with table, search, sort, paginate
- **Category Management**: Inline create/edit/delete
- **Booking Management**: View, change status, delete
- **Media Manager** (Supabase Storage):
  - Drag-and-drop or click-to-upload images (JPEG, PNG, WebP, GIF, SVG — max 10MB)
  - Gallery grid with search, filter by tag, filter by usage location
  - Detail panel: view dimensions, file size, upload date, uploader
  - Edit alt text, tags, and usage locations inline
  - Replace image (swaps file but keeps metadata & URL references)
  - Copy public URL to clipboard
  - Delete with confirmation
  - **Image Picker Dialog**: reusable popup for choosing images from the media library when editing site content — also supports inline upload and manual URL entry
- **User Management**: Create/edit/delete (admin only)
- **User avatar and name** displayed in header when logged in
- Protected routes with AuthGuard + AdminGuard

### Site Content Architecture
- `SiteContent` model defines all editable sections (hero, stats, services, testimonials, FAQs, gallery, tours, CTA, company info)
- `SiteContentService` reads/writes content from Supabase `site_content` table
- Homepage and footer subscribe to `content$` and update in real-time when content is changed in the editor
- "Reset to Defaults" button restores all original content

### Yeti AI Chatbot
- Cute floating chat widget (bottom-right corner) powered by Google Gemini 2.0 Flash
- **Secure**: Gemini API key is stored server-side in a Supabase Edge Function (`gemini-chat`) — never exposed to the browser
- **System Instructions**: Automatically fed company info, FAQs, services, tours, and testimonials from `SiteContentService` — the AI knows everything about the site!
- Quick-action buttons for common questions (Treks, Tours, Contact, Fitness)
- Typing animation, conversation history, and message timestamps
- Responsive design with smooth open/close animations
- `ChatbotService` calls the Edge Function proxy instead of Gemini directly

## Database (Supabase)

All data is stored in a Supabase PostgreSQL database with Row Level Security (RLS) enabled.

### Tables
| Table | Description |
|-------|-------------|
| `categories` | Trek categories (High Altitude, Cultural, Tea House, Camping) |
| `treks` | Trek listings with details, pricing, itineraries |
| `bookings` | Customer booking enquiries with status tracking |
| `app_users` | Admin CRM users (legacy, kept for compatibility) |
| `site_content` | All editable homepage sections stored as JSONB |
| `media_assets` | Image metadata — file name, URL, alt text, tags, usage locations, dimensions |
| `allowed_admins` | Email whitelist for authorized admin access |

### RLS Policies
- **Public read** on `categories`, `treks`, `site_content` (visitors can browse)
- **Public insert** on `bookings` (visitors can submit enquiries)
- **Allowed admins only** for all write/admin operations (checked via `allowed_admins` table + Supabase Auth)
- Supabase URL and anon key are configured in `src/environments/environment.ts`

## Deployment

This frontend can be deployed to:
- Netlify
- Vercel
- Firebase Hosting
- AWS S3 + CloudFront

Configure the production Supabase credentials in `src/environments/environment.prod.ts` before deployment.
