import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationTableComponent } from './certification-table.component';

describe('CertificationTableComponent', () => {
  let component: CertificationTableComponent;
  let fixture: ComponentFixture<CertificationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificationTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
