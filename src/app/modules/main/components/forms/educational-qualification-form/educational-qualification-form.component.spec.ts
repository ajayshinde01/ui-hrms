import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalQualificationFormComponent } from './educational-qualification-form.component';

describe('EducationalQualificationFormComponent', () => {
  let component: EducationalQualificationFormComponent;
  let fixture: ComponentFixture<EducationalQualificationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalQualificationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationalQualificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
