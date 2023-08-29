import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaDetailsTableComponent } from './visa-details-table.component';

describe('VisaDetailsTableComponent', () => {
  let component: VisaDetailsTableComponent;
  let fixture: ComponentFixture<VisaDetailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisaDetailsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisaDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
