# Trekking Nepal - Angular Frontend Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm start
```

The application will be available at `http://localhost:4200/`

## 📁 Project Structure

```
src/app/
├── core/                    # Core functionality
│   ├── guards/             # Route guards (AuthGuard, AdminGuard)
│   └── interceptors/       # HTTP interceptors (AuthInterceptor)
├── shared/                 # Shared components and modules
│   ├── components/         # Header, Footer
│   └── shared.module.ts    # Shared module with Material components
├── models/                 # TypeScript interfaces
│   ├── trek.model.ts
│   ├── user.model.ts
│   ├── booking.model.ts
│   └── category.model.ts
├── services/               # API services
│   ├── auth.service.ts
│   ├── trek.service.ts
│   ├── booking.service.ts
│   ├── category.service.ts
│   └── user.service.ts
├── public/                 # Public-facing pages
│   ├── home/
│   ├── trek-list/
│   ├── trek-detail/
│   ├── about/
│   └── contact/
└── admin/                  # Admin dashboard pages
    ├── login/
    ├── treks/
    │   ├── trek-list/
    │   └── trek-form/
    ├── bookings/
    ├── categories/
    └── users/
```

## 🔐 Authentication

### Demo Credentials
- **Username:** admin
- **Password:** admin

### How It Works
1. Login at `/admin/login`
2. JWT token stored in localStorage
3. Token attached to API requests via HTTP interceptor
4. Protected routes use AuthGuard and AdminGuard

## 🌐 Routes

### Public Routes
- `/` - Home page
- `/treks` - Trek listing with filters
- `/treks/:id` - Trek details with booking form
- `/about` - About us page
- `/contact` - Contact form

### Admin Routes (Protected)
- `/admin/login` - Admin login
- `/admin/treks` - Trek management (list)
- `/admin/treks/new` - Create new trek
- `/admin/treks/:id/edit` - Edit trek
- `/admin/bookings` - Booking management
- `/admin/categories` - Category management
- `/admin/users` - User management (Admin only)

## 🔧 Configuration

### API Endpoint
Update the API URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // Change to your backend URL
};
```

For production, update `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

## 📊 Mock Data

Currently, the application uses **mock data** in the services. This allows you to:
- Test the UI without a backend
- Develop frontend independently
- Demonstrate functionality

### Switching to Real API

To connect to your Java Spring Boot backend:

1. **Update Service Methods**
   
   In each service file (e.g., `trek.service.ts`), uncomment the real HTTP calls:

   ```typescript
   // Replace this:
   return of(this.mockTreks);
   
   // With this:
   return this.http.get<Trek[]>(this.apiUrl);
   ```

2. **Remove Mock Data**
   
   Delete the mock data arrays from service files once backend is ready.

3. **Update Auth Service**
   
   In `auth.service.ts`, replace the mock login with:
   
   ```typescript
   login(credentials: LoginRequest): Observable<LoginResponse> {
     return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
       .pipe(tap(response => this.setSession(response)));
   }
   ```

## 🎨 Styling

- **Framework:** Angular Material
- **Theme:** Indigo-Pink (customizable in `angular.json`)
- **Global Styles:** `src/styles.scss`
- **Component Styles:** Each component has its own `.scss` file

### Customizing Theme

To change the Material theme, update `angular.json`:

```json
"styles": [
  "@angular/material/prebuilt-themes/purple-green.css",
  "src/styles.scss"
]
```

Available themes:
- `indigo-pink.css`
- `deeppurple-amber.css`
- `pink-bluegrey.css`
- `purple-green.css`

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test -- --code-coverage
```

## 🏗️ Building for Production

```bash
# Build for production
npm run build

# Output will be in dist/ folder
```

## 📦 Deployment

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist/trekking-nepal-frontend`

### Vercel
1. Framework preset: Angular
2. Build command: `npm run build`
3. Output directory: `dist/trekking-nepal-frontend`

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔌 Backend Integration Checklist

- [ ] Update `environment.ts` with backend API URL
- [ ] Replace mock data with real HTTP calls in services
- [ ] Test authentication flow
- [ ] Verify CORS settings on backend
- [ ] Test all CRUD operations
- [ ] Handle error responses appropriately
- [ ] Add loading states for API calls

## 📝 Features Implemented

### Public Website
✅ Home page with featured treks  
✅ Trek listing with filters (region, difficulty, days)  
✅ Trek detail page with booking form  
✅ About page  
✅ Contact form  
✅ Responsive design  
✅ Material UI components  

### Admin Dashboard
✅ Login with JWT authentication  
✅ Trek CRUD operations  
✅ Booking management with status updates  
✅ Category management  
✅ User management (Admin only)  
✅ Protected routes with guards  
✅ Data tables with sorting and pagination  
✅ Search and filter functionality  

### Technical Features
✅ Angular 16+  
✅ Angular Material  
✅ Reactive Forms  
✅ HTTP Interceptor for auth  
✅ Route Guards  
✅ Service layer architecture  
✅ TypeScript interfaces  
✅ SCSS styling  
✅ Responsive layout  

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4200
lsof -ti:4200 | xargs kill -9

# Or use a different port
ng serve --port 4300
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Angular CLI Not Found
```bash
# Install Angular CLI globally
npm install -g @angular/cli
```

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Development Workflow

1. **Feature Development**
   - Create feature branch
   - Develop with mock data
   - Test UI/UX
   - Commit changes

2. **Backend Integration**
   - Update service methods
   - Test with real API
   - Handle errors
   - Update documentation

3. **Testing**
   - Unit tests for components
   - Integration tests for services
   - E2E tests for critical flows

4. **Deployment**
   - Build production bundle
   - Deploy to hosting platform
   - Configure environment variables
   - Monitor for errors

## 💡 Tips

- Use Angular DevTools browser extension for debugging
- Keep components small and focused
- Use services for business logic
- Follow Angular style guide
- Write meaningful commit messages
- Document complex logic

## 📞 Support

For issues or questions:
- Check the README.md
- Review Angular documentation
- Check browser console for errors
- Verify API endpoint configuration
