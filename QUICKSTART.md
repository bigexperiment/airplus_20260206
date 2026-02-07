# ⚡ Quick Start Guide

Get the Trekking Nepal Angular app running in 3 minutes!

## 🚀 Installation

```bash
# Navigate to project directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at **http://localhost:4200/**

## 🎯 Try It Out

### Public Website
1. **Home Page** - http://localhost:4200/
2. **Browse Treks** - http://localhost:4200/treks
3. **View Trek Details** - Click any trek card
4. **About Us** - http://localhost:4200/about
5. **Contact** - http://localhost:4200/contact

### Admin Dashboard
1. Go to **http://localhost:4200/admin/login**
2. Login with:
   - **Username:** `admin`
   - **Password:** `admin`
3. Explore:
   - Trek Management
   - Bookings
   - Categories
   - Users (Admin only)

## 📦 What You Get

✅ **5 Public Pages** - Home, Treks, Trek Detail, About, Contact  
✅ **6 Admin Pages** - Login, Trek CRUD, Bookings, Categories, Users  
✅ **Mock Data** - Works without backend  
✅ **Material UI** - Beautiful, responsive design  
✅ **Authentication** - JWT-based login  
✅ **CRUD Operations** - Full create, read, update, delete  

## 🔌 Connect to Backend

When your Java Spring Boot backend is ready:

1. **Update API URL** in `src/environments/environment.ts`:
   ```typescript
   apiUrl: 'http://localhost:8080/api'
   ```

2. **Uncomment real HTTP calls** in service files (see `API_INTEGRATION.md`)

3. **Remove mock data** arrays from services

4. **Test!** 🎉

## 📚 Documentation

- **Full Setup Guide:** `SETUP.md`
- **Backend Integration:** `API_INTEGRATION.md`
- **Project Overview:** `README.md`
- **Complete Summary:** `PROJECT_SUMMARY.md`

## 🛠️ Common Commands

```bash
# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
ng lint
```

## 🎨 Customize

- **Colors:** Update Material theme in `angular.json`
- **Styles:** Edit `src/styles.scss`
- **Logo:** Replace in header component
- **Content:** Update component templates

## ❓ Need Help?

Check the documentation files or review the code - it's well-commented and follows Angular best practices!

**Happy Coding! 🚀**
