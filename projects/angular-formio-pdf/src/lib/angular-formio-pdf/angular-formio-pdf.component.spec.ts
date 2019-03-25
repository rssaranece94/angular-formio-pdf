import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularFormioPdfComponent } from './angular-formio-pdf.component';

describe('AngularFormioPdfComponent', () => {
  let component: AngularFormioPdfComponent;
  let fixture: ComponentFixture<AngularFormioPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularFormioPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularFormioPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
