import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningDetailsComponent } from './joining-details.component';

describe('JoiningDetailsComponent', () => {
  let component: JoiningDetailsComponent;
  let fixture: ComponentFixture<JoiningDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoiningDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoiningDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
