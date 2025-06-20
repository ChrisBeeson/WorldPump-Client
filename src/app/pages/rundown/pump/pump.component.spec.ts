import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpComponent } from './pump.component';

describe('PumpComponent', () => {
  let component: PumpComponent;
  let fixture: ComponentFixture<PumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PumpComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
