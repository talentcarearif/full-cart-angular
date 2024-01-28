import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { IApiResponse } from '../models/IApiResponse.model';
import { BehaviorSubject, Observable, Subject, catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { AuthModel } from '../models/auth.model';
import { AuthState } from '../states/auth-state';
import { User } from '../models/user.model';
import { IContainer } from '../models/api-container.model';
import { Logout } from '../actions/auth.action';
import { Store } from '@ngxs/store';
import { environment } from '../../../environments/environment.prod';
import { CommonService } from './common.service';
import { UserMaster } from '../models/userMaster.model';
import { UserRole } from '../models/userRole.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Select(AuthState.isLoggedIn) isLoggedIn?: Observable<boolean>;
  @Select(AuthState.getAuthInfo) authInfo?: Observable<AuthModel>;
  baseUrl: string = environment.baseUrl;

  constructor(
    private router: Router,
    private store: Store,
    private commonService: CommonService,
    private http: HttpClient) 
  { }  

  public authenticate(user: User): Observable<IContainer<AuthModel>> {
    return this.http.post<IContainer<AuthModel>>(`${this.baseUrl}/api/userlogin/login`, {userEmail: user.userEmail, password: user.password});
  }

  public userRegistration(user: UserMaster): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(`${this.baseUrl}/api/userregister/register/add`, user);
  }

  public getUserRole(): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(`${this.baseUrl}/api/userregister/user-role/list`);
  }

  logout() {
    this.store.dispatch(new Logout());
    localStorage.removeItem("accessToken");     
    localStorage.removeItem("isLoggedInSession");
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');   
    localStorage.removeItem('userMobile');     
    localStorage.removeItem('userAddress');     
    localStorage.removeItem("cartCount"); 
    this.commonService.updateCartCount(0); 
    this.router.navigate(["/login"]); 
  }
}
