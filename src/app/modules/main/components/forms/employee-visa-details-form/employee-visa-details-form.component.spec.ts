import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeVisaDetailsFormComponent } from './employee-visa-details-form.component';

describe('EmployeeVisaDetailsFormComponent', () => {
  let component: EmployeeVisaDetailsFormComponent;
  let fixture: ComponentFixture<EmployeeVisaDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeVisaDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeVisaDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
