import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: UserModel | null = null;
  login(user: UserModel): void {
    this.currentUser = user;
  }
  logout(): void {
    this.currentUser = null;
  }
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
  getCurrentUser(): UserModel | null {
    return this.currentUser;
  }
}
