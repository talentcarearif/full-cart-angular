import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './auth/user-login/user-login.component';
import { BrandComponent } from './features/brand/view-brand/brand.component';
import { CategoryComponent } from './features/category/view-category/category.component';
import { HomePageComponent } from './features/home-page/home-page.component';
import { ProductsComponent } from './features/products/product-add/products.component';
import { ProductViewComponent } from './features/products/product-view/product-view.component';
import { UserRegisterComponent } from './auth/user-register/user-register.component';
import { ShopingCartComponent } from './features/shoping-cart/shoping-cart.component';
import { OrdersComponent } from './features/orders/orders.component';
import { PaymentsComponent } from './features/payments/payments.component';
import { UserProfileComponent } from './features/user-profile/user-profile.component';
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard.component';
import { OrderUserComponent } from './features/orders/order-user/order-user.component';

const routes: Routes = [
  {
      path: '',
      component: HomePageComponent
  },
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path: 'user-profile',
    component: UserProfileComponent
  },
  {
      path: 'login',
      component: UserLoginComponent
  },
  {
    path: 'registration',
    component: UserRegisterComponent
  },

  {
    path: 'shopping-cart',
    component: ShopingCartComponent
  },
  {
    path: 'orders',
    component: OrdersComponent
  },
  {
    path: 'orders-customer',
    component: OrderUserComponent
  },
  {
    path: 'payments',
    component: PaymentsComponent
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent
  },
  {
      path: '**',
      redirectTo: '',
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
