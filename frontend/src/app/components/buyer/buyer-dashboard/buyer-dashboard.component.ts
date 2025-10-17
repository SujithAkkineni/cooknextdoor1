import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MealService } from '../../../services/meal';
import { OrderService } from '../../../services/order';
import { AuthService } from '../../../services/auth';

interface BuyerStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  favoriteMeals: number;
}

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './buyer-dashboard.html',
  styleUrl: './buyer-dashboard.scss'
})
export class BuyerDashboardComponent implements OnInit {
  currentUser: any = null;
  loading = true;
  activeTab = 0;

  // Stats
  stats: BuyerStats = {
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    favoriteMeals: 0
  };

  // Data
  recentOrders: any[] = [];
  availableMeals: any[] = [];
  favoriteMeals: any[] = [];

  constructor(
    private mealService: MealService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load orders and meals in parallel
    this.loadOrders();
    this.loadAvailableMeals();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (response: any) => {
        if (response.orders) {
          // Filter orders for current buyer
          this.recentOrders = response.orders.filter((order: any) =>
            order.buyer?.id === this.currentUser.id || order.buyer === this.currentUser.id
          ).slice(0, 5); // Show only recent 5 orders
        } else {
          this.recentOrders = [];
        }
        this.updateStats();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.recentOrders = [];
      }
    });
  }

  loadAvailableMeals(): void {
    this.mealService.getMeals().subscribe({
      next: (response: any) => {
        if (response.meals) {
          this.availableMeals = response.meals.filter((meal: any) => meal.available).slice(0, 6);
          this.favoriteMeals = response.meals.filter((meal: any) => meal.available).slice(0, 3);
        } else {
          this.availableMeals = [];
          this.favoriteMeals = [];
        }
        this.updateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading meals:', error);
        this.availableMeals = [];
        this.favoriteMeals = [];
        this.loading = false;
      }
    });
  }

  updateStats(): void {
    this.stats = {
      totalOrders: this.recentOrders.length,
      pendingOrders: this.recentOrders.filter(order => order.status === 'pending').length,
      deliveredOrders: this.recentOrders.filter(order => order.status === 'delivered').length,
      favoriteMeals: this.favoriteMeals.length
    };
  }

  browseAllMeals(): void {
    this.router.navigate(['/meals']);
  }

  orderMeal(meal: any): void {
    this.router.navigate(['/orders'], {
      queryParams: { mealId: meal.id, action: 'order' }
    });
  }

  viewOrderDetails(order: any): void {
    this.router.navigate(['/orders'], {
      queryParams: { orderId: order.id }
    });
  }

  reorderMeal(order: any): void {
    this.orderMeal(order.meal);
  }

  getCurrentUser(): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
