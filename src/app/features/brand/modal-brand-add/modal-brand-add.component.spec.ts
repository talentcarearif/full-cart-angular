import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBrandAddComponent } from './modal-brand-add.component';

describe('ModalBrandAddComponent', () => {
  let component: ModalBrandAddComponent;
  let fixture: ComponentFixture<ModalBrandAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalBrandAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalBrandAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
