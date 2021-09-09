import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from '../models/user-data';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly mockUser: UserData = new UserData('admin', 'admin');
  isAuthenticated = false;

  constructor(private router: Router) { }

  authenticate(userData: UserData): boolean {
    if (this.checkCredentials(userData)) {
      this.isAuthenticated = true;
      this.router.navigateByUrl('/home', { state: userData });
      return true;
    }
    this.isAuthenticated = false;
    return false;
  }

  private checkCredentials(userData: UserData): boolean {
    return this.checkLogin(userData.getUserName()) && this.checkPassword(userData.getPassword());
  }

  private checkLogin(userName: string): boolean {
    return userName === this.mockUser.getUserName();
  }

  private checkPassword(password: string): boolean {
    return password === this.mockUser.getPassword();
  }

  logout() {
    this.isAuthenticated = false;
    this.router.navigate(['']);
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
