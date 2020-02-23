import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  private token: string = "";

  constructor(private router: Router) { }

  canActivate() {
    // If the user is not logged in we'll send them back to the home page
    if (this.token.length <= 0) {
        console.log('No estás logueado');
        this.router.navigate(['/']);
        return false;
    }
    return true;
  }

  logOut() {
    this.token = "";
    this.router.navigate(['/']);
  }

  getToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
  }

}
