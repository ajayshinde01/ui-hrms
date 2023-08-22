import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePersonalInfoFormComponent } from './employee-personal-info-form.component';

describe('EmployeePersonalInfoFormComponent', () => {
  let component: EmployeePersonalInfoFormComponent;
  let fixture: ComponentFixture<EmployeePersonalInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeePersonalInfoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePersonalInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
