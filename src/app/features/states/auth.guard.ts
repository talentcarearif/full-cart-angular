export class AuthGuard {

}

// import { Injectable } from '@angular/core'
// import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
// import { Observable } from 'rxjs'
// import { AuthService } from '../services/auth.service'

// @Injectable()
// export class AuthGuard implements CanActivate {

//   constructor(private authService: AuthService, 
//               private router: Router,              
//               ) {}
  
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
//     return this.authService?.isLoggedIn?.subscribe(((isLoggedIn : boolean) => {
//             if (isLoggedIn) {
//                 // Routing Path Add here//                                                    
//                   return true;               
//             } else {
//                 this.router.navigate(['/login']);
//                 return false;
//             }
//         })
//     )
//   }
// }
