import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CommonService } from '../../services/common.service';
import { FullCartService } from '../../services/full-cart.service';
import { IApiResponse } from '../../models/IApiResponse.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent  implements OnInit, OnDestroy  {
  authSub?: Subscription;
  deleteSub?: Subscription;
  dataSub?: Subscription;
  loginUser: string = '';
  itemArray : any = [];
  displayedColumns: string[] = [
    'orderDate',
    'productName',
    'count',
    'price',
    'totalPrice',
    'customer',
    'orderStatus',
    'action'
  ];

  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    public commonService: CommonService,
    public router : Router,
    private cartService: FullCartService
  ) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getOrderDetails() {
    this.dataSub =
    this.cartService.getAllOrderDetails().subscribe({
      next: (response: IApiResponse) =>{
        if (response.isExecuted) {
          this.dataSource.data = response.data;
          this.itemArray = response.data;
        }
      },
      error: (error) => {
        this.commonService.showErrorMsg(error.message);
      }
    })
  }

  refreshComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('/admin-dashboard', { state: {component: 'order-details'}});
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.itemArray = this.dataSource.filteredData;
  }

  cancelCustomerOrder(id: number) {
    this.deleteSub =
    this.cartService.cancelCustomerOrder(id).subscribe({
      next: (response: IApiResponse) =>{
        if (response.isExecuted) {
          this.commonService.showSuccessMsg(response.message);
          this.ngOnInit();
        }
        else {
          this.commonService.showErrorMsg(response.message);
        }
      },
      error: (error) => {
        this.commonService.showErrorMsg(error.message);
      }
    })
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.dataSub?.unsubscribe();
  }

}
