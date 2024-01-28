import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent implements OnInit, OnDestroy {
  dataSub?: Subscription;
  stateData: any = null;
  loginUser: string = '';
  totalAmount: number = 0;

  constructor(
    public router: Router,
    public commonService: CommonService
  ) {
    this.stateData = this.router.getCurrentNavigation()?.extras.state ;
  } 

  ngOnInit(): void {
    if (this.stateData != null) { 
      this.loginUser = localStorage.getItem('userEmail') ?? '';
      this.totalAmount = this.stateData.totalAmount;      
    }
    else {
      this.commonService.showErrorMsg('No order information found');
      this.commonService.refreshPage('/');
    }
  }

  paymentOrder() {
    this.commonService.showSuccessMsg('Product Ordered Successfully');
  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
  }
}
