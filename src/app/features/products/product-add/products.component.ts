import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FullCartService } from '../../services/full-cart.service';
import { Subscription } from 'rxjs';
import { IApiResponse } from '../../models/IApiResponse.model';
import { Category } from '../../models/category.model';
import { Brand } from '../../models/brand.model';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy{
  form: FormGroup = new FormGroup({});
  loginUser?: string;
  submitSubs: Subscription | undefined;
  catSubs: Subscription | undefined;
  brandSubs: Subscription | undefined;
  categoryList?: Category[];
  brandList?: Brand[];
  stateData: any = null;
  saveOrUpdate: any;
  @Input() getEmittedData : any;
  headers?: string[];
  data?: any[][];
  excelDataArray?: Product[];


  constructor(
    private fb: FormBuilder,
    private cartService: FullCartService,
    public router: Router,
    public commonService: CommonService
  ) {
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
  }
  
  ngOnInit(): void {
    this.saveOrUpdate = 'Save Data';
    this.formInfo();
    this.getCategoryList();
    this.getBrandList();
    if (this.stateData != null) {
      this.saveOrUpdate = 'Update Data';
      this.form.patchValue(this.stateData);
    }     
    if (this.getEmittedData != null) {
      this.form.patchValue(this.getEmittedData);
    }
  }

  formInfo() {
    this.form = this.fb.group({
      id: [0],
      productName : [null,Validators.required],
      description : [null,Validators.required],
      price       : [null,Validators.required],
      quantity    : [null,Validators.required],
      categoryId  : ['',Validators.required],
      brandId     : ['',Validators.required],
      imagePath   : [null]
    });
  }; 

  getCategoryList() {
    this.catSubs =
    this.cartService.getAllCategories().subscribe({
      next: (response: IApiResponse) =>{
        if (response.isExecuted) {
          this.categoryList = response.data;
        }
      },
      error: (error) => {
        this.commonService.showErrorMsg(error.message);
      }
    })
  }

  getBrandList() {
    this.brandSubs =
    this.cartService.getAllBrands().subscribe({
      next: (response: IApiResponse) =>{
        if (response.isExecuted) {
          this.brandList = response.data;
        }
      },
      error: (error) => {
        this.commonService.showErrorMsg(error.message);
      }
    })
  }

  get f() {        
    return this.form.controls;
  }

  goToViewPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('/admin-dashboard', { state: {component: 'product-view'}});
    });
  } 

  refreshComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('/admin-dashboard', { state: {component: 'product'}});
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitSubs =
      this.cartService.submitProducts(this.form.value).subscribe({
        next: ((response: IApiResponse) => {
          if (response.isExecuted) {
            this.commonService.showSuccessMsg(response.message);
            if (this.stateData != null || this.getEmittedData != null) {
              this.goToViewPage();
            }
            else {
              this.ngOnInit();
            }
          }
          else {
            this.commonService.showErrorMsg(response.message);
          }
        }),
        error: (error) => {
          this.commonService.showErrorMsg(error.message);
        }
      })
    }
    else {
      this.commonService.showErrorMsg('Please fill all required fields');
    }   
  }

  onSubmitFromExcel() {
    if (this.excelDataArray) {
      this.submitSubs =
      this.cartService.submitProductsFromExcel(this.excelDataArray).subscribe({
        next: ((response: IApiResponse) => {
          if (response.isExecuted) {
            this.commonService.showSuccessMsg(response.message);
            this.ngOnInit();
          }
          else {
            this.commonService.showErrorMsg(response.message);
          }
        }),
        error: (error) => {
          this.commonService.showErrorMsg(error.message);
        }
      })
    }
    else {
      this.commonService.showErrorMsg('No excel data found in excel');
    }   
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      return this.commonService.showErrorMsg('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      this.data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      this.headers = this.data.shift();
      
      this.excelDataArray = this.data.map(row => {
        const obj : any = {};
        this.headers?.forEach((header, index: number) => {
          obj[header] = row[index];
        });
        return obj;
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }

  ngOnDestroy(): void {
    this.submitSubs?.unsubscribe();
    this.catSubs?.unsubscribe();
    this.brandSubs?.unsubscribe();
  }

}
