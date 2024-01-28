import { NgModule } from '@angular/core'; 
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

const router = [
  RouterOutlet, 
  RouterLink, 
  RouterLinkActive
]; 

@NgModule({
  declarations: [], 
  imports: [router],
  exports: [router],
  providers: []
})

export class ManualRouterModule { }
