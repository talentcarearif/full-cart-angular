import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FullCartService } from '../../services/full-cart.service';
import { IApiResponse } from '../../models/IApiResponse.model';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-modal-category-add',
  templateUrl: './modal-category-add.component.html',
  styleUrl: './modal-category-add.component.scss'
})
export class ModalCategoryAddComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  submitSubs: Subscription | undefined;
  
  constructor (
    public dialogRef: MatDialogRef<ModalCategoryAddComponent>,
    private fb: FormBuilder,
    private cartService: FullCartService,
    public commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }
  
  ngOnInit(): void {
    this.formInfo();
    if (this.data != null) {
      this.form.patchValue(this.data);
    }
  }

  formInfo() {
    this.form = this.fb.group({
      id: [0],
      categoryName : [null,Validators.required],
    });
  }; 

  onSubmit() {
    if (this.form.valid) {
      this.submitSubs =
      this.cartService.submitCategories(this.form.value).subscribe({
        next: ((response: IApiResponse) => {
          if (response.isExecuted) {
            this.commonService.showSuccessMsg(response.message);
            this.dialogRef.close();
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

  ngOnDestroy(): void {
    this.submitSubs?.unsubscribe();
  }
}
