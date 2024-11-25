import { TestBed } from '@angular/core/testing';

import { LearningPackageService } from './learning-package.service';

describe('LearningPackageService', () => {
  let service: LearningPackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningPackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
