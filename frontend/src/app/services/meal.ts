import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private apiUrl = 'http://localhost:5001/api/meals';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let token = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('token');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getMeals(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getMeal(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createMeal(meal: { name: string; description: string; price: number; image?: string }): Observable<any> {
    return this.http.post(this.apiUrl, meal, { headers: this.getHeaders() });
  }

  updateMeal(id: string, meal: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, meal, { headers: this.getHeaders() });
  }

  deleteMeal(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
