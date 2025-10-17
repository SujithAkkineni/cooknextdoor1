import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MealService } from '../../../services/meal';
import { OrderService } from '../../../services/order';
import { AuthService } from '../../../services/auth';

interface SellerStats {
  totalMeals: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

@Component({
  selector: 'app-seller-dashboard',
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
  templateUrl: './seller-dashboard.html',
  styleUrl: './seller-dashboard.scss'
})
export class SellerDashboardComponent implements OnInit {
  currentUser: any = null;
  loading = true;
  activeTab = 0;

  // Stats
  stats: SellerStats = {
    totalMeals: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  };

  // Data
  meals: any[] = [];
  orders: any[] = [];

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

    // Load meals and orders in parallel
    this.loadMeals();
    this.loadOrders();
  }

  loadMeals(): void {
    this.mealService.getMeals().subscribe({
      next: (response: any) => {
        if (response.meals) {
          // Filter meals for current seller in demo mode
          this.meals = response.meals.filter((meal: any) =>
            meal.seller?.id === this.currentUser.id || meal.seller === this.currentUser.id
          );
        } else {
          this.meals = [];
        }
        this.updateStats();
      },
      error: (error) => {
        console.error('Error loading meals:', error);
        this.meals = [];
      }
    });
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (response: any) => {
        if (response.orders) {
          // Filter orders for current seller
          this.orders = response.orders.filter((order: any) =>
            order.seller?.id === this.currentUser.id || order.seller === this.currentUser.id
          );
        } else {
          this.orders = [];
        }
        this.updateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.orders = [];
        this.loading = false;
      }
    });
  }

  updateStats(): void {
    this.stats = {
      totalMeals: this.meals.length,
      totalOrders: this.orders.length,
      pendingOrders: this.orders.filter(order => order.status === 'pending').length,
      completedOrders: this.orders.filter(order => order.status === 'delivered').length
    };
  }

  navigateToAddMeal(): void {
    this.router.navigate(['/meals'], { queryParams: { action: 'add' } });
  }

  editMeal(meal: any): void {
    this.router.navigate(['/meals'], {
      queryParams: { action: 'edit', mealId: meal.id }
    });
  }

  deleteMeal(meal: any): void {
    if (confirm('Are you sure you want to delete this meal?')) {
      this.mealService.deleteMeal(meal.id).subscribe({
        next: () => {
          this.snackBar.open('Meal deleted successfully!', 'Close', { duration: 3000 });
          this.loadMeals();
        },
        error: (error) => {
          console.error('Error deleting meal:', error);
          this.snackBar.open('Failed to delete meal. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  updateOrderStatus(order: any, status: string): void {
    this.orderService.updateOrder(order.id, { status }).subscribe({
      next: () => {
        this.snackBar.open(`Order ${status} successfully!`, 'Close', { duration: 3000 });
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order:', error);
        this.snackBar.open('Failed to update order status.', 'Close', { duration: 3000 });
      }
    });
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
