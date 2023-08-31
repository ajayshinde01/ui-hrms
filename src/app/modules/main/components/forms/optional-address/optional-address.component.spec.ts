import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalAddressComponent } from './optional-address.component';

describe('OptionalAddressComponent', () => {
  let component: OptionalAddressComponent;
  let fixture: ComponentFixture<OptionalAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionalAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionalAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
