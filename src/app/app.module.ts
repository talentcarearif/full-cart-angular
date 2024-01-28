import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './features/modules/material.module';
import { ManualRouterModule } from './features/modules/router.module';
import { AuthService } from './features/services/auth.service';
import { CommonService } from './features/services/common.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthState } from './features/states/auth-state';
import { NgxsModule } from '@ngxs/store';
import { HomePageComponent } from './features/home-page/home-page.component';
import { UserLoginComponent } from './auth/user-login/user-login.component';
import { UserRegisterComponent } from './auth/user-register/user-register.component';
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard.component';
import { BrandComponent } from './features/brand/view-brand/brand.component';
import { CategoryComponent } from './features/category/view-category/category.component';
import { ErrorViewComponent } from './features/error-view/error-view.component';
import { PaymentsComponent } from './features/payments/payments.component';
import { ProductsComponent } from './features/products/product-add/products.component';
import { ProductViewComponent } from './features/products/product-view/product-view.component';
import { ShopingCartComponent } from './features/shoping-cart/shoping-cart.component';
import { UserProfileComponent } from './features/user-profile/user-profile.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from '../environments/environment';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ModalCategoryAddComponent } from './features/category/modal-category-add/modal-category-add.component';
import { ModalBrandAddComponent } from './features/brand/modal-brand-add/modal-brand-add.component';
import { OrdersComponent } from './features/orders/orders.component';
import { OrderDetailsComponent } from './features/orders/order-details/order-details.component';
import { OrderUserComponent } from './features/orders/order-user/order-user.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    UserLoginComponent,
    UserRegisterComponent,
    AdminDashboardComponent,
    BrandComponent,
    CategoryComponent,
    ErrorViewComponent,
    PaymentsComponent,
    ProductsComponent,
    ProductViewComponent,
    ShopingCartComponent,
    UserProfileComponent,
    ModalCategoryAddComponent,
    ModalBrandAddComponent,
    OrdersComponent,
    OrderDetailsComponent,
    OrderUserComponent
  ],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([AuthState], {developmentMode: !environment.production}),
    BrowserAnimationsModule,
    AppRoutingModule,
    ManualRouterModule,
    HttpClientModule,
    MaterialModule
  ],
  bootstrap: [AppComponent],
  providers: [
    AuthService,
    //AuthGuard,
    CommonService,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline', floatLabel: 'always'}}
  ]
})
export class AppModule { }
