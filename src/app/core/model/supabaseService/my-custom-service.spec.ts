import { TestBed } from '@angular/core/testing';

import { MyCustomService } from './my-custom-service';

describe('MyCustomService', () => {
  let service: MyCustomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyCustomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
