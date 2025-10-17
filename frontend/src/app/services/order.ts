import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5001/api/orders';

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

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getOrder(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createOrder(order: { mealId: string; quantity: number }): Observable<any> {
    return this.http.post(this.apiUrl, order, { headers: this.getHeaders() });
  }

  updateOrder(id: string, order: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, order, { headers: this.getHeaders() });
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
