import { TestBed } from '@angular/core/testing';

import { RundownService } from './rundown.service';

describe('RundownService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RundownService = TestBed.get(RundownService);
    expect(service).toBeTruthy();
  });
});
