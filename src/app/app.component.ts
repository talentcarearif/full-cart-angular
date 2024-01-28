import { Component, OnDestroy, OnInit} from '@angular/core';
import { CommonService } from './features/services/common.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './features/services/auth.service';
import { AuthModel } from './features/models/auth.model';
import { Router } from '@angular/router';
import { UserMaster } from './features/models/userMaster.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'full-cart'; 
  cartItemCount: number = 0;
  cartItemNull: any;
  cartSubs! : Subscription;
  logSubs?: Subscription;
  isLoggedIn$? : Observable<boolean>;
  isLoggedInSession: string = 'N';
  loginUser: string = '';
  loginUserName? : string;
  userInfo: UserMaster = {
    id : 0,
    firstName : '',
    lastName : '',
    email : '',
    password : '',
    mobile : '',
    address : '',
    userType : '',
    userRole : '',
    createDate : '' 
  };

  constructor(
    private commonService: CommonService,
    public authService: AuthService,
    public router: Router
    ) { 
  };  

  ngOnInit(): void {  
    this.cartItemCount = this.commonService.totalCartCount;  
    this.authInfo();             
    this.cartSubs = 
    this.commonService.cartCountEmitter.subscribe((newCount) => {    
      this.cartItemCount = newCount;
    });
  }  

  authInfo() {
    this.authService.authInfo?.subscribe((res:AuthModel) => {
      this.loginUser = localStorage.getItem('userEmail') ?? '';
      this.loginUserName = localStorage.getItem('userName') ?? '';
      this.userInfo.firstName = localStorage.getItem('userName') ?? '';
      this.userInfo.email = localStorage.getItem('userEmail') ?? '';
      this.userInfo.mobile = localStorage.getItem('userMobile') ?? '';
      this.userInfo.email = localStorage.getItem('userEmail') ?? '';
      this.userInfo.address = localStorage.getItem('userAddress') ?? '';
      this.userInfo.userRole = localStorage.getItem('userRole') ?? '';
      this.isLoggedInSession = localStorage.getItem('isLoggedInSession') ?? 'N';
      if (res.isAuthenticated) {
        this.isLoggedIn$ = this.authService.isLoggedIn;
      }     
    });
  }

  showShoppingCart() {
    if (this.isLoggedInSession == 'Y' && this.cartItemCount > 0) {
      this.commonService.refreshPage('/shopping-cart');
    }
  }

  showUserProfile() {
    this.router.navigateByUrl('/user-profile', {state: {loginUser: this.loginUser}});
  }

  showOrderDetails() {
    this.router.navigateByUrl('/orders-customer');
  }

  adminDashBoard() {
    this.router.navigateByUrl('/admin-dashboard', {state: {loginUser: this.loginUser}});
  }

  onLogout() {
    this.authService.logout();
    this.isLoggedInSession = 'N';
  }

  ngOnDestroy(): void {
    this.cartSubs?.unsubscribe();
    this.logSubs?.unsubscribe();
  }

}
