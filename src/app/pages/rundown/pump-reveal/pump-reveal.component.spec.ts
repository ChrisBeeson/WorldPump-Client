import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpRevealComponent } from './pump-reveal.component';

describe('PumpRevealComponent', () => {
  let component: PumpRevealComponent;
  let fixture: ComponentFixture<PumpRevealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PumpRevealComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PumpRevealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
