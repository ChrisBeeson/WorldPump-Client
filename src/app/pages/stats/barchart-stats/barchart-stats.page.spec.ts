import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarchartStatsPage } from './barchart-stats.page';

describe('BarchartStatsPage', () => {
  let component: BarchartStatsPage;
  let fixture: ComponentFixture<BarchartStatsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarchartStatsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarchartStatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
