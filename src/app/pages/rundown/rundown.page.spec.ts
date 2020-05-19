import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RundownPage } from './rundown.page';

describe('RundownPage', () => {
  let component: RundownPage;
  let fixture: ComponentFixture<RundownPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RundownPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RundownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
