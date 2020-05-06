import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAuthorisationPage } from './notification-authorisation.page';

describe('NotificationAuthorisationPage', () => {
  let component: NotificationAuthorisationPage;
  let fixture: ComponentFixture<NotificationAuthorisationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationAuthorisationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationAuthorisationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
