import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CommonService } from '../../services/common.service';
import { FullCartService } from '../../services/full-cart.service';
import { IApiResponse } from '../../models/IApiResponse.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalCategoryAddComponent } from '../modal-category-add/modal-category-add.component';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit, OnDestroy, AfterViewInit  {
  authSub?: Subscription;
  deleteSub?: Subscription;
  dataSub?: Subscription;
  loginUser: string = '';
  displayedColumns: string[] = [
    'categoryName',
    'action'
  ];

  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    public commonService: CommonService,
    public router : Router,
    private cartService: FullCartService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCategoryList();
  }

  getCategoryList() {
    this.dataSub =
    this.cartService.getAllCategories().subscribe({
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

  refreshComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('/admin-dashboard', { state: {component: 'category'}});
    });
  }

  editCategoryById(element: any) {
    this.openCategoryModal(element);
  }

  deleteCategoryById(id: number) {
    this.deleteSub =
    this.cartService.deleteCategoryById(id).subscribe({
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

  openCategoryModal(singleCategory?: Category): void {
    const dialogRef = this.dialog.open(ModalCategoryAddComponent, {
      disableClose: true,
      minWidth: '550px',
      minHeight: '260px',
      data: singleCategory});

    dialogRef.afterClosed().subscribe((result:any) => {
      this.ngOnInit();
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
    this.dataSub?.unsubscribe();
  }
}
