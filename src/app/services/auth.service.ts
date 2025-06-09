import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  private isBrowser: boolean;

login(email: string, password: string): Observable<boolean> {
  return this.http.get<User[]>(`${this.apiUrl}/users?email=${email}&password=${password}`)
    .pipe(
      map(users => {
        if (users.length > 0) {
          this.currentUser = users[0];
          if (this.isBrowser) {
            localStorage.setItem('token', 'fake-jwt-token');
            localStorage.setItem('user', JSON.stringify(users[0]));
          }
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
}

register(user: User): Observable<boolean> {
  return this.http.post<User>(`${this.apiUrl}/users`, user)
    .pipe(
      tap(newUser => {
        this.currentUser = newUser;
        if (this.isBrowser) {
          localStorage.setItem('token', 'fake-jwt-token');
          localStorage.setItem('user', JSON.stringify(newUser));
        }
      }),
      map(() => true),
      catchError(() => of(false))
    );
}

logout(): void {
  this.currentUser = null;
  if (this.isBrowser) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

isAuthenticated(): boolean {
  if (!this.isBrowser) {
    return false;
  }
  return !!localStorage.getItem('token');
}

getCurrentUser(): User | null {
  if (!this.isBrowser) {
    return null;
  }
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

}