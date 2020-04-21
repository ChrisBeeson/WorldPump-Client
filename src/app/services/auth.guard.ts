import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {


      return this.authService.user$.pipe(
        take(1),
        map(user => !!user),
        tap(loggedIn => {
          if (!loggedIn) {
            console.log('[AuthGuard] Access denied, You are not logged In.');
            this.router.navigate(['/login']);
            return false;
          }
          console.log('[AuthGuard] You are logged In');
          return true;
        })
      );
      

      
      /*
    return new Promise(async (resolve, reject) => {
      try {
        const user = this.authService.getUser();
        if (user) {
          console.log("Found User:"+user.uid);
          resolve(true);
        } else {
          console.log("" )
          reject('No user logged in');
          this.router.navigateByUrl('/login');
        }
      } catch (error) {
        reject(error);
      }
    });
    
*/
  }
}
