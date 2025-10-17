import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'seller-dashboard', loadComponent: () => import('./components/seller/seller-dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent) },
  { path: 'buyer-dashboard', loadComponent: () => import('./components/buyer/buyer-dashboard/buyer-dashboard.component').then(m => m.BuyerDashboardComponent) },
  { path: 'meals', loadComponent: () => import('./components/meals/meal-list/meal-list.component').then(m => m.MealListComponent) },
  { path: 'orders', loadComponent: () => import('./components/orders/order-list/order-list.component').then(m => m.OrderListComponent) },
  { path: '**', redirectTo: '/home' }
];
