import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any = null;
  featuredMeals = [
    {
      id: 'featured_1',
      name: 'Signature Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken',
      price: 18.99,
      chef: 'Chef Priya',
      rating: 4.8,
      image: 'https://via.placeholder.com/400x250?text=Butter+Chicken'
    },
    {
      id: 'featured_2',
      name: 'Artisan Pizza',
      description: 'Wood-fired pizza with fresh mozzarella and basil',
      price: 16.99,
      chef: 'Chef Mario',
      rating: 4.9,
      image: 'https://via.placeholder.com/400x250?text=Artisan+Pizza'
    },
    {
      id: 'featured_3',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center',
      price: 9.99,
      chef: 'Baker Sarah',
      rating: 4.7,
      image: 'https://via.placeholder.com/400x250?text=Lava+Cake'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUser = this.getCurrentUser();
    }
  }

  navigateToMeals(): void {
    this.router.navigate(['/meals']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.currentUser = null;
    this.router.navigate(['/']);
  }

  getCurrentUser(): any {
    // Get user info from token or localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  getUserRole(): string {
    return this.currentUser?.role || 'buyer';
  }
}
