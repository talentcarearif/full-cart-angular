import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { FullCartService } from '../services/full-cart.service';
import { ShoppingCart } from '../models/shopping-cart.model';
import { Subscription } from 'rxjs';
import { IApiResponse } from '../models/IApiResponse.model';
import { UserMaster } from '../models/userMaster.model';
import { OrderSummary } from '../models/orderSummary.model';

@Component({
  selector: 'app-order',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy {
  dataSub?: Subscription;
  addSubs? :Subscription;
  orderSubs? :Subscription;
  stateData: any = null;
  loginUser: string = '';
  cartList: ShoppingCart[] = [];
  orderSummary: OrderSummary = {
    totalItem :0,
    totalPayment : 0,
    deliveryFee : 0,
  };
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
    private cartService: FullCartService,
    public router: Router,
    public commonService: CommonService
  ) {
    this.stateData = this.router.getCurrentNavigation()?.extras.state ;
  }

  ngOnInit(): void {
    if (this.stateData != null) { 
      this.loginUser = localStorage.getItem('userEmail') ?? '';
      this.userInfo.firstName = localStorage.getItem('userName') ?? '';
      this.userInfo.email = localStorage.getItem('userEmail') ?? '';
      this.userInfo.mobile = localStorage.getItem('userMobile') ?? '';
      this.userInfo.email = localStorage.getItem('userEmail') ?? '';
      this.userInfo.address = localStorage.getItem('userAddress') ?? '';
      this.getShoppingCartDetails();      
    }
    else {
      this.commonService.showErrorMsg('No shopping cart information found');
      this.commonService.refreshPage('/');
    }
  }

  getShoppingCartDetails() {
    this.dataSub =
    this.cartService.getUserShoppingCartDetails(this.loginUser).subscribe({
      next: (response: IApiResponse) =>{
        if (response.isExecuted) {
          this.cartList = response.data;
          this.orderSummary.totalItem = this.cartList?.length;
          this.orderSummary.totalPayment = 0;
          for(let i of this.cartList) {
            this.orderSummary.totalPayment += i.price;
          }
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

  confirmOrder() {
    this.orderSubs =
    this.cartService.submitOrderDetails(this.loginUser).subscribe({
      next: (response: IApiResponse) =>{
        if (response.isExecuted) {
          localStorage.removeItem("cartCount"); 
          this.commonService.updateCartCount(0);
          this.router.navigateByUrl('/payments', { state: {totalAmount: this.orderSummary.totalPayment}});
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

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
    this.addSubs?.unsubscribe();
    this.orderSubs?.unsubscribe();
  }

}
