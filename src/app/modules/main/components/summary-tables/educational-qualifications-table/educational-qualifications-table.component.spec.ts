import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalQualificationsTableComponent } from './educational-qualifications-table.component';

describe('EducationalQualificationsTableComponent', () => {
  let component: EducationalQualificationsTableComponent;
  let fixture: ComponentFixture<EducationalQualificationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalQualificationsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationalQualificationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
