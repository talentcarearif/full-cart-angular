import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCategoryAddComponent } from './modal-category-add.component';

describe('ModalCategoryAddComponent', () => {
  let component: ModalCategoryAddComponent;
  let fixture: ComponentFixture<ModalCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalCategoryAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
