import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../models/IApiResponse.model';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public totalCartCount : number = 0;
  cartCountEmitter: EventEmitter<number> = new EventEmitter();
  baseUrl: string = environment.baseUrl;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {     
    this.runIfLoad();      
  }

  runIfLoad() {    
    this.totalCartCount = Number(localStorage.getItem('cartCount'));
  }

  public getTotalCartCount(loginUser: string): Observable<IApiResponse> {  
     return this.http.get<IApiResponse>(`${this.baseUrl}/api/product/get-cart-count/${loginUser}`);
  }

  updateCartCount(newCount: number) {
    this.totalCartCount = newCount;
    this.cartCountEmitter.emit(newCount);
  }

  newAddToCartCount() {
    this.totalCartCount += 1;
    this.cartCountEmitter.emit(this.totalCartCount);
  }

  newRemoveFromCartCount() {
    this.totalCartCount -= 1;
    this.cartCountEmitter.emit(this.totalCartCount);
  }

  refreshPage(path: any) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([path]);
    });
  }

  showSuccessMsg(msg: string, duration = 3000): void {
    this.snackBar.open(msg, '', {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['snackbar-container', 'success'],
    });
  }

  showErrorMsg(msg: string, duration = 3000): void {
    this.snackBar.open(msg, '', {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['snackbar-container', 'danger'],
    });
  }

  goBackCommand() {
    history.back();
  }
}
