import { TestBed } from '@angular/core/testing';

import { ShowAlertService } from './show-alert.service';

describe('ShowAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShowAlertService = TestBed.get(ShowAlertService);
    expect(service).toBeTruthy();
  });
});
