import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyContactsTableComponent } from './emergency-contacts-table.component';

describe('EmergencyContactsTableComponent', () => {
  let component: EmergencyContactsTableComponent;
  let fixture: ComponentFixture<EmergencyContactsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmergencyContactsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmergencyContactsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
