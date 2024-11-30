import { TestBed } from '@angular/core/testing';

import { FireService } from './firebase-service.service';

describe('FirebaseServiceService', () => {
  let service: FireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
