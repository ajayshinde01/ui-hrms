import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkExperienceTableComponent } from './work-experience-table.component';

describe('WorkExperienceTableComponent', () => {
  let component: WorkExperienceTableComponent;
  let fixture: ComponentFixture<WorkExperienceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkExperienceTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkExperienceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
