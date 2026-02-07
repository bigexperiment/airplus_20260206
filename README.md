# Trekking in Nepal - Frontend

Angular frontend application for the Trekking in Nepal website with Admin CRM & Visual Site Editor.

## Tech Stack

- **Angular 16+** (TypeScript)
- **Angular Material** (UI Components)
- **Angular Router** (Navigation)
- **HttpClient** (REST API calls)
- **LocalStorage** (JWT token storage, site content persistence)
- **Google Gemini AI** (Chatbot assistant via REST API)

## Project Structure

```
/src/app
    /core          - Core services and guards
    /shared        - Shared components and modules
    /models        - TypeScript interfaces (trek, user, booking, category, site-content)
    /services      - API services (trek, booking, user, category, auth, site-content, chatbot)
    /public        - Public-facing pages
        /home
        /trek-list
        /trek-detail
        /about
        /contact
    /admin         - Admin CRM pages
        /login
        /dashboard
        /site-content  - Visual content editor
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

### Admin Routes (Protected)
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard with stats overview & quick actions
- `/admin/content` - **Visual Site Content Editor** (edit all homepage sections)
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

## API Configuration

Update the API base URL and Gemini API key in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  geminiApiKey: 'YOUR_GEMINI_API_KEY_HERE'
};
```

> **Note**: Replace `YOUR_GEMINI_API_KEY_HERE` with your actual Google Gemini API key to enable the Yeti AI chatbot.

## Authentication

The application uses JWT-based authentication:
- Login credentials are sent to `/api/auth/login`
- JWT token is stored in localStorage
- Token is attached to all API requests via HTTP interceptor
- Admin routes are protected with AuthGuard

## Features

### Public Website
- **Homepage**: Full hero section with stats, services grid, **AI Agent showcase section**, featured treks, cultural tours, testimonials, photo gallery, FAQ accordion, and CTA — all in a clean bright cyan/teal theme
- All homepage content is dynamically driven by `SiteContentService` (editable via admin)
- Browse treks with filters
- View trek details
- Submit contact/booking enquiries
- Responsive design with Angular Material
- WhatsApp floating chat button
- **Yeti AI Chatbot**: Cute floating AI assistant powered by Google Gemini — answers visitor questions about treks, tours, company info, and travel tips with a friendly mountain personality
- Footer displays editable company info from SiteContentService

### Admin CRM
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
- **User Management**: Create/edit/delete (admin only)
- Protected routes with AuthGuard

### Site Content Architecture
- `SiteContent` model defines all editable sections (hero, stats, services, testimonials, FAQs, gallery, tours, CTA, company info)
- `SiteContentService` stores content in localStorage and exposes a reactive `content$` observable
- Homepage and footer subscribe to `content$` and update in real-time when content is changed in the editor
- "Reset to Defaults" button restores all original content

### Yeti AI Chatbot
- Cute floating chat widget (bottom-right corner) powered by Google Gemini 2.0 Flash
- **System Instructions**: Automatically fed company info, FAQs, services, tours, and testimonials from `SiteContentService` — the AI knows everything about the site!
- Quick-action buttons for common questions (Treks, Tours, Contact, Fitness)
- Typing animation, conversation history, and message timestamps
- Responsive design with smooth open/close animations
- Graceful fallback message when API key is not configured
- `ChatbotService` handles Gemini API communication and conversation state

## Database (Supabase)

All data is stored in a Supabase PostgreSQL database with Row Level Security (RLS) enabled.

### Tables
| Table | Rows | Description |
|-------|------|-------------|
| `categories` | 4 | Trek categories (High Altitude, Cultural, Tea House, Camping) |
| `treks` | 5 | Trek listings with details, pricing, itineraries |
| `bookings` | 2 | Customer booking enquiries with status tracking |
| `app_users` | 2 | Admin CRM users (admin + regular user) |
| `site_content` | 10 | All editable homepage sections stored as JSONB |

### RLS Policies
- **Public read** on `categories`, `treks`, `site_content` (visitors can browse)
- **Public insert** on `bookings` (visitors can submit enquiries)
- **Authenticated access** for all write/admin operations
- Supabase URL and anon key are configured in `src/environments/environment.ts`

## Demo Credentials

- **Username**: admin
- **Password**: admin

After login, you're redirected to `/admin/dashboard`.

## Deployment

This frontend can be deployed to:
- Netlify
- Vercel
- Firebase Hosting
- AWS S3 + CloudFront

Configure the production API URL and Supabase credentials in `src/environments/environment.prod.ts` before deployment.
