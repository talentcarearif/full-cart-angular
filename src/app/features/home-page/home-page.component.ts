import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FullCartService } from '../services/full-cart.service';
import { Observable, Subscription } from 'rxjs';
import { CommonService } from '../services/common.service';
import { IApiResponse } from '../models/IApiResponse.model';
import { AuthService } from '../services/auth.service';
import { AuthModel } from '../models/auth.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit, OnDestroy {
  dataSub!: Subscription;
  addSubs!: Subscription;
  removeSubs!: Subscription;
  cartSubs!: Subscription;
  productList: any = [];
  loginUser: string = '';
  isLoggedIn$? : Observable<boolean>;
  isLoggedInSession: string = 'N';
  chooseOrder: string = '';
  dataSource = new MatTableDataSource();
  
  constructor(
    private cartService: FullCartService,
    public commonService : CommonService,
    public authService : AuthService
  ) {}

  ngOnInit(): void { 
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.authInfo();
    this.getAllProductList();      
  }

  authInfo() {
    this.authService.authInfo?.subscribe((res:AuthModel) =>{
      this.loginUser = localStorage.getItem('userEmail') ?? '';
      this.isLoggedInSession = localStorage.getItem('isLoggedInSession') ?? 'N';
      if (res.isAuthenticated) {
        this.getTotalCartCount(); 
      }   
    });
  }

  getAllProductList() {
    this.dataSub =
    this.cartService.getAllProducts().subscribe({
      next: (response: IApiResponse) =>{
        if (response.isExecuted) {
          this.dataSource.data = response.data;
          this.productList = response.data;
        }
      },
      error: (error) => {
        this.commonService.showErrorMsg(error.message);
      }
    })
  }

  getTotalCartCount() {
      this.cartSubs =
      this.cartService.getTotalCartCount(this.loginUser).subscribe({
        next: (response: IApiResponse) =>{
          if (response.isExecuted) {
            this.commonService.updateCartCount(response.data);             
          }
        },
        error: (error) => {
          this.commonService.showErrorMsg(error.message);
        }
      })   
  }

  setCartToLocalStorage() {
    localStorage.setItem('cartCount',this.commonService.totalCartCount.toString()); 
  }

  addToCart(index: number, productId: number) {  
    if (this.isLoggedInSession == 'Y') {
      this.addSubs =
      this.cartService.addToCartAsPerUser(this.loginUser, productId).subscribe({
        next: (response: IApiResponse) =>{
          if (response.isExecuted) {
            this.productList[index]['cartCount'] += 1;          
            this.commonService.newAddToCartCount();
            this.setCartToLocalStorage();                   
          }
        },
        error: (error) => {
          this.commonService.showErrorMsg(error.message);
        }
      })
    }
  }

  removeFromCart(index: number, productId: number) { 
    if (this.isLoggedInSession == 'Y') {
      if (this.productList[index]['cartCount'] > 0) { 
        this.removeSubs =
        this.cartService.removeFromCartAsPerUser(this.loginUser, productId).subscribe({
          next: (response: IApiResponse) =>{
            if (response.isExecuted) {
                this.productList[index]['cartCount'] -= 1;  
                this.commonService.newRemoveFromCartCount();
                this.setCartToLocalStorage();                                        
            }
          },
          error: (error) => {
            this.commonService.showErrorMsg(error.message);
          }
        })
      }
    }
  }

  orderProductList(priceHigherLower: string) {
    if (priceHigherLower == 'H') {
      this.productList = [];
      this.dataSource.filteredData.sort((a: any, b:any) => b.price - a.price);
      this.productList = this.dataSource.filteredData;
    }
    else if (priceHigherLower == 'L') {
      this.productList = [];
      this.dataSource.filteredData.sort((a: any, b:any) => a.price - b.price);
      this.productList = this.dataSource.filteredData;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.productList = this.dataSource.filteredData;
  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
    this.addSubs?.unsubscribe();
    this.removeSubs?.unsubscribe();
    this.cartSubs?.unsubscribe();
  }
}
