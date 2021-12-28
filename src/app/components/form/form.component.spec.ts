import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBeginnerComponent } from './form.component';

describe('FormBeginnerComponent', () => {
  let component: FormBeginnerComponent;
  let fixture: ComponentFixture<FormBeginnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormBeginnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBeginnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
