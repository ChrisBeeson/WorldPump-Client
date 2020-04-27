import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpCountdownPage } from './pump-countdown.page';

describe('PumpCountdownPage', () => {
  let component: PumpCountdownPage;
  let fixture: ComponentFixture<PumpCountdownPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PumpCountdownPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PumpCountdownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
