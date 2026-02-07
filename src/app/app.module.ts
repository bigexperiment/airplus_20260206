import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './core';

// Public Components
import { HomeComponent } from './public/home/home.component';
import { TrekListComponent } from './public/trek-list/trek-list.component';
import { TrekDetailComponent } from './public/trek-detail/trek-detail.component';
import { AboutComponent } from './public/about/about.component';
import { ContactComponent } from './public/contact/contact.component';

// Admin Components
import { LoginComponent } from './admin/login/login.component';
import { AuthCallbackComponent } from './admin/auth-callback/auth-callback.component';
import { AdminTrekListComponent } from './admin/treks/trek-list/trek-list.component';
import { TrekFormComponent } from './admin/treks/trek-form/trek-form.component';
import { BookingsComponent } from './admin/bookings/bookings.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { UsersComponent } from './admin/users/users.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { SiteContentComponent } from './admin/site-content/site-content.component';

@NgModule({
  declarations: [
    AppComponent,
    // Public Components
    HomeComponent,
    TrekListComponent,
    TrekDetailComponent,
    AboutComponent,
    ContactComponent,
    // Admin Components
    LoginComponent,
    AuthCallbackComponent,
    AdminTrekListComponent,
    TrekFormComponent,
    BookingsComponent,
    CategoriesComponent,
    UsersComponent,
    DashboardComponent,
    SiteContentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
