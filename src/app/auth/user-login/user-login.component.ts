import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../features/services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { CommonService } from '../../features/services/common.service';
import { IContainer } from '../../features/models/api-container.model';
import { AuthModel } from '../../features/models/auth.model';
import { Store } from '@ngxs/store';
import { Login } from '../../features/actions/auth.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss'
})

export class UserLoginComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  loginUser: string = '';
  loginSubs? : Subscription;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public commonService: CommonService,
    private store: Store,
    private router: Router
  ) 
  { }

  ngOnInit(): void {
    this.formInfo();
  }

  formInfo() {
    this.form = this.fb.group({
      userEmail      : [null,Validators.required],
      password       : [null,Validators.required],
      createdBy      : [this.loginUser ?? '']
    });
  };

  onSubmit() {
    if (this.form.valid) {
      this.loginSubs =
      this.authService.authenticate(this.form.value).subscribe({
        next: (auth: IContainer<AuthModel>) =>{
          if (auth.isExecuted) {
              if (auth.data) {
                if (auth.data.isAuthenticated) {                                    
                  localStorage.setItem('isLoggedInSession','Y');
                  localStorage.setItem('userEmail', auth?.data?.userInformation?.userEmail);
                  localStorage.setItem('userName', auth?.data?.userInformation?.userName);
                  localStorage.setItem('userRole', auth?.data?.userInformation?.userRole);
                  localStorage.setItem('userMobile', auth?.data?.userInformation?.userMobile);
                  localStorage.setItem('userAddress', auth?.data?.userInformation?.userAddress);
                  auth.data.token = 'replace-with-original-token';
                  localStorage.setItem(
                    'accessToken',
                    auth.data.token
                  );
                  this.store.dispatch(new Login(auth?.data)); 
                  this.commonService.showSuccessMsg(auth.data.message);
                  this.router.navigateByUrl('/home');                 
                }
                else {
                  this.commonService.showErrorMsg(auth.data.message);
                }
              }
          } 
          else {
          this.commonService.showErrorMsg(auth.message);
          }      
        },
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
    this.loginSubs?.unsubscribe();
  }
  
}
