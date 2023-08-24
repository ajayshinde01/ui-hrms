import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTypeTableComponent } from './employee-type-table.component';

describe('EmployeeTypeTableComponent', () => {
  let component: EmployeeTypeTableComponent;
  let fixture: ComponentFixture<EmployeeTypeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTypeTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
