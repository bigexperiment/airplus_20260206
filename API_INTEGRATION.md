# API Integration Guide

This document explains how to connect the Angular frontend to your Java Spring Boot backend.

## 🔗 Current State

The frontend currently uses **mock data** in the services. This allows development and testing without a backend.

## 🎯 Backend API Endpoints Expected

### Authentication
```
POST /api/auth/login
Body: { username: string, password: string }
Response: { token: string, user: User }
```

### Treks
```
GET    /api/treks              - Get all treks (with optional filters)
GET    /api/treks/:id          - Get trek by ID
POST   /api/treks              - Create new trek
PUT    /api/treks/:id          - Update trek
DELETE /api/treks/:id          - Delete trek
```

### Bookings
```
GET    /api/bookings           - Get all bookings
GET    /api/bookings/:id       - Get booking by ID
POST   /api/bookings           - Create booking
PATCH  /api/bookings/:id/status - Update booking status
DELETE /api/bookings/:id       - Delete booking
```

### Categories
```
GET    /api/categories         - Get all categories
GET    /api/categories/:id     - Get category by ID
POST   /api/categories         - Create category
PUT    /api/categories/:id     - Update category
DELETE /api/categories/:id     - Delete category
```

### Users
```
GET    /api/users              - Get all users
GET    /api/users/:id          - Get user by ID
POST   /api/users              - Create user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
```

## 🔧 Step-by-Step Integration

