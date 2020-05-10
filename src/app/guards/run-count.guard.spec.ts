import { TestBed, async, inject } from '@angular/core/testing';

import { RunCountGuard } from './run-count.guard';

describe('RunCountGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RunCountGuard]
    });
  });

  it('should ...', inject([RunCountGuard], (guard: RunCountGuard) => {
    expect(guard).toBeTruthy();
  }));
});
