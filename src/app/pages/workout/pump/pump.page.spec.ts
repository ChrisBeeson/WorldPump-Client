import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpPage } from './pump.page';

describe('PumpPage', () => {
  let component: PumpPage;
  let fixture: ComponentFixture<PumpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PumpPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PumpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
