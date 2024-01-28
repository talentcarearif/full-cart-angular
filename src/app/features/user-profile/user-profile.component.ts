import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { UserMaster } from '../models/userMaster.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  stateData: any = null;
  loginUser: string = '';
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
    public router: Router,
    public commonService: CommonService
  ) {
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
    if (this.stateData != null) {
      this.loginUser = this.stateData?.loginUser;
      this.userInfo.firstName = localStorage.getItem('userName') ?? '';
      this.userInfo.email = localStorage.getItem('userEmail') ?? '';
      this.userInfo.mobile = localStorage.getItem('userMobile') ?? '';
      this.userInfo.email = localStorage.getItem('userEmail') ?? '';
      this.userInfo.address = localStorage.getItem('userAddress') ?? '';
    }
    else {
      this.commonService.showErrorMsg('Please press over your user name');
      this.commonService.refreshPage('/');
    }
  }

  ngOnDestroy(): void {
  }
 
}
