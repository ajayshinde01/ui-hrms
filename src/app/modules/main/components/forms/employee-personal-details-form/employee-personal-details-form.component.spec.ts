import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePersonalDetailsFormComponent } from './employee-personal-details-form.component';

describe('EmployeePersonalDetailsFormComponent', () => {
  let component: EmployeePersonalDetailsFormComponent;
  let fixture: ComponentFixture<EmployeePersonalDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeePersonalDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePersonalDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
