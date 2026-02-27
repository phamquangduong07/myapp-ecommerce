import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ===== LOGIN =====
  login(phoneNumber: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}/auth/login`,
      {
        phoneNumber,
        password
      }
    );
  }

  // ===== REFRESH TOKEN =====
  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}/auth/refreshToken`,
      {
        refreshToken
      }
    );
  }

  // ===== LOGOUT (optional) =====
  logout(): void {
    localStorage.clear();
    location.href = '/login';
  }
}
