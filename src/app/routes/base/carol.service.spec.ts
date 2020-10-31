import { TestBed } from '@angular/core/testing';

import { CarolService } from './carol.service';

describe('CarolService', () => {
  let service: CarolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
