import { TestBed } from '@angular/core/testing';

import { AdvicesFilesManagerService } from './advices-files-manager.service';

describe('AdvicesFilesManagerService', () => {
  let service: AdvicesFilesManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvicesFilesManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
