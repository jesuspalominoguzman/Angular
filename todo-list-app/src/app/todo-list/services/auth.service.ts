import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';

/**
 * Service responsible for handling authentication-related operations
 * Manages user authentication state and user data
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = 'authToken';
  private readonly CURRENT_USER_KEY = 'currentUser';
  private readonly USERS_KEY = 'registeredUsers';

  private users: User[] = [];

  isAuthenticatedSig = signal<boolean>(false);
  currentUserSig = signal<User | null>(null);

  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  currentUser$ = new BehaviorSubject<User | null>(null);

  constructor() {
    if (typeof window !== 'undefined') {
      this.users = this.loadUsersFromLocalStorage();
      this.isAuthenticatedSig.set(this.isAuthenticated());
      this.currentUserSig.set(this.getCurrentUser());
      this.isAuthenticated$.next(this.isAuthenticated());
      this.currentUser$.next(this.getCurrentUser());
    } else {
      // Note: This warning is important for debugging but not critical for app functionality
      // console.warn('localStorage is not available.');
    }
  }

  /**
   * Loads users from localStorage
   * @returns Array of registered users
   */
  private loadUsersFromLocalStorage(): User[] {
    try {
      const usersStr = localStorage.getItem(this.USERS_KEY);
      return usersStr ? JSON.parse(usersStr) : [];
    } catch (error) {
      console.error('Failed to load users from localStorage:', error);
      return [];
    }
  }

  /**
   * Saves users to localStorage
   */
  private saveUsersToLocalStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));
      } catch (error) {
        console.error('Failed to save users to localStorage:', error);
      }
    }
  }

  /**
   * Handles user registration
   * @param credentials User registration data
   * @returns Observable with registration result
   */
  signup(credentials: any): Observable<any> {
    const existingUser = this.users.find((u) => u.email === credentials.email);
    if (existingUser) {
      return of({ message: 'Mail already registered' }).pipe(delay(500));
    }

    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email: credentials.email,
      password: credentials.password,
    };
    this.users.push(newUser);
    this.saveUsersToLocalStorage();
    return of({ message: 'Successful signup' }).pipe(delay(500));
  }

  /**
   * Handles user login
   * @param credentials User login data
   * @returns Observable with login result
   */
  login(credentials: any): Observable<any> {
    const user = this.users.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      this.setAuthToken('fakeToken-' + user.id);
      this.setCurrentUser(user);
      this.isAuthenticatedSig.set(true);
      this.isAuthenticated$.next(true);
      this.currentUserSig.set(user);
      this.currentUser$.next(user);
      return of({ token: 'fakeToken-' + user.id, user }).pipe(delay(500));
    } else {
      return of({ message: 'Invalid credentials' }).pipe(delay(500));
    }
  }

  /**
   * Handles user logout
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
    this.isAuthenticatedSig.set(false);
    this.isAuthenticated$.next(false);
    this.currentUserSig.set(null);
    this.currentUser$.next(null);
  }

  /**
   * Gets the current authentication token
   * @returns The authentication token or null if not found
   */
  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.AUTH_TOKEN_KEY);
    }
    return null;
  }

  /**
   * Checks if user is authenticated
   * @returns Boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(this.AUTH_TOKEN_KEY);
    }
    return false;
  }

  /**
   * Gets the current user data
   * @returns The current user object or null if not found
   */
  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.CURRENT_USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  /**
   * Sets the authentication token
   * @param token The authentication token to store
   */
  private setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    }
  }

  /**
   * Sets the current user data
   * @param user The user object to store
   */
  private setCurrentUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }
  }
}
