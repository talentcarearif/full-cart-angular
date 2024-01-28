import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserRole } from '../../features/models/userRole.model';
import { AuthService } from '../../features/services/auth.service';
import { Router } from '@angular/router';
import { CommonService } from '../../features/services/common.service';
import { IApiResponse } from '../../features/models/IApiResponse.model';
import moment from 'moment';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss'
})
export class UserRegisterComponent implements OnInit, OnDestroy {  
  form: FormGroup = new FormGroup({});
  loginUser: string = '';
  userRole: string = '';
  disableRoleList: boolean = false;
  submitSubs: Subscription | undefined;
  roleSubs: Subscription | undefined;
  roleList?: UserRole[];
  currentDate: any = moment().format('YYYY-MM-DDThh:mm:ssZ');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.formInfo();
    this.getUserRole();
    this.userRole = localStorage.getItem('userRole') ?? '';
    if (this.userRole != 'Admin') {
      this.form.get('userRoleId')?.setValue(2);
      this.disableRoleList = true;
    }
    else {
      this.disableRoleList = false;
    }
  }

  formInfo() {
    this.form = this.fb.group({
      id: [0],
      firstName   : [null,Validators.required],
      lastName    : [null],
      email       : [null,Validators.required],
      password    : [null,Validators.required],
      rePassword  : [null,Validators.required],
      mobile      : [null,Validators.required],
      address     : [null,Validators.required],
      userType    : ['Active'],
      userRoleId  : ['', Validators.required],
      createDate  : [this.currentDate],
    });
  }; 

  get f() {        
    return this.form.controls;
  }

  getUserRole() {
    this.roleSubs =
    this.authService.getUserRole().subscribe({
      next: (response: IApiResponse) =>{
        if (response.isExecuted) {
          this.roleList = response.data;
        }
      },
      error: (error) => {
        this.commonService.showErrorMsg(error.message);
      }
    })
  }

  onSubmit() {
    if (this.form.value.password != this.form.value.rePassword) {
      return this.commonService.showErrorMsg('Both password should be same');
    }    
    if (this.form.valid) {
      this.submitSubs =
      this.authService.userRegistration(this.form.value).subscribe({
        next: ((response: IApiResponse) => {
          if (response.isExecuted) {
            this.commonService.showSuccessMsg(response.message);
            if( this.userRole != 'Admin') {
              this.commonService.refreshPage('/login');
            }
            else {
              this.ngOnInit();
            }
          }
          else {
            this.commonService.showErrorMsg(response.message);
          }
        }),
        error: (error) => {
          this.commonService.showErrorMsg(error.message);
        }
      })
    }
    else {
      this.commonService.showErrorMsg('Please fill all required fields');
    }   
  }

  ngOnDestroy(): void {
    this.submitSubs?.unsubscribe();
    this.roleSubs?.unsubscribe();
  }
}
