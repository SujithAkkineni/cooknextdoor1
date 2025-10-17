import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MealService } from '../../../services/meal';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  seller: {
    id: string;
    name: string;
    location: string;
  };
  available: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-meal-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './meal-list.html',
  styleUrl: './meal-list.scss'
})
export class MealListComponent implements OnInit {
  meals: Meal[] = [];
  loading = true;
  error = '';
  isLoggedIn = false;
  isDemoMode = false;

  constructor(
    private mealService: MealService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadMeals();
  }

  loadMeals(): void {
    this.loading = true;
    this.mealService.getMeals().subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.meals) {
          this.meals = response.meals;
        } else if (Array.isArray(response)) {
          this.meals = response;
        } else {
          this.meals = [];
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading meals:', error);
        this.error = 'Failed to load meals. Please try again.';
      }
    });
  }

  orderMeal(meal: Meal): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    // Navigate to order page or open order dialog
    this.router.navigate(['/orders'], {
      queryParams: { mealId: meal.id, action: 'order' }
    });
  }

  viewMealDetails(meal: Meal): void {
    this.router.navigate(['/meals', meal.id]);
  }

  formatPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }

  getCurrentUserRole(): string | null {
    // You can enhance this to get user role from token
    return localStorage.getItem('userRole') || null;
  }
}