### Step 1: Configure API URL

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // Your backend URL
};
```

### Step 2: Enable CORS on Backend

Your Spring Boot backend needs to allow requests from the Angular frontend:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:4200")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Step 3: Update Auth Service

In `src/app/services/auth.service.ts`, replace the mock login:

**Current (Mock):**
```typescript
login(credentials: LoginRequest): Observable<LoginResponse> {
  return new Observable(observer => {
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        const response: LoginResponse = { /* mock data */ };
        observer.next(response);
      }
    }, 500);
  });
}
```

**Replace with:**
```typescript
login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
    .pipe(
      tap(response => this.setSession(response)),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
}
```

### Step 4: Update Trek Service

In `src/app/services/trek.service.ts`:

**Current (Mock):**
```typescript
getAllTreks(filter?: TrekFilter): Observable<Trek[]> {
  return of(this.mockTreks);
}
```

**Replace with:**
```typescript
getAllTreks(filter?: TrekFilter): Observable<Trek[]> {
  let params = new HttpParams();
  if (filter) {
    Object.keys(filter).forEach(key => {
      const value = filter[key as keyof TrekFilter];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
  }
  return this.http.get<Trek[]>(this.apiUrl, { params });
}

getTrekById(id: number): Observable<Trek> {
  return this.http.get<Trek>(`${this.apiUrl}/${id}`);
}

createTrek(trek: Partial<Trek>): Observable<Trek> {
  return this.http.post<Trek>(this.apiUrl, trek);
}

updateTrek(id: number, trek: Partial<Trek>): Observable<Trek> {
  return this.http.put<Trek>(`${this.apiUrl}/${id}`, trek);
}

deleteTrek(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
```

**Remove mock data:**
```typescript
// Delete this entire array
private mockTreks: Trek[] = [ /* ... */ ];
```

### Step 5: Update Booking Service

In `src/app/services/booking.service.ts`:

```typescript
getAllBookings(): Observable<Booking[]> {
  return this.http.get<Booking[]>(this.apiUrl);
}

getBookingById(id: number): Observable<Booking> {
  return this.http.get<Booking>(`${this.apiUrl}/${id}`);
}

createBooking(booking: BookingRequest): Observable<Booking> {
  return this.http.post<Booking>(this.apiUrl, booking);
}

updateBookingStatus(id: number, status: BookingStatus): Observable<Booking> {
  return this.http.patch<Booking>(`${this.apiUrl}/${id}/status`, { status });
}

deleteBooking(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
```

### Step 6: Update Category Service

In `src/app/services/category.service.ts`:

```typescript
getAllCategories(): Observable<Category[]> {
  return this.http.get<Category[]>(this.apiUrl);
}

getCategoryById(id: number): Observable<Category> {
  return this.http.get<Category>(`${this.apiUrl}/${id}`);
}

createCategory(category: Partial<Category>): Observable<Category> {
  return this.http.post<Category>(this.apiUrl, category);
}

updateCategory(id: number, category: Partial<Category>): Observable<Category> {
  return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
}

deleteCategory(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
```

### Step 7: Update User Service

In `src/app/services/user.service.ts`:

```typescript
getAllUsers(): Observable<User[]> {
  return this.http.get<User[]>(this.apiUrl);
}

getUserById(id: number): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/${id}`);
}

createUser(user: RegisterRequest): Observable<User> {
  return this.http.post<User>(this.apiUrl, user);
}

updateUser(id: number, user: Partial<User>): Observable<User> {
  return this.http.put<User>(`${this.apiUrl}/${id}`, user);
}

deleteUser(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
```

## 🧪 Testing the Integration

### 1. Start Backend
```bash
# In your Spring Boot project
./mvnw spring-boot:run
```

### 2. Start Frontend
```bash
# In this Angular project
npm start
```

### 3. Test Authentication
1. Go to `http://localhost:4200/admin/login`
2. Enter credentials
3. Check browser Network tab for API call
4. Verify JWT token in localStorage

### 4. Test CRUD Operations
1. Navigate to admin sections
2. Try creating, reading, updating, deleting
3. Monitor Network tab for API calls
4. Check for errors in console

## 🐛 Common Issues

### CORS Errors
**Error:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:** Configure CORS on backend (see Step 2)

### 401 Unauthorized
**Error:** API returns 401 status

**Solution:** 
- Check JWT token is being sent in headers
- Verify token is valid
- Check AuthInterceptor is working

### 404 Not Found
**Error:** API endpoint not found

**Solution:**
- Verify backend is running
- Check API URL in environment.ts
- Confirm endpoint paths match backend

### Network Error
**Error:** "Http failure response for..."

**Solution:**
- Check backend is running
- Verify API URL is correct
- Check firewall/network settings

## 📋 Verification Checklist

- [ ] Backend is running on correct port
- [ ] CORS is configured on backend
- [ ] API URL is correct in environment.ts
- [ ] All mock data removed from services
- [ ] HTTP calls uncommented in services
- [ ] JWT token stored in localStorage
- [ ] AuthInterceptor attaching token to requests
- [ ] Login works and redirects properly
- [ ] CRUD operations work for all entities
- [ ] Error handling displays user-friendly messages
- [ ] Loading states show during API calls

## 🔐 Security Notes

1. **Never commit sensitive data** (API keys, passwords)
2. **Use environment variables** for production
3. **Validate all inputs** on both frontend and backend
4. **Implement proper error handling**
5. **Use HTTPS** in production
6. **Set secure token expiration**
7. **Implement refresh token** mechanism

## 📊 Data Model Alignment

Ensure your backend models match the frontend interfaces:

### Trek Model
```typescript
interface Trek {
  id: number;
  name: string;
  region: string;
  difficulty: string;
  days: number;
  price: number;
  summary: string;
  itinerary: string;
  bestSeason: string;
  imageUrl: string;
  categoryId?: number;
}
```

### User Model
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  fullName?: string;
}
```

### Booking Model
```typescript
interface Booking {
  id: number;
  trekId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfPeople: number;
  preferredDate: Date;
  message?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}
```

## 🚀 Production Deployment

### Environment Configuration

Create `environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api'
};
```

### Build for Production
```bash
npm run build -- --configuration production
```

### Deploy
- Upload `dist/` folder to your hosting service
- Configure environment variables
- Set up SSL certificate
- Test all functionality

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify backend logs
4. Review this guide
5. Check Angular and Spring Boot documentation
