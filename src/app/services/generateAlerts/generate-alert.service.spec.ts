import { TestBed } from '@angular/core/testing';

import { GenerateAlertService } from './generate-alert.service';

describe('GenerateAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenerateAlertService = TestBed.get(GenerateAlertService);
    expect(service).toBeTruthy();
  });
});
