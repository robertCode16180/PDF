import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SercoAuthService } from '../../login/services/serco-auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private sercoAuthService: SercoAuthService,
                private router: Router,
                 ) { /******* private localStorageManager: LocalStoreManager *******/

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
          const url: string = state.url;
          return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
      if (this.sercoAuthService.isLoggedIn) {
          return true;
      }
      this.sercoAuthService.loginRedirectUrl = url;
      this.router.navigate(['/login']);
      return false;
    }

}
