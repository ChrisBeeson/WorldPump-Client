import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,  CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppManagerService } from '../services/app-manager.service';


@Injectable({
  providedIn: 'root'
})
export class RunCountGuard implements CanActivate{
  
    constructor(private router: Router, private appManager:AppManagerService) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): | Observable <boolean | UrlTree> | Promise <boolean | UrlTree> | boolean | UrlTree {
  
      return this.appManager.runCount().then(count => {
        if (count<10000)  { return Promise.resolve(true) }
        else {  
          this.router.navigate(['/login']);
          return Promise.resolve(false);}
      });
  }
}
  