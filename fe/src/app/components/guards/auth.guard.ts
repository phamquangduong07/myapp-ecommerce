import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn } from '@angular/router';

import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../../services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardFn {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(): boolean {

    const token = this.tokenService.getToken();

    if (token) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
