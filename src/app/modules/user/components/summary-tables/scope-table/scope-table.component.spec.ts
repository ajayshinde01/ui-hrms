import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeTableComponent } from './scope-table.component';

describe('ScopeTableComponent', () => {
  let component: ScopeTableComponent;
  let fixture: ComponentFixture<ScopeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScopeTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScopeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
