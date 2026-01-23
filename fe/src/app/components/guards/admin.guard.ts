import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { of,Observable } from 'rxjs';
import { UserResponse } from 'src/app/responses/user/user.response';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  userResponse?:UserResponse | null;
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private userService:UserService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() > 0;
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    const isAdmin = this.userResponse?.role.name == 'admin';
    debugger
    if (!isTokenExpired && isUserIdValid && isAdmin) {
      return true;
    } else {

      this.router.navigate(['/login']);
      return false;
    }
  }
}

export const AdminGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  debugger
  return inject(AdminGuard).canActivate(next, state);
}
