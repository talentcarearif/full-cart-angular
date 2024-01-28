import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FullCartService } from '../../services/full-cart.service';
import { IApiResponse } from '../../models/IApiResponse.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.scss'
})
export class ProductViewComponent implements OnInit, OnDestroy, AfterViewInit {
  authSub?: Subscription;
  deleteSub?: Subscription;
  dataSub?: Subscription;
  loginUser: string = '';
  fileName: string = 'product_excel';
  excelData: any = [];
  displayedColumns: string[] = [
    'productName',
    'description',
    'price',
    'quantity',
    'category',
    'brand',
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
    this.getAllProductList();
  }

  getAllProductList() {
    this.dataSub =
    this.cartService.getAllProducts().subscribe({
      next: (response: IApiResponse) =>{
        if (response.isExecuted) {
          this.dataSource.data = response.data;
        }
      },
      error: (error) => {
        this.commonService.showErrorMsg(error.message);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  goToAddProductPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('/admin-dashboard', { state: {component: 'product'}});
    });
  }

  refreshComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('/admin-dashboard', { state: {component: 'product-view'}});
    });
  }

  editProductById(element: any) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('/admin-dashboard', { state: {component: 'product', data: element}});
    });
  }

  deleteProductById(id: number) {
    this.deleteSub =
    this.cartService.deleteProductById(id).subscribe({
      next: (response: IApiResponse) =>{
        if (response.isExecuted) {
          this.commonService.showSuccessMsg(response.message);
          this.commonService.refreshPage(this.router.url);
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

  arrangeDataForExcel() {
    return new Promise((resolve, reject)=>{
      this.excelData = [];
      this.dataSource.data.forEach((e:any)=>{
        this.excelData.push({
          "Product Name": e?.productName,
          "Description": e?.description,
          "Price": e?.price,
          "Quantity": e?.quantity,
          "Category": e?.category?.categoryName,
          "Brand": e?.brand?.brandName
        })
      })
      resolve(true);
    })
  }

  async exportArrayToExcel() {
    await this.arrangeDataForExcel();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excelData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName ? this.fileName + '.xlsx' : 'Worksheet.xlsx');
  }

  onGenerateExcelConfirmation() {
    if (this.dataSource.data.length > 0) {
      this.exportArrayToExcel();
    }
    else {
      this.commonService.showErrorMsg('No data found to generate excel');
    }
  };

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
    this.dataSub?.unsubscribe();
  }
}
