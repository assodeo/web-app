import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, UrlSegment } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { LoginCredentials } from '../models/login-credentials.model';
import { RegistrationDetails } from '../models/registration-details.model';
import { Token } from '../models/token.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/auth';

  constructor(private readonly http: HttpClient, private readonly router: Router) { }

  /**
   * Checks if the user is authenticated.
   *
   * @returns `true` if the user is authenticated, `false` otherwise.
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Logs the user in.
   *
   * @param credentials thee user's login credentials
   * @returns an observable that emits the JWT token
   */
  login(credentials: LoginCredentials): Observable<Token> {
    return this.http.post<Token>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(({ token }: Token) => {
          localStorage.setItem('app.token', token);
        })
      );
  }

  /**
   * Logs the user out.
   *
   * @param url the url to navigate to after logging back in
   */
  logout(url: UrlSegment[]): void {
    localStorage.removeItem('app.token');

    const redirect = url.join('/');
    void this.router.navigate(['/login'], { queryParams: { redirect } });
  }

  /**
   * Registers a new user.
   *
   * @param details the user's registration details
   * @returns an observable that emits the registered user
   */
  register(details: RegistrationDetails): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, details);
  }

  /**
   * Retrieves the JWT token from the local storage.
   *
   * @returns the JWT token or `null` if the user is not authenticated
   */
  getToken(): string | null {
    return localStorage.getItem('app.token');
  }
}
