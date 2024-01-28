import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { FullCartService } from '../services/full-cart.service';
import { Subscription } from 'rxjs';
import { IApiResponse } from '../models/IApiResponse.model';
import { ShoppingCart } from '../models/shopping-cart.model';

@Component({
  selector: 'app-shoping-cart',
  templateUrl: './shoping-cart.component.html',
  styleUrl: './shoping-cart.component.scss'
})
export class ShopingCartComponent implements OnInit, OnDestroy {
  dataSub?: Subscription;
  addSubs? :Subscription;
  removeSubs? :Subscription;
  loginUser: string = '';
  cartList: ShoppingCart[] = [];

  constructor(
    public commonService: CommonService,
    public router : Router,
    private cartService: FullCartService,
  ) {}  

  ngOnInit(): void {
    this.loginUser = localStorage.getItem('userEmail') ?? '';
    this.getShoppingCartDetails();
  }

  getShoppingCartDetails() {
    this.dataSub =
    this.cartService.getUserShoppingCartDetails(this.loginUser).subscribe({
      next: (response: IApiResponse) =>{
        if (response.isExecuted) {
          this.cartList = response.data;
        }
        else {
          this.commonService.showErrorMsg(response.message);
        }
      },
      error: (error) => {
        this.commonService.showErrorMsg(error.message);
      }
    })
  }

  cartOrder() {
    this.router.navigateByUrl('/orders', { state: {cartComplete: 'Yes'}});
  }

  setCartToLocalStorage() {
    localStorage.setItem('cartCount',this.commonService.totalCartCount.toString()); 
  }

  addToCart(index: number, productId: number) {  
      this.addSubs =
      this.cartService.addToCartAsPerUser(this.loginUser, productId).subscribe({
        next: (response: IApiResponse) =>{
          if (response.isExecuted) {
            this.cartList[index].count += 1;          
            this.commonService.newAddToCartCount();
            this.setCartToLocalStorage();                   
          }
        },
        error: (error) => {
          this.commonService.showErrorMsg(error.message);
        }
      })
  }

  removeFromCart(index: number, productId: number) { 
      if (this.cartList[index].count > 0) { 
        this.removeSubs =
        this.cartService.removeFromCartAsPerUser(this.loginUser, productId).subscribe({
          next: (response: IApiResponse) =>{
            if (response.isExecuted) {
                this.cartList[index].count -= 1;  
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

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
    this.addSubs?.unsubscribe();
    this.removeSubs?.unsubscribe();
  }

}
