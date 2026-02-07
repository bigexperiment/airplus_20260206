import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AdminGuard } from './core';

// Public Components
import { HomeComponent } from './public/home/home.component';
import { TrekListComponent } from './public/trek-list/trek-list.component';
import { TrekDetailComponent } from './public/trek-detail/trek-detail.component';
import { AboutComponent } from './public/about/about.component';
import { ContactComponent } from './public/contact/contact.component';

// Admin Components
import { LoginComponent } from './admin/login/login.component';
import { AdminTrekListComponent } from './admin/treks/trek-list/trek-list.component';
import { TrekFormComponent } from './admin/treks/trek-form/trek-form.component';
import { BookingsComponent } from './admin/bookings/bookings.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { UsersComponent } from './admin/users/users.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { SiteContentComponent } from './admin/site-content/site-content.component';

const routes: Routes = [
  // Public Routes
  { path: '', component: HomeComponent },
  { path: 'treks', component: TrekListComponent },
  { path: 'treks/:id', component: TrekDetailComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  // Admin Routes
  { path: 'admin/login', component: LoginComponent },
  { 
    path: 'admin/dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin/content', 
    component: SiteContentComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin/treks', 
    component: AdminTrekListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin/treks/new', 
    component: TrekFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin/treks/:id/edit', 
    component: TrekFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin/bookings', 
    component: BookingsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin/categories', 
    component: CategoriesComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin/users', 
    component: UsersComponent,
    canActivate: [AdminGuard]
  },

  // Redirect unknown routes to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
