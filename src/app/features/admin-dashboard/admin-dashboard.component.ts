import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { UserMaster } from '../models/userMaster.model';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
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
  showComponent: string = '';
  componentData: any;
  @Output() emitComponentData = new EventEmitter<number>();

  constructor(
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
      this.userInfo.userRole = localStorage.getItem('userRole') ?? '';
      if (this.userInfo.userRole != 'Admin') {
        this.commonService.showErrorMsg('Only an admin can access this page');
        this.commonService.refreshPage('/');
      }
      else {
        if (this.stateData?.component != null) {
          this.showComponent = this.stateData?.component;
          if (this.stateData?.data != null) {
            this.componentData = this.stateData?.data;
          }
        }      
      }
    }
    else {
      this.commonService.showErrorMsg('Click Admin dashboard to access this page');
      this.commonService.refreshPage('/');
    }
  }

  changeComponent(value:string) {
    this.showComponent = value;
  }

  activeClass(category: string) {
    if (this.showComponent == category) {
      return 'active';
    }
    else {
      return '';
    }
  }


  ngOnDestroy(): void {
  }
}
