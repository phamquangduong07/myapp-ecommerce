import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../services/user.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard {

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const user = this.userService.getUserResponseFromLocalStorage();

    const isLoggedIn = !!user;
    const isAdmin = user?.roles?.includes('ROLE_ADMIN')
                 || user?.role?.name?.toLowerCase() === 'admin';

    if (isLoggedIn && isAdmin) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}

export const AdminGuardFn: CanActivateFn = (next, state) => {
  return inject(AdminGuard).canActivate(next, state);
};
