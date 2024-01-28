import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse } from '../models/IApiResponse.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Category } from '../models/category.model';
import { Brand } from '../models/brand.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class FullCartService {
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getAllProducts(): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(`${this.baseUrl}/api/product/get-all`);
  }

  public submitProducts(formValue: any) {
    return this.http.post<IApiResponse>(`${this.baseUrl}/api/product/submit`, formValue);
  }

  public submitProductsFromExcel(excelData: Product[]) {
    return this.http.post<IApiResponse>(`${this.baseUrl}/api/product/excel/submit`, excelData);
  }
  
  public deleteProductById(id: number) {
    return this.http.delete<IApiResponse>(`${this.baseUrl}/api/product/delete/${id}`);
  }

  public submitCategories(formValue: Category) {
    return this.http.post<IApiResponse>(`${this.baseUrl}/api/category/submit`, formValue);
  }

  public deleteCategoryById(id: number) {
    return this.http.delete<IApiResponse>(`${this.baseUrl}/api/category/delete/${id}`);
  }

  public getAllCategories(): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(`${this.baseUrl}/api/category/get-all`);
  }

  public getAllBrands(): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(`${this.baseUrl}/api/brand/get-all`);
  }

  public deleteBrandById(id: number) {
    return this.http.delete<IApiResponse>(`${this.baseUrl}/api/brand/delete/${id}`);
  }

  public submitBrands(formValue: Brand) {
    return this.http.post<IApiResponse>(`${this.baseUrl}/api/brand/submit`, formValue);
  }

  public addToCartAsPerUser(loginUser: string, productId: number) {
    let postData = {
      loginUser, productId
    }
    return this.http.post<IApiResponse>(`${this.baseUrl}/api/product/cart/add`, postData);
  }

  public removeFromCartAsPerUser(loginUser: string, productId: number) {
    let postData = {
      loginUser, productId
    }
    return this.http.post<IApiResponse>(`${this.baseUrl}/api/product/cart/remove`, postData);
  }

  public getTotalCartCount(loginUser: string): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(`${this.baseUrl}/api/product/get-cart-count/${loginUser}`);
  }

  public getUserShoppingCartDetails(loginUser: string): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(`${this.baseUrl}/api/cartorder/shopping-cart/get-all/${loginUser}`);
  }

  public submitOrderDetails(loginUser: string): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(`${this.baseUrl}/api/cartorder/place-order/${loginUser}`, null);
  }

  public getAllOrderDetails(): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(`${this.baseUrl}/api/cartorder/get-order-details`);
  }

  public getCustomerOrderDetails(loginUser: string): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(`${this.baseUrl}/api/cartorder/get-order-details/customer/${loginUser}`);
  }

  public cancelCustomerOrder(id: number) {
    return this.http.delete<IApiResponse>(`${this.baseUrl}/api/cartorder/cancel-order/${id}`);
  }

}
